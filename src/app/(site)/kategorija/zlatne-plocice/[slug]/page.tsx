import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const revalidate = 60;

// ── Weight config per slug ─────────────────────────────────────────────────
type WeightConfig = {
  grams: number;
  label: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
};

const WEIGHT_CONFIGS: Record<string, WeightConfig> = {
  "zlatna-plocica-1g": {
    grams: 1,
    label: "Zlatna pločica 1g",
    metaTitle: "Zlatna pločica 1g | Investiciono zlato - Gold Invest",
    metaDescription:
      "Kupite LBMA sertifikovanu zlatnu pločicu od 1 grama čistoće 999,9. Idealan poklon za krštenje, rođenje i venčanje. Brza dostava širom Srbije.",
    intro:
      "Zlatna pločica od 1 grama je najpristupačniji ulaz u svet investicionog zlata i najpopularniji poklon za krštenja i rođenja. Isporučuje se u zaštitnom blisteru sa sertifikatom kovnice.",
  },
  "zlatna-plocica-2g": {
    grams: 2,
    label: "Zlatna pločica 2g",
    metaTitle: "Zlatna pločica 2g | Investiciono zlato - Gold Invest",
    metaDescription:
      "LBMA sertifikovana zlatna pločica od 2 grama čistoće 999,9. Odličan poklon i početni investicioni korak. Dostava za celu Srbiju.",
    intro:
      "Zlatna pločica od 2 grama nudi odličan odnos cene i vrednosti za početnike u investiranju u zlato. Dolazi u zaštitnom blisteru poznatih svetskih kovnica.",
  },
  "zlatna-plocica-5g": {
    grams: 5,
    label: "Zlatna pločica 5g",
    metaTitle: "Zlatna pločica 5g | Investiciono zlato - Gold Invest",
    metaDescription:
      "Kupite zlatnu pločicu od 5 grama — LBMA sertifikat, čistoća 999,9. Argor-Heraeus, C. Hafner. Transparentne prodajne, avansne i otkupne cene.",
    intro:
      "Zlatna pločica od 5 grama je popularan izbor za redovno štedenje u zlatu. LBMA sertifikovana, čistoće 999,9, u zaštitnom blisteru sa hologramom.",
  },
  "zlatna-plocica-10g": {
    grams: 10,
    label: "Zlatna pločica 10g",
    metaTitle: "Zlatna pločica 10g | Investiciono zlato - Gold Invest",
    metaDescription:
      "LBMA sertifikovana zlatna pločica 10g čistoće 999,9. Idealna za diversifikaciju portfelja i dugoročno čuvanje vrednosti. Gold Invest — pouzdani partner.",
    intro:
      "Zlatna pločica od 10 grama je jedan od najtraženijih formata za investitore koji žele fleksibilnost i laku prodaju. Pogodna za redovnu kupovinu i postepenu izgradnju portfolija.",
  },
  "zlatna-plocica-20g": {
    grams: 20,
    label: "Zlatna pločica 20g",
    metaTitle: "Zlatna pločica 20g | Investiciono zlato - Gold Invest",
    metaDescription:
      "Zlatna pločica 20g — LBMA sertifikat, čistoća 999,9. Ulazak u teritoriju ozbiljnijeg investiranja po povoljnijoj spreadovnoj premiji. Dostava širom Srbije.",
    intro:
      "Zlatna pločica od 20 grama nudi bolji odnos premije prema ceni zlata u poređenju sa manjim formatima, uz zadržavanje fleksibilnosti pri prodaji ili poklanjanju.",
  },
};

