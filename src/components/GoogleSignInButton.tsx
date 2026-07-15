"use client";

import Script from "next/script";
import { useState } from "react";
import Skeleton from "react-loading-skeleton";

export function GoogleSignInButton() {
  const [scriptReady, setScriptReady] = useState(false);

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        data-callback="handleGoogleSignIn"
        data-auto_prompt="false"
      />
      <div className="relative inline-block" style={{ width: 200, height: 40 }}>
        <div
          className="g_id_signin"
          data-type="standard"
          style={{ visibility: scriptReady ? "visible" : "hidden" }}
        />
        {!scriptReady && (
          <div className="absolute inset-0">
            <Skeleton width={200} height={40} borderRadius={4} />
          </div>
        )}
      </div>
    </>
  );
}
