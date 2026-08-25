import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — otherwise Turbopack walks up and picks up the
  // package-lock.json in the home directory.
  turbopack: { root: __dirname },
  // The floating dev badge sits over the sidebar's account row, which puts it
  // in every screenshot taken while measuring a frame.
  devIndicators: false,
};

export default nextConfig;
