"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  type AuthUser,
  getMe,
  loginWithGoogle,
  logout as apiLogout,
  refreshAccessToken,
} from "@/api/auth";

interface AuthContextValue {
  user: AuthUser | null;
  accessToken: string | null;
  loading: boolean;
  login: (idToken: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => Promise<void>;
  /**
   * Runs an authenticated API call with the current access token. If the
   * call fails with 401 (expired/invalid access token), silently refreshes
   * using the httpOnly refresh cookie and retries once. Only logs the user
   * out if the refresh itself fails -- i.e. the session is truly dead, not
   * just the short-lived access token.
   */
  withAuth: <T extends { ok: boolean; status?: number }>(
    fn: (token: string) => Promise<T>
  ) => Promise<T>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await refreshAccessToken();
      if (token) {
        setAccessToken(token);
        setUser(await getMe(token));
      }
      setLoading(false);
    })();
  }, []);

  const login = async (idToken: string) => {
    const result = await loginWithGoogle(idToken);
    if (!result.ok) {
      return { ok: false as const, error: result.error };
    }
    setAccessToken(result.accessToken);
    setUser(result.user);
    return { ok: true as const };
  };

  const logout = async () => {
    await apiLogout();
    setAccessToken(null);
    setUser(null);
  };

  const withAuth = async <T extends { ok: boolean; status?: number }>(
    fn: (token: string) => Promise<T>
  ): Promise<T> => {
    if (!accessToken) {
      return { ok: false, status: 401, error: "Not signed in" } as unknown as T;
    }

    const result = await fn(accessToken);
    if (result.ok || result.status !== 401) {
      return result;
    }

    const newToken = await refreshAccessToken();
    if (!newToken) {
      await logout();
      return result;
    }

    setAccessToken(newToken);
    return fn(newToken);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, login, logout, withAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
