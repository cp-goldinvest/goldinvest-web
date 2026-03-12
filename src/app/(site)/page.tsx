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

const MOCK_SNAPSHOT = { id: "mock", xau_usd: 2700, xau_eur: 4375, usd_rsd: 108, eur_rsd: 117.5, price_per_g_rsd: 16500, source: "mock", fetched_at: new Date().toISOString() };
const MOCK_TIERS = [{ id: "t1", name: "default", category: null, min_g: 0, max_g: 99999, margin_stock_pct: 4.5, margin_advance_pct: 3.5, margin_purchase_pct: 2, created_at: "" }];
const MOCK_VARIANTS = [
  { id: "1", product_id: "p1", slug: "zlatna-plocica-1g-pamp", weight_g: 1, weight_oz: 0.032, purity: 0.9999, fine_weight_g: 1, sku: null, stock_qty: 10, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 1, is_active: true, products: { name: "Zlatna pločica 1g", brand: "PAMP Suisse", origin: "Švajcarska", category: "plocica" }, pricing_rules: null },
  { id: "2", product_id: "p2", slug: "zlatna-plocica-2g-pamp", weight_g: 2, weight_oz: 0.064, purity: 0.9999, fine_weight_g: 2, sku: null, stock_qty: 8, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 2, is_active: true, products: { name: "Zlatna pločica 2g", brand: "PAMP Suisse", origin: "Švajcarska", category: "plocica" }, pricing_rules: null },
  { id: "3", product_id: "p3", slug: "zlatna-plocica-5g-heraeus", weight_g: 5, weight_oz: 0.161, purity: 0.9999, fine_weight_g: 5, sku: null, stock_qty: 5, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 3, is_active: true, products: { name: "Zlatna pločica 5g", brand: "Heraeus", origin: "Nemačka", category: "plocica" }, pricing_rules: null },
  { id: "4", product_id: "p4", slug: "zlatna-plocica-10g-heraeus", weight_g: 10, weight_oz: 0.321, purity: 0.9999, fine_weight_g: 10, sku: null, stock_qty: 3, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 4, is_active: true, products: { name: "Zlatna pločica 10g", brand: "Heraeus", origin: "Nemačka", category: "plocica" }, pricing_rules: null },
  { id: "5", product_id: "p5", slug: "zlatna-poluga-1oz-argor", weight_g: 31.1, weight_oz: 1, purity: 0.9999, fine_weight_g: 31.1, sku: null, stock_qty: 4, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 5, is_active: true, products: { name: "Zlatna poluga 1 unca", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "6", product_id: "p6", slug: "zlatna-poluga-50g-umicore", weight_g: 50, weight_oz: 1.607, purity: 0.9999, fine_weight_g: 50, sku: null, stock_qty: 2, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 6, is_active: true, products: { name: "Zlatna poluga 50g", brand: "Umicore", origin: "Belgija", category: "poluga" }, pricing_rules: null },
  { id: "7", product_id: "p7", slug: "zlatni-dukat-1-4oz-maple", weight_g: 7.78, weight_oz: 0.25, purity: 0.9999, fine_weight_g: 7.78, sku: null, stock_qty: 6, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 7, is_active: true, products: { name: "Zlatni Maple Leaf 1/4oz", brand: "Royal Canadian Mint", origin: "Kanada", category: "dukat" }, pricing_rules: null },
  { id: "8", product_id: "p8", slug: "zlatni-dukat-1oz-krugerrand", weight_g: 31.1, weight_oz: 1, purity: 0.9167, fine_weight_g: 31.1, sku: null, stock_qty: 3, availability: "available_on_request", lead_time_weeks: 1, images: ["/images/product-poluga.png"], sort_order: 8, is_active: true, products: { name: "Krugerrand 1oz", brand: "South African Mint", origin: "Južna Afrika", category: "dukat" }, pricing_rules: null },
];

export default async function HomePage() {
  let variants: any = MOCK_VARIANTS, tiers: any = MOCK_TIERS, snapshotRow: any = MOCK_SNAPSHOT;
  try {
    const supabase = createServiceClient();
    const withTimeout = <T,>(p: Promise<T>): Promise<T> =>
      Promise.race([p, new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000))]);

    const [r1, r2, r3] = await withTimeout(Promise.all([
      supabase.from("product_variants").select("*, products!inner(name, brand, origin, category), pricing_rules(*)").eq("is_active", true).order("sort_order"),
      supabase.from("pricing_tiers").select("*"),
      supabase.from("gold_price_snapshots").select("*").order("fetched_at", { ascending: false }).limit(1).single(),
    ]));
    if (r1.data?.length) { variants = r1.data; tiers = r2.data; snapshotRow = r3.data; }
  } catch {
    // DB nedostupna — koristimo mock podatke
  }

  return (
    <main className="bg-white">

      {/* 1. Hero */}
      <HeroSection />

      {/* 2. Products */}
      <section className="bg-white py-12">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8">
          <ProductGrid
            variants={variants as any}
            tiers={tiers}
            snapshot={snapshotRow}
          />
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
