import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-expect-error - allowedDevOrigins might not be in NextConfig types yet
  allowedDevOrigins: ["192.168.1.10"],
};

export default nextConfig;
