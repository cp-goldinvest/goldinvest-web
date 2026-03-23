import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from "@/lib/schema";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { DarkQuoteSection } from "@/components/catalog/DarkQuoteSection";
import { DeliverySection } from "@/components/catalog/DeliverySection";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { BrandCardsSection } from "@/components/catalog/BrandCardsSection";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCard } from "@/components/ui/InfoCard";

export const revalidate = 60;

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Poklon za rođenje deteta — zlatna pločica ili dukat | Gold Invest Beograd",
  description:
    "Poklonite investiciono zlato za rođenje deteta — zlatne pločice (1g–10g) i dukate oslobođene od PDV-a. Trajni poklon koji čuva vrednost dok dete odraste. Beograd, brza dostava.",
  alternates: { canonical: "https://goldinvest.rs/poklon-za-rodjenje-deteta" },
  openGraph: {
    title: "Poklon za rođenje deteta — investiciono zlato | Gold Invest",
    description:
      "Zlatna pločica ili dukat za novorođenče — jedini poklon čija vrednost raste zajedno s detetom. Bez PDV-a, sa sertifikatom, dostupno u Beogradu.",
    url: "https://goldinvest.rs/poklon-za-rodjenje-deteta",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "Šta je prikladna vrednost poklona za novorođenče?",
    a: "Za goste i kolege, zlatna pločica od 1g ili 2g predstavlja elegantniju i trajniju alternativu klasičnoj koverti — po sličnoj ceni. Za blisku rodbinu (tetke, ujaci, stričevi) pločica od 5g ili mali dukat je uobičajen izbor. Bake, deke i kumovi se najčešće odlučuju za pločice od 10g ili veliki dukat Franc Jozef kao temelj prve štednje. Aktuelne cene uvek su istaknute pored svakog proizvoda na sajtu.",
  },
  {
    q: "Da li zlatna pločica dolazi u poklon pakovanju?",
    a: "Da. Sve zlatne pločice (1g, 2g, 5g, 10g) dolaze fabrički zapečaćene u sigurnosnom blister pakovanju formata kreditne kartice — koje je istovremeno i LBMA sertifikat. Blister pakovanje ima visokokvalitetan vizuelni utisak i ne zahteva dodatno pakovanje. Pored toga, Gold Invest nudi mogućnost ekskluzivnih poklon kutijica za posebno uređen dar.",
  },
  {
    q: "Kada treba dati poklon — odmah po porođaju ili na imendanu?",
    a: "Investiciono zlato je pogodan poklon u oba slučaja, ali ga mnogi gosti biraju za imendan ili krstnu slavu jer se tada organizuje formalno slavlje. Nema pogrešnog trenutka — zlato ne može da 'zastari' ni da 'istekne'. Neki roditelji sakupljaju zlatne pločice od različitih gostiju i čuvaju ih kao male investicione celine.",
  },
  {
    q: "Šta roditelji mogu da urade sa zlatom dok dete ne odraste?",
    a: "Zlato nudi potpunu fleksibilnost. Roditelji ga mogu čuvati u sefu na ime deteta i dopunjavati iz godine u godinu. Kada dete odraste, može ga prodati po aktuelnoj tržišnoj ceni — za pokriće troškova fakulteta, prvu stanarinu ili početni kapital. Gold Invest garantovano otkupljuje sve LBMA-sertifikovane proizvode u originalnom pakovanju bez vremenskog ograničenja.",
  },
  {
    q: "Da li smem bušiti dukat ili skidati pločicu iz pakovanja?",
    a: "Ne. Bilo kakvo fizičko oštećenje — bušenje, sečenje, lemljenje alkice na dukat, ili otvaranje blister pakovanja pločice — trajno ukida investicioni status proizvoda. Oštećen dukat ili otvorena pločica prodaje se isključivo kao 'lomljeno zlato' po znatno nižoj ceni. Investiciono zlato mora ostati u originalnom, neoštećenom stanju kako bi zadržalo punu preprodajnu vrednost.",
  },
  {
    q: "Da li se na investiciono zlato plaća PDV?",
    a: "Ne. Investiciono zlato — zlatne pločice finoće 999,9 i dukati — potpuno je oslobođeno PDV-a u Srbiji prema Zakonu o PDV-u, čl. 25. Za razliku od zlatnog nakita iz zlatara na koji se plaća 20% PDV i marža za rad, svaki dinar koji platite za investiciono zlato direktno prelazi u vrednost čistog metala.",
  },
  {
    q: "Mogu li kupiti poklon za novorođenče onlajn i dobiti dostavu u Beogradu?",
    a: "Da. Poklon možete poručiti telefonom (061/269-8569) ili putem upita na sajtu. Diskretna dostava kurirskom službom dostupna je na čitavoj teritoriji Srbije u roku od 1–2 radna dana. Lično preuzimanje u našoj poslovnici u Beogradu moguće je odmah po potvrdi narudžbine — bez prethodnog zakazivanja.",
  },
];

