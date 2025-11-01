import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async redirects() {
    return [
      {
        source: "/verify",
        destination: "/api/verify",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
