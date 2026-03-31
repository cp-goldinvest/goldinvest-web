import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Zlatne pločice | Najpovoljnija Cena i Prodaja Zlatnih Pločica",
  description:
    "Kupite LBMA sertifikovane zlatne pločice od 1g do 20g — Argor-Heraeus, C. Hafner, The Royal Mint. Idealan poklon za krštenje i rođenje. Transparentne cene i brza dostava.",
  alternates: { canonical: "https://goldinvest.rs/kategorija/zlatne-plocice" },
  openGraph: {
    title: "Zlatne pločice 1g–20g — LBMA sertifikovane | Gold Invest",
    description: "Zlatne pločice čistoće 999,9 od 1g do 20g — Argor-Heraeus i C. Hafner. Idealan poklon i investicija. Bez PDV-a, brza dostava.",
    url: "https://goldinvest.rs/kategorija/zlatne-plocice",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Da li su zlatne pločice i zlatne poluge ista stvar?",
    a: "Da, tehnički gledano to je ista stvar. Obe spadaju u investiciono zlato čistoće 99.99% i kuju se po istim LBMA standardima. Naziv 'pločice' se u praksi kolokvijalno koristi za manje gramaže (od 1g do 20g) zbog njihovog izgleda i veličine, dok se izraz 'poluge' obično koristi za formate od 50g pa naviše.",
  },
  {
    q: "Da li se na zlatne pločice plaća PDV?",
    a: "Ne. U Republici Srbiji promet investicionim zlatom — u koje spadaju i zlatne pločice finoće preko 995/1000 — je po zakonu u potpunosti oslobođen plaćanja PDV-a i poreza na kapitalnu dobit.",
  },
  {
    q: "Kako se pakuju zlatne pločice za poklon?",
    a: "Sama pločica dolazi u elegantnom, čvrstom blister pakovanju (veličine platne kartice) koje izgleda izuzetno luksuzno i sadrži sve sertifikate. Uz to, Gold Invest nudi i mogućnost kupovine dodatnih luksuznih kutijica koje pločicu čine idealnim darom za svečanosti.",
  },
  {
    q: "Da li otkupljujete zlatne pločice kupljene u inostranstvu?",
    a: "Da. Otkupljujemo sve zlatne pločice i poluge, bez obzira gde ste ih i od koga kupili, pod uslovom da dolaze od priznatih svetskih rafinerija i da prolaze našu brzu i stručnu proveru autentičnosti na licu mesta.",
  },
  {
    q: "Šta predstavlja oznaka 999,9?",
    a: "Oznaka 999,9 (poznata i kao 'četiri devetke') predstavlja maksimalan nivo čistoće investicionog zlata koji se može postići u rafinerijskoj obradi. To znači da je vaša zlatna pločica izrađena od 99,99% čistog zlata, što u potpunosti odgovara vrednosti od 24 karata. Kod investicionih pločica, ovo je ultimativni standard koji garantuje maksimalnu likvidnost i oslobađanje od poreza.",
  },
  {
    q: "Koji je limit za plaćanje u gotovini?",
    a: "U skladu sa Zakonom o sprečavanju pranja novca Republike Srbije, kupovinu zlatnih pločica možete platiti u gotovini do maksimalnog iznosa od 1.160.000 dinara (10.000 evra u protivvrednosti). S obzirom na to da su pločice manjih gramaža (od 1g do 20g), najveći broj kupovina u ovoj kategoriji možete bez problema obaviti gotovinski. Sve transakcije koje prelaze ovaj iznos moraju se realizovati isključivo bezgotovinski, preko bankovnog računa.",
  },
  {
    q: "Mogu li da plaćam platnom karticom?",
    a: "Ne, plaćanje platnim karticama trenutno nije moguće. Razlog za to su visoke provizije banaka (često i do 2–3%) koje bi neizbežno morale da se ugrade u krajnju cenu zlata. Naš cilj je da vam obezbedimo najpovoljniju moguću cenu na tržištu bez skrivenih troškova, zbog čega prihvatamo isključivo plaćanje gotovinom, bankovnim transferom ili pouzećem.",
  },
  {
    q: "Koliko traje isporuka?",
    a: "Za klijente u Beogradu nudimo isporuku dan za dan — ukoliko je porudžbina evidentirana radnim danima do 12h, zlato stiže na vašu adresu istog dana do 18h. Za porudžbine iz ostalih gradova Srbije, diskretna i osigurana dostava traje od 1 do 3 radna dana (ovo ne važi za avansne kupovine, za koje se rok isporuke precizno definiše pri samoj kupovini).",
  },
  {
    q: "Koliko košta dostava?",
    a: "Cena bezbedne i osigurane dostave zavisi od težine i vrednosti porudžbine. Kontaktirajte nas na 061 269 8569 ili putem kontakt forme za tačan iznos.",
  },
  {
    q: "Šta je bolji poklon — zlatna pločica ili zlatni dukat?",
    a: "Oba formata su izuzetan izbor jer predstavljaju investiciono zlato koje trajno čuva vrednost. Zlatne pločice dolaze u modernim sigurnosnim blisterima i predstavljaju savremen, elegantan poklon. Sa druge strane, zlatni dukati (poput čuvenog Franca Jozefa) nose duboku istorijsku simboliku i predstavljaju najpopularniji tradicionalni dar na našim prostorima. Izbor zavisi isključivo od vašeg ukusa.",
  },
];

