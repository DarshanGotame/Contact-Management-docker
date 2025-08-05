import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**/*",
      },
    ],
  },
  // Disable static optimization for pages that use dynamic features
  staticPageGenerationTimeout: 1000,
  // Allow missing suspense boundaries
  experimental: {
    // This helps with useSearchParams issues during build
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;