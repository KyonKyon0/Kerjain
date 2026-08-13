import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // some older canary versions put it here
  },
  // @ts-ignore - To fix Next.js 16+ dev origin blocking
  allowedDevOrigins: ['192.168.1.10'],
};

export default nextConfig;
