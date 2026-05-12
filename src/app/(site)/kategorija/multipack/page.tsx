import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { GOLDINVEST_SITE_ID } from "@/lib/site";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Multipack setovi - Zlatne pločice u setu | Gold Invest",
  description:
    "Kupite C. Hafner multipack setove zlatnih pločica - kombinacije od 10x1g, 25x1g i više. LBMA sertifikovano, čistoća 999,9. Idealan poklon i pametna investicija.",
  alternates: { canonical: "https://goldinvest.rs/kategorija/multipack" },
  openGraph: {
    title: "Multipack setovi zlatnih pločica | Gold Invest",
    description:
      "C. Hafner multipack setovi - zlatne pločice u kombinacijama. LBMA standard, čistoća 999,9. Bez PDV-a.",
    url: "https://goldinvest.rs/kategorija/multipack",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Šta je multipack set zlatnih pločica?",
    a: "Multipack set je jedan komad investicionog zlata koji se sastoji od više međusobno spojenih manjih pločica. Na primer, C. Hafner CombiBar od 10x1g je jedna pločica dimenzija kreditne kartice koja se može podeliti na 10 zasebnih pločica od po 1g. Ovo vam daje fleksibilnost da u budućnosti prodate samo onoliko zlata koliko vam je potrebno.",
  },
  {
    q: "Da li je multipack set isto što i obična zlatna pločica?",
    a: "Materijal i standard su isti - čistoća 999,9 i LBMA sertifikacija. Razlika je u formatu: multipack kombinuje više pločica u jednu celinu, što smanjuje premiju po gramu u poređenju sa kupovinom istog broja pojedinačnih pločica.",
  },
  {
    q: "Da li se na multipack setove plaća PDV?",
    a: "Ne. Kao i sve forme investicionog zlata čistoće iznad 995/1000, multipack setovi su u potpunosti oslobođeni PDV-a i poreza na kapitalnu dobit u Republici Srbiji.",
  },
  {
    q: "Mogu li da razdvojim multipack set na pojedinačne pločice?",
    a: "Da, to je i poenta ovog formata. C. Hafner CombiBar setovi su dizajnirani tako da se svaka manja pločica može lako odlomiti bez alata. Međutim, jednom odlomljene pločice gube originalni blister sertifikat kao celina - svaka odlomljena pločica nosi sopstvenu čistoću i težinu, ali je proverite pre prodaje.",
  },
  {
    q: "Da li je multipack set dobar poklon?",
    a: "Apsolutno. Multipack set je impresivan poklon upravo zbog svoje vizuelne prezentacije - jedna veća pločica sa vidljivom podjelom na manje. Odličan je za važne životne prilike poput venčanja, jubilarnih godišnjica ili kao investicioni poklon za mlade.",
  },
];

