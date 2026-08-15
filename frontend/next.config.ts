import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // @ts-ignore - To fix Next.js 16+ dev origin blocking
  allowedDevOrigins: ['192.168.1.10', '192.168.0.106', 'localhost', '127.0.0.1'],
};

export default nextConfig;

