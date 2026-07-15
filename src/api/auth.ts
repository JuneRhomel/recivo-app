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
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json().catch(() => null);
    if (res.ok) {
      return { ok: true, accessToken: data.accessToken, user: data.user };
    }
    return {
      ok: false,
      status: res.status,
      error: data?.error ?? "Login failed. Please try again.",
    };
  } catch (error) {
    return { ok: false, status: 0, error: "Could not reach the server. Please try again." };
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.accessToken as string;
  } catch {
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

export async function logout(): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => undefined);
}
