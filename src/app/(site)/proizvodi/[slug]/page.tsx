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
import { ProductHeroImage } from "@/components/catalog/ProductHeroImage";

export const revalidate = 60;

// ── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("product_variants")
      .select("name, weight_g, images, products!inner(name)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    const row = (data ?? null) as any;
    const name = row?.name ?? row?.products?.name ?? "Investicioni zlatni proizvod";
    const weight = row ? formatWeight(row.weight_g) : "";
    const image = row?.images?.[0] ?? "/images/product-poluga.webp";
    return {
      title: `${name} ${weight} | Cena i Prodaja — Gold Invest Beograd`,
      description: `Kupite ${name} čistoće 999,9. LBMA Good Delivery sertifikat. Oslobođen PDV-a. Brza dostava za Beograd i celu Srbiju. Pozovite: 061/269-8569.`,
      alternates: { canonical: `https://goldinvest.rs/proizvodi/${slug}` },
      openGraph: {
        title: `${name} ${weight} | Gold Invest`,
        description: `${name} — LBMA Good Delivery, čistoća 999,9, bez PDV-a. Brza dostava.`,
        url: `https://goldinvest.rs/proizvodi/${slug}`,
        siteName: "Gold Invest",
        locale: "sr_RS",
        type: "website",
        images: [{ url: image, width: 800, height: 800 }],
      },
    };
  } catch {
    return { title: "Investicioni zlatni proizvod | Gold Invest" };
  }
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function ProizvodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let variant: any = null;
  let allVariants: any[] = [];
  let tiers: any = [];
  let snapshotRow: any = null;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3]: any = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*), length_mm, width_mm, thickness_mm")
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
      tiers = r2.data ?? [];
      snapshotRow = r3.data ?? null;

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
    // DB nedostupna
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

  const heroImages = variant.images?.length
    ? variant.images
    : ["/images/product-poluga.webp"];
  const inStock = variant.availability === "in_stock";
  const isPreorder = variant.availability === "preorder";
  const weightDisplay = formatWeight(variant.weight_g);

  const normalized = (s: string) => s.toLowerCase().replace(/\s+/g, "");
  const displayName = variant.name ?? product.name;
  const productNameWithWeight =
    normalized(displayName).includes(normalized(weightDisplay))
      ? displayName
      : `${displayName} ${weightDisplay}`;

  const categoryMeta: Record<string, { label: string; href: string }> = {
    poluga:  { label: "Zlatne poluge",  href: "/kategorija/zlatne-poluge" },
    plocica: { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
    dukat:   { label: "Zlatni dukati",  href: "/kategorija/zlatni-dukati" },
    novac:   { label: "Zlatni novac",   href: "/kategorija/zlatni-novac" },
  };
  const cat = categoryMeta[product.category] ?? categoryMeta.poluga;

  const categoryWeightLabelMap: Record<string, string> = {
    poluga: "Zlatna poluga",
    plocica: "Zlatna pločica",
    dukat: "Zlatni dukat",
    novac: "Zlatni novac",
  };
  const categoryWeightLabel = `${categoryWeightLabelMap[product.category] ?? "Proizvod"} ${weightDisplay}`;

  const categoryWeightHrefMap: Record<string, string | null> = {
    // Pločice imaju stabilne weight slugove
    plocica: `/kategorija/zlatne-plocice/zlatna-plocica-${
      variant.weight_g === 1
        ? "1g"
        : variant.weight_g === 2
        ? "2g"
        : variant.weight_g === 5
        ? "5g"
        : variant.weight_g === 10
        ? "10g"
        : variant.weight_g === 20
        ? "20g"
        : ""
    }`,
    // Poluge imaju stabilne weight slugove
    poluga: `/kategorija/zlatne-poluge/zlatna-poluga-${
      Math.abs(variant.weight_g - 31.1) < 0.05
        ? "1-unca"
        : variant.weight_g >= 1000
        ? "1kg"
        : `${variant.weight_g}g`
    }`,
    // Za dukate/novac nema pouzdanog weight slug šablona, ostajemo na listi kategorije
    dukat: null,
    novac: null,
  };
  const categoryWeightHrefRaw = categoryWeightHrefMap[product.category] ?? null;
  const categoryWeightHref = categoryWeightHrefRaw?.endsWith("-") ? cat.href : categoryWeightHrefRaw ?? cat.href;

  const breadcrumbs = [
    { label: "Investiciono zlato", href: "/" },
    { label: cat.label, href: cat.href },
    { label: categoryWeightLabel, href: categoryWeightHref },
    { label: productNameWithWeight, href: `/proizvodi/${slug}` },
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

            {/* Left — image(s): images[0] = prednja, images[1] = zadnja */}
            <ProductHeroImage images={heroImages} productName={product.name} />

            {/* Right — product info */}
            <div className="flex flex-col">

              {/* Brand eyebrow */}
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="relative w-6 h-6 rounded-full overflow-hidden bg-white"
                  style={{ border: "1px solid rgba(190,173,135,0.4)" }}
                >
                  <Image
                    src="/images/brands/argor-heraeus.webp"
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
                {productNameWithWeight}
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
                  className="flex-1 inline-flex items-center justify-center gap-2.5 rounded-full font-bold transition-opacity hover:opacity-90 min-h-[60px] sm:min-h-[52px]"
                  style={{
                    backgroundColor: "#BEAD87",
                    color: "#1B1B1C",
                    fontFamily: "var(--font-rethink), sans-serif",
                    fontSize: 14,
                    boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <Phone size={16} strokeWidth={2.2} />
                  Pozovite — 061/269-8569
                </a>
                <Link
                  href="/kontakt"
                  className="flex-1 inline-flex items-center justify-center rounded-full font-semibold transition-colors hover:bg-black/5 min-h-[60px] sm:min-h-[52px]"
                  style={{
                    border: "1.5px solid #1B1B1C",
                    color: "#1B1B1C",
                    fontFamily: "var(--font-rethink), sans-serif",
                    fontSize: 13.5,
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
          category={product.category}
          sku={variant.sku}
          variantName={variant.name ?? null}
          description={variant.description ?? null}
          lengthMm={variant.length_mm ?? null}
          widthMm={variant.width_mm ?? null}
          thicknessMm={variant.thickness_mm ?? null}
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
