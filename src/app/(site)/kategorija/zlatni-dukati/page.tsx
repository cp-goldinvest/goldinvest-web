import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { GOLDINVEST_SITE_ID } from "@/lib/site";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Dukati | Najpovoljnija Cena i Prodaja Zlatnih Dukata - Beograd",
  description:
    "Kupite zlatne dukate - Franc Jozef i Bečka Filharmonija. LBMA sertifikovani, oslobođeni PDV-a, transparentne prodajne i otkupne cene. Dostava za celu Srbiju.",
  alternates: { canonical: "https://goldinvest.rs/kategorija/zlatni-dukati" },
  openGraph: {
    title: "Zlatni dukati - Franc Jozef i Bečka filharmonija | Gold Invest",
    description: "Kupite zlatne dukate - Franc Jozef i Bečka filharmonija. LBMA sertifikovani, oslobođeni PDV-a, transparentne otkupne cene. Dostava po Srbiji.",
    url: "https://goldinvest.rs/kategorija/zlatni-dukati",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Da li se na zlatne dukate plaća porez (PDV)?",
    a: "Ne. U Republici Srbiji se zlatni dukati tretiraju kao investiciono zlato. Da bi kovanica bila oslobođena PDV-a, mora imati finoću jednaku ili veću od 900/1000 i biti iskovana posle 1800. godine. Svi naši dukati (Franc Jozef i Filharmonija) ispunjavaju ove stroge zakonske uslove, što znači da je vaša kupovina u potpunosti oslobođena poreza.",
  },
  {
    q: "Kako su pakovani dukati i da li imaju sertifikat?",
    a: "Za razliku od modernih zlatnih poluga koje se nalaze u plastičnom blister pakovanju, zlatni dukati i kovanice se najčešće pakuju u okrugle zaštitne kapsule (od tvrdog akrila) ili specijalne folije. S obzirom na to da su u pitanju globalno prepoznatljive kovanice iz državnih kovnica, one ne poseduju štampani papirni sertifikat - sam dizajn kovanice, njene precizne dimenzije, težina i zvuk prilikom kuckanja predstavljaju garanciju autentičnosti koju naši stručnjaci lako proveravaju.",
  },
  {
    q: "Šta predstavlja oznaka 999,9?",
    a: "To znači da je vaša moderna investiciona kovanica (poput Bečke Filharmonije) napravljena od 99,99% čistog zlata, što u potpunosti odgovara vrednosti od 24 karata. Napomena: istorijski dukati poput Franca Jozefa imaju nešto manju oznaku 986, jer sadrže minimalan procenat bakra radi čvrstine.",
  },
  {
    q: "Zlatno pravilo - kako čuvati dukate?",
    a: "Nikada nemojte čistiti, polirati, niti brisati dukate abrazivnim sredstvima. Takođe, izbegavajte dodirivanje površine kovanice golim prstima, jer kiseline sa kože mogu ostaviti trajne mrlje. Svaka fizička intervencija, grebanje ili bušenje dukata (kako bi se napravio nakit) trajno mu uništava investicionu vrednost, i takav dukat se prilikom prodaje tretira isključivo kao lomljeno zlato (po osetno nižoj ceni). Čuvajte ih uvek u njihovim originalnim kapsulama.",
  },
  {
    q: "Mogu li da plaćam platnom karticom?",
    a: "Ne, plaćanje platnim karticama trenutno nije moguće. Razlog za to su visoke provizije banaka (često i do 2-3%) koje bi neizbežno morale da se ugrade u krajnju cenu zlata. Naš cilj je da vam obezbedimo najpovoljniju moguću cenu na tržištu bez skrivenih troškova, zbog čega prihvatamo isključivo plaćanje gotovinom, bankovnim transferom ili pouzećem.",
  },
  {
    q: "Koliko traje isporuka?",
    a: "Za klijente u Beogradu nudimo isporuku dan za dan - ukoliko je porudžbina evidentirana radnim danima do 12h, zlato stiže na vašu adresu istog dana do 18h. Za porudžbine iz ostalih gradova Srbije, diskretna i osigurana dostava traje od 1 do 3 radna dana (ovo ne važi za avansne kupovine, za koje se rok isporuke precizno definiše pri samoj kupovini).",
  },
  {
    q: "Koliko košta dostava?",
    a: "Cena bezbedne i osigurane dostave zavisi od vrednosti porudžbine. Kontaktirajte nas na 061 426 4129 ili putem kontakt forme za tačan iznos.",
  },
  {
    q: "Da li otkupljujete dukate koji su kupljeni na drugom mestu?",
    a: "Da, Gold Invest vrši brz i diskretan otkup zlatnih dukata bez obzira gde ste ih i kada kupili. Naši stručnjaci na licu mesta proveravaju težinu i autentičnost kovanice, nakon čega vam novac isplaćujemo istog dana - na bankovni račun ili u gotovini.",
  },
  {
    q: "Koji je limit za plaćanje u gotovini?",
    a: "Kao i kod ostalog investicionog zlata, prema Zakonu o sprečavanju pranja novca, kupovinu zlatnih dukata možete platiti u gotovini do maksimalnog iznosa od 1.160.000 dinara (10.000 evra u protivvrednosti). Sve porudžbine iznad ovog iznosa moraju se platiti isključivo bezgotovinski, preko bankovnog računa.",
  },
  {
    q: "Koja je razlika između zlatne poluge i zlatnog dukata?",
    a: "Zlatne poluge se kuju u različitim gramažama (od 1g do 1kg) isključivo od čistog zlata (24 karata) i fabrički su zapečaćene u blister sertifikate. One su matematički najisplativije za velike investicije. Sa druge strane, dukati (poput Franca Jozefa) imaju istorijski i estetski značaj, ne dolaze u vakuumiranim blisterima, a često su legirani (23.6 karata) kako bi bili čvršći. Dukati su fleksibilniji za unovčavanje manjih iznosa i neuporedivo su popularniji kao poklon.",
  },
  {
    q: "Šta je bolje kupiti - Malog ili Velikog Franca Jozefa?",
    a: "Izbor isključivo zavisi od vašeg budžeta i namene. Mali dukat (3.49g) je najpopularniji izbor za poklone povodom rođenja i krštenja, i nudi odličnu fleksibilnost ako želite da sitnim koracima gradite ušteđevinu. Veliki dukat (13.96g) je impresivnijeg izgleda, vizuelno je mnogo upečatljiviji kao poklon za svadbe i nudi nešto povoljniju cenu po gramu čistog zlata.",
  },
];

