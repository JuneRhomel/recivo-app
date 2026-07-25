// The API and the app are on different registrable domains under
// *.up.railway.app, which makes an httpOnly cookie a third-party cookie that
// browsers drop -- so the refresh token is kept here instead. See the note in
// reciv-api/src/routes/auth.ts.
const REFRESH_TOKEN_KEY = "recivo.refreshToken";

function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeRefreshToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export interface AuthUser {
  id: number;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

export type GoogleSignupResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

export async function signupWithGoogle(idToken: string): Promise<GoogleSignupResult> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (res.ok) {
      return { ok: true };
    }

    const data = await res.json().catch(() => null);
    return {
      ok: false,
      status: res.status,
      error: data?.error ?? "Sign up failed. Please try again.",
    };
  } catch {
    return { ok: false, status: 0, error: "Could not reach the server. Please try again." };
  }
}

export type GoogleLoginResult =
  | { ok: true; accessToken: string; user: AuthUser }
  | { ok: false; status: number; error: string };

export async function loginWithGoogle(idToken: string): Promise<GoogleLoginResult> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json().catch(() => null);
    if (res.ok) {
      storeRefreshToken(data.refreshToken);
      return { ok: true, accessToken: data.accessToken, user: data.user };
    }
    return {
      ok: false,
      status: res.status,
      error: data?.error ?? "Login failed. Please try again.",
    };
  } catch {
    return { ok: false, status: 0, error: "Could not reach the server. Please try again." };
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      // The server rejected the token, so it will never work again -- drop it
      // rather than retrying a dead session on every page load.
      storeRefreshToken(null);
      return null;
    }

    const data = await res.json();
    // The server rotates the refresh token on each call to slide the 7-day
    // window forward, so the new one has to replace the stored one.
    storeRefreshToken(data.refreshToken);
    return data.accessToken as string;
  } catch {
    // Network failure, not a rejection -- keep the token so an offline reload
    // doesn't sign the user out.
    return null;
  }
}

export async function getMe(accessToken: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Refresh tokens are stateless, so there is nothing for the server to revoke --
// logging out is just dropping the stored token.
export async function logout(): Promise<void> {
  storeRefreshToken(null);
}
