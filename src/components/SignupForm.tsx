"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { signupWithGoogle } from "@/api/auth";
import { useGoogleSignIn } from "@/hooks/useGoogleSignIn";
import { ROUTES } from "@/router/routes";
import { AuthCard } from "./AuthCard";
import { GoogleSignInButton } from "./GoogleSignInButton";

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCredential = useCallback(async (idToken: string) => {
    setError(null);
    const result = await signupWithGoogle(idToken);
    if (result.ok) {
      setSuccess(true);
      return;
    }
    setError(
      result.status === 409
        ? "An account with this Google account already exists."
        : result.error
    );
  }, []);

  useGoogleSignIn(handleCredential);

  if (success) {
    return (
      <AuthCard title="Account created">
        <p className="text-center text-sm text-(--muted)">
          You&apos;re all set — you can now log in and start recording collections.
        </p>
        <Link href={ROUTES.HOME} className="text-sm text-(--accent) underline">
          Back to home
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create your Recivo account">
      <GoogleSignInButton />
      {error && <p className="text-center text-sm text-(--danger)">{error}</p>}
      <Link href={ROUTES.LOGIN} className="text-sm text-(--accent) underline">
        Already have an account? Log in
      </Link>
    </AuthCard>
  );
}
