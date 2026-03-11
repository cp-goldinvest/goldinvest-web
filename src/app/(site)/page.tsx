import { createServiceClient } from "@/lib/supabase/server";
import { CategoryCards } from "@/components/home/CategoryCards";
import { ProductGrid } from "@/components/catalog/ProductGrid";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createServiceClient();

  const [{ data: variants }, { data: tiers }, { data: snapshotRow }] =
    await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
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
      <HeroSection />

      {/* All products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-[#E9E6D9]">
            Naša ponuda
          </h2>
          <p className="mt-2 text-[#8A8A8A] text-sm">
            LBMA sertifikovane zlatne poluge, pločice i dukati — transparentne cene u realnom vremenu
          </p>
        </div>

        {variants && tiers && snapshotRow ? (
          <ProductGrid
            variants={variants as any}
            tiers={tiers}
            snapshot={snapshotRow}
          />
        ) : (
          <div className="py-20 text-center text-[#8A8A8A]">
            Cene trenutno nisu dostupne. Pokušajte ponovo.
          </div>
        )}
      </section>
    </main>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center overflow-hidden">

      {/* Background: dark + radial gold glow */}
      <div className="absolute inset-0 bg-[#1B1B1C]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 65% 40%, #BF8E41 0%, transparent 70%)",
        }}
      />
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1B1B1C] to-transparent" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#BF8E41]/30 bg-[#BF8E41]/8 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#BF8E41]" />
            <span className="text-xs font-medium text-[#BF8E41] tracking-widest uppercase">
              LBMA Sertifikovano
            </span>
          </div>

          {/* H1 */}
          <h1
            className="font-serif font-semibold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight mb-8"
            style={{
              background: "linear-gradient(135deg, #D4A84F 0%, #E8C97A 45%, #BF8E41 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Investiciono
            <br />
            zlato
          </h1>

          {/* Intro */}
          <p className="text-base sm:text-lg text-[#E9E6D9]/75 max-w-xl leading-relaxed mb-10">
            Najsigurniji i najstabilniji način za dugoročno očuvanje vašeg
            kapitala od inflacije. Vrhunske LBMA sertifikovane zlatne poluge,
            pločice i prepoznatljive dukate. Mogućnost trenutne kupovine,
            povoljnije avansne ponude, kao i otkup.{" "}
            <a
              href="tel:+381612698569"
              className="text-[#BF8E41] hover:text-[#D4A84F] transition-colors duration-200 font-medium"
            >
              Poruči na 061 269 8569
            </a>{" "}
            — brza dostava!
          </p>

          {/* Category cards */}
          <CategoryCards />
        </div>
      </div>
    </section>
  );
}
