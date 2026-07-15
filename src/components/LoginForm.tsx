"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import { ROUTES } from "@/router/routes";
import { AuthCard } from "./AuthCard";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleCredential = useCallback(
    async (idToken: string) => {
      setError(null);
      const result = await login(idToken);
      if (result.ok) {
        router.push(ROUTES.HOME);
        return;
      }
      setError(result.error);
    },
    [login, router]
  );

  useGoogleSignIn(handleCredential);

  return (
    <AuthCard title="Log in to Recivo">
      <GoogleSignInButton />
      {error && <p className="text-center text-sm text-(--danger)">{error}</p>}
      <Link href={ROUTES.SIGNUP} className="text-sm text-(--accent) underline">
        Need an account? Sign up
      </Link>
    </AuthCard>
  );
}
