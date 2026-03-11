import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/home/HeroSection";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { GoldTypesSection } from "@/components/home/GoldTypesSection";
import { PriceBreakdownSection } from "@/components/home/PriceBreakdownSection";
import { GoldPriceChart } from "@/components/home/GoldPriceChart";
import { EducationCarousel } from "@/components/home/EducationCarousel";
import { FaqSection } from "@/components/home/FaqSection";
import { ProductGrid } from "@/components/catalog/ProductGrid";

export const revalidate = 60;

export default async function HomePage() {
  let variants = null, tiers = null, snapshotRow = null;
  try {
    const supabase = createServiceClient();
    const timeout = (ms: number) => new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
    const [r1, r2, r3] = await Promise.race([
      Promise.all([
        supabase.from("product_variants").select("*, products!inner(name, brand, origin, category), pricing_rules(*)").eq("is_active", true).order("sort_order"),
        supabase.from("pricing_tiers").select("*"),
        supabase.from("gold_price_snapshots").select("*").order("fetched_at", { ascending: false }).limit(1).single(),
      ]),
      timeout(5000).then(() => { throw new Error("timeout"); }),
    ]) as any;
    variants = r1.data;
    tiers = r2.data;
    snapshotRow = r3.data;
  } catch {
    // DB nedostupna — prikazujemo fallback
  }

  return (
    <main className="bg-white">

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Products */}
      <section className="bg-white py-12">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8">
          {variants && tiers && snapshotRow ? (
            <ProductGrid
              variants={variants as any}
              tiers={tiers}
              snapshot={snapshotRow}
            />
          ) : (
            <div className="py-20 text-center text-[#9D9072]">
              Cene trenutno nisu dostupne. Pokušajte ponovo.
            </div>
          )}
        </div>
      </section>

      {/* 3. Vrste i pravila */}
      <GoldTypesSection />

      {/* 4. Citat / quote sekcija */}
      <section className="bg-[#0D0D0D] py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col items-center text-center">
          <span className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-6">
            Investicija
          </span>
          <h2
            className="text-white leading-[1.15] mb-10 max-w-[820px]"
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(22px, 3.2vw, 42px)",
              fontWeight: 400,
            }}
          >
            <span style={{ fontStyle: "normal" }}>
              Kupovinom investicionog zlata vi zapravo ne trošite svoj novac,{" "}
            </span>
            <span style={{ fontStyle: "italic" }}>
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
        </div>
      </section>

      {/* 5. Faktori cene + raščlanjenost */}
      <PriceBreakdownSection />

      {/* 6. Gold price chart */}
      <GoldPriceChart />

      {/* 7. Edukacija carousel */}
      <EducationCarousel />

      {/* 8. FAQ */}
      <FaqSection />

      {/* 7. CTA — iznad footera */}
      <WhatIsGoldSection />

    </main>
  );
}
