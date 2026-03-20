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
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildFaqSchema, buildProductSchema } from "@/lib/schema";

export const revalidate = 60;

// ── Types ──────────────────────────────────────────────────────────────────

type FaqItem = { q: string; a: string };

type FormatCard = {
  title: string;
  specs: string;
  body: string;
};

type HistoryCard = {
  heading: string;
  body: string | string[];
};

type SlugConfig = {
  metaTitle: string;
  metaDescription: string;
  breadcrumbLabel: string;
  heroTitle: string;
  intro: string;
  heroImage: string;
  /** Slugs to show in the product grid (matched against variant slugs) */
  variantSlugs: string[];
  /** Mock variant weights for fallback */
  mockWeights: number[];
  formatsHeading: string;
  formatsDescription: string;
  formats: [FormatCard, FormatCard];
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
  historySection: {
    heading: string;
    intro: string;
    cards: HistoryCard[];
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
};

// ── Slug configs ───────────────────────────────────────────────────────────

const SLUG_CONFIGS: Record<string, SlugConfig> = {
  "franc-jozef-dukat": {
    metaTitle: "Dukat Franc Jozef | Mali i Veliki Zlatni Dukat - Prodaja Beograd",
    metaDescription:
      "Kupite mali ili veliki zlatni dukat Franc Jozef — oslobodjen PDV-a, austrijska kovnica, garantovana autenticnost. Prodajna i otkupna cena. Brza dostava Beograd i Srbija.",
    breadcrumbLabel: "Franc Jozef dukat",
    heroTitle: "Franc Jozef dukat",
    intro:
      "Zlatni dukat Franc Jozef je najprepoznatljivija investiciona kovanica i najpopularniji tradicionalni poklon na nasim prostorima. Idealan za krstenja, rodenja i svadbe, ali i kao sigurno utociste za vas kapital. Gold Invest vam nudi male i velike dukate iz austrijske drzavne kovnice, uz garantovanu autenticnost, transparentne cene i oslobodjenje od PDV-a. Porucite putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    heroImage: "/images/gold-coins.png",
    variantSlugs: ["franc-jozef-1-dukat", "franc-jozef-4-dukati"],
    mockWeights: [3.49, 13.96],
    formatsHeading: "Mali i Veliki Franc Jozef — Koja je razlika?",
    formatsDescription:
      "Franc Jozef dukati se kuju u cuvenoj austrijskoj drzavnoj kovnici (Munze Osterreich) od zlata izuzetne cistote 986/1000 (23.6 karata). Minimalni dodatak bakra u leguri daje im karakteristicnu, prelepu crvenkasto-zlatnu nijansu i cini ih otpornijim na habanje od cistog 24-karatnog zlata.",
    formats: [
      {
        title: "Mali dukat Franc Jozef (Jednostruki)",
        specs: "3.49 g ukupno — 3.44 g cistog zlata — cistoca 986/1000 (23.6 karata)",
        body: "Najcesci poklon za krstenje i rodenje. Idealan je za darivanje povodom rodenja, krstenja i rodjendana, ali i za postepeno, mesecno gradjenje licnog zlatnog portfolija. Zahvaljujuci manjoj gramazi, nudi odlicnu fleksibilnost — lako ga je pokloniti, a jos lakse unovciti kada zatreba.",
      },
      {
        title: "Veliki dukat Franc Jozef (Cetvorostruki)",
        specs: "13.96 g ukupno — 13.77 g cistog zlata — cistoca 986/1000 (23.6 karata)",
        body: "Vizuelno impresivan i znacajno masivniji. Prepoznatljiv je po velikom precniku i cesto predstavlja glavni poklon na vencanjima ili pametan izbor za ozbiljnije investitore koji zele povoljniju cenu po gramu u odnosu na mali dukat.",
      },
    ],
    priceStructure: {
      title: "Franc Jozef dukat cena — Prodajna / Avansna / Otkupna",
      description:
        "Kao ozbiljna i transparentna kuca, Gold Invest vam uvek nudi tri oblika cena dukata Franc Jozef:",
      card1Body:
        "Cena za dukate koje trenutno imamo u nasem beogradskom trezoru. Placate i preuzimate svoj dukat odmah — bez cekanja i skrivenih troskova.",
      card2Body:
        "Planirate kupovinu vece kolicine dukata? Uplatite iznos unapred, 'zakljucajte' trenutnu, nizu berzansku cenu i sacekajte isporuku direktno iz austrijske kovnice uz znacajnu ustedu.",
      card3Body:
        "Iznos po kojima u svakom trenutku i bez cekanja otkupljujemo vase dukate. Zbog ogromne potraznje za Franc Jozefom, razlika izmedju prodajne i otkupne cene (spread) je kod nas uvek svedena na minimum.",
    },
    delivery: {
      heading: "Gde kupiti dukat Franc Jozef — Gold Invest Beograd",
      description:
        "Prodaja dukata Franc Jozef je moguca na nekoliko nacina — uvek diskretno i maksimalno osigurano.",
      pickupCardBody:
        "Posetite nas licno u Beogradu. Potpuno diskretno okruzenje, strucna provera autenticnosti i preuzimanje na licu mesta bez cekanja.",
    },
    historySection: {
      heading: "Dukat Franc Jozef — Istorija najpoznatije zlatne kovanice Balkana",
      intro:
        "Nijedan komad investicionog zlata ne nosi toliku istorijsku tezinu, tradiciju i poverenje na nasim prostorima kao dukat sa likom austrijskog cara Franca Jozefa. Ovi dukati se vec generacijama koriste kao najsigurniji nacin cuvanja porodicnog bogatstva.",
      cards: [
        {
          heading: "Ko je bio Franc Jozef?",
          body: "Franc Jozef I (Franz Joseph I) bio je car Austrije i kralj Ugarske, i jedan od najdugovecnijih monarha u evropskoj istoriji (vladao je punih 68 godina, od 1848. do 1916. godine). Njegova vladavina obeleziila je takozvano 'zlatno doba' Austrougarske monarhije — period ogromnog ekonomskog i industrijskog uspona, stabilnosti i kulturnog procvata. Zbog te neprikosnovene stabilnosti, njegov lik je u svesti naroda (posebno na Balkanu) postao apsolutni sinonim za bogatstvo, sigurnost i trajanje.",
        },
        {
          heading: "Zasto se dukati kuju bas po njemu?",
          body: "U vreme njegove vladavine, Austrougarska je bila ekonomska super sila, a austrijski dukat je bio glavna trgovacka valuta u ovom delu Evrope. Trgovci su ga obozavali jer je garantovao nepogresivu tacnost tezine i izuzetnu cistotu zlata od 98.6% (23.6 karata) — standard koji se u industriji i danas naziva 'dukat zlato' (Ducat gold). Cak i nakon pada Austrougarske imperije, apsolutno poverenje u ovu kovanicu ostalo je duboko ukorenjeno u kulturi.",
        },
        {
          heading: "Fenomen 1915. godine (zasto svaki dukat nosi ovaj datum?)",
          body: "Mnogi kupci se iznenade kada na svom potpuno novom dukatu vide uklesanu 1915. godinu, misleci da kupuju anticki novac. Istina je fascinantna: zbog izbijanja Prvog svetskog rata, redovno kovanje dukata je zvanicno prekinuto. Medutim, zbog nezapamcene globalne potraznje, austrijska kovnica je nastavila proizvodnju iskljucivo u investicione svrhe. Svaki novi dukat zauvek nosi godinu 1915. kao odavanje pocasti poslednjoj godini redovnog kovanja. Dakle — dukat koji danas kupite je ganc nov (takozvano novo kovanje ili 'restrike'), iskovan nedavno pomocu originalnih istorijskih kalupa.",
        },
        {
          heading: "Simbolika na kovanici — Lice i Nalicje",
          body: [
            "Lice (Avers): prikazuje raskosan profil cara sa lovorovim vencem na glavi (simbol vojnicke slave). Uz rub je ispisan tekst na latinskom: 'FRANC IOS I D G AUSTRIAE IMPERATOR'.",
            "Nalicje (Revers): krase ga velicastveni dvoglavi orao (grb Habzburske monarhije) koji u kandzama drzi mac i kraljevsku jabuku — simboli moci i pravde. Iznad njega je kruna, a duz ivice nalaze se titule i cuvena 1915. godina.",
          ],
        },
      ],
    },
    faq: {
      title: "Cesta pitanja o dukatu Franc Jozef",
      items: [
        {
          q: "Zasto na svakom dukatu pise godina 1915?",
          a: "Svi investicioni Franc Jozef dukati koji se danas legalno prodaju nose utisnatu godinu 1915. To ne znaci da je dukat star preko sto godina, vec da je u pitanju zvanicno, moderno 'novo kovanje' (restrike) austrijske drzavne kovnice. Godina 1915. se koristi kao istorijski simbol, jer je to bila poslednja godina redovnog kovanja pre pauze usled Prvog svetskog rata.",
        },
        {
          q: "Da li se na dukat Franc Jozef placa PDV?",
          a: "Ne. Prema zakonima Republike Srbije, zlatni dukati finoce preko 900/1000 iskovani posle 1800. godine tretiraju se kao investiciono zlato. S obzirom na to da Franc Jozef ima cistotu od 986/1000 (23.6 karata), u potpunosti je oslobodjen placanja PDV-a i poreza na kapitalnu dobit.",
        },
        {
          q: "Kako se pakuje Franc Jozef i da li ima sertifikat?",
          a: "Istorijski dukati ne dolaze u fabrickim blister pakovanjima sa papirnim sertifikatima kao moderne zlatne poluge. Sam dukat, sa svojim specificnim mikrometarskim dimenzijama, tacnom tezinom i jedinstvenim tonom prilikom kuckanja, predstavlja sertifikat autenticnosti. Vas dukat od nas dobijate bezbedno upakovan u okruglu zastiitnu kapsulu od tvrdog akrila (ili prigodnu poklon kutijicu), koja ga stiti od ostecenja.",
        },
        {
          q: "Kako ga cuvati?",
          a: "Zlatno pravilo: Nikada ne dodirujte povrsinuu dukata golim prstima i nikada ga ne briste niti polirajte krpama! Zlato je mekan metal i svako trenje ostavlja mikro-ogrebotine, dok kiseline sa prstiju mogu ostaviti trajne mrlje. Svako fizicko ostecenje, busenje (radi pravljenja ogrlice) ili grebanje trajno unistava njegov investicioni status. Uvek ga cuvajte u originalnoj zastiitnoj kapsuli.",
        },
        {
          q: "Da li otkupljujete dukate kupljene u inostranstvu ili drugim zlatarama?",
          a: "Da, Gold Invest vrsi brz i diskretan otkup svih malih i velikih dukata Franc Jozef, bez obzira gde su prvobitno kupljeni. Nasi strucnjaci na licu mesta (za par minuta) proveravaju autenticnost kovanice, nakon cega vam novac isplacujemo istog dana.",
        },
        {
          q: "Koji je limit za placanje u gotovini?",
          a: "U skladu sa Zakonom o sprecavanju pranja novca, kupovinu dukata mozete platiti u gotovini (kesu) do zakonskog limita od 1.160.000 dinara (10.000 evra u protivvrednosti). Sve transakcije iznad ovog iznosa realizuju se bezgotovinski, preko vaseg bankovnog racuna.",
        },
        {
          q: "Mogu li da placam platnom karticom?",
          a: "Ne, placanje platnim karticama trenutno nije moguce. Razlog za to su visoke provizije banaka (cesto i do 2-3%) koje bi neizbezno morale da se ugrade u krajnju cenu zlata. Nas cilj je da vam obezbedimo najpovoljniju mogucu cenu na trzistu bez skrivenih troskova, zbog cega prihvatamo iskljucivo placanje gotovinom, bankovnim transferom ili pouzecem.",
        },
        {
          q: "Koliko traje isporuka?",
          a: "Za klijente u Beogradu nudimo isporuku 'dan za dan' — ukoliko je porudzbina evidentirana radnim danima do 12h, zlato stize na vasu adresu istog dana do 18h. Za porudzbine iz ostalih gradova Srbije, diskretna i osigurana dostava traje od 1 do 3 radna dana (ovo ne vazi za avansne kupovine, za koje se rok isporuke precizno definise pri samoj kupovini).",
        },
      ],
    },
  },
};

// ── Static params ──────────────────────────────────────────────────────────
export function generateStaticParams() {
  return Object.keys(SLUG_CONFIGS).map((slug) => ({ slug }));
}

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = SLUG_CONFIGS[slug];
  if (!config) return {};
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: `https://goldinvest.rs/kategorija/zlatni-dukati/${slug}`,
    },
  };
}

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_SNAPSHOT = {
  id: "mock", xau_usd: 2700, xau_eur: 4375, usd_rsd: 108, eur_rsd: 117.5,
  price_per_g_rsd: 16500, source: "mock", fetched_at: new Date().toISOString(),
};
const MOCK_TIERS = [{
  id: "t1", name: "default", category: null, min_g: 0, max_g: 99999,
  margin_stock_pct: 4.5, margin_advance_pct: 3.5, margin_purchase_pct: 2, created_at: "",
}];
const ALL_MOCK_DUKATI = [
  { id: "d1", product_id: "d1", slug: "franc-jozef-1-dukat", weight_g: 3.49, weight_oz: 0.1123, purity: 0.9860, fine_weight_g: 3.44, sku: null, stock_qty: 10, availability: "in_stock", lead_time_weeks: null, images: ["/images/gold-coins.png"], sort_order: 1, is_active: true, products: { name: "Franc Jozef 1 dukat", brand: "Munze Osterreich", origin: "Austrija", category: "dukat" }, pricing_rules: null },
  { id: "d2", product_id: "d2", slug: "franc-jozef-4-dukati", weight_g: 13.96, weight_oz: 0.4492, purity: 0.9860, fine_weight_g: 13.76, sku: null, stock_qty: 5, availability: "in_stock", lead_time_weeks: null, images: ["/images/gold-coins.png"], sort_order: 2, is_active: true, products: { name: "Franc Jozef 4 dukati", brand: "Munze Osterreich", origin: "Austrija", category: "dukat" }, pricing_rules: null },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default async function DukatSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = SLUG_CONFIGS[slug];
  if (!config) notFound();

  let variants: any = ALL_MOCK_DUKATI.filter((v) =>
    config.mockWeights.includes(Number(v.weight_g))
  );
  let tiers: any = MOCK_TIERS;
  let snapshotRow: any = MOCK_SNAPSHOT;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .in("slug", config.variantSlugs)
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
    { label: "Zlatni dukati", href: "/kategorija/zlatni-dukati" },
    { label: config.breadcrumbLabel, href: `/kategorija/zlatni-dukati/${slug}` },
  ];

  return (
    <main className="bg-white">
      {/* Schema.org */}
      <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
      <SchemaScript
        schema={buildProductSchema({
          name: config.heroTitle,
          description: config.metaDescription,
          brand: "Munze Osterreich",
          slug: `/kategorija/zlatni-dukati/${slug}`,
          image: config.heroImage,
          purity: "986/1000",
        })}
      />
      <SchemaScript schema={buildFaqSchema(config.faq.items)} />

      {/* ── Breadcrumb + hero ──────────────────────────────────────────── */}
      <section className="bg-white py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <Breadcrumb items={breadcrumbs} variant="light" />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            {/* Left: product image */}
            <div
              className="relative rounded-2xl overflow-hidden bg-[#F9F9F9]"
              style={{ height: 320 }}
            >
              <Image
                src={config.heroImage}
                alt={config.heroTitle}
                fill
                className="object-contain p-8"
              />
            </div>

            {/* Right: title + intro + CTAs */}
            <div>
              <h1
                className="text-[#1B1B1C] leading-[1.05]"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontSize: "clamp(28px, 3.8vw, 54px)",
                  fontWeight: 400,
                }}
              >
                {config.heroTitle}
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
                  style={{
                    fontSize: 12.1,
                    boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
                  }}
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

      {/* ── Product grid ─────────────────────────────────────────────────── */}
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
            gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-6"
            maxItems={4}
          />
        </div>
      </section>

      {/* ── H2: Mali i Veliki FJ — format comparison ───────────────────── */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title={config.formatsHeading}
            description={config.formatsDescription}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.formats.map((fmt) => (
              <div
                key={fmt.title}
                className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-8"
              >
                <h3
                  className="text-[#1B1B1C] mb-2"
                  style={{
                    fontFamily: "var(--font-pp-editorial), Georgia, serif",
                    fontSize: "clamp(18px, 2vw, 24px)",
                    fontWeight: 400,
                  }}
                >
                  {fmt.title}
                </h3>
                <p
                  className="text-xs font-semibold tracking-widest uppercase text-[#BF8E41] mb-4"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  {fmt.specs}
                </p>
                <p
                  className="text-[#6B6B6B] leading-relaxed"
                  style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14.5 }}
                >
                  {fmt.body}
                </p>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ── H2: Cena ─────────────────────────────────────────────────────── */}
      <PriceStructureSection
        title={config.priceStructure.title}
        description={config.priceStructure.description}
        card1Body={config.priceStructure.card1Body}
        card2Body={config.priceStructure.card2Body}
        card3Body={config.priceStructure.card3Body}
      />

      {/* ── H2: Gde kupiti / Dostava ──────────────────────────────────────── */}
      <DeliverySection
        heading={config.delivery.heading}
        description={config.delivery.description}
        pickupCardBody={config.delivery.pickupCardBody}
      />

      {/* ── H2: Istorija Franc Jozefa ─────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title={config.historySection.heading}
            description={config.historySection.intro}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {config.historySection.cards.map((card) => (
              <InfoCard key={card.heading} title={card.heading}>
                {Array.isArray(card.body) ? (
                  <ul className="space-y-2">
                    {card.body.map((line, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#BEAD87] shrink-0" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  card.body
                )}
              </InfoCard>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <CategoryFaq
        title={config.faq.title}
        items={config.faq.items}
        ctaHref="/kontakt"
        ctaLabel="Kontaktirajte nas"
      />

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <WhatIsGoldSection />
    </main>
  );
}
