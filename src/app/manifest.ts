import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gold Invest - Investiciono zlato Beograd",
    short_name: "Gold Invest",
    description:
      "Gold Invest nudi vrhunske LBMA sertifikovane zlatne poluge, pločice i dukate. Trenutna kupovina, avansne ponude i otkup.",
    start_url: "/",
    display: "standalone",
    background_color: "#1B1B1C",
    theme_color: "#1B1B1C",
    icons: [
      {
        src: "/favicon/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicon/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
