import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Phone } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { computePrices, formatRsd, formatWeight } from "@/lib/pricing";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { ProductTabs } from "@/components/catalog/ProductTabs";

export const revalidate = 60;

// ── Mock data ───────────────────────────────────────────────────────────────

const MOCK_SNAPSHOT = {
  id: "mock", xau_usd: 2700, xau_eur: 4375, usd_rsd: 108, eur_rsd: 117.5,
  price_per_g_rsd: 16500, source: "mock", fetched_at: new Date().toISOString(),
};
const MOCK_TIERS = [{
  id: "t1", name: "default", category: null, min_g: 0, max_g: 99999,
  margin_stock_pct: 3.5, margin_advance_pct: 2.5, margin_purchase_pct: 1.5, created_at: "",
}];

const ALL_MOCK_VARIANTS = [
  { id: "p1", product_id: "p1", slug: "zlatna-poluga-1-unca-argor",  weight_g: 31.1,  weight_oz: 1,      purity: 0.9999, fine_weight_g: 31.1,  sku: "AH-1OZ",   stock_qty: 4, availability: "in_stock",           lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 1, is_active: true, products: { name: "Zlatna poluga 1 unca",  brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p2", product_id: "p2", slug: "zlatna-poluga-50g-hafner",    weight_g: 50,    weight_oz: 1.607,  purity: 0.9999, fine_weight_g: 50,    sku: "CH-50G",   stock_qty: 3, availability: "in_stock",           lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 2, is_active: true, products: { name: "Zlatna poluga 50g",     brand: "C. Hafner",     origin: "Nemačka",    category: "poluga" }, pricing_rules: null },
  { id: "p3", product_id: "p3", slug: "zlatna-poluga-100g-argor",   weight_g: 100,   weight_oz: 3.215,  purity: 0.9999, fine_weight_g: 100,   sku: "AH-100G",  stock_qty: 3, availability: "in_stock",           lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 3, is_active: true, products: { name: "Argor-Heraeus zlatna poluga 100g", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p4", product_id: "p4", slug: "zlatna-poluga-250g-argor",   weight_g: 250,   weight_oz: 8.037,  purity: 0.9999, fine_weight_g: 250,   sku: "AH-250G",  stock_qty: 1, availability: "in_stock",           lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 4, is_active: true, products: { name: "Zlatna poluga 250g",    brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p5", product_id: "p5", slug: "zlatna-poluga-500g-argor",   weight_g: 500,   weight_oz: 16.075, purity: 0.9999, fine_weight_g: 500,   sku: "AH-500G",  stock_qty: 1, availability: "in_stock",           lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 5, is_active: true, products: { name: "Zlatna poluga 500g",    brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p6", product_id: "p6", slug: "zlatna-poluga-1kg-argor",    weight_g: 1000,  weight_oz: 32.151, purity: 0.9999, fine_weight_g: 1000,  sku: "AH-1KG",   stock_qty: 1, availability: "available_on_request", lead_time_weeks: 1,  images: ["/images/product-poluga.png"], sort_order: 6, is_active: true, products: { name: "Zlatna poluga 1kg",     brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
];

// ── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mock = ALL_MOCK_VARIANTS.find((v) => v.slug === slug);
  const name = mock?.products?.name ?? "Zlatna poluga";
  const weight = mock ? formatWeight(mock.weight_g) : "";
  return {
    title: `${name} | Cena i Prodaja — Gold Invest Beograd`,
    description: `Kupite ${name} čistoće 999,9. LBMA Good Delivery sertifikat. Oslobođena PDV-a. Brza dostava za Beograd i celu Srbiju. Pozovite: 061/269-8569.`,
    alternates: {
      canonical: `https://goldinvest.rs/proizvodi/${slug}`,
    },
    openGraph: {
      title: `${name} ${weight} | Gold Invest`,
      description: `${name} — LBMA Good Delivery, čistoća 999,9, bez PDV-a. Brza dostava.`,
      images: [{ url: mock?.images?.[0] ?? "/images/product-poluga.png", width: 800, height: 800 }],
    },
  };
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function ProizvodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let variant: (typeof ALL_MOCK_VARIANTS)[0] | undefined = ALL_MOCK_VARIANTS.find(
    (v) => v.slug === slug
  );
  let allVariants: typeof ALL_MOCK_VARIANTS = ALL_MOCK_VARIANTS;
  let tiers: any = MOCK_TIERS;
  let snapshotRow: any = MOCK_SNAPSHOT;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("slug", slug)
        .eq("is_active", true)
        .single(),
      supabase.from("pricing_tiers").select("*"),
      supabase
        .from("gold_price_snapshots")
        .select("*")
        .order("fetched_at", { ascending: false })
        .limit(1)
        .single(),
    ]);

    if (r1.data) {
      variant = r1.data as any;
      tiers = r2.data ?? MOCK_TIERS;
      snapshotRow = r3.data ?? MOCK_SNAPSHOT;

      // Fetch related products (same category, different slug)
      const category = (r1.data as any).products?.category ?? "poluga";
      const r4 = await supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("products.category", category)
        .eq("is_active", true)
        .neq("slug", slug)
        .order("sort_order")
        .limit(4);
      if (r4.data?.length) {
        allVariants = r4.data as any;
      }
    }
  } catch {
    // Supabase nedostupan — koristimo mock podatke
  }

  if (!variant) notFound();

  const product = variant.products as {
    name: string;
    brand: string;
    origin: string;
    category: string;
  };

  const prices = computePrices(
    variant.weight_g,
    product.category,
    snapshotRow,
    variant.pricing_rules ?? null,
    tiers
  );

  const heroImg = variant.images?.[0] ?? "/images/product-poluga.png";
  const inStock = variant.availability === "in_stock";
  const isPreorder = variant.availability === "preorder";
  const weightDisplay = formatWeight(variant.weight_g);

  const breadcrumbs = [
    { label: "Investiciono zlato", href: "/" },
    { label: "Zlatne poluge", href: "/kategorija/zlatne-poluge" },
    { label: `${weightDisplay} — ${product.brand}`, href: `/kategorija/zlatne-poluge/zlatna-poluga-${variant.weight_g === 31.1 ? "1-unca" : variant.weight_g >= 1000 ? "1kg" : `${variant.weight_g}g`}` },
    { label: product.name, href: `/proizvodi/${slug}` },
  ];

  const relatedVariants = allVariants.filter(
    (v) => v.slug !== slug && v.products?.category === product.category
  ).slice(0, 4);

  return (
    <main className="bg-white">

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={breadcrumbs} variant="light" />
        </SectionContainer>
      </section>

      {/* ── Hero / Product section ───────────────────────────────────────────── */}
      <section
        className="overflow-hidden py-8 sm:py-12"
        style={{
          background: "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)",
        }}
      >
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 xl:gap-16 items-center">

            {/* Left — image */}
            <div
              className="relative rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm"
              style={{
                boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
                minHeight: 340,
                maxHeight: 480,
                height: "clamp(340px, 36vw, 480px)",
              }}
            >
              <Image
                src={heroImg}
                alt={product.name}
                fill
                priority
                className="object-contain p-10 sm:p-14"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* LBMA badge */}
              <div
                className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm"
                style={{ border: "0.5px solid rgba(190,173,135,0.5)" }}
              >
                <span
                  className="text-[#BF8E41] font-semibold"
                  style={{ fontSize: 10.5, letterSpacing: "0.05em" }}
                >
                  LBMA GOOD DELIVERY
                </span>
              </div>
            </div>

            {/* Right — product info */}
            <div className="flex flex-col">

              {/* Brand eyebrow */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="relative w-6 h-6 rounded-full overflow-hidden bg-white"
                  style={{ border: "1px solid rgba(190,173,135,0.4)" }}
                >
                  <Image
                    src="/images/brands/argor-heraeus.png"
                    alt={product.brand}
                    fill
                    className="object-contain p-0.5"
                    sizes="24px"
                  />
                </div>
                <span
                  className="text-[#6B5E3F] font-semibold uppercase tracking-widest"
                  style={{ fontSize: 11 }}
                >
                  {product.brand} · {product.origin}
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-[#1B1B1C] leading-[1.08] mb-4"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontSize: "clamp(28px, 3.4vw, 50px)",
                  fontWeight: 400,
                }}
              >
                {product.name}
              </h1>

              {/* Short description */}
              <p
                className="text-[#6B6B6B] mb-5"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 15.5,
                  lineHeight: "1.65em",
                  maxWidth: 480,
                }}
              >
                Čistoća 999,9/1000 · 24 karata · LBMA Good Delivery · Fabrički zapečaćen blister
                sa serijskim brojem · Oslobođena PDV-a · Dostava za celu Srbiju.
              </p>

              {/* Availability */}
              <div className="flex items-center gap-2 mb-6">
                <CheckCircle2
                  size={15}
                  className={inStock ? "text-green-500" : "text-[#BEAD87]"}
                />
                <span
                  className="font-medium"
                  style={{
                    fontFamily: "var(--font-rethink), sans-serif",
                    fontSize: 13.5,
                    color: inStock ? "#16a34a" : "#6B6B6B",
                  }}
                >
                  {inStock
                    ? "Na stanju — dostupno odmah"
                    : isPreorder
                    ? `Dostupno za ${variant.lead_time_weeks ?? "?"} nedelje`
                    : "Dostupno na upit"}
                </span>
              </div>

              {/* Prices */}
              <div
                className="rounded-2xl overflow-hidden mb-6"
                style={{ border: "1px solid rgba(190,173,135,0.35)", background: "rgba(255,255,255,0.65)" }}
              >
                {/* Prodajna — highlighted row */}
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: "1px solid rgba(190,173,135,0.3)", background: "rgba(255,255,255,0.8)" }}
                >
                  <div>
                    <p
                      className="text-[#BF8E41] font-semibold uppercase tracking-widest"
                      style={{ fontSize: 10.5 }}
                    >
                      Spot / Lager
                    </p>
                    <p
                      className="text-[#1B1B1C] font-semibold"
                      style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14 }}
                    >
                      Prodajna cena
                    </p>
                  </div>
                  <p
                    className="text-[#1B1B1C] font-bold tabular-nums"
                    style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: "clamp(20px, 2.2vw, 28px)" }}
                  >
                    {formatRsd(prices.stock)}
                  </p>
                </div>

                {/* Avansna */}
                <div
                  className="flex items-center justify-between px-5 py-3.5"
                  style={{ borderBottom: "1px solid rgba(190,173,135,0.2)" }}
                >
                  <p
                    className="text-[#6B6B6B]"
                    style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14 }}
                  >
                    Avansna prodajna cena
                  </p>
                  <p
                    className="text-[#1B1B1C] font-semibold tabular-nums"
                    style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 17 }}
                  >
                    {formatRsd(prices.advance)}
                  </p>
                </div>

                {/* Otkupna */}
                <div className="flex items-center justify-between px-5 py-3.5">
                  <p
                    className="text-[#8A8A8A]"
                    style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14 }}
                  >
                    Otkupna cena
                  </p>
                  <p
                    className="text-[#6B6B6B] tabular-nums"
                    style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 15 }}
                  >
                    {formatRsd(prices.purchase)}
                  </p>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+381612698569"
                  className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-full font-bold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "#BEAD87",
                    color: "#1B1B1C",
                    fontFamily: "var(--font-rethink), sans-serif",
                    fontSize: 14,
                    height: 52,
                    boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <Phone size={16} strokeWidth={2.2} />
                  Pozovite — 061/269-8569
                </a>
                <Link
                  href="/kontakt"
                  className="flex-1 inline-flex items-center justify-center rounded-full font-semibold transition-colors hover:bg-black/5"
                  style={{
                    border: "1.5px solid #1B1B1C",
                    color: "#1B1B1C",
                    fontFamily: "var(--font-rethink), sans-serif",
                    fontSize: 13.5,
                    height: 52,
                  }}
                >
                  Pošaljite upit
                </Link>
              </div>

              {/* Trust note */}
              <p
                className="text-[#9D9072] mt-4"
                style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 12, lineHeight: "1.6em" }}
              >
                Cene se osvežavaju svakih 60 sekundi prema aktuelnom berzanskom kursu.
                PDV nije uračunat — investiciono zlato je oslobođeno PDV-a.
              </p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ── Info tabs ───────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-[#F0EDE6]">
        <ProductTabs
          weightG={variant.weight_g}
          purity={variant.purity}
          brand={product.brand}
          origin={product.origin}
          sku={variant.sku}
        />
      </section>

      {/* ── Related products ────────────────────────────────────────────────── */}
      {relatedVariants.length > 0 && (
        <section className="bg-[#FAFAF8] py-16 sm:py-20 border-t border-[#F0EDE6]">
          <SectionContainer>
            <SectionHeading
              title="Povezani proizvodi"
              description="Investicione zlatne poluge LBMA rafinerija — različite gramže, ista garancija čistoće 999,9."
              eyebrow="Zlatne poluge"
            />
            <ProductGrid
              variants={relatedVariants as any}
              tiers={tiers}
              snapshot={snapshotRow}
              hideFilterSortBar
              gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              maxItems={4}
            />
            <div className="mt-10 flex justify-center">
              <Link
                href="/kategorija/zlatne-poluge"
                className="inline-flex items-center justify-center rounded-full transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#1B1B1C",
                  color: "#FFFFFF",
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontWeight: 600,
                  fontSize: 13,
                  height: 48,
                  padding: "0 32px",
                }}
              >
                Sve zlatne poluge
              </Link>
            </div>
          </SectionContainer>
        </section>
      )}

      {/* ── CTA section ─────────────────────────────────────────────────────── */}
      <WhatIsGoldSection />

    </main>
  );
}
