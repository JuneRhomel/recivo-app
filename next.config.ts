import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // S3 + CloudFront serve `/login/index.html` for `/login/`, not `/login.html`
  // for `/login` -- match that layout so the deployed routing works.
  trailingSlash: true,
  allowedDevOrigins: ["192.168.1.10", "192.168.1.10.nip.io"],
};

export default nextConfig;
