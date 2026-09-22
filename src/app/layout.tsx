import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Rethink_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import MobilePhoneBar from "@/components/layout/MobilePhoneBar";

const GTM_ID = "GTM-KN46NHL8";

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
  title: "Gold Invest - Investiciono zlato Beograd",
  description:
    "Gold Invest nudi vrhunske LBMA sertifikovane zlatne poluge, pločice i dukate. Trenutna kupovina, avansne ponude i otkup. Brza dostava u Srbiji.",
  metadataBase: new URL("https://goldinvest.rs"),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1B1B1C" },
    { media: "(prefers-color-scheme: dark)", color: "#1B1B1C" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sr">
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className={`${rethinkSans.variable} ${ppEditorial.variable} antialiased`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <MobilePhoneBar />
      </body>
    </html>
  );
}
