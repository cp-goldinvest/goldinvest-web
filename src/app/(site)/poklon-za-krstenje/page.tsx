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

export const metadata: Metadata = {
  title: "Poklon za krštenje — zlatna pločica ili dukat | Gold Invest Beograd",
  description:
    "Poklonite investiciono zlato za krštenje — dukate i zlatne pločice oslobođene PDV-a. Trajni poklon koji čuva vrednost, za devojčice i dečake. Beograd, brza dostava.",
  alternates: { canonical: "https://goldinvest.rs/poklon-za-krstenje" },
  openGraph: {
    title: "Poklon za krštenje — investiciono zlato | Gold Invest",
    description:
      "Zlatna pločica ili dukat za krštenje — jedini poklon čija vrednost raste zajedno s detetom. Bez PDV-a, sa sertifikatom, dostupno u Beogradu.",
    url: "https://goldinvest.rs/poklon-za-krstenje",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Koliko novca je prikladno izdvojiti za krstenje?",
    a: "Cene zlatnih plocica od 1g krece se u rangu vrednosti prosecnog poklona u koverti, dok za kumove i najblizu rodbinu imamo formate od 5g ili dukate koji predstavljaju skuplji finansijski poklon. Aktuelne cene uvek mozete videti pored svakog proizvoda na nasem sajtu.",
  },
  {
    q: "Da li uz zlato dobijam sertifikat i kutijicu?",
    a: "Da. Sve zlatne plocice (1g, 2g, 5g) dolaze fabricki zapecacene u cvrsto blister pakovanje koje ujedno sluz kao LBMA sertifikat i garancija cistioce. Zlatni dukati se isporucuju u sigurnosnim zastinim kapsulama. Takode, Gold Invest nudi i mogucnost pakovanja u ekskluzivne, luksuzne poklon kutijice, kako bi vas dar bio u potpunosti spreman za predaju.",
  },
  {
    q: "Da li se na zlatne dukate i plocice placa porez (PDV)?",
    a: "Ne. Za razliku od decijeg nakita iz obicnih zlatara na koji se placa PDV od 20%, zlatni dukati i plocice iz nase ponude tretiraju se po zakonu kao investiciono zlato i u potpunosti su oslobodjeni placanja poreza. Celokupan iznos koji platite prelazi u cistu vrednost zlata koje poklanjate.",
  },
  {
    q: "Sta roditelji mogu kasnije da urade sa tim zlatom?",
    a: "Zlato nudi apsolutnu fleksibilnost. Roditelji ga mogu cuvati u sefu na ime deteta i sakupljati ga godinama (za fakultet, stan ili auto). Ukoliko im u medjuvremenu zatreba novac za detetove neodlozne potrebe, investiciono zlato je najlikvidnija imovina na svetu — u svakom trenutku ga mogu doneti u Gold Invest ili bilo koju menjacnicu zlata u svetu i unoviciti ga po aktuelnoj berznkso ceni u roku od nekoliko minuta.",
  },
  {
    q: "Da li smem da probusim dukat kako bi dete nosilo lancic?",
    a: "Strogo upozorenje: Nikada nemojte busiti, seci niti lemiti alkice na investicione dukate! Bilo kakvo fizicko ostecenje ili busenje kovanice trajno unistava njen investicioni status. Probuden dukat se prilikom kasnije prodaje tretira iskljucivo kao 'lomljeno zlato', sto znaci da mu se otkupna cena drasticno obara. Zlato namenjeno stednji mora ostati u svom originalnom, neostecenom stanju.",
  },
];

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
    sort_order: 1,
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
    sort_order: 2,
    is_active: true,
    products: { name: "Veliki dukat Franc Jozef", brand: "Austrijska kovnica", origin: "Austrija", category: "dukat" },
    pricing_rules: null,
  },
  {
    id: "p1g",
    product_id: "p1",
    slug: "zlatna-plocica-1g",
    weight_g: 1,
    weight_oz: 0.032,
    purity: 0.9999,
    fine_weight_g: 1,
    sku: null,
    stock_qty: 15,
    availability: "in_stock",
    lead_time_weeks: null,
    images: ["/images/product-poluga.png"],
    sort_order: 3,
    is_active: true,
    products: { name: "Zlatna plocica 1g", brand: "C. Hafner", origin: "Nemacka", category: "plocica" },
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
    stock_qty: 12,
    availability: "in_stock",
    lead_time_weeks: null,
    images: ["/images/product-poluga.png"],
    sort_order: 4,
    is_active: true,
    products: { name: "Zlatna plocica 2g", brand: "Argor-Heraeus", origin: "Svajcarska", category: "plocica" },
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
    stock_qty: 8,
    availability: "in_stock",
    lead_time_weeks: null,
    images: ["/images/product-poluga.png"],
    sort_order: 5,
    is_active: true,
    products: { name: "Zlatna plocica 5g", brand: "Argor-Heraeus", origin: "Svajcarska", category: "plocica" },
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
    stock_qty: 4,
    availability: "in_stock",
    lead_time_weeks: null,
    images: ["/images/product-poluga.png"],
    sort_order: 6,
    is_active: true,
    products: { name: "Zlatna plocica 10g", brand: "C. Hafner", origin: "Nemacka", category: "plocica" },
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
    stock_qty: 6,
    availability: "in_stock",
    lead_time_weeks: null,
    images: ["/images/product-poluga.png"],
    sort_order: 7,
    is_active: true,
    products: { name: "Becka filharmonija 1/10 oz", brand: "Austrijska kovnica", origin: "Austrija", category: "dukat" },
    pricing_rules: null,
  },
];

