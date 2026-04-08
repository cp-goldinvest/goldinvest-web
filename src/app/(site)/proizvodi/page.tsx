import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Svi proizvodi - zlatne poluge, pločice i dukati | Gold Invest",
  description:
    "Pregledajte kompletan asortiman investicionog zlata: LBMA poluge, pločice i dukati. Transparentne cene, bez PDV-a.",
  alternates: { canonical: "https://goldinvest.rs/proizvodi" },
};

export default async function SviProizvodiPage() {
  let variants: any[] = [];
  let tiers: any[] = [];
  let snapshotRow: any = null;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("is_active", true)
        .order("sort_order"),
      supabase.from("pricing_tiers").select("*"),
      supabase.from("gold_price_snapshots").select("*").order("fetched_at", { ascending: false }).limit(1).single(),
    ]);
    variants = r1.data ?? [];
    tiers = r2.data ?? [];
    snapshotRow = r3.data ?? null;
  } catch {
    // DB nedostupna
  }

  return (
    <main className="bg-white">
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb
            variant="light"
            items={[
              { label: "Investiciono zlato", href: "/" },
              { label: "Svi proizvodi", href: "/proizvodi" },
            ]}
          />
        </SectionContainer>
      </section>

      <section className="bg-white py-10 sm:py-12">
        <SectionContainer>
          <h1
            className="text-[#1B1B1C] mb-3"
            style={{
              fontFamily: "var(--font-pp-editorial), Georgia, serif",
              fontSize: "clamp(26px, 3.2vw, 44px)",
              fontWeight: 400,
            }}
          >
            Svi proizvodi
          </h1>
          <p
            className="text-[#6B6B6B] max-w-[640px] mb-10"
            style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 15.5, lineHeight: 1.65 }}
          >
            Zlatne poluge, pločice, dukati i zlatnici - sortirano po brendu. Koristite filtere za užu selekciju.
          </p>

          <ProductGrid
            variants={variants as any}
            tiers={tiers}
            snapshot={snapshotRow}
            defaultSort="brand_asc"
            groupByBrand
          />

          <div className="mt-12 flex flex-wrap gap-4 justify-center sm:justify-start">
            <Link
              href="/kategorija/zlatne-plocice"
              className="text-sm font-medium text-[#6B5E3F] underline decoration-[#BF8E41]/40 underline-offset-4 hover:text-[#1B1B1C]"
            >
              Zlatne pločice
            </Link>
            <Link
              href="/kategorija/zlatne-poluge"
              className="text-sm font-medium text-[#6B5E3F] underline decoration-[#BF8E41]/40 underline-offset-4 hover:text-[#1B1B1C]"
            >
              Zlatne poluge
            </Link>
            <Link
              href="/kategorija/zlatni-dukati"
              className="text-sm font-medium text-[#6B5E3F] underline decoration-[#BF8E41]/40 underline-offset-4 hover:text-[#1B1B1C]"
            >
              Zlatni dukati
            </Link>
          </div>
        </SectionContainer>
      </section>
    </main>
  );
}
