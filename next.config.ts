import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — otherwise Turbopack walks up and picks up the
  // package-lock.json in the home directory.
  turbopack: { root: __dirname },
};

export default nextConfig;
