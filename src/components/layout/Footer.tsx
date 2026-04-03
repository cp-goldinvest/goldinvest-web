import Link from "next/link";
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from "lucide-react";
import { GoldInvestLogo } from "@/components/ui/GoldInvestLogo";

const PRODUCTS = [
  { label: "Zlatne poluge", href: "/kategorija/zlatne-poluge" },
  { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
  { label: "Zlatni dukati", href: "/kategorija/zlatni-dukati" },
  { label: "Zlatnici", href: "/kategorija/zlatni-dukati" },
  { label: "Poklon za krštenje", href: "/poklon-za-krstenje" },
  { label: "Poklon za rođenje deteta", href: "/poklon-za-rodjenje-deteta" },
];

const INFO = [
  { label: "Kako kupiti zlato", href: "/kako-kupiti" },
  { label: "Otkup zlata",       href: "/otkup-zlata" },
  { label: "Cena zlata",        href: "/cena-zlata" },
  { label: "Česta pitanja",     href: "/cesta-pitanja" },
  { label: "Blog",              href: "/blog" },
];

const SOCIAL = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

const linkStyle: React.CSSProperties = {
  fontFamily: "var(--font-rethink), sans-serif",
  fontWeight: 400,
  fontSize: 16,
  lineHeight: "1.5em",
  color: "#99A1AF",
};

const headingStyle: React.CSSProperties = {
  fontFamily: "var(--font-rethink), sans-serif",
  fontWeight: 700,
  fontSize: 18,
  lineHeight: "1.556em",
  color: "#FFFFFF",
};

export function Footer() {
  return (
    <footer style={{ background: "#101010" }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-16">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="flex flex-col gap-0">
            {/* Logo */}
            <div className="mb-5">
              <GoldInvestLogo className="h-8 w-auto invert" />
            </div>

            {/* Description */}
            <p className="mb-8 max-w-[221px]" style={linkStyle}>
              Vaš pouzdan partner za investiranje u plemenite metale. Diskretno, sigurno i strateški — jer prava vrednost traje zauvek.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#2A2A2B] transition-colors"
                  style={{ background: "#1B1B1C" }}
                >
                  <Icon size={20} color="#99A1AF" />
                </a>
              ))}
            </div>
          </div>

          {/* Proizvodi */}
          <div>
            <h3 className="mb-5" style={headingStyle}>Proizvodi</h3>
            <ul className="flex flex-col gap-3">
              {PRODUCTS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors" style={linkStyle}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Informacije */}
          <div>
            <h3 className="mb-5" style={headingStyle}>Informacije</h3>
            <ul className="flex flex-col gap-3">
              {INFO.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors" style={linkStyle}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="mb-5" style={headingStyle}>Kontakt</h3>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-3">
                <MapPin size={20} color="#99A1AF" className="mt-0.5 shrink-0" />
                <span style={linkStyle}>
                  Beograd, Srbija
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} color="#99A1AF" className="shrink-0" />
                <a href="tel:+381614264129" className="hover:text-white transition-colors" style={linkStyle}>
                  061/426-4129
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} color="#99A1AF" className="shrink-0" />
                <a href="mailto:info@goldinvest.rs" className="hover:text-white transition-colors" style={linkStyle}>
                  info@goldinvest.rs
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid #1B1B1C" }}
        >
          <p style={{ fontFamily: "var(--font-rethink), sans-serif", fontWeight: 400, fontSize: 14, lineHeight: "1.429em", color: "#6A7282" }}>
            © {new Date().getFullYear()} Gold Invest. Sva prava zadržana.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: "Uslovi korišćenja", href: "/uslovi-koriscenja" },
              { label: "Politika privatnosti", href: "/politika-privatnosti" },
              { label: "Podešavanje kolačića", href: "/podesavanje-kolacica" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-rethink), sans-serif", fontWeight: 400, fontSize: 14, lineHeight: "1.429em", color: "#6A7282" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