export default async function MultipackPage() {
  let variants: any = [];
  let tiers: any = [];
  let snapshotRow: any = null;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("products.category", "multipack")
        .eq("is_active", true)
        .eq("pricing_rules.site_id", GOLDINVEST_SITE_ID)
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

  return (
    <CategoryPageTemplate
      breadcrumbs={[
        { label: "Investiciono zlato", href: "/" },
        { label: "Multipack setovi", href: "/kategorija/multipack" },
      ]}
      heroTitle="Multipack setovi"
      heroIntro="Multipack setovi su pametno rešenje za investitore koji žele fleksibilnost. Jedna kompaktna pločica koja se deli na više manjih - isti LBMA standard, čistoća 999,9, bez PDV-a. Poruči putem kontakt forme ili na broj 0614264129 - BRZA dostava!"
      variants={variants}
      tiers={tiers}
      snapshot={snapshotRow}
      filterConfig={{
        showCategoryFilter: false,
      }}
      infoSectionA={{
        heading: "Šta su multipack setovi?",
        description:
          "Multipack setovi kombinuju prednosti malih pločica (fleksibilnost) i većih formi (niža premija po gramu). Idealni za investitore koji žele modularno zlato.",
        cards: [
          {
            title: "C. Hafner CombiBar - nemački kvalitet u setu",
            body: "C. Hafner je pionir multipack formata. Njihovi setovi dolaze kao jedna kompaktna pločica sa jasno definisanim linijama podele - svaka manja pločica nosi tačnu gramažu, čistoću i serijski broj.",
          },
          {
            title: "Fleksibilnost po gramu",
            body: "Umesto da prodajete celu investiciju, možete odlomiti samo onoliko pločica koliko vam treba. Ostatak ostaje u originalnom obliku, spreman za kasniju prodaju po punoj tržišnoj ceni.",
          },
          {
            title: "Niža premija od pojedinačnih pločica",
            body: "Kupovinom seta umesto istog broja pojedinačnih pločica plaćate nižu ukupnu premiju. Više zlata za isti novac - uz istu fleksibilnost pri prodaji.",
          },
        ],
      }}
      infoSectionB={{
        heading: "LBMA standard i sertifikacija",
        description:
          "Svi multipack setovi u našoj ponudi potiču od C. Hafner rafinerije - jedne od najprestižnijih na LBMA listi. Svaki set dolazi fabrički zapečaćen u sigurnosnom blisteru koji je vaš zvanični sertifikat.",
        cards: [
          {
            title: "Šta garantuje LBMA sertifikacija?",
            body: "Tačnu gramažu, čistoću od 99,99% i legalno poreklo metala. Sertifikovano zlato je prepoznato i lako naplativo svuda u svetu - apsolutna likvidnost bez pitanja.",
          },
          {
            title: "Blister pakovanje kao sertifikat",
            body: "Ceo set dolazi u jednom sigurnosnom blisteru sa logom, serijskim brojem i oznakama za svaku pločicu. Nikada ne otvarajte pakovanje pre prodaje - otvoreni blister smanjuje otkupnu vrednost.",
          },
          {
            title: "C. Hafner - etičko zlato",
            body: "Nemačka rafinerija C. Hafner kuje isključivo od recikliranog zlata. Isti standard kvaliteta, nulti uticaj na rudarska polja - premium izbor za investitore kojima je važno poreklo metala.",
          },
        ],
      }}
      darkQuote={{
        eyebrow: "Pametna investicija",
        normalText: "Jedan set, neograničena fleksibilnost -",
        italicText: "prodajte gram po gram, tačno onoliko koliko vam treba.",
        ctaHref: "/kontakt",
        ctaLabel: "Poruči odmah",
      }}
      brandsSection={{
        title: "C. Hafner - ekskluzivni partner za multipack",
        description:
          "Gold Invest nudi isključivo C. Hafner multipack setove - nemačku rafineriju sa tradicijom od preko 170 godina i LBMA akreditacijom.",
        brands: [
          {
            img: "/images/brands/c-hafner.webp",
            title: "C. Hafner",
            origin: "Nemačka",
            text: "Rafinerija sa tradicijom od preko 170 godina, osnivač CombiBar formata. Kuju isključivo od recikliranog zlata - etički premium kvalitet koji nosi LBMA Good Delivery status.",
            imageScale: 0.9,
          },
        ],
      }}
      delivery={{
        heading: "Prodaja multipack setova - Gold Invest Beograd",
        description:
          "Kupovina multipack setova je brza i potpuno bezbedna. Nudimo preuzimanje na više načina.",
        pickupCardBody:
          "Posetite nas lično u Beogradu. Diskretno okruženje, stručna provera i preuzimanje na licu mesta - bez čekanja.",
      }}
      priceStructure={{
        title: "Cene multipack setova - Prodajna / Avansna / Otkupna",
        description:
          "Kao i za sve proizvode, uz svaki multipack set jasno su istaknute sve tri cene:",
        card1Body:
          "Cena za setove koje imamo u trezoru. Uplatite i preuzmite istog dana.",
        card2Body:
          "Uplatite unapred i zaključajte trenutnu berzansku cenu - robu direktno poručujemo iz kovnice.",
        card3Body:
          "Garantovani iznos po kom Gold Invest otkupljuje vaše setove - uvek javno istaknut.",
      }}
      faq={{
        title: "Česta pitanja o multipack setovima",
        items: FAQ_ITEMS,
      }}
    />
  );
}