export default async function PoklonaZaKrstenjiePage() {
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
          "mali-dukat-franc-jozef",
          "veliki-dukat-franc-jozef",
          "zlatna-plocica-1g",
          "zlatna-plocica-2g",
          "zlatna-plocica-5g",
          "zlatna-plocica-10g",
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
    // Supabase nedostupan ili nema ENV — koristimo mock podatke
  }

  const breadcrumbs = [
    { label: "Investiciono zlato", href: "/" },
    { label: "Poklon za krstenje", href: "/poklon-za-krstenje" },
  ];

  return (
    <main className="bg-white">
      {/* Schema.org */}
      <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
      <SchemaScript schema={buildFaqSchema(FAQ_ITEMS)} />
      <SchemaScript
        schema={buildWebPageSchema({
          name: "Poklon za krštenje — zlatna pločica ili dukat | Gold Invest Beograd",
          description:
            "Investiciono zlato kao poklon za krštenje — zlatne pločice i dukati oslobođeni PDV-a, sa sertifikatom, brza dostava Beograd.",
          slug: "/poklon-za-krstenje",
        })}
      />

      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={breadcrumbs} variant="light" />
        </SectionContainer>
      </section>

      {/* Hero */}
      <CategoryHero
        title="Poklon za krstenje"
        introFull="Krstenje je jedan od najvaznijih dogadjaja u zivotu deteta i porodice, a takav trenutak zasluzuje dar koji ne bledi. Umesto novca koji gubi vrednost ili igracaka koje se brzo prerastu, poklonite investiciono zlato — jedini poklon cija vrednost raste zajedno sa detetom. U nasoj ponudi pronadjite tradicionalne dukate i moderne zlatne plocice (od 1g do 10g), oslobodjene poreza i spremne za darivanje."
        pills={[
          { label: "Zlatni dukati", href: "/kategorija/zlatni-dukati" },
          { label: "Zlatne plocice", href: "/kategorija/zlatne-plocice" },
        ]}
        introMaxWidth="none"
        centerOnDesktop
      />

      {/* Proizvodi pogodni za poklon */}
      <section className="bg-white py-12">
        <SectionContainer>
          <p
            className="text-xs font-semibold tracking-widest uppercase text-[#BF8E41] mb-6"
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          >
            Ponuda za poklon
          </p>
          <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-5">
            U ovoj kategoriji izlistavamo artikle pogodne za poklon: <strong>Mali i Veliki dukat Franc Jozef</strong>,
            <strong> zlatne pločice 1g, 2g, 5g i 10g</strong>, kao i <strong>Filharmoniju 1/10 oz</strong>.
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
                { label: "Dukat Mali FJ (3.49g)", value: 3.49 },
                { label: "Plocica 1g", value: 1 },
                { label: "Plocica 2g", value: 2 },
                { label: "Plocica 5g", value: 5 },
                { label: "Plocica 10g", value: 10 },
                { label: "Dukat Veliki FJ (13.96g)", value: 13.96 },
                { label: "Filharmoniju 1/10 oz (3.11g)", value: 3.11 },
              ],
            }}
          />
        </SectionContainer>
      </section>

      {/* H2: Zasto je investiciono zlato najbolji poklon */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title="Zasto je investiciono zlato najbolji poklon za krstenje deteta?"
            description="Kada biraju poklon za krstenje, gosti se najcesce odlucuju za novac u koverti ili deciji nakit. Sa finansijskog i prakticnog aspekta, investiciono zlato predstavlja neuporedivo pametniji izbor."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Pobedjuje inflaciju (novac u koverti gubi vrednost)">
              Novac koji danas stavite detetu u kovertu ce za 18 godina, kada dete postane punolgetno, usled inflacije vredeti drasticno manje. Zlato, sa druge strane, kroz istoriju dokazano cuva kupovnu moc i njegova vrednost dugorocno raste.
            </InfoCard>
            <InfoCard title="Ne placate porez (za razliku od nakita)">
              Kada u obicnoj zlatari kupite deciju narukvicu ili lancic, placate 20% PDV-a i visoku marzu za rad zlatara. Investiciono zlato je oslobodjeno PDV-a — novac koji dajete ide iskljucivo u vrednost cistog metala.
            </InfoCard>
            <InfoCard title="Trajna uspomena i finansijska sigurnost">
              Zlato se ne trosi na tekuce troskove (pelene, kolica, odecu). Ono ostaje sacuvano kao mali kapital koji ce detetu sutra znaciti za obrazovanje, prvi automobil ili pocetak samostalnog zivota.
            </InfoCard>
          </div>
        </SectionContainer>
      </section>

      {/* H2: Sta pokloniti — dukati ili plocice */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title="Sta pokloniti iz naseg asortimana?"
            description="U zavisnosti od vaseg budzeta i ukusa, Gold Invest vam nudi dva pravca za savrsen dar — tradicionalni dukat ili moderni blister."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <InfoCard title="Zlatni dukat Franc Jozef">
              Dukati su glavni simbol darivanja na Balkanu. Dostupni su u dva formata:
              <ul className="mt-3 space-y-1 text-sm">
                <li>
                  <span className="font-semibold">Mali dukat Franc Jozef</span> — 3.49g, 986/1000 (23.6 karata)
                </li>
                <li>
                  <span className="font-semibold">Veliki dukat Franc Jozef</span> — 13.96g, 986/1000 (23.6 karata)
                </li>
              </ul>
              <p className="mt-3 text-sm">
                Ne dolazi u plasticnom pakovanju, vec u elegantnoj okrugloj kapsuli — istorijski sam i poseban, ujedno i trajni podsetsnik na vrednost poklona.
              </p>
              <Link
                href="/kategorija/zlatni-dukati"
                className="inline-block mt-4 text-xs font-semibold tracking-widest uppercase text-[#BF8E41] hover:opacity-80 transition-opacity"
              >
                Pogledaj dukate &rarr;
              </Link>
            </InfoCard>

            <InfoCard title="Zlatne plocice">
              Zlatne plocice (od 1g, 2g ili 5g) su savrsen izbor za one koji zele moderniji poklon od 24-karatnog zlata (cistoca 999,9). Svaka plocica iz rafinerija Argor-Heraeus ili C. Hafner dolazi fabricki zapecacena u prelepom sigurnosnom blister pakovanju — velicine bankovne kartice — koje je ujedno i sertifikat i daje izuzetno luksuzan vizuelni utisak.
              <Link
                href="/kategorija/zlatne-plocice"
                className="inline-block mt-4 text-xs font-semibold tracking-widest uppercase text-[#BF8E41] hover:opacity-80 transition-opacity"
              >
                Pogledaj plocice &rarr;
              </Link>
            </InfoCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard title="Poklon za krstenje devojcice">
              Kada se bira poklon za krstenje devojcice, prvi instinkt vecine gostiju je kupovina decijeg nakita. Medutim, nakit se veoma brzo preraste, podlozan je lomljenju i gubljenju, a pri kupovini placate visoku marzu i 20% PDV-a. Elegantne <strong>zlatne plocice</strong> u prelepom blister pakovanju (posebno ekoloski C. Hafner) ili tradicionalni <strong>Mali dukat Franc Jozef</strong> su idealan izbor.
            </InfoCard>

            <InfoCard title="Poklon za krstenje decaka">
              Tradicionalni pokloni za decake cesto ukljucuju zlatne krstice ili lancice, koji neretko zavrse zaboravljeni u fioci. Umesto nakita, poklonite mu <strong>zlatne plocice</strong> od 2g ili 5g (Argor-Heraeus), kao i masivniji <strong>Veliki dukat Franc Jozef</strong>. To nije samo simbolican poklon — to je prvi konkretan korak u izgradnji njegovog licnog finansijskog temelja.
            </InfoCard>
          </div>
        </SectionContainer>
      </section>

      {/* Dark quote */}
      <DarkQuoteSection
        eyebrow="Poklon koji traje generacijama"
        normalText="Investiciono zlato nije samo dar za dan krstenja —"
        italicText="to je finansijska osnova koju ce dete pamtiti celog zivota."
        ctaHref="/kontakt"
        ctaLabel="Upit za poklon"
      />

      {/* H2: Od kuma, bake i deke */}
      <section className="bg-white py-16 sm:py-20">
        <SectionContainer>
          <SectionHeading
            title="Poklon za krstenje od kuma, bake i deke"
            description="Obicaj nalaze da najblizi clanovi porodice i duhovni srodnici donose najznacajnije darove. Evo sta preporucujemo za svaku ulogu."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Za kumove">
              Kumovi kao drugi roditelji se najcesce odlucuju za <strong>zlatnu plocicu od 5g</strong> ili <strong>Mali dukat Franc Jozef</strong>. Oba formata nose snaznu simboliku, lako se pakuju u luksuznu kutijicu i predstavljaju nezaboravan pocetak detetove zlatne stednje.
            </InfoCard>
            <InfoCard title="Za bake i deke">
              Bake i deke cesto zele da osiguraju buducnost svog unuka ili unuke. Za njih, <strong>zlatna plocica od 10g</strong> ili <strong>Veliki dukat Franc Jozef</strong> su cest izbor — temelj za buducu stednju koji ce dete razumeti i ceniti kada odraste.
            </InfoCard>
            <InfoCard title="Za rodbinu i prijatelje">
              Ukoliko dolazite kao gost, <strong>zlatna plocica od 1g ili 2g</strong> je neuporedivo elegantniji i trajniji poklon od klasicne koverte sa 100 ili 200 evra. Isti iznos — trajno znacenje.
            </InfoCard>
          </div>
        </SectionContainer>
      </section>

      {/* Brands */}
      <BrandCardsSection
        title="Brendovi koje poklanjate — evropski premium kvalitet"
        description="Svaka plocica i dukat iz nase ponude poticu od svetski priznatih kovnica i rafinerija — garancija autenticiteta i trajne vrednosti."
        brands={[
          {
            img: "/images/brands/argor-heraeus.png",
            title: "Argor-Heraeus",
            origin: "Svajcarska",
            text: "Industrijski standard i jedna od najpouzdanijih svetskih rafinerija. Svajcarska preciznost u svakom detalju — plocice Argor-Heraeusa su sinonim za sigurnost.",
          },
          {
            img: "/images/brands/c-hafner.png",
            title: "C. Hafner",
            origin: "Nemacka",
            text: "Rafinerija sa tradicijom od preko 170 godina, poznata po besprekornoj izradi i etickom poreklu zlata. Koriste iskljucivo reciklirano zlato — nemacki premium bez kompromisa.",
            imageScale: 0.9,
          },
          {
            img: "/images/brands/logo-royal-mint.png",
            title: "Austrijska kovnica",
            origin: "Austrija",
            text: "Zvanicna austrijska drzavna kovnica — izdaje i Becku Filharmoniju i legendarni Dukat Franc Jozef. Jedan od najpoznatijih brendova u istoriji evropskog kovanog novca.",
          },
        ]}
      />

      {/* Delivery */}
      <DeliverySection
        heading="Prodaja poklona za krstenje Beograd — Gold Invest"
        description="Kupovina zlatnog poklona za krstenje kod nas je brza i bezbedna. Mozete licno doci po poklon u Beograd ili narudzbinom pokrenuti diskretnu dostavu na kucnu adresu."
        pickupCardBody="Posetite nas licno u Beogradu. Diskretno okruzenje, strucna pomoc pri odabiru poklona i preuzimanje na licu mesta — bez cekanja."
      />

      {/* FAQ */}
      <CategoryFaq
        title="Cesta pitanja o poklonu za krstenje"
        items={FAQ_ITEMS}
        ctaHref="/kontakt"
        ctaLabel="Posaljite upit"
      />

      {/* CTA */}
      <WhatIsGoldSection />
    </main>
  );
}
