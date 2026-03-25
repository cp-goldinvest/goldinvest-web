import type { Metadata } from "next";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BLOG_POSTS } from "@/data/blog-posts";
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
          <BlogGrid posts={BLOG_POSTS} />
        </SectionContainer>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────────── */}
      <NewsletterSection />

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <WhatIsGoldSection />
    </main>
  );
}
