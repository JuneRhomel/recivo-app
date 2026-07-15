"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    handleGoogleSignIn?: (response: { credential: string }) => void;
  }
}

export function useGoogleSignIn(onCredential: (idToken: string) => void) {
  useEffect(() => {
    window.handleGoogleSignIn = (response) => onCredential(response.credential);
    return () => {
      window.handleGoogleSignIn = undefined;
    };
  }, [onCredential]);
}