// ─── Mock fallback data ────────────────────────────────────────────────────────

const MOCK_SNAPSHOT = {
  id: "mock",
  xau_usd: 2700,
  xau_eur: 4375,
  usd_rsd: 108,
  eur_rsd: 117.5,
  price_per_g_rsd: 16500,
  source: "mock",
  fetched_at: new Date().toISOString(),
};

const MOCK_TIERS = [
  {
    id: "t1",
    name: "default",
    category: null,
    min_g: 0,
    max_g: 99999,
    margin_stock_pct: 4.5,
    margin_advance_pct: 3.5,
    margin_purchase_pct: 2,
    created_at: "",
  },
];

const MOCK_VARIANTS = [
  {
    id: "p1g",
    product_id: "p1",
    slug: "zlatna-plocica-1g",
    weight_g: 1,
    weight_oz: 0.032,
    purity: 0.9999,
    fine_weight_g: 1,
    sku: null,
    stock_qty: 20,
    availability: "in_stock",
    lead_time_weeks: null,
    images: ["/images/product-poluga.png"],
    sort_order: 1,
    is_active: true,
    products: { name: "Zlatna pločica 1g", brand: "C. Hafner", origin: "Nemačka", category: "plocica" },
    pricing_rules: null,
  },
  {
    id: "p2g",
    product_id: "p2",
    slug: "zlatna-plocica-2g",
    weight_g: 2,
    weight_oz: 0.064,
    purity: 0.9999,
    fine_weight_g: 2,
    sku: null,
    stock_qty: 15,
    availability: "in_stock",
    lead_time_weeks: null,
    images: ["/images/product-poluga.png"],
    sort_order: 2,
    is_active: true,
    products: { name: "Zlatna pločica 2g", brand: "Argor-Heraeus", origin: "Švajcarska", category: "plocica" },
    pricing_rules: null,
  },
  {
    id: "p5g",
    product_id: "p3",
    slug: "zlatna-plocica-5g",
    weight_g: 5,
    weight_oz: 0.161,
    purity: 0.9999,
    fine_weight_g: 5,
    sku: null,
    stock_qty: 10,
    availability: "in_stock",
    lead_time_weeks: null,
    images: ["/images/product-poluga.png"],
    sort_order: 3,
    is_active: true,
    products: { name: "Zlatna pločica 5g", brand: "Argor-Heraeus", origin: "Švajcarska", category: "plocica" },
    pricing_rules: null,
  },
  {
    id: "p10g",
    product_id: "p4",
    slug: "zlatna-plocica-10g",
    weight_g: 10,
    weight_oz: 0.321,
    purity: 0.9999,
    fine_weight_g: 10,
    sku: null,
    stock_qty: 6,
    availability: "in_stock",
    lead_time_weeks: null,
    images: ["/images/product-poluga.png"],
    sort_order: 4,
    is_active: true,
    products: { name: "Zlatna pločica 10g", brand: "C. Hafner", origin: "Nemačka", category: "plocica" },
    pricing_rules: null,
  },
  {
    id: "fj-mali",
    product_id: "d1",
    slug: "mali-dukat-franc-jozef",
    weight_g: 3.49,
    weight_oz: 0.112,
    purity: 0.986,
    fine_weight_g: 3.44,
    sku: null,
    stock_qty: 10,
    availability: "in_stock",
    lead_time_weeks: null,
    images: ["/images/product-poluga.png"],
    sort_order: 5,
    is_active: true,
    products: { name: "Mali dukat Franc Jozef", brand: "Austrijska kovnica", origin: "Austrija", category: "dukat" },
    pricing_rules: null,
  },
  {
    id: "fj-veliki",
    product_id: "d2",
    slug: "veliki-dukat-franc-jozef",
    weight_g: 13.96,
    weight_oz: 0.449,
    purity: 0.986,
    fine_weight_g: 13.76,
    sku: null,
    stock_qty: 5,
    availability: "in_stock",
    lead_time_weeks: null,
    images: ["/images/product-poluga.png"],
    sort_order: 6,
    is_active: true,
    products: { name: "Veliki dukat Franc Jozef", brand: "Austrijska kovnica", origin: "Austrija", category: "dukat" },
    pricing_rules: null,
  },
  {
    id: "filh-110",
    product_id: "d3",
    slug: "filharmonija-1-10-oz",
    weight_g: 3.11,
    weight_oz: 0.1,
    purity: 0.9999,
    fine_weight_g: 3.11,
    sku: null,
    stock_qty: 7,
    availability: "in_stock",
    lead_time_weeks: null,
    images: ["/images/product-poluga.png"],
    sort_order: 7,
    is_active: true,
    products: { name: "Bečka Filharmonija 1/10 oz", brand: "Austrijska kovnica", origin: "Austrija", category: "dukat" },
    pricing_rules: null,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PoklonaZaRodjenjePage() {
  let variants: any = MOCK_VARIANTS;
  let tiers: any = MOCK_TIERS;
  let snapshotRow: any = MOCK_SNAPSHOT;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .in("products.category", ["dukat", "plocica"])
        .eq("is_active", true)
        .in("slug", [
          "zlatna-plocica-1g",
          "zlatna-plocica-2g",
          "zlatna-plocica-5g",
          "zlatna-plocica-10g",
          "mali-dukat-franc-jozef",
          "veliki-dukat-franc-jozef",
          "filharmonija-1-10-oz",
        ])
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
    // Supabase nedostupan — koristimo mock podatke
  }

  const breadcrumbs = [
    { label: "Investiciono zlato", href: "/" },
    { label: "Poklon za rođenje deteta", href: "/poklon-za-rodjenje-deteta" },
  ];

  return (
    <main className="bg-white">
      <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
      <SchemaScript schema={buildFaqSchema(FAQ_ITEMS)} />
      <SchemaScript
        schema={buildWebPageSchema({
          name: "Poklon za rođenje deteta — zlatna pločica ili dukat | Gold Invest Beograd",
          description:
            "Investiciono zlato kao poklon za novorođenče — zlatne pločice i dukati oslobođeni od PDV-a, sa sertifikatom, brza dostava Beograd.",
          slug: "/poklon-za-rodjenje-deteta",
        })}
      />

      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={breadcrumbs} variant="light" />
        </SectionContainer>
      </section>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <CategoryHero
        title="Poklon za rođenje deteta"
        introFull="Rođenje je jedinstven trenutak — i zaslužuje poklon koji će trajati koliko i sećanje na njega. Umesto novca koji inflacija polako troši ili igračaka koje se prerastu za godinu dana, poklonite investiciono zlato: jedini poklon čija vrednost raste zajedno s detetom. Zlatne pločice od 1g do 10g i tradicionalni dukati — bez PDV-a, sa međunarodnim sertifikatom, uz dostavu u Beogradu i čitavoj Srbiji."
        pills={[
          { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
          { label: "Zlatni dukati", href: "/kategorija/zlatni-dukati" },
          { label: "Kako kupiti", href: "/kako-kupiti" },
        ]}
        introMaxWidth="none"
        centerOnDesktop
      />

      {/* ── Proizvodi ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-12">
        <SectionContainer>
          <p
            className="text-xs font-semibold tracking-widest uppercase text-[#BF8E41] mb-3"
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          >
            Preporučena ponuda za poklon
          </p>
          <p
            className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-6"
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          >
            Zlatne pločice{" "}
            <Link href="/kategorija/zlatne-plocice" className="text-[#BF8E41] hover:underline font-medium">
              Argor-Heraeus i C. Hafner
            </Link>{" "}
            (1g–10g, finoća 999,9) i{" "}
            <Link href="/kategorija/zlatni-dukati" className="text-[#BF8E41] hover:underline font-medium">
              zlatni dukati
            </Link>{" "}
            — svi formati pogodni za darivanje novorođenčeta.
          </p>
          <ProductGrid
            variants={variants}
            tiers={tiers}
            snapshot={snapshotRow}
            filterConfig={{
              showCategoryFilter: false,
              showPriceFilter: false,
              showBrandFilter: false,
              showOriginFilter: false,
              filterLabelText: "Filtriraj",
              sortLabelText: "Sortiraj",
              weightOptions: [
                { label: "Pločica 1g", value: 1 },
                { label: "Pločica 2g", value: 2 },
                { label: "Pločica 5g", value: 5 },
                { label: "Pločica 10g", value: 10 },
                { label: "Mali dukat FJ (3.49g)", value: 3.49 },
                { label: "Bečka Filharmonija 1/10 oz (3.11g)", value: 3.11 },
                { label: "Veliki dukat FJ (13.96g)", value: 13.96 },
              ],
            }}
          />
        </SectionContainer>
      </section>

      {/* ── H2: Zašto zlato ───────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title="Zašto je investiciono zlato najbolji poklon za novorođenče?"
            description="Na bebi šopingu i u porodičnom okruženju uvek se pojavljuju ista pitanja: šta je smisleno pokloniti, šta neće biti zaboravljeno u fioci i šta će stvarno nešto vrediti. Evo zbog čega sve više porodica u Srbiji bira investiciono zlato."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Pobeđuje inflaciju — novac u koverti gubi vrednost">
              Novčanica od 50 evra za 18–20 godina neće vrediti ni blizu onoliko koliko vredi danas. Zlato je kroz istoriju čuvalo kupovnu moć — u poslednjih 20 godina cena zlata u dinarima porasla je za više od 600%. Poklon koji čuvate za dete danas vrediće više kada mu bude najpotrebniji.
            </InfoCard>
            <InfoCard title="Bez PDV-a — plaćate samo vrednost čistog zlata">
              Dečiji nakit iz zlatare podrazumeva 20% PDV i visoku maržu za rad. Investicione zlatne pločice i dukati su potpuno oslobođeni od PDV-a po zakonu — svaki dinar koji uplatite direktno prelazi u vrednost zlata koje poklanjate. Nema skrivenih troškova.
            </InfoCard>
            <InfoCard title="Likvidna imovina — prodaje se bilo kada, bilo gde">
              Zlatna pločica od LBMA akreditovane livarnice prihvata se na svim tržištima plemenitih metala u svetu. Kada dete odraste, može je prodati u roku od nekoliko minuta — u Gold Investu, u menjačnici ili u bilo kojoj stranoj zemlji. Potpuna sloboda bez birokratije.
            </InfoCard>
          </div>
        </SectionContainer>
      </section>

      {/* ── H2: Koje opcije postoje ───────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title="Zlatne pločice ili dukati — šta izabrati za poklon?"
            description="Zavisi od prilike, budžeta i ličnog ukusa. Oba formata su pogodna za darivanje novorođenčeta, ali se razlikuju po poreklu, izgledu i simbolici."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <InfoCard title="Zlatne pločice (1g–10g) — moderni poklon 24-karatnog zlata">
              <Link href="/kategorija/zlatne-plocice" className="text-[#BF8E41] hover:underline font-medium">Zlatne pločice</Link>{" "}
              finoće 999,9 (24 karata) od livarnica Argor-Heraeus i C. Hafner dolaze fabrički zapečaćene u sigurnosnom blister pakovanju — formata kreditne kartice, sa ugrađenim LBMA sertifikatom. Vizuelno impresivno, nepogrešivo autentično i idealno za darivanje. Pločica od 1g ili 2g savršena je za goste, a 5g ili 10g za blisku porodicu.
              <Link
                href="/kategorija/zlatne-plocice"
                className="inline-block mt-4 text-xs font-semibold tracking-widest uppercase text-[#BF8E41] hover:opacity-80 transition-opacity"
              >
                Pogledajte pločice →
              </Link>
            </InfoCard>

            <InfoCard title="Zlatni dukati — tradicionalni simbol srećnog početka">
              <Link href="/kategorija/zlatni-dukati" className="text-[#BF8E41] hover:underline font-medium">Dukat</Link>{" "}
              je na Balkanu sinonim za poklon pri važnim životnim događajima. Mali dukat Franc Jozef (3,49g, 986/1000) i Bečka Filharmonija (3,11g, 999,9) dolaze u elegantnim okruglim kapsulama i nose snažnu simboliku. Veliki dukat Franc Jozef (13,96g) je impozantan poklon koji roditelji čuvaju kao mali zlatni saldo za dete.
              <Link
                href="/kategorija/zlatni-dukati"
                className="inline-block mt-4 text-xs font-semibold tracking-widest uppercase text-[#BF8E41] hover:opacity-80 transition-opacity"
              >
                Pogledajte dukate →
              </Link>
            </InfoCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Poklon za novorođenčad — po budžetu gosta">
              <ul className="space-y-2 text-[14.5px]">
                <li><span className="font-semibold text-[#1B1B1C]">Gosti i kolege</span> — zlatna pločica 1g ili 2g (elegantna alternativa koverti sa novcem)</li>
                <li><span className="font-semibold text-[#1B1B1C]">Rodbina (tetke, ujaci)</span> — pločica 5g ili mali dukat Franc Jozef</li>
                <li><span className="font-semibold text-[#1B1B1C]">Bake, deke, kumovi</span> — pločica 10g ili veliki dukat (prvi ozbiljni kapital)</li>
                <li><span className="font-semibold text-[#1B1B1C]">Roditelji jedni drugima</span> — pločica 10g kao zajednička investicija u budućnost deteta</li>
              </ul>
            </InfoCard>

            <InfoCard title="Šta je bolje — pločica ili dukat?">
              <p className="text-[14.5px] mb-3">
                <strong>Zlatne pločice</strong> imaju nešto nižu premiju jer su standardizovan LBMA proizvod —
                preprodajno povoljnije za veće vrednosti. Finoća 999,9 znači čistije zlato.
              </p>
              <p className="text-[14.5px]">
                <strong>Dukati</strong> nose tradiciju i emotivnu vrednost koja je u srpskoj kulturi dobro prepoznata.
                Mali dukat je cenovno sličan pločici od 2g, ali vizuelno upečatljiviji kao dar.
                Oba su izvrsni pokloni — izbor je stvar ukusa.
              </p>
            </InfoCard>
          </div>
        </SectionContainer>
      </section>

      {/* ── Dark quote ────────────────────────────────────────────────────────── */}
      <DarkQuoteSection
        eyebrow="Poklon koji traje koliko i ljubav"
        normalText="Zlato ne bledi, ne zastareva i ne izlazi iz mode —"
        italicText="raste zajedno s detetom i čeka ga kada mu bude najpotrebnije."
        ctaHref="/kontakt"
        ctaLabel="Pošaljite upit za poklon"
      />

      {/* ── H2: Ko i šta poklanja ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <SectionContainer>
          <SectionHeading
            title="Poklon za novorođenče — od bake, dede, kumova i prijatelja"
            description="Svaki gost ima drugačiji budžet i drugačiji odnos sa porodicom. Evo šta Gold Invest preporučuje za svaku ulogu na slavlju."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Za bake i deke — temelj prve štednje">
              Bake i deke najčešće žele da osiguraju budućnost deteta nečim konkretnim.{" "}
              <Link href="/kategorija/zlatne-plocice" className="text-[#BF8E41] hover:underline">
                Zlatna pločica od 10g
              </Link>{" "}
              ili{" "}
              <Link href="/kategorija/zlatni-dukati" className="text-[#BF8E41] hover:underline">
                veliki dukat Franc Jozef
              </Link>{" "}
              su prirodan izbor — impozantan poklon koji roditelji čuvaju za dete dok ne odraste za fakultet, prvu stanarinu ili prve korake u samostalan život.
            </InfoCard>
            <InfoCard title="Za kumove — simboličan i vredan dar">
              Kum ili kuma kao duhovni roditelj donosi poklon sa posebnom simbolikom.{" "}
              <Link href="/kategorija/zlatne-plocice" className="text-[#BF8E41] hover:underline">
                Zlatna pločica od 5g
              </Link>{" "}
              ili{" "}
              <Link href="/kategorija/zlatni-dukati" className="text-[#BF8E41] hover:underline">
                mali dukat
              </Link>{" "}
              su idealan format — dovoljna vrednost da bude zapamćen, dovoljno elegantno da bude dostojno prilike. Pakujemo i u luksuzne poklon kutijice.
            </InfoCard>
            <InfoCard title="Za goste i kolege — elegantnija alternativa koverti">
              Koverta sa 50 ili 100 evra je nevidljiva čim prođe prvih mesec dana pelena. Zlatna{" "}
              <Link href="/kategorija/zlatne-plocice" className="text-[#BF8E41] hover:underline">
                pločica od 1g ili 2g
              </Link>{" "}
              košta slično, ali ostaje sačuvana decenijama. Roditelji će se sećati ko je doneo zlato — a ne ko je dao novac u koverti.
            </InfoCard>
          </div>
        </SectionContainer>
      </section>

      {/* ── H2: Lokalni SEO — Beograd ─────────────────────────────────────────── */}
      <section className="bg-[#F9F9F7] py-16 sm:py-18 border-t border-[#F0EDE6]">
        <SectionContainer>
          <div className="max-w-[760px]">
            <span
              className="text-[#BF8E41] text-[11px] font-semibold tracking-widest uppercase mb-4 block"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              Beograd i čitava Srbija
            </span>
            <h2
              className="text-[#1B1B1C] mb-5"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "clamp(22px, 2.5vw, 32px)",
                lineHeight: "1.2",
              }}
            >
              Kupovina zlatnog poklona za novorođenče u Beogradu
            </h2>
            <div
              className="text-[#4C4C4C] space-y-4"
              style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 15, lineHeight: "1.7" }}
            >
              <p>
                Gold Invest je specijalizovana prodavnica investicionog zlata u Beogradu sa fizičkom poslovnicom
                dostupnom bez prethodnog zakazivanja. Svaki kupac dobija stručnu pomoć pri odabiru najprikladnijeg
                formata za poklon — u zavisnosti od budžeta, prilike i ličnih preferencija.
              </p>
              <p>
                Pored lične kupovine u Beogradu, dostava je dostupna na čitavoj teritoriji Srbije kurirskom službom —
                diskretno, osigurano i u roku od 1–2 radna dana. Za hitne porudžbine (npr. kad saznate da je beba
                stigla), pozovite nas direktno na{" "}
                <a href="tel:+381612698569" className="text-[#BF8E41] font-semibold hover:underline">
                  061/269-8569
                </a>{" "}
                — organizujemo isporuku isti dan.
              </p>
              <p>
                Sve pločice i dukati iz naše ponude potiču isključivo od LBMA akreditovanih livarnica —
                Argor-Heraeus (Švajcarska), C. Hafner (Nemačka) i Austrijske kovnice. Svaki proizvod
                dolazi sa originalnim sertifikatom i garantovanim otkupom.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-7">
              <a
                href="tel:+381612698569"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-[#1B1B1C] font-semibold text-[13px] hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: "#BEAD87",
                  fontFamily: "var(--font-rethink), sans-serif",
                  boxShadow: "0px 4px 14px rgba(190,173,135,0.35)",
                }}
              >
                Pozovite: 061/269-8569
              </a>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#D8CEB8] text-[#1B1B1C] font-semibold text-[13px] hover:border-[#BF8E41] hover:text-[#BF8E41] transition-all"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                Pošaljite upit
              </Link>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ── Brands ────────────────────────────────────────────────────────────── */}
      <BrandCardsSection
        title="Brendovi koje poklanjate — evropski premium standard"
        description="Zlatne pločice i dukati iz naše ponude potiču od svetski priznatih livarnica i kovnica — međunarodni sertifikat kvaliteta i garantovana preprodajna vrednost."
        brands={[
          {
            img: "/images/brands/argor-heraeus.png",
            title: "Argor-Heraeus",
            origin: "Švajcarska",
            text: "Jedna od vodećih svetskih rafinerija plemenitih metala sa sedištem u Mendriziju. Svaka pločica Argor-Heraeus nosi LBMA sertifikat i garantovanu čistoću 999,9 — standard koji se prihvata na svim tržištima.",
          },
          {
            img: "/images/brands/c-hafner.png",
            title: "C. Hafner",
            origin: "Nemačka",
            text: "Nemačka rafinerija sa tradicijom od preko 170 godina i strogim etičkim standardima. C. Hafner koristi isključivo reciklirano zlato verifikovanog porekla — poklon koji je dobar i za planetu.",
            imageScale: 0.9,
          },
          {
            img: "/images/brands/logo-royal-mint.png",
            title: "Austrijska kovnica",
            origin: "Austrija",
            text: "Zvanična austrijska državna kovnica — izdaje i čuvenu Bečku filharmoniju i legendarni dukat Franc Jozef. Više od 800 godina tradicije kovanja — jedan od najprepoznatljivijih brendova na svetu.",
          },
        ]}
      />

      {/* ── Delivery ──────────────────────────────────────────────────────────── */}
      <DeliverySection
        heading="Dostava i preuzimanje — poklon za novorođenče u Beogradu i Srbiji"
        description="Kupovina zlatnog poklona kod Gold Investa je brza, diskretna i bezbedna. Lično preuzmite u Beogradu ili naručite dostavu na kućnu adresu."
        pickupCardBody="Posetite nas lično u poslovnici u Beogradu — bez zakazivanja, tokom radnog vremena. Stručni savetnik pomoći će vam pri odabiru najboljeg formata za poklon i pripremiti ga za predaju odmah na licu mesta."
      />

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <CategoryFaq
        title="Česta pitanja o poklonu za novorođenče"
        items={FAQ_ITEMS}
        ctaHref="/kontakt"
        ctaLabel="POŠALJITE UPIT"
      />

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <WhatIsGoldSection />
    </main>
  );
}
