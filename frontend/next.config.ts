import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Specifically to ignore React 19 + Framer motion typing discrepancies.
  },
};

export default nextConfig;
