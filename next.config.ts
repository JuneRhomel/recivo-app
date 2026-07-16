import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // S3 + CloudFront serve `/login/index.html` for `/login/`, not `/login.html`
  // for `/login` -- match that layout so the deployed routing works.
  trailingSlash: true,
};

export default nextConfig;
