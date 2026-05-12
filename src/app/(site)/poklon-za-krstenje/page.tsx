import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { GOLDINVEST_SITE_ID } from "@/lib/site";
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
  title: "Poklon za krštenje - Šta kupiti za krštenje? | Gold Invest",
  description:
    "Poklonite investiciono zlato za krštenje - dukate i zlatne pločice oslobođene PDV-a. Trajni poklon koji čuva vrednost, za devojčice i dečake. Beograd, brza dostava.",
  alternates: { canonical: "https://goldinvest.rs/poklon-za-krstenje" },
  openGraph: {
    title: "Poklon za krštenje - investiciono zlato | Gold Invest",
    description:
      "Zlatna pločica ili dukat za krštenje - jedini poklon čija vrednost raste zajedno s detetom. Bez PDV-a, sa sertifikatom, dostupno u Beogradu.",
    url: "https://goldinvest.rs/poklon-za-krstenje",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Koliko novca je prikladno izdvojiti za krštenje?",
    a: "Cene zlatnih pločica od 1g kreće se u rangu vrednosti prosečnog poklona u koverti, dok za kumove i najbližu rodbinu imamo formate od 5g ili dukate koji predstavljaju skuplji finansijski poklon. Aktuelne cene uvek možete videti pored svakog proizvoda na našem sajtu.",
  },
  {
    q: "Da li uz zlato dobijam sertifikat i kutijicu?",
    a: "Da. Sve zlatne pločice (1g, 2g, 5g) dolaze fabrički zapečaćene u čvrsto blister pakovanje koje ujedno služi kao LBMA sertifikat i garancija čistoće. Zlatni dukati se isporučuju u sigurnosnim zaštitnim kapsulama. Takođe, Gold Invest nudi i mogućnost pakovanja u ekskluzivne, luksuzne poklon kutijice, kako bi vaš dar bio u potpunosti spreman za predaju.",
  },
  {
    q: "Da li se na zlatne dukate i pločice plaća porez (PDV)?",
    a: "Ne. Za razliku od dečijeg nakita iz običnih zlatara na koji se plaća PDV od 20%, zlatni dukati i pločice iz naše ponude tretiraju se po zakonu kao investiciono zlato i u potpunosti su oslobođeni plaćanja poreza. Celokupan iznos koji platite prelazi u čistu vrednost zlata koje poklanjate.",
  },
  {
    q: "Šta roditelji mogu kasnije da urade sa tim zlatom?",
    a: "Zlato nudi apsolutnu fleksibilnost. Roditelji ga mogu čuvati u sefu na ime deteta i sakupljati ga godinama (za fakultet, stan ili auto). Ukoliko im u međuvremenu zatreba novac za detetove neodložne potrebe, investiciono zlato je najlikvidnija imovina na svetu - u svakom trenutku ga mogu doneti u Gold Invest ili bilo koju menjačnicu zlata u svetu i unovčiti ga po aktuelnoj berzanskoj ceni u roku od nekoliko minuta.",
  },
  {
    q: "Da li smem da probušim dukat kako bi dete nosilo lančić?",
    a: "Strogo upozorenje: Nikada nemojte bušiti, seći niti leminti alkice na investicione dukate! Bilo kakvo fizičko oštećenje ili bušenje kovanice trajno uništava njen investicioni status. Probušen dukat se prilikom kasnije prodaje tretira isključivo kao 'lomljeno zlato', što znači da mu se otkupna cena drastično obara. Zlato namenjeno štednji mora ostati u svom originalnom, neoštećenom stanju.",
  },
];




