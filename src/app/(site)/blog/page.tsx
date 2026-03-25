import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { BlogGrid, type Post } from "@/components/blog/BlogGrid";
import { NewsletterSection } from "@/components/blog/NewsletterSection";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Blog | Gold Invest — Saveti i analize o investicionom zlatu",
  description:
    "Čitajte stručne tekstove o investicionom zlatu — kako kupiti, zašto je zlato sigurna investicija, analiza tržišta, saveti za početnike i iskusne investitore.",
  alternates: { canonical: "https://goldinvest.rs/blog" },
  openGraph: {
    title: "Blog | Gold Invest — Saveti i analize o investicionom zlatu",
    description:
      "Stručni tekstovi o zlatu kao investiciji — tržište, saveti, vodiči i analize.",
    url: "https://goldinvest.rs/blog",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Blog", href: "/blog" },
];

const POSTS: Post[] = [
  {
    slug: "zasto-ulagati-u-zlato",
    title: "Zašto ulagati u zlato — 7 razloga koje svaki investitor treba da zna",
    excerpt:
      "Zlato čuva vrednost kroz decenije, štiti od inflacije i valutnih kriza. Evo konkretnih razloga zašto finansijski stručnjaci preporučuju 5–15% zlata u portfelju.",
    category: "Investiciono zlato",
    date: "15. mart 2025.",
    readMin: 7,
    image: "/images/bento-gold-bar.png",
    imageAlt: "Zlatna poluga kao investicija",
    featured: true,
  },
  {
    slug: "kako-odrediti-cenu-zlata",
    title: "Kako se formira cena zlata na tržištu",
    excerpt:
      "London Bullion Market Association (LBMA) dva puta dnevno objavljuje referentnu cenu zlata. Saznajte šta utiče na kurs i kako pratiti pravi trenutak za kupovinu.",
    category: "Tržište",
    date: "8. mart 2025.",
    readMin: 5,
    image: "/images/faktori-1.png",
    imageAlt: "Grafikon cene zlata na berzi",
  },
  {
    slug: "zlatne-poluge-vs-novcanice",
    title: "Zlatne poluge ili novčanice — šta je bolje za početnike",
    excerpt:
      "Poluge nude nižu premiju za veće iznose, dok novčanice omogućavaju fleksibilnu prodaju u manjim količinama. Uporedite prednosti i mane oba formata.",
    category: "Vodič",
    date: "1. mart 2025.",
    readMin: 6,
    image: "/images/bento-coins.png",
    imageAlt: "Zlatne poluge i zlatnici",
  },
  {
    slug: "inflacija-i-zlato",
    title: "Inflacija i zlato — istorijska veza koja štiti vašu ušteđevinu",
    excerpt:
      "U periodima visoke inflacije, zlato je istorijski čuvalo kupovnu moć. Pogledajte podatke iz poslednjih 50 godina i šta to znači za vaš novac danas.",
    category: "Saveti",
    date: "22. februar 2025.",
    readMin: 8,
    image: "/images/faktori-inflacija.png",
    imageAlt: "Inflacija i zaštita ušteđevine zlatom",
  },
  {
    slug: "lbma-sertifikacija-sta-znaci",
    title: "LBMA sertifikacija — zašto je važna i kako je prepoznati",
    excerpt:
      "Samo zlato od LBMA akreditovanih kovnica garantuje međunarodnu prihvatljivost i lakšu preprodaju. Naučite kako da proverite poreklo pre kupovine.",
    category: "Vodič",
    date: "14. februar 2025.",
    readMin: 4,
    image: "/images/edu-sertifikati-lbma.png",
    imageAlt: "LBMA sertifikat za zlatnu polugu",
  },
  {
    slug: "centralne-banke-kupuju-zlato",
    title: "Centralne banke rekordno kupuju zlato — šta to znači za vas",
    excerpt:
      "U 2024. centralnim bankama sveta kupile su više zlata nego ikad. Otkrijte zašto ovo povećava dugoročni pritisak na cenu i kako to utiče na privatne investitore.",
    category: "Tržište",
    date: "5. februar 2025.",
    readMin: 6,
    image: "/images/faktori-centralne-banke.png",
    imageAlt: "Centralne banke i zlato",
  },
  {
    slug: "kako-cuvati-fizicko-zlato",
    title: "Kako čuvati fizičko zlato — sef, banka ili kuća",
    excerpt:
      "Čuvanje zlata kod kuće, u bankarskom sefu ili kod dilera — svaka opcija ima svoje prednosti i rizike. Ovaj vodič pomaže da donesete pravu odluku.",
    category: "Saveti",
    date: "28. januar 2025.",
    readMin: 5,
    image: "/images/jastuk-poluga.png",
    imageAlt: "Čuvanje fizičkog zlata u sefu",
  },
  {
    slug: "kamatne-stope-i-cena-zlata",
    title: "Kamatne stope i cena zlata — inverzna veza koju morate razumeti",
    excerpt:
      "Kada kamatne stope rastu, cena zlata obično pada — i obrnuto. Razumevanje ove veze pomaže vam da bolje planirate trenutak ulaska u investiciju.",
    category: "Tržište",
    date: "20. januar 2025.",
    readMin: 5,
    image: "/images/faktori-kamatne-stope.png",
    imageAlt: "Kamatne stope i kretanje cene zlata",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  return (
    <main className="bg-white">
      <SchemaScript schema={buildBreadcrumbSchema(BREADCRUMBS)} />
      <SchemaScript
        schema={buildWebPageSchema({
          name: "Blog | Gold Invest — Saveti i analize o investicionom zlatu",
          description:
            "Stručni tekstovi o investicionom zlatu — tržište, saveti, vodiči i analize za srpske investitore.",
          slug: "/blog",
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
        className="pt-14 pb-12 border-b border-[#F0EDE6]"
        style={{
          background: "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)",
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
              <span style={{ fontStyle: "normal" }}>Znanje koje</span>
              <br />
              <span style={{ fontStyle: "italic" }}>štiti vaš novac.</span>
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
              Stručni tekstovi o investicionom zlatu — kako funkcioniše tržište, šta
              utiče na cenu, kako odabrati pravi format i kako zaštititi ušteđevinu
              na dugi rok.
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* ── Blog grid ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#FAFAF8] py-14 sm:py-20">
        <SectionContainer>
          <BlogGrid posts={POSTS} />
        </SectionContainer>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────────── */}
      <NewsletterSection />

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <WhatIsGoldSection />
    </main>
  );
}
