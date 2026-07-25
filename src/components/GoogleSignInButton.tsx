"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";

const BUTTON_WIDTH = 200;
const BUTTON_HEIGHT = 40;

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize(config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }): void;
          renderButton(
            parent: HTMLElement,
            options: { type: "standard"; width: number }
          ): void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onCredential: (idToken: string) => void;
}

export function GoogleSignInButton({ onCredential }: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  // AuthProvider builds a new `login` on every render, so onCredential is not a
  // stable reference. Keeping it in a ref rather than an effect dependency stops
  // the button tearing itself down and redrawing on every parent render.
  const onCredentialRef = useRef(onCredential);
  useEffect(() => {
    onCredentialRef.current = onCredential;
  });

  // GIS scans the DOM for its data-attribute markup exactly once, when the
  // script first initializes. Moving between /login and /signup is a
  // client-side navigation, so the script is already loaded and never rescans
  // -- the freshly mounted div stays empty and the button silently vanishes.
  // Drawing it imperatively from onReady covers first load AND every
  // subsequent mount, which is precisely what onReady is for.
  const drawButton = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const gsi = window.google?.accounts.id;
    if (!gsi || !clientId || !containerRef.current) return;

    gsi.initialize({
      client_id: clientId,
      callback: (response) => onCredentialRef.current(response.credential),
    });
    // Drop any previously drawn button so a remount can't stack two.
    containerRef.current.replaceChildren();
    gsi.renderButton(containerRef.current, {
      type: "standard",
      width: BUTTON_WIDTH,
    });
    setRendered(true);
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={drawButton}
      />
      <div
        className="relative inline-block"
        style={{ width: BUTTON_WIDTH, height: BUTTON_HEIGHT }}
      >
        <div ref={containerRef} style={{ visibility: rendered ? "visible" : "hidden" }} />
        {!rendered && (
          <div className="absolute inset-0">
            <Skeleton width={BUTTON_WIDTH} height={BUTTON_HEIGHT} borderRadius={4} />
          </div>
        )}
      </div>
    </>
  );
}