export default async function ZlatnePlocicePage() {
  let variants: any = [];
  let tiers: any = [];
  let snapshotRow: any = null;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("products.category", "plocica")
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
    variants = r1.data ?? [];
      tiers = r2.data ?? [];
      snapshotRow = r3.data ?? null;
  } catch {
    // DB nedostupna
  }

  return (
    <CategoryPageTemplate
      infoSectionBLayout="premium-bento"
      infoSectionBBentoBlackCardImageOnTop
      breadcrumbs={[
        { label: "Investiciono zlato", href: "/" },
        { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
      ]}
      heroTitle="Zlatne pločice"
      heroIntro="Zlatne pločice su najpametniji način da započnete izgradnju svog investicionog portfolija, ali i najvredniji poklon za vama drage osobe. Nudimo isključivo LBMA sertifikovane pločice čistoće 999,9, prestižnih evropskih kovnica. Obezbedili smo transparentne cene i brzu isporuku. Poruči putem kontakt forme ili na broj 0612698569 — BRZA dostava!"
      heroPills={[
        { label: "Zlatna pločica 1 gram", href: "/kategorija/zlatne-plocice/zlatna-plocica-1g" },
        { label: "Zlatna pločica 2 grama", href: "/kategorija/zlatne-plocice/zlatna-plocica-2g" },
        { label: "Zlatna pločica 5 grama", href: "/kategorija/zlatne-plocice/zlatna-plocica-5g" },
        { label: "Zlatna pločica 10 grama", href: "/kategorija/zlatne-plocice/zlatna-plocica-10g" },
        { label: "Zlatna pločica 20 grama", href: "/kategorija/zlatne-plocice/zlatna-plocica-20g" },
      ]}
      variants={variants}
      tiers={tiers}
      snapshot={snapshotRow}
      filterConfig={{
        showCategoryFilter: false,
        weightOptions: [
          { label: "Pločica 1g", value: 1 },
          { label: "Pločica 2g", value: 2 },
          { label: "Pločica 5g", value: 5 },
          { label: "Pločica 10g", value: 10 },
          { label: "Pločica 20g", value: 20 },
        ],
        priceOptions: [
          { label: "Do 30.000 RSD", value: 30_000 },
          { label: "Do 60.000 RSD", value: 60_000 },
          { label: "Do 100.000 RSD", value: 100_000 },
          { label: "Do 180.000 RSD", value: 180_000 },
          { label: "Do 350.000 RSD", value: 350_000 },
        ],
      }}
      infoSectionA={{
        heading: "Koje gramaže zlatnih pločica nudimo?",
        description:
          "Gold Invest vam nudi pločice maksimalne čistoće od 99.99% (24 karata), skrojene za svaki budžet — od savršenog poklona do sistematske izgradnje portfolija.",
        cards: [
          {
            title: "Pločice od 1g i 2g — savršen poklon za krštenje ili rođenje",
            body: "Najpristupačniji ulazak u svet investicionog zlata. Umesto novca u koverti koji će inflacija obezvrediti, poklanjanjem zlatne pločice od 1g ili 2g za krštenje ili rođenje deteta darujete trajnu vrednost.",
          },
          {
            title: "Pločice od 5g i 10g — pametna štednja",
            body: "Idealan format za ljude koji žele da mesečno ili kvartalno odvajaju deo zarade i sistematski grade svoj zlatni portfolio. Niža premija po gramu od najmanjih pločica, uz istu fleksibilnost.",
          },
          {
            title: "Pločica od 20g — maksimalna vrednost u malom formatu",
            body: "Najveća u kategoriji pločica. Nudi najbolji odnos cene po gramu i fleksibilnosti za investitore sa srednjim budžetom koji ne žele da se vežu za poluge od 50g ili više.",
          },
        ],
        infoBoxContent: (
          <>
            Dok su{" "}
            <Link
              href="/kategorija/zlatne-poluge"
              className="font-semibold text-[#1B1B1C] underline decoration-[#BEAD87] hover:text-[#BEAD87] transition-colors"
            >
              zlatne poluge
            </Link>{" "}
            rezervisane za osiguranje ogromnog kapitala, pločice nude ono što veliki formati nemaju
            — fleksibilnost. Ako vam iznenada zatreba manji iznos gotovine, prodate samo jednu
            pločicu i ostatak investicije ostaje netaknut. Pogledate i{" "}
            <Link
              href="/kategorija/zlatni-dukati"
              className="font-semibold text-[#1B1B1C] underline decoration-[#BEAD87] hover:text-[#BEAD87] transition-colors"
            >
              zlatne dukate
            </Link>{" "}
            — popularan izbor za tradicionalni poklon.
          </>
        ),
      }}
      infoSectionB={{
        heading: "Sertifikati i LBMA standard zlatnih pločica",
        description:
          "Baš kao i najveće poluge, svaka zlatna pločica iz naše ponude iskovana je u rafinerijama sa prestižne LBMA (London Bullion Market Association) liste — globalna garancija tačne gramaže, čistoće od 99.99% i legalnog porekla.",
        headingClassName: "py-1",
        cards: [
          {
            title: "Gde je sertifikat vaše pločice?",
            body: "Pločica vam se isporučuje fabrički zapečaćena u čvrsto sigurnosno blister pakovanje veličine platne kartice. To pakovanje je vaš sertifikat — na njemu se nalaze logo proizvođača, čistoća i jedinstveni serijski broj koji je laserski urezan i na samoj pločici.",
          },
          {
            title: "Šta vam donosi LBMA Good Delivery status?",
            body: "Nije samo prestižna oznaka. To je najrigoroznija globalna garancija kvaliteta — potvrda čistoće, tačne gramaže i strogo kontrolisanog, etičkog porekla metala. Vaša pločica je prepoznata i lako naplativa svuda u svetu.",
          },
          {
            title: "Zlatno pravilo: nikada ne otvarajte blister",
            body: "Oštećen blister trajno poništava investicioni 'Good Delivery' status pločice. Pri kasnijoj prodaji biće vam ponuđena niža cena, jer zlato mora ići na ponovnu proveru autentičnosti. Čuvajte pakovanje onako kako ste ga dobili.",
          },
        ],
      }}
      darkQuote={{
        eyebrow: "Garancija kvaliteta",
        normalText: "Blister pakovanje nije samo ambalaža —",
        italicText:
          "to je vaš sertifikat, garancija autentičnosti i ključ za maksimalnu otkupnu cenu.",
        ctaHref: "/#faq",
        ctaLabel: "Saznaj više",
      }}
      brandsSection={{
        title: "Brendovi zlatnih pločica — evropski premium kvalitet",
        description:
          "Naš asortiman se oslanja na apsolutne lidere u preradi plemenitih metala, čime vam garantujemo sigurnost i laku utrživost svuda u svetu.",
        brands: [
          {
            img: "/images/brands/argor-heraeus.webp",
            title: "Argor-Heraeus",
            origin: "Švajcarska",
            text: "Industrijski standard i jedna od najpouzdanijih svetskih rafinerija. Švajcarska preciznost u svakom detalju — pločice Argor-Heraeusa su sinonim za sigurnost i izuzetno su tražene na celom evropskom tržištu.",
          },
          {
            img: "/images/brands/c-hafner.webp",
            title: "C. Hafner",
            origin: "Nemačka",
            text: "Rafinerija sa tradicijom od preko 170 godina, poznata po besprekornoj izradi i etičkom poreklu zlata — koriste isključivo reciklirano zlato. Nemački premium kvalitet bez kompromisa.",
            imageScale: 0.9,
          },
          {
            img: "/images/brands/logo-royal-mint.webp",
            title: "The Royal Mint",
            origin: "Velika Britanija",
            text: "Zvanična britanska državna kovnica čije pločice nose ogroman istorijski prestiž i autoritet. Jedan od najprepoznatljivijih brendova na globalnom tržištu investicionog zlata.",
          },
        ],
      }}
      delivery={{
        heading: "Prodaja zlatnih pločica Beograd — Gold Invest",
        description:
          "Kupovina pločica za poklon ili investiciju kod nas je brza i potpuno bezbedna. Biramo opciju koja vama najviše odgovara.",
        pickupCardBody:
          "Posetite nas lično u Beogradu. Diskretno okruženje, stručna provera i preuzimanje na licu mesta — bez čekanja.",
      }}
      priceStructure={{
        title: "Zlatne pločice cena — Prodajna / Avansna / Otkupna",
        description:
          "Transparentnost je osnova našeg poslovanja. Uz svaku zlatnu pločicu na sajtu jasno su istaknute tri cene zlata:",
        card1Body:
          "Cena za pločice koje imamo u trezoru. Plaćate i preuzimate ih istog dana — bez čekanja i bez skrivenih troškova.",
        card2Body:
          "Želite više pločica po nižoj ceni? Uplatite iznos unapred, zaključajte trenutnu berzansku cenu i sačekajte isporuku direktno iz kovnice uz značajnu uštedu.",
        card3Body:
          "Iznos po kom Gold Invest otkupljuje vaše pločice. Naše otkupne cene prate svetsku berzu i uvek su javno prikazane — garantovana likvidnost bez iznenađenja.",
      }}
      faq={{
        title: "Česta pitanja o zlatnim pločicama",
        items: FAQ_ITEMS,
      }}
    />
  );
}
