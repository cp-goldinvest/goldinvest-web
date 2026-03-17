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
  "zlatna-poluga-1-unca": {
    grams: 31.1,
    label: "Zlatna poluga 1 unca (31,1g)",
    metaTitle: "Zlatna poluga 1 unca | Investiciono zlato - Gold Invest",
    metaDescription:
      "Kupite LBMA sertifikovanu zlatnu polugu od 1 troy unce (31,1g) čistoće 999,9. Globalno najpopularniji format za investitore. Transparentne cene — Gold Invest.",
    intro:
      "Zlatna poluga od 1 troy unce (31,1034g) je globalno najlikvidniji format investicionog zlata. Lako se prodaje svuda u svetu, a cena je direktno vezana za međunarodnu troy uncu.",
  },
  "zlatna-poluga-50g": {
    grams: 50,
    label: "Zlatna poluga 50g",
    metaTitle: "Zlatna poluga 50g | Investiciono zlato - Gold Invest",
    metaDescription:
      "LBMA sertifikovana zlatna poluga od 50 grama čistoće 999,9. Argor-Heraeus, C. Hafner. Odličan balans između veličine investicije i fleksibilnosti.",
    intro:
      "Zlatna poluga od 50 grama je idealan izbor za investitore koji žele ozbiljniji unos kapitala uz zadržavanje fleksibilnosti pri delimičnoj prodaji portfolija.",
  },
  "zlatna-poluga-100g": {
    grams: 100,
    label: "Zlatna poluga 100g",
    metaTitle: "Zlatna poluga 100g | Investiciono zlato - Gold Invest",
    metaDescription:
      "Kupite zlatnu polugu od 100 grama — apsolutno najtraženiji format na srpskom i evropskom tržištu. LBMA sertifikat, čistoća 999,9. Gold Invest — pouzdani partner.",
    intro:
      "Zlatna poluga od 100 grama je apsolutno najprodavaniji format na domaćem i evropskom tržištu. Savršen balans između vrednosti investicije i lakoće čuvanja i prodaje.",
  },
  "zlatna-poluga-250g": {
    grams: 250,
    label: "Zlatna poluga 250g",
    metaTitle: "Zlatna poluga 250g | Investiciono zlato - Gold Invest",
    metaDescription:
      "LBMA sertifikovana zlatna poluga 250g čistoće 999,9. Za ozbiljne investitore koji žele manji spread i veće količine zlata u trezoru. Dostava za celu Srbiju.",
    intro:
      "Zlatna poluga od 250 grama nudi značajno manji procentualni spread od manjih formata, što je čini izborom iskusnijih investitora koji grade veće zlatne rezerve.",
  },
  "zlatna-poluga-500g": {
    grams: 500,
    label: "Zlatna poluga 500g",
    metaTitle: "Zlatna poluga 500g | Investiciono zlato - Gold Invest",
    metaDescription:
      "Zlatna poluga od 500 grama — LBMA sertifikat, čistoća 999,9. Ultimativni izbor za ozbiljne investitore koji prebacuju veće sume iz finansijskog u realni sistem.",
    intro:
      "Zlatna poluga od 500 grama je izbor ozbiljnih investitora i institucija. Najmanji spread od svih manjih formata, maksimalna efikasnost pri ulaganju većeg kapitala.",
  },
  "zlatna-poluga-1kg": {
    grams: 1000,
    label: "Zlatna poluga 1kg",
    metaTitle: "Zlatna poluga 1kg | Investiciono zlato - Gold Invest",
    metaDescription:
      "Kupite zlatnu polugu od 1 kilograma — matematički najefikasniji format investicionog zlata. LBMA sertifikat, čistoća 999,9. Individualna ponuda — pozovite nas.",
    intro:
      "Zlatna poluga od 1 kilograma je matematički najefikasniji format — minimalan spread, maksimalna vrednost po gramu. Za individualne cene i uslove dostave, pozovite nas direktno.",
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
      canonical: `https://goldinvest.rs/kategorija/zlatne-poluge/${slug}`,
    },
  };
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function PolugaWeightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = WEIGHT_CONFIGS[slug];
  if (!config) notFound();

  // Mock fallback (isti kao za kategoriju poluga)
  const MOCK_SNAPSHOT = { id: "mock", xau_usd: 2700, xau_eur: 4375, usd_rsd: 108, eur_rsd: 117.5, price_per_g_rsd: 16500, source: "mock", fetched_at: new Date().toISOString() };
  const MOCK_TIERS = [{ id: "t1", name: "default", category: null, min_g: 0, max_g: 99999, margin_stock_pct: 4.5, margin_advance_pct: 3.5, margin_purchase_pct: 2, created_at: "" }];
  const MOCK_POLUGE = [
    { id: "p1", product_id: "p1", slug: "zlatna-poluga-1-unca-argor", weight_g: 31.1, weight_oz: 1, purity: 0.9999, fine_weight_g: 31.1, sku: null, stock_qty: 4, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 1, is_active: true, products: { name: "Zlatna poluga 1 unca", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
    { id: "p2", product_id: "p2", slug: "zlatna-poluga-50g-umicore", weight_g: 50, weight_oz: 1.607, purity: 0.9999, fine_weight_g: 50, sku: null, stock_qty: 2, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 2, is_active: true, products: { name: "Zlatna poluga 50g", brand: "Umicore", origin: "Belgija", category: "poluga" }, pricing_rules: null },
    { id: "p3", product_id: "p3", slug: "zlatna-poluga-100g-argor", weight_g: 100, weight_oz: 3.215, purity: 0.9999, fine_weight_g: 100, sku: null, stock_qty: 3, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 3, is_active: true, products: { name: "Zlatna poluga 100g", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
    { id: "p4", product_id: "p4", slug: "zlatna-poluga-250g-argor", weight_g: 250, weight_oz: 8.037, purity: 0.9999, fine_weight_g: 250, sku: null, stock_qty: 1, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 4, is_active: true, products: { name: "Zlatna poluga 250g", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
    { id: "p5", product_id: "p5", slug: "zlatna-poluga-500g-argor", weight_g: 500, weight_oz: 16.075, purity: 0.9999, fine_weight_g: 500, sku: null, stock_qty: 1, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 5, is_active: true, products: { name: "Zlatna poluga 500g", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
    { id: "p6", product_id: "p6", slug: "zlatna-poluga-1kg-argor", weight_g: 1000, weight_oz: 32.151, purity: 0.9999, fine_weight_g: 1000, sku: null, stock_qty: 1, availability: "available_on_request", lead_time_weeks: 1, images: ["/images/product-poluga.png"], sort_order: 6, is_active: true, products: { name: "Zlatna poluga 1kg", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  ];

  let variants: any = MOCK_POLUGE.filter((v) => Number(v.weight_g) === config.grams);
  let tiers: any = MOCK_TIERS;
  let snapshotRow: any = MOCK_SNAPSHOT;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("products.category", "poluga")
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
    { label: "Zlatne poluge", href: "/kategorija/zlatne-poluge" },
    { label: config.label, href: `/kategorija/zlatne-poluge/${slug}` },
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
              href={`/kategorija/zlatne-poluge/${s}`}
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
