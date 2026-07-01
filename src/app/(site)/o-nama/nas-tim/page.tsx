import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";
import { TeamCard } from "./TeamCard";

export const metadata: Metadata = {
  title: "Naš tim | Gold Invest - Investiciono zlato Beograd",
  description:
    "Upoznajte Vuka i Stefana Rosića - osnivače Gold Invest-a. Direktan kontakt, bez posrednika.",
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

// Zamenite sa pravim LinkedIn URL-ovima kada su profili gotovi
const TEAM = [
  {
    name: "Vuk Rosić",
    role: "CEO | Osnivač",
    image: "/images/team/Vuk.webp",
    linkedin: "https://www.linkedin.com/in/vuk-rosic",
    bio: [
      "Po struci pravnik, a po izboru trgovac investicionim zlatom. Godinama sam radio sa ljudima koji su želeli da zaštite vrednost svoje imovine i iznova nailazio na isti problem - nedostajalo je mesto kome mogu istinski da veruju.",
      "Upravo iz tog razloga nastao je Gold Invest. Ideja je bila jednostavna: omogućiti kupovinu investicionog zlata kroz jasan proces, realne informacije i odnos u kojem je poverenje važnije od same prodaje.",
    ],
  },
  {
    name: "Stefan Rosić",
    role: "Sales Consultant",
    image: "/images/team/Stefan.webp",
    linkedin: "https://www.linkedin.com/in/stefan-rosic",
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
          description: "Direktan kontakt, bez posrednika.",
          slug: "/o-nama/nas-tim",
        })}
      />

      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={BREADCRUMBS} variant="light" />
        </SectionContainer>
      </section>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
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
              className="text-[#1B1B1C] leading-[1.1] mb-5"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(32px, 4vw, 54px)",
              }}
            >
              <span style={{ fontStyle: "normal" }}>Poverenje počinje razgovorom.</span>
              <br />
              <span style={{ fontStyle: "italic" }}>Sa pravom osobom.</span>
            </h1>
            <p
              className="text-[#4C4C4C] leading-relaxed md:mx-auto"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontSize: 16,
                lineHeight: "1.65em",
                maxWidth: 520,
              }}
            >
              Od prvog poziva do završene kupovine komunicirate direktno sa Gold Invest timom.
              Bez call centra, bez prebacivanja između operatera i bez generičkih odgovora.
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* ── Tim ──────────────────────────────────────────────────────────────── */}
      <section className="bg-white py-12 sm:py-16 border-b border-[#F0EDE6]">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TEAM.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <WhatIsGoldSection />
    </main>
  );
}
