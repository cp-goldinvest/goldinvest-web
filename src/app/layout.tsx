import type { Metadata } from "next";
import localFont from "next/font/local";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";

const ppEditorial = localFont({
  src: [
    { path: "../../public/fonts/PPEditorialNew-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/PPEditorialNew-Italic.otf", weight: "400", style: "italic" },
  ],
  variable: "--font-pp-editorial",
  display: "swap",
  preload: true,
});

const rethinkSans = Rethink_Sans({
  variable: "--font-rethink",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
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
      <body className={`${rethinkSans.variable} ${ppEditorial.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
