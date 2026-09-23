import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true
    },
    browserToTerminal: true
  },
  allowedDevOrigins: ["192.168.0.15"],
  serverExternalPackages: ["pdf-to-img", "pdf-lib"]
};

export default nextConfig;
