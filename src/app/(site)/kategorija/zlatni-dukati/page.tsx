import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Zlatni dukati i kovanice | Gold Invest",
  description:
    "Kupite investicione zlatne dukate — Franc Jozef, Bečka Filharmonija, Maple Leaf, Britannia. LBMA sertifikovani, visoka likvidnost, transparentne cene.",
  alternates: { canonical: "https://goldinvest.rs/kategorija/zlatni-dukati" },
};

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Zlatni dukati", href: "/kategorija/zlatni-dukati" },
];

export default async function ZlatniDukatiPage() {
  const supabase = createServiceClient();

  const [{ data: variants }, { data: tiers }, { data: snapshotRow }] =
    await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .in("products.category", ["dukat", "novac"])
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

  return (
    <main className="min-h-screen bg-[#1B1B1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={BREADCRUMBS} />

        <div className="mt-6 mb-10">
          <h1 className="font-serif text-4xl lg:text-5xl font-semibold text-[#E9E6D9]">
            Zlatni dukati i kovanice
          </h1>
          <p className="mt-4 text-[#8A8A8A] text-base max-w-2xl leading-relaxed">
            Kovanice spajaju istorijsku prepoznatljivost i visoku likvidnost. Franc Jozef,
            Bečka Filharmonija, Maple Leaf, Britannia — sve su dostupne uz transparentne
            prodajne, avansne i otkupne cene.
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
                link.href === "/kategorija/zlatni-dukati"
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