// ── Static params (SSG) ────────────────────────────────────────────────────
export function generateStaticParams() {
  return Object.keys(WEIGHT_CONFIGS).map((slug) => ({ slug }));
}

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = WEIGHT_CONFIGS[slug];
  if (!config) return {};
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: `https://goldinvest.rs/kategorija/zlatne-plocice/${slug}`,
    },
  };
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function PlocicaWeightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = WEIGHT_CONFIGS[slug];
  if (!config) notFound();

  // Mock fallback (isti set kao na homepage-u)
  const MOCK_SNAPSHOT = { id: "mock", xau_usd: 2700, xau_eur: 4375, usd_rsd: 108, eur_rsd: 117.5, price_per_g_rsd: 16500, source: "mock", fetched_at: new Date().toISOString() };
  const MOCK_TIERS = [{ id: "t1", name: "default", category: null, min_g: 0, max_g: 99999, margin_stock_pct: 4.5, margin_advance_pct: 3.5, margin_purchase_pct: 2, created_at: "" }];
  const MOCK_VARIANTS = [
    { id: "1", product_id: "p1", slug: "zlatna-plocica-1g-pamp", weight_g: 1, weight_oz: 0.032, purity: 0.9999, fine_weight_g: 1, sku: null, stock_qty: 10, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 1, is_active: true, products: { name: "Zlatna pločica 1g", brand: "PAMP Suisse", origin: "Švajcarska", category: "plocica" }, pricing_rules: null },
    { id: "2", product_id: "p2", slug: "zlatna-plocica-2g-pamp", weight_g: 2, weight_oz: 0.064, purity: 0.9999, fine_weight_g: 2, sku: null, stock_qty: 8, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 2, is_active: true, products: { name: "Zlatna pločica 2g", brand: "PAMP Suisse", origin: "Švajcarska", category: "plocica" }, pricing_rules: null },
    { id: "3", product_id: "p3", slug: "zlatna-plocica-5g-heraeus", weight_g: 5, weight_oz: 0.161, purity: 0.9999, fine_weight_g: 5, sku: null, stock_qty: 5, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 3, is_active: true, products: { name: "Zlatna pločica 5g", brand: "Heraeus", origin: "Nemačka", category: "plocica" }, pricing_rules: null },
    { id: "4", product_id: "p4", slug: "zlatna-plocica-10g-heraeus", weight_g: 10, weight_oz: 0.321, purity: 0.9999, fine_weight_g: 10, sku: null, stock_qty: 3, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 4, is_active: true, products: { name: "Zlatna pločica 10g", brand: "Heraeus", origin: "Nemačka", category: "plocica" }, pricing_rules: null },
    { id: "5", product_id: "p5", slug: "zlatna-plocica-20g-heraeus", weight_g: 20, weight_oz: 0.643, purity: 0.9999, fine_weight_g: 20, sku: null, stock_qty: 2, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 5, is_active: true, products: { name: "Zlatna pločica 20g", brand: "Heraeus", origin: "Nemačka", category: "plocica" }, pricing_rules: null },
  ];

  let variants: any = MOCK_VARIANTS.filter((v) => Number(v.weight_g) === config.grams);
  let tiers: any = MOCK_TIERS;
  let snapshotRow: any = MOCK_SNAPSHOT;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("products.category", "plocica")
        .eq("weight_g", config.grams)
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

  const breadcrumbs = [
    { label: "Investiciono zlato", href: "/" },
    { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
    { label: config.label, href: `/kategorija/zlatne-plocice/${slug}` },
  ];

  return (
    <main className="min-h-screen bg-[#1B1B1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <Breadcrumb items={breadcrumbs} />

        <div className="mt-6 mb-10">
          <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-[#E9E6D9]">
            {config.label}
          </h1>
          <p className="mt-4 text-[#8A8A8A] text-base max-w-2xl leading-relaxed">
            {config.intro}
          </p>
        </div>

        {/* Weight quick-links */}
        <div className="flex flex-wrap gap-2 mb-8">
          {Object.entries(WEIGHT_CONFIGS).map(([s, c]) => (
            <a
              key={s}
              href={`/kategorija/zlatne-plocice/${s}`}
              className={[
                "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                s === slug
                  ? "border-[#BF8E41] text-[#BF8E41] bg-[#BF8E41]/5"
                  : "border-[#2E2E2F] text-[#8A8A8A] hover:border-[#BF8E41]/40 hover:text-[#E9E6D9]",
              ].join(" ")}
            >
              {c.label}
            </a>
          ))}
        </div>

        <ProductGrid
          variants={variants as any}
          tiers={tiers}
          snapshot={snapshotRow}
        />

      </div>
    </main>
  );
}
