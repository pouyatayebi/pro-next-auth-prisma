import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  outputFileTracingIncludes: {
    "app/**": ["node_modules/.prisma/client/**"],
  },
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
