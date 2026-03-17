import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Zlatni dukati i kovanice | Prodaja zlatnih kovanica - Gold Invest",
  description:
    "Kupite zlatne dukate i investicione kovanice — Franc Jozef, Bečka Filharmonija, Maple Leaf, Britannia. LBMA sertifikovani, visoka likvidnost, transparentne cene.",
  alternates: {
    canonical: "https://goldinvest.rs/kategorija/zlatni-dukati",
  },
};

const FAQ_ITEMS = [
  {
    q: "Koja zlatna kovanica je najpopularnija u Srbiji?",
    a: "Franc Jozef dukat je bez konkurencije najpopularnija zlatna kovanica u Srbiji, zahvaljujući dugoj tradiciji koja datira još iz vremena Austro-Ugarske. Posebno je cenjen kao poklonski format — za venčanja, krštenja i jubileje. Od modernih investicionih kovanica, Bečka Filharmonija (Wiener Philharmoniker) je ubedljivo najprodavanija u Evropi.",
  },
  {
    q: "Da li se na zlatne kovanice plaća PDV u Srbiji?",
    a: "Investicione zlatne kovanice čistoće 900/1000 ili više, koje ispunjavaju zakonom propisane uslove, oslobođene su PDV-a u Srbiji. To se odnosi na kovanice poput Franc Jozef dukati, Bečka Filharmonija, Maple Leaf i Britannia. Obratite nam se za potvrdu statusa konkretne kovanice.",
  },
  {
    q: "Koja je razlika između Franc Jozef dukata i modernih investicionih kovanica?",
    a: "Franc Jozef dukat je kovan od zlata čistoće 986/1000 (23,75 karata), dok su moderne investicione kovanice poput Bečke Filharmonije, Maple Leaf-a ili Britannije kovane od zlata čistoće 999,9/1000 (24 karata). Franc Jozef ima visoku kulturnu vrednost i tradiciju, dok moderne kovanice nose nešto nižu premiju pri kupovini i globalnu su prihvaćenost na svim tržištima.",
  },
  {
    q: "Šta je Bečka Filharmonija (Wiener Philharmoniker)?",
    a: "Bečka Filharmonija je austrijska državna zlatna kovanica, kovana od strane Münze Österreich (Bečke kovnice) od 1989. godine. Izrađena je od zlata čistoće 999,9/1000, nominalne vrednosti 100 evra (za 1 oz), i godišnje se nalazi među pet najprodavanijih zlatnih kovanica na svetu. Dostupna je u težinama od 1/25 oz do 1 oz.",
  },
  {
    q: "Da li je Maple Leaf dobra investicija?",
    a: "Kanadski Maple Leaf je jedna od najcenjenijih investicionih kovanica na svetu — kovan od zlata čistoće 999,9/1000, sa dodatnim sigurnosnim elementima poput radial lines dizajna i laserski urezanog mikro teksta. Izuzetno je likvidan na globalnom tržištu i uz minimalan spread otkupljiv svuda u svetu.",
  },
  {
    q: "Kako se čuvaju zlatne kovanice?",
    a: "Zlatne kovanice treba čuvati u originalnoj ambalaži — kapsuli ili tubi. Nikada ne dodirujte površinu kovanice golim rukama (koristite pamučne rukavice ako morate), jer otisci prstiju mogu uzrokovati trajnu koroziju. Za veće kolekcije, preporučujemo čuvanje u bankarskom sefu. Vlaga, direktna svetlost i ekstremne temperature mogu oštetiti izgled kovanice i umanjiti njenu kolekcionarsku vrednost.",
  },
  {
    q: "Koja je razlika između investicione kovanice i numizmatičke kovanice?",
    a: "Investiciona kovanica se kupuje isključivo zbog vrednosti zlata koje sadrži — cena je direktno vezana za cenu zlata na berzi plus mala premija. Numizmatička (kolekcionarska) kovanica ima vrednost koja može biti višestruko veća od vrednosti metala, ali ta vrednost zavisi od tržišta kolekcionara, a ne od cene zlata. Gold Invest se fokusira isključivo na investicione kovanice.",
  },
  {
    q: "Koji format kovanice se najviše isplati?",
    a: "Matematički gledano, kovanica od 1 oz (31,1g) ima najnižu premiju po gramu. Međutim, sa stanovišta fleksibilnosti, kupovina više kovanica od 1/4 oz ili 1/2 oz daje vam mogućnost da prodajete u manjim delovima. Franc Jozef dukat (3,49g) je odličan za poklone i manje uštedine, dok je 1 oz Filharmonija idealna kao osnovna investiciona kovanica.",
  },
  {
    q: "Da li mogu da platim platnom karticom?",
    a: "Ne, plaćanje platnim karticama trenutno nije moguće. Razlog su visoke bankarske provizije koje bi se morale ugraditi u cenu. Prihvatamo isključivo plaćanje gotovinom, bankovnim transferom ili pouzećem, čime vam garantujemo najpovoljniju moguću cenu.",
  },
  {
    q: "Koliko traje isporuka zlatnih kovanica?",
    a: "Za klijente u Beogradu nudimo isporuku dan za dan — ukoliko je porudžbina evidentirana radnim danima do 12h, zlato stiže na vašu adresu istog dana do 18h. Za porudžbine iz ostalih gradova Srbije, diskretna i osigurana dostava traje od 1 do 3 radna dana.",
  },
  {
    q: "Da li otkupljujete zlatne kovanice?",
    a: "Da, Gold Invest otkupljuje sve investicione zlatne kovanice po javno istaknutim otkupnim cenama, uz isplatu istog dana. Bitno je da kovanice budu u originalnoj ambalaži i dobrom stanju. Otkupljujemo i kovanice kupljene kod drugih trgovaca.",
  },
  {
    q: "Koliko košta dostava?",
    a: "Cena bezbedne i osigurane dostave zavisi od vrednosti porudžbine. Kontaktirajte nas na 061 269 8569 ili putem kontakt forme za tačan iznos.",
  },
  {
    q: "Mogu li platiti pouzećem?",
    a: "Da, nudimo i opciju plaćanja pouzećem. Svoju porudžbinu možete platiti kuriru u gotovini pri preuzimanju, uz poštovanje zakonskog limita za keš transakcije.",
  },
  {
    q: "Koja su ograničenja za plaćanje u kešu?",
    a: "Sve transakcije se odvijaju u skladu sa Zakonom o sprečavanju pranja novca. Za gotovinske uplate postoje zakonski limiti (trenutno do 10.000 evra u dinarskoj protivvrednosti), dok se sve kupovine iznad tog iznosa moraju realizovati bezgotovinskim transferom.",
  },
];

