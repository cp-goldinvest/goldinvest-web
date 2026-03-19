import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { PriceStructureSection } from "@/components/catalog/PriceStructureSection";
import { DeliverySection } from "@/components/catalog/DeliverySection";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCard } from "@/components/ui/InfoCard";
import { NumberedCard } from "@/components/ui/NumberedCard";

export const revalidate = 60;

// ── Types ──────────────────────────────────────────────────────────────────

type FaqItem = { q: string; a: string };

type SeoSections = {
  brands: {
    heading: string;
    description: string;
    cards: { title: string; body: string }[];
  };
  whyBuy: {
    heading: string;
    description: string;
    cards: { title: string; body: string }[];
  };
  priceStructure: {
    title: string;
    description: string;
    card1Body: string;
    card2Body: string;
    card3Body: string;
  };
  delivery: {
    heading: string;
    description: string;
    pickupCardBody: string;
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
};

type WeightConfig = {
  grams: number;
  label: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  /** Extended SEO content — only defined for slugs with a full SEO document */
  seo?: SeoSections;
};

// ── Weight config per slug ─────────────────────────────────────────────────

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
    metaTitle: "Zlatna pločica 10g | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite LBMA sertifikovanu zlatnu pločicu 10g čistoće 999,9 — Argor-Heraeus, C. Hafner, The Royal Mint. Idealna za redovnu štednju i poklon. Transparentne cene, brza dostava.",
    intro:
      "Zlatna pločica 10 grama je idealan izbor za redovnu mesečnu štednju, ali i kao izuzetno vredan i prestižan poklon. U našoj ponudi se nalaze isključivo pločice čistoće 999,9 svetskih lidera: Argor-Heraeus, C. Hafner i The Royal Mint. Poruči putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    seo: {
      brands: {
        heading: "Nasa ponuda — evropski brendovi (LBMA standard)",
        description:
          "Sve pločice su investiciono zlato koje ispunjava najstrože svetske LBMA ('Good Delivery') standarde, maksimalne finoće od 99.99% (24 karata) i dolaze fabrički zapečaćene u sigurnosno blister pakovanje — vaš zvanični sertifikat.",
        cards: [
          {
            title: "Argor-Heraeus 10g — Švajcarska",
            body: "Švajcarski Argor-Heraeus je jedna od najvećih rafinerija na svetu. Njihova pločica od 10g odlikuje se svedenim, klasičnim dizajnom sa jasno istaknutim logotipom, težinom, oznakom čistoće i jedinstvenim serijskim brojem. Izuzetno je tražena i priznata na svim kontinentima.",
          },
          {
            title: "C. Hafner 10g — Nemačka",
            body: "C. Hafner je prestižna nemačka rafinerija sa tradicijom od preko 170 godina. Njihove pločice su posebno cenjene jer dolaze isključivo od recikliranog zlata — besprekorna izrada (999,9) uz nulti negativan uticaj na životnu sredinu. Pakuju se u elegantne, tamne blister sertifikate.",
          },
          {
            title: "The Royal Mint Britannia 10g — Britanija",
            body: "Zvanična državna kovnica Velike Britanije nudi pločicu koja je pravo umetničko delo. Na njoj se nalazi prepoznatljivi motiv 'Britanije' — simbola britanske pomorske moći. Dolazi u sigurnosnom blisteru i često je prvi izbor kolekcionara.",
          },
        ],
      },
      whyBuy: {
        heading: "Zašto je zlatna pločica od 10g idealna investicija?",
        description:
          "Format od 10 grama se smatra 'kraljem pametne štednje'. Ukoliko tek ulazite u svet plemenitih metala, ovo je idealna gramaža — a evo i zašto:",
        cards: [
          {
            title: "Odlična cena po gramu",
            body: "Za razliku od najmanjih pločica (1g ili 2g) gde su troškovi proizvodnje u odnosu na količinu zlata viši, pločica od 10g nudi znatno nižu premiju (maržu) — što je čini matematički veoma isplativom investicijom.",
          },
          {
            title: "Maksimalna fleksibilnost i likvidnost",
            body: "Ako uložite novac u velike zlatne poluge, a zatreba vam samo manji iznos gotovine, moraćete da prodate celu polugu. Kupovinom više pločica od 10g zadržavate potpunu kontrolu — unovčite samo onoliko grama koliko vam je u tom trenutku potrebno.",
          },
          {
            title: "Vredan poklon za krštenje ili rođenje",
            body: "Koverta sa novcem se lako potroši i brzo zaboravi. Zlatna pločica od 10 grama je jedan od najupečatljivijih poklona koji ostaje zauvek, ali i čuva vrednost za onoga kome je poklonjena.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne pločice od 10g",
        description:
          "Gold Invest vam pruža apsolutnu transparentnost cena zlata — bez skrivenih troškova. Svaka pločica od 10g ima jasno istaknute sve tri cene:",
        card1Body:
          "Važi za pločice koje su fizički prisutne u našem trezoru. Uplatite i preuzmite svoje zlato istog dana.",
        card2Body:
          "Zelite da kupite 5, 10 ili više pločica od 10g? Uplatite celokupan iznos unapred i zaključajte trenutnu berzansku cenu. Mi robu direktno poručujemo iz kovnica (Švajcarska, Nemačka, Britanija), a vi dobijate najpovoljniju moguću cenu.",
        card3Body:
          "Garantovani iznos po kojem Gold Invest u svakom trenutku otkupljuje vaše pločice. Zbog ogromne popularnosti gramaže od 10g, naš spread (razlika između prodajne i otkupne cene) je minimalan.",
      },
      delivery: {
        heading: "Prodaja zlatnih pločica 10g Beograd — Gold Invest",
        description:
          "Kupovina zlatnih pločica od 10g je brza i bezbedna. Nudimo tri načina preuzimanja — uvek diskretno i osigurano.",
        pickupCardBody:
          "Cekamo vas u sigurnoj kancelariji u Beogradu. Bez čekanja, u potpuno diskretnom okruženju.",
      },
      faq: {
        title: "Česta pitanja o zlatnoj pločici od 10g",
        items: [
          {
            q: "Šta predstavlja oznaka 999,9?",
            a: "Oznaka 999,9 (poznata i kao 'četiri devetke') predstavlja maksimalan nivo čistoće investicionog zlata koji se može postići u rafinerijskoj obradi. To znači da je vaša zlatna pločica izrađena od 99,99% čistog zlata, što u potpunosti odgovara vrednosti od 24 karata. Kod investicionih pločica, ovo je ultimativni standard koji garantuje maksimalnu likvidnost i oslobađanje od poreza.",
          },
          {
            q: "Da li uz pločicu dobijam sertifikat?",
            a: "Da. Sama pločica je isporučena iz kovnice u čvrstom plastičnom pakovanju (blisteru) veličine platne bankovne kartice. Na tom pakovanju su jasno odštampani logo rafinerije, čistoća, težina i jedinstveni serijski broj koji je laserski upisan i na samu pločicu. To pakovanje predstavlja vaš neosporivi sertifikat. Zlatno pravilo: nikada ne otvarajte i ne secite pakovanje, jer time trajno narušavate vrednost svog zlata.",
          },
          {
            q: "Da li se na pločicu od 10g plaća PDV?",
            a: "Ne. Sve pločice od 10 grama u našoj ponudi ispunjavaju zakonski uslov čistoće iznad 995/1000 (naše su 999,9), što znači da se tretiraju kao investiciono zlato i u potpunosti su oslobođene plaćanja PDV-a i poreza na kapitalnu dobit u Republici Srbiji.",
          },
          {
            q: "Koji je limit za plaćanje u gotovini?",
            a: "Zakon o sprečavanju pranja novca dozvoljava gotovinska plaćanja do maksimalnog iznosa od 1.160.000 dinara (10.000 evra). S obzirom na trenutne cene na berzi, kupovinu jedne ili čak nekoliko pločica od 10 grama možete bez ikakvih problema obaviti i platiti u kešu. Sve kupovine preko zakonskog limita vrše se bezgotovinski, transferom preko računa.",
          },
          {
            q: "Mogu li da plaćam platnom karticom?",
            a: "Ne, plaćanje platnim karticama trenutno nije moguće. Razlog za to su visoke provizije banaka (često i do 2-3%) koje bi neizbežno morale da se ugrade u krajnju cenu zlata. Naš cilj je da vam obezbedimo najpovoljniju moguću cenu na tržištu bez skrivenih troškova, zbog čega prihvatamo isključivo plaćanje gotovinom, bankovnim transferom ili pouzećem.",
          },
          {
            q: "Koliko traje isporuka?",
            a: "Za klijente u Beogradu nudimo isporuku dan za dan — ukoliko je porudžbina evidentirana radnim danima do 12h, zlato stiže na vašu adresu istog dana do 18h. Za porudžbine iz ostalih gradova Srbije, diskretna i osigurana dostava traje od 1 do 3 radna dana (ovo ne važi za avansne kupovine, za koje se rok isporuke precizno definiše pri samoj kupovini).",
          },
        ],
      },
    },
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

  const heroImg =
    variants?.[0]?.images?.[0] ?? "/images/product-poluga.png";
  const heroTitle = config.label.replace("g", " grama");

  return (
    <main className="bg-white">
      {/* ── Breadcrumb + hero (homepage style) ─────────────────────────── */}
      <section className="bg-white py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <Breadcrumb items={breadcrumbs} variant="light" />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            {/* Left image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#F9F9F9]" style={{ height: 320 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* Image is handled by next/image via component below */}
              <Image
                src={heroImg}
                alt={config.label}
                fill
                className="object-contain p-8"
              />
            </div>

            {/* Right content */}
            <div className="text-left md:text-left">
              <h1
                className="text-[#1B1B1C] leading-[1.05]"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontSize: "clamp(28px, 3.8vw, 54px)",
                  fontWeight: 400,
                }}
              >
                {heroTitle}
              </h1>
              <p
                className="text-[#6B6B6B] mt-4"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 16,
                  lineHeight: "1.6em",
                  maxWidth: 520,
                }}
              >
                {config.intro}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                <a
                  href="/kontakt"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#1B1B1C] text-white font-semibold transition-opacity hover:opacity-90"
                  style={{ fontSize: 12.1, boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)" }}
                >
                  UPIT ZA CENU
                </a>
                <a
                  href="tel:+381612698569"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#BEAD87] text-[#1B1B1C] font-semibold transition-opacity hover:opacity-90"
                  style={{ fontSize: 12.1 }}
                >
                  POZOVITE +381 61/269 8569
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Offer section ─────────────────────────────────────────────── */}
      <section className="bg-white py-12 border-t border-[#F0EDE6]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <h2
            className="text-[#1B1B1C] mb-8"
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontWeight: 500,
              letterSpacing: "-0.5px",
              fontSize: 22,
            }}
          >
            PONUDA U OVOJ KATEGORIJI
          </h2>

          <ProductGrid
            variants={variants as any}
            tiers={tiers}
            snapshot={snapshotRow}
            hideFilterSortBar
            gridClassName="grid grid-cols-1 sm:grid-cols-3 gap-6"
            maxItems={9}
          />
        </div>
      </section>

      {/* ── SEO content sections (only for slugs with a full SEO document) ── */}
      {config.seo && (
        <>
          {/* H2: Brendovi — LBMA standard */}
          <section className="bg-white py-16 sm:py-20">
            <SectionContainer>
              <SectionHeading
                title={config.seo.brands.heading}
                description={config.seo.brands.description}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {config.seo.brands.cards.map((card, i) => (
                  <InfoCard key={i} title={card.title}>
                    {card.body}
                  </InfoCard>
                ))}
              </div>
            </SectionContainer>
          </section>

          {/* H2: Zašto je idealna investicija */}
          <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
            <SectionContainer>
              <SectionHeading
                title={config.seo.whyBuy.heading}
                description={config.seo.whyBuy.description}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {config.seo.whyBuy.cards.map((card, i) => (
                  <NumberedCard key={i} number={i + 1} title={card.title}>
                    {card.body}
                  </NumberedCard>
                ))}
              </div>
            </SectionContainer>
          </section>

          {/* H2: Cena */}
          <PriceStructureSection
            title={config.seo.priceStructure.title}
            description={config.seo.priceStructure.description}
            card1Body={config.seo.priceStructure.card1Body}
            card2Body={config.seo.priceStructure.card2Body}
            card3Body={config.seo.priceStructure.card3Body}
          />

          {/* H2: Prodaja / Dostava */}
          <DeliverySection
            heading={config.seo.delivery.heading}
            description={config.seo.delivery.description}
            pickupCardBody={config.seo.delivery.pickupCardBody}
          />

          {/* H2: Česta pitanja */}
          <CategoryFaq
            title={config.seo.faq.title}
            items={config.seo.faq.items}
            ctaHref="/kontakt"
            ctaLabel="Kontaktirajte nas"
          />

          <WhatIsGoldSection />
        </>
      )}
    </main>
  );
}
