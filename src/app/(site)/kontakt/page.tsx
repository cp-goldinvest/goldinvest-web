import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildWebPageSchema, buildLocalBusinessSchema } from "@/lib/schema";
import { ContactForm } from "@/components/contact/ContactForm";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Kontakt | Gold Invest — Investiciono zlato Beograd",
  description:
    "Kontaktirajte Gold Invest za upit o kupovini ili otkupu investicionog zlata. Beograd, radno vreme pon–pet 09–17h, sub 09–13h. Telefon: 061/426-4129.",
  alternates: { canonical: "https://goldinvest.rs/kontakt" },
  openGraph: {
    title: "Kontakt | Gold Invest",
    description:
      "Pozovite nas ili pošaljite upit — odgovaramo u toku istog radnog dana.",
    url: "https://goldinvest.rs/kontakt",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Kontakt", href: "/kontakt" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KontaktPage() {
  return (
    <main className="bg-white">
      <SchemaScript schema={buildBreadcrumbSchema(BREADCRUMBS)} />
      <SchemaScript schema={buildLocalBusinessSchema()} />
      <SchemaScript
        schema={buildWebPageSchema({
          name: "Kontakt | Gold Invest — Investiciono zlato Beograd",
          description:
            "Kontaktirajte Gold Invest za upit o kupovini ili otkupu investicionog zlata u Beogradu.",
          slug: "/kontakt",
        })}
      />

      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={BREADCRUMBS} variant="light" />
        </SectionContainer>
      </section>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section
        className="overflow-hidden"
        style={{ background: "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)" }}
      >
        <SectionContainer className="py-14 sm:py-20">
          <div className="text-left md:text-center md:mx-auto max-w-[680px]">
            <h1
              className="text-[#1B1B1C] leading-[1.1] mb-6"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 4vw, 52px)",
              }}
            >
              <span style={{ fontStyle: "normal" }}>Razgovarajmo.</span>
              <br />
              <span style={{ fontStyle: "italic" }}>Odmah.</span>
            </h1>
            <p
              className="text-[#4C4C4C] leading-relaxed mb-0"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontSize: 16,
                lineHeight: "1.65em",
                maxWidth: 520,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Najbrže do odgovora — telefonom. Javimo se u roku od nekoliko sekundi tokom radnog vremena. Za pisane upite, odgovaramo u toku istog dana.
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* ── Main section — info + form ────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24">
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-12 lg:gap-20 items-start lg:items-center">

            {/* ── Left — contact info ─────────────────────────────────────── */}
            <div>
              {/* Phone — primary CTA */}
              <a
                href="tel:+381614264129"
                className="group flex items-center gap-4 mb-10"
              >
                <span
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#BEAD87]"
                  style={{ backgroundColor: "#1B1B1C" }}
                >
                  <Phone size={22} color="#fff" />
                </span>
                <div>
                  <p
                    className="text-[#9D9072] text-xs font-semibold tracking-widest uppercase mb-0.5"
                    style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                  >
                    Telefon
                  </p>
                  <span
                    className="text-[#1B1B1C] group-hover:text-[#BF8E41] transition-colors"
                    style={{
                      fontFamily: "var(--font-pp-editorial), Georgia, serif",
                      fontWeight: 400,
                      fontStyle: "italic",
                      fontSize: "clamp(22px, 2.5vw, 30px)",
                      lineHeight: "1.1",
                    }}
                  >
                    061/426-4129
                  </span>
                </div>
              </a>

              {/* Divider */}
              <div className="border-t border-[#F0EDE6] mb-8" />

              {/* Info items */}
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-[#F9F9F9] border border-[#F0EDE6] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={16} className="text-[#BEAD87]" />
                  </span>
                  <div>
                    <p
                      className="text-[#9D9072] text-[11px] font-semibold tracking-widest uppercase mb-1"
                      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                    >
                      E-mail
                    </p>
                    <a
                      href="mailto:info@goldinvest.rs"
                      className="text-[#1B1B1C] font-medium hover:text-[#BF8E41] transition-colors"
                      style={{
                        fontFamily: "var(--font-rethink), sans-serif",
                        fontSize: 15,
                      }}
                    >
                      info@goldinvest.rs
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-[#F9F9F9] border border-[#F0EDE6] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} className="text-[#BEAD87]" />
                  </span>
                  <div>
                    <p
                      className="text-[#9D9072] text-[11px] font-semibold tracking-widest uppercase mb-1"
                      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                    >
                      Adresa
                    </p>
                    <p
                      className="text-[#1B1B1C] font-medium"
                      style={{
                        fontFamily: "var(--font-rethink), sans-serif",
                        fontSize: 15,
                        lineHeight: "1.5",
                      }}
                    >
                      Beograd, Srbija
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-[#F9F9F9] border border-[#F0EDE6] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock size={16} className="text-[#BEAD87]" />
                  </span>
                  <div>
                    <p
                      className="text-[#9D9072] text-[11px] font-semibold tracking-widest uppercase mb-1"
                      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                    >
                      Radno vreme
                    </p>
                    <div
                      className="flex flex-col gap-0.5"
                      style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 15 }}
                    >
                      <span className="text-[#1B1B1C] font-medium">
                        Pon–Pet: 09:00–17:00
                      </span>
                      <span className="text-[#1B1B1C] font-medium">
                        Subota: 09:00–13:00
                      </span>
                      <span className="text-[#BDBDBD]">
                        Nedelja: zatvoreno
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="mt-10 pt-8 border-t border-[#F0EDE6]">
                <p
                  className="text-[#9D9072] text-[11px] font-semibold tracking-widest uppercase mb-4"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  Brzi linkovi
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Kako kupiti zlato", href: "/kako-kupiti" },
                    { label: "Otkup zlata", href: "/otkup-zlata" },
                    { label: "Česta pitanja", href: "/cesta-pitanja" },
                  ].map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="inline-flex items-center gap-1.5 text-[#1B1B1C] hover:text-[#BF8E41] transition-colors font-medium"
                      style={{
                        fontFamily: "var(--font-rethink), sans-serif",
                        fontSize: 14,
                      }}
                    >
                      {label}
                      <ArrowUpRight size={13} className="opacity-50" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right — form ────────────────────────────────────────────── */}
            <div
              className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-3xl p-7 sm:p-10"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
            >
              <h2
                className="text-[#1B1B1C] mb-2"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontWeight: 600,
                  fontSize: 20,
                  lineHeight: "1.3",
                }}
              >
                Pošaljite upit
              </h2>
              <p
                className="text-[#9D9072] text-sm mb-7 leading-relaxed"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                Popunite formu — javićemo se u toku istog radnog dana.
              </p>
              <ContactForm />
            </div>

          </div>
        </SectionContainer>
      </section>

      {/* ── Map / location ───────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-8 items-stretch">

            {/* Info card */}
            <div
              className="bg-[#1A1A1A] rounded-2xl p-7 sm:p-8 flex flex-col justify-between"
              style={{ minHeight: 280 }}
            >
              <div>
                <span
                  className="text-[#BF8E41] text-[10.5px] font-semibold tracking-widest uppercase mb-4 block"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  Naša lokacija
                </span>
                <h2
                  className="text-white mb-4"
                  style={{
                    fontFamily: "var(--font-pp-editorial), Georgia, serif",
                    fontWeight: 400,
                    fontStyle: "italic",
                    fontSize: "clamp(20px, 2vw, 26px)",
                    lineHeight: "1.2",
                  }}
                >
                  Beograd, Srbija
                </h2>
                <p
                  className="text-[#8B806D] text-sm leading-relaxed mb-6"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  Poslovnica je dostupna bez zakazivanja tokom radnog vremena. Za veće količine ili poluge od 500g, preporučujemo prethodni poziv.
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Beograd,+Srbija"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#BEAD87] font-semibold hover:gap-3 transition-all"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 13,
                }}
              >
                Otvori u Google Maps
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Map embed placeholder — replace iframe src with your Google Maps embed URL */}
            <div
              className="rounded-2xl overflow-hidden bg-[#F0EDE6] relative"
              style={{ minHeight: 320 }}
            >
              <iframe
                title="Gold Invest lokacija"
                src="https://maps.google.com/maps?q=Beograd,+Srbija&output=embed&z=12"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block", minHeight: 320 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </SectionContainer>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <WhatIsGoldSection />
    </main>
  );
}
