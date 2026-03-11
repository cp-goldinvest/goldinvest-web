import type { Metadata } from "next";
import { Rethink_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const rethinkSans = Rethink_Sans({
  variable: "--font-rethink",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
      <body className={`${rethinkSans.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
