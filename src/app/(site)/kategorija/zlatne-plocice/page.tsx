import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Zlatne pločice | Prodaja zlatnih pločica - Gold Invest",
  description:
    "Kupite LBMA sertifikovane zlatne pločice od 1g do 20g — Argor-Heraeus, C. Hafner. Idealan poklon za krštenje i rođenje. Transparentne cene i brza dostava.",
  alternates: { canonical: "https://goldinvest.rs/kategorija/zlatne-plocice" },
};

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
];

// Mock fallback (isti stil kao homepage)
const MOCK_SNAPSHOT = { id: "mock", xau_usd: 2700, xau_eur: 4375, usd_rsd: 108, eur_rsd: 117.5, price_per_g_rsd: 16500, source: "mock", fetched_at: new Date().toISOString() };
const MOCK_TIERS = [{ id: "t1", name: "default", category: null, min_g: 0, max_g: 99999, margin_stock_pct: 4.5, margin_advance_pct: 3.5, margin_purchase_pct: 2, created_at: "" }];
const MOCK_VARIANTS = [
  { id: "1", product_id: "p1", slug: "zlatna-plocica-1g-pamp", weight_g: 1, weight_oz: 0.032, purity: 0.9999, fine_weight_g: 1, sku: null, stock_qty: 10, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 1, is_active: true, products: { name: "Zlatna pločica 1g", brand: "PAMP Suisse", origin: "Švajcarska", category: "plocica" }, pricing_rules: null },
  { id: "2", product_id: "p2", slug: "zlatna-plocica-2g-pamp", weight_g: 2, weight_oz: 0.064, purity: 0.9999, fine_weight_g: 2, sku: null, stock_qty: 8, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 2, is_active: true, products: { name: "Zlatna pločica 2g", brand: "PAMP Suisse", origin: "Švajcarska", category: "plocica" }, pricing_rules: null },
  { id: "3", product_id: "p3", slug: "zlatna-plocica-5g-heraeus", weight_g: 5, weight_oz: 0.161, purity: 0.9999, fine_weight_g: 5, sku: null, stock_qty: 5, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 3, is_active: true, products: { name: "Zlatna pločica 5g", brand: "Heraeus", origin: "Nemačka", category: "plocica" }, pricing_rules: null },
  { id: "4", product_id: "p4", slug: "zlatna-plocica-10g-heraeus", weight_g: 10, weight_oz: 0.321, purity: 0.9999, fine_weight_g: 10, sku: null, stock_qty: 3, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 4, is_active: true, products: { name: "Zlatna pločica 10g", brand: "Heraeus", origin: "Nemačka", category: "plocica" }, pricing_rules: null },
  { id: "5", product_id: "p5", slug: "zlatna-plocica-20g-heraeus", weight_g: 20, weight_oz: 0.643, purity: 0.9999, fine_weight_g: 20, sku: null, stock_qty: 2, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 5, is_active: true, products: { name: "Zlatna pločica 20g", brand: "Heraeus", origin: "Nemačka", category: "plocica" }, pricing_rules: null },
];

export default async function ZlatnePlocicePage() {
  let variants: any = MOCK_VARIANTS, tiers: any = MOCK_TIERS, snapshotRow: any = MOCK_SNAPSHOT;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("products.category", "plocica")
        .eq("is_active", true)
        .order("sort_order"),
      supabase.from("pricing_tiers").select("*"),
      supabase
        .from("gold_price_snapshots")
        .select("*")
        .order("fetched_at", { ascending: false })
        .limit(1)
        .single(),
    ]);
    if (r1.data?.length) {
      variants = r1.data;
      tiers = r2.data;
      snapshotRow = r3.data;
    }
  } catch {
    // Supabase nedostupan ili nema ENV — koristimo mock podatke
  }

  return (
    <main className="min-h-screen bg-[#1B1B1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={BREADCRUMBS} />

        <div className="mt-6 mb-10">
          <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-[#E9E6D9]">
            Zlatne pločice
          </h1>
          <p className="mt-4 text-[#8A8A8A] text-base max-w-2xl leading-relaxed">
            Zlatne pločice od 1g do 20g — savršen ulazak u svet investiranja i
            najvredniji poklon za krštenja, rođenja i venčanja. LBMA sertifikovane,
            finoće 999,9.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { label: "Pločice 1g–20g",   href: "/kategorija/zlatne-plocice" },
            { label: "Poluge 50g–1kg",    href: "/kategorija/zlatne-poluge" },
            { label: "Dukati i kovanice", href: "/kategorija/zlatni-dukati" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={[
                "px-5 py-2 rounded-full text-sm font-medium border transition-colors",
                link.href === "/kategorija/zlatne-plocice"
                  ? "border-[#BF8E41] text-[#BF8E41] bg-[#BF8E41]/5"
                  : "border-[#2E2E2F] text-[#8A8A8A] hover:border-[#BF8E41]/40 hover:text-[#E9E6D9]",
              ].join(" ")}
            >
              {link.label}
            </a>
          ))}
        </div>

        {snapshotRow && variants && tiers ? (
          <ProductGrid variants={variants as any} tiers={tiers} snapshot={snapshotRow} />
        ) : (
          <p className="text-[#8A8A8A] py-12 text-center">Cene trenutno nisu dostupne.</p>
        )}
      </div>
    </main>
  );
}
