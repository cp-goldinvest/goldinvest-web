import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { PriceStructureSection } from "@/components/catalog/PriceStructureSection";
import { DeliverySection } from "@/components/catalog/DeliverySection";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";

export const revalidate = 60;
export const dynamicParams = true;

// ── Static params ──────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("products")
      .select("slug")
      .eq("category", "multipack")
      .eq("is_active", true);
    return ((data ?? []) as Array<{ slug: string }>).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

// ── Metadata ───────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const supabase = createServiceClient();
    const { data: rawData } = await supabase
      .from("products")
      .select("name, brand")
      .eq("slug", slug)
      .eq("category", "multipack")
      .single();

    const data = rawData as unknown as { name: string; brand: string } | null;
    if (!data) return {};
    return {
      title: `${data.name} - Multipack set | Gold Invest`,
      description: `Kupite ${data.name} multipack set - C. Hafner LBMA sertifikovano zlato čistoće 999,9. Bez PDV-a, brza dostava.`,
      alternates: { canonical: `https://goldinvest.rs/kategorija/multipack/${slug}` },
    };
  } catch {
    return {};
  }
}

// ── FAQ ─────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "Da li je multipack set isto što i investiciono zlato?",
    a: "Da, u potpunosti. Multipack setovi imaju istu čistoću 999,9 i isti LBMA sertifikat kao i individualne pločice ili poluge. Jedina razlika je format - više pločica spojenih u jednu celinu.",
  },
  {
    q: "Da li se na multipack set plaća PDV?",
    a: "Ne. Kao i sve forme investicionog zlata čistoće iznad 995/1000, multipack setovi su oslobođeni PDV-a i poreza na kapitalnu dobit u Republici Srbiji.",
  },
  {
    q: "Mogu li razdvojiti set na pojedinačne pločice?",
    a: "Da. C. Hafner CombiBar setovi su dizajnirani za lako razdvajanje - svaka pločica se može odlomiti bez alata. Imajte u vidu da odlomljene pločice gube originalni blister sertifikat kao celina.",
  },
  {
    q: "Da li mogu platiti platnom karticom?",
    a: "Ne, plaćanje platnim karticama trenutno nije moguće. Prihvatamo gotovinu, bankovni transfer i pouzećem.",
  },
  {
    q: "Koliko traje isporuka?",
    a: "Za klijente u Beogradu nudimo isporuku dan za dan - porudžbine evidentirane radnim danima do 12h stižu istog dana do 18h. Za ostatak Srbije, diskretna i osigurana dostava traje 1 do 3 radna dana.",
  },
];

// ── Page ───────────────────────────────────────────────────────────────────

export default async function MultipackSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let product: any = null;
  let variants: any = [];
  let tiers: any = [];
  let snapshotRow: any = null;

  try {
    const supabase = createServiceClient();
    const [r0, r1, r2, r3] = await Promise.all([
      supabase
        .from("products")
        .select("id, name, brand, origin")
        .eq("slug", slug)
        .eq("category", "multipack")
        .eq("is_active", true)
        .single() as unknown as Promise<{ data: { id: string; name: string; brand: string; origin: string } | null }>,
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("products.slug", slug)
        .eq("products.category", "multipack")
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

    product = r0.data;
    variants = r1.data ?? [];
    tiers = r2.data ?? [];
    snapshotRow = r3.data ?? null;
  } catch {
    // DB nedostupna
  }

  if (!product) return notFound();

  const breadcrumbs = [
    { label: "Investiciono zlato", href: "/" },
    { label: "Multipack setovi", href: "/kategorija/multipack" },
    { label: product.name, href: `/kategorija/multipack/${slug}` },
  ];

  return (
    <main className="bg-white">
      <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
      <SchemaScript schema={buildFaqSchema(FAQ_ITEMS)} />

      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={breadcrumbs} variant="light" />
        </SectionContainer>
      </section>

      {/* Hero */}
      <section
        className="pt-14 pb-12 border-b border-[#F0EDE6]"
        style={{
          background:
            "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)",
        }}
      >
        <SectionContainer>
          <div className="max-w-2xl">
            <p
              className="text-[11px] font-semibold tracking-widest uppercase text-[#9D9072] mb-4"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              Multipack set · C. Hafner · 999,9
            </p>
            <h1
              className="text-[#1B1B1C] leading-[1.1] mb-5"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 4vw, 48px)",
              }}
            >
              {product.name}
            </h1>
            <p
              className="text-[#4C4C4C]"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontSize: 16,
                lineHeight: "1.65em",
                maxWidth: 520,
              }}
            >
              Investicioni set zlatnih pločica čistoće 999,9 - LBMA sertifikovan, bez PDV-a.
              Jedan kompaktni format koji se deli na pojedinačne pločice po potrebi.
              Poruči na broj <strong>0614264129</strong> ili putem kontakt forme.
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* Product grid */}
      <section className="bg-[#FAFAF8] py-14 sm:py-20">
        <SectionContainer>
          <ProductGrid variants={variants} tiers={tiers} snapshot={snapshotRow} />
        </SectionContainer>
      </section>

      {/* Price structure */}
      <PriceStructureSection
        title={`${product.name} - cene`}
        description="Transparentne cene bez skrivenih troškova - sve tri cene uvek jasno istaknute."
        card1Body="Cena za setove koje imamo u trezoru. Uplatite i preuzmite istog dana."
        card2Body="Avansnom uplatom zaključavate trenutnu berzansku cenu - robu poručujemo direktno iz kovnice."
        card3Body="Garantovani iznos po kom Gold Invest otkupljuje vaše setove - uvek javno istaknut."
      />

      {/* Delivery */}
      <DeliverySection
        heading={`Kupovina ${product.name} - Gold Invest Beograd`}
        description="Kupovina je brza i potpuno bezbedna. Biramo opciju koja vama najviše odgovara."
        pickupCardBody="Posetite nas lično u Beogradu. Diskretno okruženje i preuzimanje na licu mesta - bez čekanja."
      />

      {/* FAQ */}
      <CategoryFaq title="Česta pitanja o multipack setovima" items={FAQ_ITEMS} />

      <WhatIsGoldSection />
    </main>
  );
}
