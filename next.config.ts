import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
      "recharts",
    ],
  },
};

export default nextConfig;
