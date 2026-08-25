import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [72, 75],
  },
  // three.js ships untranspiled ESM examples; keep the transpile hint explicit.
  transpilePackages: ["three"],
};

export default nextConfig;