export default async function PoklonaZaKrstenjiePage() {
  let variants: any = [];
  let tiers: any = [];
  let snapshotRow: any = null;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .in("products.category", ["dukat", "plocica"])
        .eq("is_active", true)
        .eq("pricing_rules.site_id", GOLDINVEST_SITE_ID)
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
      supabase.from("pricing_tiers").select("*").eq("site_id", GOLDINVEST_SITE_ID),
      supabase
        .from("gold_price_snapshots")
        .select("*")
        .order("fetched_at", { ascending: false })
        .limit(1)
        .single(),
    ]);
    variants = r1.data ?? [];
      tiers = r2.data ?? [];
      snapshotRow = r3.data ?? null;
  } catch {
    // DB nedostupna
  }

  const breadcrumbs = [
    { label: "Investiciono zlato", href: "/" },
    { label: "Poklon za krštenje", href: "/poklon-za-krstenje" },
  ];

  return (
    <main className="bg-white">
      {/* Schema.org */}
      <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
      <SchemaScript schema={buildFaqSchema(FAQ_ITEMS)} />
      <SchemaScript
        schema={buildWebPageSchema({
          name: "Poklon za krštenje - Šta kupiti za krštenje? | Gold Invest",
          description:
            "Investiciono zlato kao poklon za krštenje - zlatne pločice i dukati oslobođeni PDV-a, sa sertifikatom, brza dostava Beograd.",
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
        title="Poklon za krštenje"
        introFull="Krštenje je jedan od najvažnijih događaja u životu deteta i porodice, a takav trenutak zaslužuje dar koji ne bledi. Umesto novca koji gubi vrednost ili igračaka koje se brzo prerastu, poklonite investiciono zlato - jedini poklon čija vrednost raste zajedno sa detetom. U našoj ponudi pronađite tradicionalne dukate i moderne zlatne pločice (od 1g do 10g), oslobođene poreza i spremne za darivanje."
        pills={[
          { label: "Zlatni dukati", href: "/kategorija/zlatni-dukati" },
          { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
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
                { label: "Pločica 1g", value: 1 },
                { label: "Pločica 2g", value: 2 },
                { label: "Pločica 5g", value: 5 },
                { label: "Pločica 10g", value: 10 },
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
            title="Zašto je investiciono zlato najbolji poklon za krštenje deteta?"
            description="Kada biraju poklon za krštenje, gosti se najčešće odlučuju za novac u koverti ili dečiji nakit. Sa finansijskog i praktičnog aspekta, investiciono zlato predstavlja neuporedivo pametniji izbor."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard title="Pobeđuje inflaciju (novac u koverti gubi vrednost)">
            Novac koji danas stavite detetu u kovertu će za 18 godina, kada dete postane punoletno, usled inflacije vredeti drastično manje. Zlato, sa druge strane, kroz istoriju dokazano čuva kupovnu moć i njegova vrednost dugoročno raste.
          </InfoCard>

          <InfoCard title="Ne plaćate porez (za razliku od nakita)">
            Kada u običnoj zlatari kupite dečiju narukvicu ili lančić, plaćate 20% PDV-a i visoku maržu za rad zlatara. Investiciono zlato je oslobođeno PDV-a - novac koji dajete ide isključivo u vrednost čistog metala.
          </InfoCard>

          <InfoCard title="Trajna uspomena i finansijska sigurnost">
            Zlato se ne troši na tekuće troškove (pelene, kolica, odeću). Ono ostaje sačuvano kao mali kapital koji će detetu sutra značiti za obrazovanje, prvi automobil ili početak samostalnog života.
          </InfoCard>
          </div>
        </SectionContainer>
      </section>

      {/* H2: Sta pokloniti - dukati ili plocice */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
        <SectionHeading
          title="Šta pokloniti iz našeg asortimana?"
          description="U zavisnosti od vašeg budžeta i ukusa, Gold Invest vam nudi dva pravca za savršen dar - tradicionalni dukat ili moderni blister."
        />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <InfoCard title="Zlatni dukat Franc Jozef">
              Dukati su glavni simbol darivanja na Balkanu. Dostupni su u dva formata:
              <ul className="mt-3 space-y-1 text-sm">
                <li>
                  <span className="font-semibold">Mali dukat Franc Jozef</span> - 3.49g, 986/1000 (23.6 karata)
                </li>
                <li>
                  <span className="font-semibold">Veliki dukat Franc Jozef</span> - 13.96g, 986/1000 (23.6 karata)
                </li>
              </ul>
              <p className="mt-3 text-sm">
              Ne dolazi u plastičnom pakovanju, već u elegantnoj okrugloj kapsuli - istorijski sam i poseban, ujedno i trajni podsetnik na vrednost poklona.
              </p>
              <Link
                href="/kategorija/zlatni-dukati"
                className="inline-block mt-4 text-xs font-semibold tracking-widest uppercase text-[#BF8E41] hover:opacity-80 transition-opacity"
              >
                Pogledaj dukate &rarr;
              </Link>
            </InfoCard>

            <InfoCard title="Zlatne pločice">
            Zlatne pločice (od 1g, 2g ili 5g) su savršen izbor za one koji žele moderniji poklon od 24-karatnog zlata (čistoća 999,9). Svaka pločica iz rafinerija Argor-Heraeus ili C. Hafner dolazi fabrički zapečaćena u prelepom sigurnosnom blister pakovanju - veličine bankovne kartice - koje je ujedno i sertifikat i daje izuzetno luksuzan vizuelni utisak.
              <Link
                href="/kategorija/zlatne-plocice"
                className="inline-block mt-4 text-xs font-semibold tracking-widest uppercase text-[#BF8E41] hover:opacity-80 transition-opacity"
              >
                Pogledaj pločice &rarr;
              </Link>
            </InfoCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard title="Poklon za krštenje devojčice">
            Kada se bira poklon za krštenje devojčice, prvi instinkt većine gostiju je kupovina dečijeg nakita. Međutim, nakit se veoma brzo preraste, podložan je lomljenju i gubljenju, a pri kupovini plaćate visoku maržu i 20% PDV-a.
            </InfoCard>

            <InfoCard title="Poklon za krštenje dečaka">
              Tradicionalni pokloni za dečake često uključuju zlatne krstiće ili lančiće, koji neretko završe zaboravljeni u fioci. Umesto nakita, poklonite mu <strong>zlatne pločice</strong> od 2g ili 5g (Argor-Heraeus), kao i masivniji <strong>Veliki dukat Franc Jozef</strong>. To nije samo simboličan poklon - to je prvi konkretan korak u izgradnji njegovog ličnog finansijskog temelja.
            </InfoCard>
          </div>
        </SectionContainer>
      </section>

      {/* Dark quote */}
      <DarkQuoteSection
        eyebrow="Poklon koji traje generacijama"
        normalText="Investiciono zlato nije samo dar za dan krštenja -"
        italicText="to je finansijska osnova koju će dete pamtiti celog života."
        ctaHref="/kontakt"
        ctaLabel="Upit za poklon"
      />

      {/* H2: Od kuma, bake i deke */}
      <section className="bg-white py-16 sm:py-20">
        <SectionContainer>
          <SectionHeading
            title="Poklon za krštenje od kuma, bake i deke"
            description="Običaj nalaže da najbliži članovi porodice i duhovni srodnici donose najznačajnije darove. Evo šta preporučujemo za svaku ulogu."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Za kumove">
              Kumovi kao drugi roditelji se najčešće odlučuju za <strong>zlatnu pločicu od 5g</strong> ili <strong>Mali dukat Franc Jozef</strong>. Oba formata nose snažnu simboliku, lako se pakuju u luksuznu kutijicu i predstavljaju nezaboravan početak detetove zlatne štednje.
            </InfoCard>
            <InfoCard title="Za bake i deke">
              Bake i deke često žele da osiguraju budućnost svog unuka ili unuke. Za njih, <strong>zlatna pločica od 10g</strong> ili <strong>Veliki dukat Franc Jozef</strong> su čest izbor - temelj za buduću štednju koji će dete razumeti i ceniti kada odraste.
            </InfoCard>
            <InfoCard title="Za rodbinu i prijatelje">
              Ukoliko dolazite kao gost, <strong>zlatna pločica od 1g ili 2g</strong> je neuporedivo elegantniji i trajniji poklon od klasične koverte sa 100 ili 200 evra. Isti iznos - trajno značenje.
            </InfoCard>
          </div>
        </SectionContainer>
      </section>

      {/* Brands */}
      <BrandCardsSection
        title="Brendovi koje poklanjate - evropski premium kvalitet"
        description="Svaka pločica i dukat iz naše ponude potiču od svetski priznatih kovnica i kovanica - garancija autenticiteta i trajne vrednosti."
        brands={[
          {
            img: "/images/brands/argor-heraeus.webp",
            title: "Argor-Heraeus",
            origin: "Svajcarska",
            text: "Industrijski standard i jedna od najpouzdanijih svetskih rafinerija. Švajcarska preciznost u svakom detalju - pločice Argor-Heraeusa su sinonim za sigurnost.",
          },
          {
            img: "/images/brands/c-hafner.webp",
            title: "C. Hafner",
            origin: "Nemacka",
            text: "Rafinerija sa tradicijom od preko 170 godina, poznata po besprekornoj izradi i etičkom poreklu zlata. Koriste isključivo reciklirano zlato - nemački premium bez kompromisa.",
            imageScale: 0.9,
          },
          {
            img: "/images/brands/logo-royal-mint.webp",
            title: "Austrijska kovnica",
            origin: "Austrija",
            text: "Zvanična austrijska državna kovnica - izdaje i Bečku Filharmoniju i legendarni Dukat Franc Jozef. Jedan od najpoznatijih brendova u istoriji evropskog kovanog novca.",
          },
        ]}
      />

      {/* Delivery */}
      <DeliverySection
        heading="Prodaja poklona za krštenje Beograd - Gold Invest"
        description="Kupovina zlatnog poklona za krštenje kod nas je brza i bezbedna. Možete lično doći po poklon u Beograd ili naručbom pokrenuti diskretnu dostavu na kućnu adresu."
        pickupCardBody="Posetite nas lično u Beogradu. Diskretno okruženje, stručna pomoć pri odabiru poklona i preuzimanje na licu mesta - bez čekanja."
      />

      {/* FAQ */}
      <CategoryFaq
        title="Česta pitanja o poklonu za krštenje"
        items={FAQ_ITEMS}
        ctaHref="/kontakt"
        ctaLabel="Pošaljite upit"
      />

      {/* CTA */}
      <WhatIsGoldSection />
    </main>
  );
}
