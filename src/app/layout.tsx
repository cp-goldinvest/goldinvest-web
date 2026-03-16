import type { Metadata } from "next";
import localFont from "next/font/local";
import { Rethink_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";

const ppEditorial = localFont({
  src: [
    { path: "../../public/fonts/PPEditorialNew-Thin.otf", weight: "100", style: "normal" },
    { path: "../../public/fonts/PPEditorialNew-ThinItalic.otf", weight: "100", style: "italic" },
    { path: "../../public/fonts/PPEditorialNew-Ultralight.otf", weight: "200", style: "normal" },
    { path: "../../public/fonts/PPEditorialNew-UltralightItalic.otf", weight: "200", style: "italic" },
    { path: "../../public/fonts/PPEditorialNew-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/PPEditorialNew-Italic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/PPEditorialNew-Bold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/PPEditorialNew-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "../../public/fonts/PPEditorialNew-Heavy.otf", weight: "800", style: "normal" },
    { path: "../../public/fonts/PPEditorialNew-HeavyItalic.otf", weight: "800", style: "italic" },
  ],
  variable: "--font-pp-editorial",
  display: "swap",
});

const rethinkSans = Rethink_Sans({
  variable: "--font-rethink",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Investiciono zlato | Prodaja Investicionog Zlata Beograd i Srbija",
  description:
    "Gold Invest nudi vrhunske LBMA sertifikovane zlatne poluge, pločice i dukate. Trenutna kupovina, avansne ponude i otkup. Brza dostava u Srbiji.",
  metadataBase: new URL("https://goldinvest.rs"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <body className={`${rethinkSans.variable} ${ppEditorial.variable} ${spaceGrotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
