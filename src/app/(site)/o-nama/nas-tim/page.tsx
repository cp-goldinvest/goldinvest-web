import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Naš tim | Gold Invest - Investiciono zlato Beograd",
  description:
    "Upoznajte Vuka i Stefana Rosića - osnivače Gold Invest-a. Kupovina investicionog zlata u Beogradu uz direktan kontakt, transparentne cene i LBMA garanciju.",
  alternates: { canonical: "https://goldinvest.rs/o-nama/nas-tim" },
  openGraph: {
    title: "Naš tim | Gold Invest",
    description: "Direktan kontakt, bez posrednika.",
    url: "https://goldinvest.rs/o-nama/nas-tim",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "O nama", href: "/o-nama" },
  { label: "Naš tim", href: "/o-nama/nas-tim" },
];

const TEAM = [
  {
    name: "Vuk Rosić",
    role: "CEO | Osnivač",
    image: "/images/team/Vuk.webp",
    linkedin: "https://www.linkedin.com/in/vuk-rosi%C4%87-03ba83419/",
    bio: [
      "Po struci pravnik, a po izboru trgovac investicionim zlatom. Godinama sam radio sa ljudima koji su želeli da zaštite vrednost svoje imovine i iznova nailazio na isti problem - nedostajalo je mesto kome mogu istinski da veruju.",
      "Upravo iz tog razloga nastao je Gold Invest. Ideja je bila jednostavna: omogućiti kupovinu investicionog zlata kroz jasan proces, realne informacije i odnos u kojem je poverenje važnije od same prodaje.",
    ],
  },
  {
    name: "Stefan Rosić",
    role: "Sales Consultant",
    image: "/images/team/Stefan.webp",
    linkedin: "https://www.linkedin.com/in/stefan-rosic-160088336/",
    bio: [
      "Većina ljudi koja nas pozove ne želi samo cenu zlata. Želi da razume šta kupuje, zašto kupuje i da li donosi pravu odluku.",
      "Moj posao je da odgovorim na sva pitanja, bez žurbe i bez pritiska. Bilo da neko kupuje prvu pločicu od 1 grama ili gradi ozbiljan investicioni portfolio, cilj mi je da ceo proces bude jednostavan, jasan i siguran.",
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NasTimPage() {
  return (
    <main className="bg-white">
      <SchemaScript schema={buildBreadcrumbSchema(BREADCRUMBS)} />
      <SchemaScript
        schema={buildWebPageSchema({
          name: "Naš tim | Gold Invest - Investiciono zlato Beograd",
          description:
            "Kupovina investicionog zlata u Beogradu uz direktan kontakt, transparentne cene i LBMA garanciju.",
          slug: "/o-nama/nas-tim",
        })}
      />

      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={BREADCRUMBS} variant="light" />
        </SectionContainer>
      </section>

      {/* ── Uvod ─────────────────────────────────────────────────────────────── */}
      <section
        className="pt-14 pb-12 border-b border-[#F0EDE6]"
        style={{
          background:
            "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)",
        }}
      >
        <SectionContainer>
          <div className="max-w-2xl text-left md:text-center md:mx-auto">
            <h1
              className="text-[#1B1B1C] leading-[1.1] mb-6"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 4vw, 52px)",
              }}
            >
              <span style={{ fontStyle: "normal" }}>Upoznajte ljude</span>
              <br />
              <span style={{ fontStyle: "italic" }}>iza Gold Invest-a.</span>
            </h1>

            <p
              className="text-[#3A3220] mb-4"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontSize: 16,
                lineHeight: "1.75em",
                maxWidth: 560,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Gold Invest je osnovan od strane pravnika koji je godinama klijentima savetovao
              fizičko investiciono zlato kao zaštitu imovine - i koji je odlučio da taj standard
              sam postavi. Svaka transakcija se odvija uz punu dokumentaciju, LBMA garanciju
              autentičnosti i cenu formiranu prema London Fix kursu, bez skrivenih premijuma.
            </p>
            <p
              className="text-[#3A3220] mb-10"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontSize: 16,
                lineHeight: "1.75em",
                maxWidth: 560,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Svaki klijent od prvog razgovora do preuzimanja komunicira direktno sa Vukom
              ili Stefanom - bez call centra i bez generičkih odgovora. Pozivamo vas da nas
              posetite u kancelariji na Džordža Vašingtona 3 u Beogradu i da se lično upoznamo.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:justify-center">
              <Link
                href="tel:+38161426-4129"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  background: "#1B1B1C",
                  letterSpacing: "0.01em",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.1a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Pozovite nas
              </Link>
              <Link
                href="https://maps.google.com/?q=Džordža+Vašingtona+3+Beograd"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-[13.5px] font-semibold transition-colors"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  background: "rgba(255,255,255,0.55)",
                  color: "#1B1B1C",
                  letterSpacing: "0.01em",
                  backdropFilter: "blur(4px)",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Džordža Vašingtona 3, Beograd
              </Link>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ── Clan tima ────────────────────────────────────────────────────────── */}
      {TEAM.map((member, i) => {
        const imgLeft = i % 2 === 0;
        return (
          <section
            key={member.name}
            className="py-16 sm:py-24"
            style={{ background: i % 2 === 0 ? "#FFFFFF" : "#F9F7F2" }}
          >
            <SectionContainer>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

                {/* Slika */}
                <div
                  className={`relative rounded-2xl overflow-hidden ${imgLeft ? "" : "md:order-2"}`}
                  style={{ aspectRatio: "4/5" }}
                >
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    style={{ objectPosition: "50% 20%" }}
                  />
                </div>

                {/* Tekst */}
                <div className={imgLeft ? "" : "md:order-1"}>
                  <span
                    className="block text-[11px] font-semibold tracking-widest uppercase mb-3"
                    style={{
                      fontFamily: "var(--font-rethink), sans-serif",
                      color: "#BF8E41",
                    }}
                  >
                    {member.role}
                  </span>
                  <h2
                    className="text-[#1B1B1C] mb-6 leading-[1.1]"
                    style={{
                      fontFamily: "var(--font-pp-editorial), Georgia, serif",
                      fontWeight: 400,
                      fontStyle: "italic",
                      fontSize: "clamp(28px, 3vw, 40px)",
                    }}
                  >
                    {member.name}
                  </h2>

                  <div className="flex flex-col gap-4 mb-8">
                    {member.bio.map((para, j) => (
                      <p
                        key={j}
                        className="text-[#3A3A3A]"
                        style={{
                          fontFamily: "var(--font-rethink), sans-serif",
                          fontSize: 15,
                          lineHeight: "1.75em",
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#1B1B1C] hover:text-[#BF8E41] transition-colors text-[13px] font-medium"
                    style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn profil
                  </a>
                </div>

              </div>
            </SectionContainer>
          </section>
        );
      })}

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <WhatIsGoldSection />
    </main>
  );
}