export default async function ZlatniDukatiPage() {
  let variants: any = [];
  let tiers: any = [];
  let snapshotRow: any = null;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .in("products.category", ["dukat", "kovanica"])
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
      infoSectionBLayout="premium-bento"
      infoSectionBImageSrc="/images/bento-coins.webp"
      infoSectionBImageAlt="Zlatni dukat"
      breadcrumbs={[
        { label: "Investiciono zlato", href: "/" },
        { label: "Zlatni dukati", href: "/kategorija/zlatni-dukati" },
      ]}
      heroTitle="Dukati"
      heroIntro="Zlatni dukati su najtraženije svetske investicione kovanice, pogotovo čuveni Dukat Franc Jozef i prestižna Bečka Filharmonija. Obezbedili smo vam transparentne cene, oslobođenje od poreza i povoljne otkupne cene. Poruči putem kontakt forme ili na broj 0614264129 - BRZA dostava!"
      heroPills={[
        { label: "Franc Jozef dukat", href: "/kategorija/zlatni-dukati/franc-jozef-dukat" },
        { label: "Bečka filharmonija dukat", href: "/kategorija/zlatni-dukati/becka-filharmonija-dukat" },
      ]}
      variants={variants}
      tiers={tiers}
      snapshot={snapshotRow}
      filterConfig={{
        showCategoryFilter: false,
        weightOptions: [
          { label: "Franc Jozef 1 dukat (3,49g)", value: 3.49 },
          { label: "Franc Jozef 4 dukati (13,96g)", value: 13.96 },
          { label: "Bečka Filharmonija 1/10 oz", value: 3.11 },
          { label: "Bečka Filharmonija 1/4 oz", value: 7.78 },
          { label: "Bečka Filharmonija 1/2 oz", value: 15.55 },
          { label: "Bečka Filharmonija 1 oz", value: 31.1 },
        ],
        priceOptions: [
          { label: "Do 100.000 RSD", value: 100_000 },
          { label: "Do 200.000 RSD", value: 200_000 },
          { label: "Do 300.000 RSD", value: 300_000 },
          { label: "Do 400.000 RSD", value: 400_000 },
          { label: "Do 500.000 RSD", value: 500_000 },
          { label: "Do 600.000 RSD", value: 600_000 },
        ],
      }}
      infoSectionA={{
        heading: "Naša ponuda - Franc Jozef i Bečka Filharmonija",
        description: "Gold Invest podrazumeva i najlikvidnije evropske kovanice, koje kuje čuvena austrijska državna kovnica Münze Österreich. Njihova prepoznatljivost garantuje da ih možete prodati po fer ceni bilo gde u svetu.",
        cards: [
          {
            title: "Dukat Franc Jozef - srpski favorit",
            body: "Ubedljivo najpoznatiji i najtraženiji dukat u Srbiji i regionu. Dostupan u dva formata: mali dukat (3.49g, od čega 3.44g čistog zlata) - izuzetan izbor za poklone i postepenu štednju; i veliki dukat (13.96g, 13.77g čistog zlata) - idealan za ozbiljnija ulaganja. Finoća 986/1000 (23.6 karata) daje mu karakterističnu crvenkasto-zlatnu nijansu i veću otpornost na habanje.",
          },
          {
            title: "Bečka Filharmonija - evropski investicioni standard",
            body: "Wiener Philharmoniker je najprodavanija evropska moderna investiciona kovanica. Kuje se od najčistijeg zlata finoće 999,9 (24 karata). Osnovni format je 1 Troj unca (31.1g) - svetski standard u trgovini zlatom. Za manje budžete postoje frakcije od 1/2, 1/4 i 1/10 unce, što daje odličnu fleksibilnost pri investiranju.",
          },
          {
            title: "Maple Leaf i Britannia - globalni favoriti",
            body: "Kanadski Maple Leaf i britanska Britannia su zlatne kovanice čistoće 999,9/1000, prihvaćene na svim finansijskim tržištima sveta. Odlikuju se naprednim sigurnosnim elementima i statusom koji ih čini lako unovčivim u bilo kojoj zemlji.",
          },
        ],
        infoBoxContent: (
          <>
            Zlatne kovanice (dukati) nose ogromnu tradicionalnu težinu na našim prostorima - apsolutni su standard za darivanje na venčanjima, krštenjima i godišnjicama. Ukoliko tražite veće iznose sa nižom premijom po gramu, pogledajte i{" "}
            <Link
              href="/kategorija/zlatne-plocice"
              className="font-semibold text-[#1B1B1C] underline decoration-[#BEAD87] hover:text-[#BEAD87] transition-colors"
            >
              zlatne pločice
            </Link>
            {" "}ili{" "}
            <Link
              href="/kategorija/zlatne-poluge"
              className="font-semibold text-[#1B1B1C] underline decoration-[#BEAD87] hover:text-[#BEAD87] transition-colors"
            >
              zlatne poluge
            </Link>
            .
          </>
        ),
      }}
      infoSectionB={{
        heading: "Garancija autentičnosti i poreklo zlatnih dukata",
        description: "Za razliku od zlatnih poluga koje poseduju papirne ili plastične sertifikate sa serijskim brojevima, istorijski dukati i investicione kovanice garanciju nose u samom metalu. Naši stručnjaci autentičnost svakog dukata proveravaju kroz tri ključna faktora:",
        headingClassName: "py-1",
        cards: [
          {
            title: "Tačna mikrometarska dimenzija",
            body: "Svaki dukat ili kovanica ima precizno definisan prečnik i debljinu. Odstupanje i od stotinke milimetra otkriva falsifikat. Ova provera se obavlja na licu mesta, pre svake kupovine i otkupa.",
          },
          {
            title: "Precizna gramaža",
            body: "Težina se meri do u stoti deo grama na kalibriranoj analitičkoj vagi. Franc Jozef 1 dukat tačno iznosi 3.49g, a 4 dukati 13.96g. Svako odstupanje je odmah vidljivo i diskvalifikuje kovanicu.",
          },
          {
            title: "Specifična rezonanca - zvuk čistog zlata",
            body: "Čisto zlato prilikom laganog kuckanja proizvodi karakteristični zvuk koji se jasno razlikuje od legura i falsifikata. Vaš dukat dobijate bezbedno upakovan u zaštitnu akrilnu kapsulu koja čuva njegovu investicionu vrednost.",
          },
        ],
      }}
      darkQuote={{
        eyebrow: "Poklon i investicija",
        normalText: "Zlatni dukat nije samo poklon -",
        italicText: "to je trajna finansijska sigurnost koju prenosite na sledeću generaciju, a koja odoleva inflaciji.",
        ctaHref: "/kontakt",
        ctaLabel: "Kontaktirajte nas",
      }}
      brandsSection={{
        title: "Kovnice zlatnih kovanica",
        description: "Gold Invest u ponudi ima isključivo kovanice najeminentnijih svetskih kovnica. Sve kovanice su originalne, dolaze u originalnoj ambalaži i ispunjavaju najstrože investicione standarde:",
        brands: [
          {
            img: "/images/gold-coins.webp",
            title: "Münze Österreich (Bečka kovnica)",
            origin: "Austrija",
            text: "Austrija je dom dve najvoljenije zlatne kovanice - Franc Jozef dukati, neodvojivi deo srpske tradicije, i Bečka Filharmonija, najprodavanija zlatna kovanica u Evropi. Münze Österreich kuje zlatne kovanice od 1194. godine.",
            imageMode: "photo",
          },
          {
            img: "/images/gold-coins.webp",
            title: "Royal Canadian Mint",
            origin: "Kanada",
            text: "Kanadska Maple Leaf kovanica je jedna od najprepoznatljivijih investicionih kovanica na svetu. Kovana od zlata čistoće 999,9/1000, sa naprednim laserskim sigurnosnim elementima, izuzetno je likvidan i globalno prihvaćen format.",
            imageMode: "photo",
          },
          {
            img: "/images/brands/logo-royal-mint.webp",
            title: "The Royal Mint (Kraljevska kovnica)",
            origin: "Velika Britanija",
            text: "Britannia je britanska investiciona kovanica sa tradicijom koja seže u 1987. godinu. Izrađena od zlata čistoće 999,9/1000, nosi autoritet jedne od najstarijih i najuglednijih državnih kovnica na svetu.",
          },
        ],
      }}
      delivery={{
        heading: "Prodaja dukata Beograd - Gold Invest",
        description: "Kupovina dukata se može obaviti lično u Beogradu, uz isporuku za isti dan ili dostavu za celu Srbiju - uvek diskretno i osigurano.",
        pickupCardBody: "Posetite nas lično u Beogradu. Obezbedili smo potpuno sigurno i diskretno okruženje za preuzimanje vaših dukata bez čekanja.",
      }}
      priceStructure={{
        title: "Zlatni dukati cena - Trenutna / Avansna / Otkupna",
        description: "Kao ozbiljna trgovačka kuća, Gold Invest vam jasno komunicira sve cene i opcije kupovine:",
        card1Body: "Cena dukata koje imamo fizički na stanju. Plaćate i preuzimate odmah, bez ikakvog čekanja.",
        card2Body: "Želite da kupite veću količinu dukata? Avansna uplata vam omogućava da zaključate trenutnu berzansku cenu, a mi robu povlačimo direktno iz bečke kovnice uz značajnu uštedu.",
        card3Body: "Zahvaljujući ogromnoj popularnosti Franca Jozefa i Filharmonije, spread između kupovne i prodajne cene je minimalan - brz povrat investicije po javno istaknutim cenama, uz isplatu istog dana.",
      }}
      faq={{
        title: "Česta pitanja o zlatnim dukatima",
        items: FAQ_ITEMS,
      }}
    />
  );
}
