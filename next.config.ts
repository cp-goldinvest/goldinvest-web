import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      { source: "/kategorija/zlatne-poluge/", destination: "/kategorija/zlatne-poluge", permanent: true },
      { source: "/pokloni/poklon-za-krstenje", destination: "/poklon-za-krstenje", permanent: true },
      { source: "/pokloni/poklon-za-rodjenje-deteta", destination: "/poklon-za-rodjenje-deteta", permanent: true },
    ];
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
