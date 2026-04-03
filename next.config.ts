import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
{ source: "/kategorija/zlatne-poluge/", destination: "/kategorija/zlatne-poluge", permanent: true },
      { source: "/pokloni/poklon-za-krstenje", destination: "/poklon-za-krstenje", permanent: true },
      { source: "/pokloni/poklon-za-rodjenje-deteta", destination: "/poklon-za-rodjenje-deteta", permanent: true },
      { source: "/proizvodi/zlatna-poluga-100g-argor", destination: "/proizvodi/argor-heraeus-100g-zlatna-poluga", permanent: true },
    ];
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "ucngtcsmkxuxuubrobsc.supabase.co" },
    ],
  },
};

export default nextConfig;