// Mock fallback
const MOCK_SNAPSHOT = { id: "mock", xau_usd: 2700, xau_eur: 4375, usd_rsd: 108, eur_rsd: 117.5, price_per_g_rsd: 16500, source: "mock", fetched_at: new Date().toISOString() };
const MOCK_TIERS = [{ id: "t1", name: "default", category: null, min_g: 0, max_g: 99999, margin_stock_pct: 4.5, margin_advance_pct: 3.5, margin_purchase_pct: 2, created_at: "" }];
const MOCK_DUKATI = [
  { id: "d1", product_id: "d1", slug: "franc-jozef-1-dukat", weight_g: 3.49, weight_oz: 0.1123, purity: 0.9860, fine_weight_g: 3.44, sku: null, stock_qty: 10, availability: "in_stock", lead_time_weeks: null, images: ["/images/gold-coins.png"], sort_order: 1, is_active: true, products: { name: "Franc Jozef 1 dukat", brand: "Münze Österreich", origin: "Austrija", category: "dukat" }, pricing_rules: null },
  { id: "d2", product_id: "d2", slug: "franc-jozef-4-dukati", weight_g: 13.96, weight_oz: 0.4492, purity: 0.9860, fine_weight_g: 13.76, sku: null, stock_qty: 5, availability: "in_stock", lead_time_weeks: null, images: ["/images/gold-coins.png"], sort_order: 2, is_active: true, products: { name: "Franc Jozef 4 dukati", brand: "Münze Österreich", origin: "Austrija", category: "dukat" }, pricing_rules: null },
  { id: "d3", product_id: "d3", slug: "becka-filharmonija-1-10-oz", weight_g: 3.11, weight_oz: 0.1, purity: 0.9999, fine_weight_g: 3.11, sku: null, stock_qty: 8, availability: "in_stock", lead_time_weeks: null, images: ["/images/gold-coins.png"], sort_order: 3, is_active: true, products: { name: "Bečka Filharmonija 1/10 oz", brand: "Münze Österreich", origin: "Austrija", category: "kovanica" }, pricing_rules: null },
  { id: "d4", product_id: "d4", slug: "becka-filharmonija-1-4-oz", weight_g: 7.78, weight_oz: 0.25, purity: 0.9999, fine_weight_g: 7.78, sku: null, stock_qty: 6, availability: "in_stock", lead_time_weeks: null, images: ["/images/gold-coins.png"], sort_order: 4, is_active: true, products: { name: "Bečka Filharmonija 1/4 oz", brand: "Münze Österreich", origin: "Austrija", category: "kovanica" }, pricing_rules: null },
  { id: "d5", product_id: "d5", slug: "becka-filharmonija-1-2-oz", weight_g: 15.55, weight_oz: 0.5, purity: 0.9999, fine_weight_g: 15.55, sku: null, stock_qty: 4, availability: "in_stock", lead_time_weeks: null, images: ["/images/gold-coins.png"], sort_order: 5, is_active: true, products: { name: "Bečka Filharmonija 1/2 oz", brand: "Münze Österreich", origin: "Austrija", category: "kovanica" }, pricing_rules: null },
  { id: "d6", product_id: "d6", slug: "becka-filharmonija-1-oz", weight_g: 31.1, weight_oz: 1, purity: 0.9999, fine_weight_g: 31.1, sku: null, stock_qty: 3, availability: "in_stock", lead_time_weeks: null, images: ["/images/gold-coins.png"], sort_order: 6, is_active: true, products: { name: "Bečka Filharmonija 1 oz", brand: "Münze Österreich", origin: "Austrija", category: "kovanica" }, pricing_rules: null },
  { id: "d7", product_id: "d7", slug: "maple-leaf-1-oz", weight_g: 31.1, weight_oz: 1, purity: 0.9999, fine_weight_g: 31.1, sku: null, stock_qty: 3, availability: "in_stock", lead_time_weeks: null, images: ["/images/gold-coins.png"], sort_order: 7, is_active: true, products: { name: "Maple Leaf 1 oz", brand: "Royal Canadian Mint", origin: "Kanada", category: "kovanica" }, pricing_rules: null },
  { id: "d8", product_id: "d8", slug: "britannia-1-oz", weight_g: 31.1, weight_oz: 1, purity: 0.9999, fine_weight_g: 31.1, sku: null, stock_qty: 2, availability: "available_on_request", lead_time_weeks: 1, images: ["/images/gold-coins.png"], sort_order: 8, is_active: true, products: { name: "Britannia 1 oz", brand: "The Royal Mint", origin: "Velika Britanija", category: "kovanica" }, pricing_rules: null },
];

