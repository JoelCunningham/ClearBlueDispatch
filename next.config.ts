import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
    browserToTerminal: true,
  },
  allowedDevOrigins: ["192.168.0.15"],
};

export default nextConfig;
