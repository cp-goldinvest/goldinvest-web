import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { createServiceClient } from "@/lib/supabase/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildOrganizationSchema, buildLocalBusinessSchema, buildWebSiteSchema } from "@/lib/schema";
import { HeroSection } from "@/components/home/HeroSection";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { GoldTypesSection } from "@/components/home/GoldTypesSection";
import { PriceBreakdownSection } from "@/components/home/PriceBreakdownSection";
import { GoldPriceChartLazy } from "@/components/home/GoldPriceChartLazy";
import { HomeBlogBentoSection } from "@/components/home/HomeBlogBentoSection";
import { BLOG_POSTS, getLatestBlogPosts } from "@/data/blog-posts";
import { FaqSection } from "@/components/home/FaqSection";
import { ProductGrid } from "@/components/catalog/ProductGrid";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Investiciono zlato | Prodaja Investicionog Zlata Beograd i Srbija",
  description:
    "Gold Invest — specijalizovani diler investicionog zlata u Beogradu. LBMA sertifikovane zlatne poluge, pločice i dukati. Bez PDV-a, transparentne cene, brza dostava po Srbiji.",
  alternates: { canonical: "https://goldinvest.rs" },
  openGraph: {
    title: "Gold Invest — Investiciono zlato Beograd",
    description:
      "Kupite LBMA sertifikovane zlatne poluge, pločice i dukate. Transparentne cene, bez PDV-a, dostava po celoj Srbiji.",
    url: "https://goldinvest.rs",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};


async function ProductsSection() {
  let variants: any = [], tiers: any = [], snapshotRow: any = null;
  try {
    const supabase = createServiceClient();
    const withTimeout = <T,>(p: Promise<T>): Promise<T> =>
      Promise.race([p, new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000))]);

    const [r1, r2, r3] = await withTimeout(Promise.all([
      supabase.from("product_variants").select("*, products!inner(name, brand, origin, category), pricing_rules(*)").eq("is_active", true).order("sort_order"),
      supabase.from("pricing_tiers").select("*"),
      supabase.from("gold_price_snapshots").select("*").order("fetched_at", { ascending: false }).limit(1).single(),
    ]));
    variants = r1.data ?? [];
    tiers = r2.data ?? [];
    snapshotRow = r3.data ?? null;
  } catch {
    // DB nedostupna
  }

  return (
    <section className="bg-white py-12">
      <SectionContainer>
        <ProductGrid
          variants={variants as any}
          tiers={tiers}
          snapshot={snapshotRow}
          defaultSort="featured_home"
          enablePagination
          pageSize={8}
        />
        <div className="mt-10 flex justify-center">
          <Link
            href="/proizvodi"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-[#1B1B1C] text-white font-semibold transition-opacity hover:opacity-90"
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontSize: 12.5,
              boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
            }}
          >
            Pregledaj sve proizvode
          </Link>
        </div>
      </SectionContainer>
    </section>
  );
}

export default async function HomePage() {
  const latestBlogPosts = getLatestBlogPosts(BLOG_POSTS, 5);

  return (
    <main className="bg-white">
      <SchemaScript schema={buildOrganizationSchema()} />
      <SchemaScript schema={buildLocalBusinessSchema()} />
      <SchemaScript schema={buildWebSiteSchema()} />

      {/* 1. Hero — renderuje se odmah, bez čekanja na DB */}
      <HeroSection />

      {/* 2. Products — streama se kada DB odgovori */}
      <Suspense fallback={<section className="bg-white py-12" style={{ minHeight: 400 }} />}>
        <ProductsSection />
      </Suspense>

      {/* 3. Vrste i pravila */}
      <GoldTypesSection />

      {/* 4. Citat / quote sekcija */}
      <section className="bg-[#0D0D0D] py-20">
        <SectionContainer className="flex flex-col items-start text-left md:items-center md:text-center">
          <span className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-6">
            Investicija
          </span>
          <h2
            className="text-white leading-[1.15] mb-10 max-w-[820px]"
            style={{
              fontFamily: "var(--font-pp-editorial), Georgia, serif",
              fontSize: "clamp(22px, 3.2vw, 42px)",
            }}
          >
            <span style={{ fontWeight: 400, fontStyle: "normal" }}>
              Kupovinom investicionog zlata vi zapravo ne trošite svoj novac,{" "}
            </span>
            <span style={{ fontWeight: 400, fontStyle: "italic" }}>
              već ga pretvarate u najsigurniju međunarodnu valutu koja ne zavisi
              od vlada, banaka i političkih sistema.
            </span>
          </h2>
          <Link
            href="/kategorija/zlatne-poluge"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: "#BEAD87",
              fontSize: "12.1px",
              boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
            }}
          >
            Saznaj više
          </Link>
        </SectionContainer>
      </section>

      {/* 5. Faktori cene + raščlanjenost */}
      <PriceBreakdownSection />

      {/* 6. Gold price chart */}
      <GoldPriceChartLazy />

      {/* 7. Blog — bento (GoldTypes-style), 5 najnovijih članaka */}
      <HomeBlogBentoSection posts={latestBlogPosts} />

      {/* 8. FAQ */}
      <FaqSection />

      {/* 7. CTA — iznad footera */}
      <WhatIsGoldSection />

    </main>
  );
}