export default async function ZlatniDukatiPage() {
  let variants: any = MOCK_DUKATI;
  let tiers: any = MOCK_TIERS;
  let snapshotRow: any = MOCK_SNAPSHOT;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .in("products.category", ["dukat", "kovanica"])
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

  return (
    <CategoryPageTemplate
      breadcrumbs={[
        { label: "Investiciono zlato", href: "/" },
        { label: "Zlatni dukati i kovanice", href: "/kategorija/zlatni-dukati" },
      ]}
      heroTitle="Zlatni dukati i kovanice"
      heroIntro="Zlatni dukati i investicione kovanice predstavljaju odličan način da uđete u svet investicionog zlata — posebno kao poklon ili za fleksibilno čuvanje vrednosti. Franc Jozef dukati su deo srpske tradicije, a moderne kovanice poput Bečke Filharmonije, Maple Leaf-a i Britannije nude maksimalnu globalnu likvidnost. Sve kovanice u Gold Invest ponudi su originalne, sertifikovane i odmah dostupne. Poruči na 0612698569 ili putem kontakt forme!"
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
        heading: "Koje vrste zlatnih kovanica postoje?",
        description: "Gold Invest nudi pažljivo odabrane zlatne kovanice sa različitim profilima — od tradicionalnih srpskih favorita do modernih investicionih kovanica prihvaćenih svuda u svetu.",
        cards: [
          {
            title: "Franc Jozef dukati — srpska tradicija",
            body: "Najomiljenija zlatna kovanica u Srbiji. Kovan od zlata čistoće 986/1000 (23,75 karata), dostupan u formatu 1 dukat (3,49g) i 4 dukati (13,96g). Idealan poklon za venčanja, krštenja i jubileje, ali i solidan investicioni format za manje iznose.",
          },
          {
            title: "Bečka Filharmonija — evropski investicioni standard",
            body: "Najprodavanija zlatna kovanica u Evropi. Zlato čistoće 999,9/1000 (24 karata), dostupna u težinama od 1/10 oz do 1 oz. Niska premija, visoka likvidnost i prepoznatljivost na celom globalnom tržištu — klasičan investicioni izbor.",
          },
          {
            title: "Maple Leaf i Britannia — globalni favoriti",
            body: "Kanadski Maple Leaf i britanska Britannia su zlatne kovanice čistoće 999,9/1000, prihvaćene na svim finansijskim tržištima sveta. Odlikuju se naprednim sigurnosnim elementima i statusom koji ih čini lako unovčivim u bilo kojoj zemlji.",
          },
        ],
        infoBoxContent: (
          <>
            Ukoliko tražite veće iznose investicionog zlata sa nižom premijom po gramu, preporučujemo da pogledate i{" "}
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
        heading: "Autentičnost i pakovanje zlatnih kovanica",
        description: "Svaka kovanica u Gold Invest ponudi dolazi u originalnoj ambalaži kovnice, sa svim elementima autentičnosti. Pravilno čuvanje kovanice direktno utiče na njenu otkupnu vrednost.",
        headingClassName: "py-1",
        cards: [
          {
            title: "Originalna kapsula ili tuba kovnice",
            body: "Moderne investicione kovanice (Filharmonija, Maple Leaf, Britannia) isporučuju se u zaštitnim kapsulama ili originalnim tubama kovnice, koje garantuju autentičnost i štite površinu od oštećenja.",
          },
          {
            title: "Franc Jozef — originalni papirni certifikat",
            body: "Franc Jozef dukati dolaze sa originalnim papirnim sertifikatom kovnice. Sertifikat potvrđuje čistoću, težinu i autentičnost kovanice, te je važno čuvati ga uz kovanicu za buduću preprodaju.",
          },
          {
            title: "Zlatno pravilo: Ne dodirujte površinu kovanice",
            body: "Otisci prstiju mogu uzrokovati koroziju i trajno umanjiti kolekcionarsku vrednost kovanice. Uvek koristite pamučne rukavice ili hvatajte kovanicu za ivice. Kapsula štiti kovanicu — ne otvarajte je nepotrebno.",
          },
        ],
      }}
      darkQuote={{
        eyebrow: "Tradicija i likvidnost",
        normalText: "Zlatne kovanice spajaju estetiku i vrednost —",
        italicText: "prihvaćene svuda u svetu, dostupne u malim iznosima, a uvek konvertibilne u gotovinu.",
        ctaHref: "/kontakt",
        ctaLabel: "Kontaktirajte nas",
      }}
      brandsSection={{
        title: "Kovnice zlatnih kovanica",
        description: "Gold Invest u ponudi ima isključivo kovanice najeminentnijih svetskih kovnica. Sve kovanice su originalne, dolaze u originalnoj ambalaži i ispunjavaju najstrože investicione standarde:",
        brands: [
          {
            img: "/images/gold-coins.png",
            title: "Münze Österreich (Bečka kovnica)",
            origin: "Austrija",
            text: "Austrija je dom dve najvoljenije zlatne kovanice — Franc Jozef dukati, neodvojivi deo srpske tradicije, i Bečka Filharmonija, najprodavanija zlatna kovanica u Evropi. Münze Österreich kuje zlatne kovanice od 1194. godine.",
            imageMode: "photo",
          },
          {
            img: "/images/gold-coins.png",
            title: "Royal Canadian Mint",
            origin: "Kanada",
            text: "Kanadska Maple Leaf kovanica je jedna od najprepoznatljivijih investicionih kovanica na svetu. Kovana od zlata čistoće 999,9/1000, sa naprednim laserskim sigurnosnim elementima, izuzetno je likvidan i globalno prihvaćen format.",
            imageMode: "photo",
          },
          {
            img: "/images/brands/logo-royal-mint.png",
            title: "The Royal Mint (Kraljevska kovnica)",
            origin: "Velika Britanija",
            text: "Britannia je britanska investiciona kovanica sa tradicijom koja seže u 1987. godinu. Izrađena od zlata čistoće 999,9/1000, nosi autoritet jedne od najstarijih i najuglednijih državnih kovnica na svetu.",
          },
        ],
      }}
      delivery={{
        heading: "Prodaja zlatnih kovanica Beograd — Gold Invest",
        description: "Kupovina zlatnih kovanica zahteva diskreciju i sigurnost. Nudimo više opcija preuzimanja i isporuke — uvek osigurano i neprimetno.",
        pickupCardBody: "Posetite nas na adresi Bulevar oslobođenja 123. Obezbedili smo diskretno okruženje za preuzimanje kovanica i potpisivanje dokumentacije.",
      }}
      priceStructure={{
        title: "Cena zlatnih kovanica — Trenutna / Avansna / Otkupna",
        description: "Kao i kod ostatka našeg asortimana, Gold Invest vam pruža opciju da optimizujete troškove pri kupovini zlatnih kovanica:",
        card1Body: "Plaćate i istog dana preuzimate kovanicu iz našeg trezora (ili vam je šaljemo na adresu).",
        card2Body: "Uplaćujete unapred, zaključavate trenutnu (nižu) cenu i čekate isporuku direktno iz inostrane kovnice. Idealno za veće količine kovanica.",
        card3Body: "Javno istaknuta cena po kojoj Gold Invest garantovano otkupljuje vaše kovanice, uz isplatu istog dana. Otkupljujemo i kovanice kupljene kod drugih trgovaca.",
      }}
      faq={{
        title: "Česta pitanja o zlatnim dukatima i kovanicama",
        items: FAQ_ITEMS,
      }}
    />
  );
}
