import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Truck, ShieldCheck, Info } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { SeoSection } from "@/components/catalog/SeoSection";
import { BrandCardsSection } from "@/components/catalog/BrandCardsSection";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Zlatne poluge | Prodaja zlatnih poluga - Najpovoljnija Cena",
  description:
    "Kupite LBMA sertifikovane zlatne poluge čistoće 999,9 — Argor-Heraeus, C. Hafner, The Royal Mint. Transparentne prodajne, avansne i otkupne cene. Dostava za celu Srbiju.",
  alternates: {
    canonical: "https://goldinvest.rs/kategorija/zlatne-poluge",
  },
};

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Zlatne poluge", href: "/kategorija/zlatne-poluge" },
];

const INTRO_FULL = `Zlatne poluge su najsigurniji način da zaštitite veći kapital od inflacije i ekonomskih potresa. Naša ponuda obuhvata isključivo LBMA sertifikovane poluge finoće 999,9, poznatih svetskih kovnica. Obezbedili smo vam transparentne cene za trenutnu i avansnu kupovinu, uz garantovan i siguran otkup. Poruči putem kontakt forme ili na broj 0612698569 - BRZA dostava!`;

const CATEGORY_PILLS = [
  { label: "Pločice 1g–20g", href: "/kategorija/zlatne-plocice", active: false },
  { label: "Poluge 50g–1kg", href: "/kategorija/zlatne-poluge", active: true },
  { label: "Dukati i kovanice", href: "/kategorija/zlatni-dukati", active: false },
];

const FAQ_ITEMS = [
  {
    q: "Koja zlatna poluga se najviše isplati za kupovinu?",
    a: "Matematički gledano, najviše se isplati poluga od 1 kilograma, jer nosi ubedljivo najmanje troškove proizvodnje (premiju) po gramu. Međutim, sa stanovišta fleksibilnosti, investitori se najčešće odlučuju za kupovinu više poluga od 100g. Na taj način, ukoliko im iznenada zatreba gotovina, mogu prodati samo jednu polugu od 100g, umesto da moraju da prodaju celu polugu od kilograma.",
  },
  {
    q: "Da li se na zlatne poluge plaća porez u Srbiji?",
    a: "Ne. U skladu sa Zakonom o PDV-u, promet investicionim zlatnim polugama čistoće jednake ili veće od 995/1000 u potpunosti je oslobođen plaćanja poreza na dodatu vrednost (PDV). Takođe, oslobođeni ste i poreza na kapitalnu dobit prilikom kasnije prodaje.",
  },
  {
    q: "Šta znači LBMA oznaka proizvođača?",
    a: "LBMA (London Bullion Market Association) je najviše globalno telo koje kontroliše tržište plemenitih metala. Kada kovnica iz koje potiče vaše zlato ima LBMA sertifikat (odnosno nalazi se na njihovoj Good Delivery listi), to je apsolutna garancija da ta zlatna poluga ispunjava najstrože svetske standarde po pitanju tačne težine, čistoće i legalnog (etičkog) porekla metala.",
  },
  {
    q: "Šta predstavlja oznaka 999,9?",
    a: "Oznaka 999,9 (često nazivana i četiri devetke) predstavlja maksimalan nivo čistoće investicionog zlata koji se može postići u rafinerijskoj obradi. To znači da je vaša poluga ili pločica napravljena od 99,99% čistog zlata, što u potpunosti odgovara vrednosti od 24 karata.",
  },
  {
    q: "Mogu li da plaćam platnom karticom?",
    a: "Ne, plaćanje platnim karticama trenutno nije moguće. Razlog za to su visoke provizije banaka (često i do 2-3%) koje bi neizbežno morale da se ugrade u krajnju cenu zlata. Naš cilj je da vam obezbedimo najpovoljniju moguću cenu na tržištu bez skrivenih troškova, zbog čega prihvatamo isključivo plaćanje gotovinom, bankovnim transferom ili pouzećem.",
  },
  {
    q: "Da li je zlato sertifikovano?",
    a: "Da, svaki komad zlata iz našeg asortimana je strogo sertifikovan. Kod modernih zlatnih poluga i pločica, samo čvrsto sigurnosno pakovanje (blister) u kojem se nalaze zapravo predstavlja sertifikat. Na njemu su jasno utisnuti naziv rafinerije, oznaka čistoće, težina i jedinstveni serijski broj koji se uvek mora poklapati sa brojem laserski urezanim na samoj poluzi.",
  },
  {
    q: "Gde je najbezbednije čuvati veće zlatne poluge?",
    a: "Zbog velike vrednosti, zlatne poluge od 250g, 500g i 1kg se najređe čuvaju u kućnim uslovima. Apsolutna preporuka stručnjaka je zakup sefa u nekoj od poslovnih banaka u Srbiji. Zakup bankarskog sefa je vrlo pristupačan (iznosi svega nekoliko hiljada dinara na godišnjem nivou), a pruža vam maksimalnu fizičku i pravnu sigurnost.",
  },
  {
    q: "Šta se dešava ako oštetim pakovanje (sertifikat) zlatne poluge?",
    a: "Ovo je najvažnije pravilo! Nikada ne otvarajte zaštitno blister pakovanje! Pakovanje garantuje da poluga nije kompromitovana. Ukoliko polugu izvadite iz plastike, ona i dalje sadrži istu količinu zlata, ali gubi svoj LBMA investicioni status. Prilikom otkupa takve poluge, trgovci moraju da rade ponovnu fizičku proveru autentičnosti, zbog čega će vam biti ponuđena niža otkupna cena od redovne.",
  },
  {
    q: "Da li mogu da fizički presečem ili podelim zlatnu polugu?",
    a: "Ne, investicione zlatne poluge se nikada ne smeju seći, topiti niti fizički deliti. Bilo kakva fizička intervencija trajno uništava investicioni status poluge i njenu vrednost svodi na vrednost lomljenog zlata, koje je znatno jeftinije. Ukoliko smatrate da će vam kapital biti potreban u delovima, savetujemo kupovinu više manjih poluga.",
  },
  {
    q: "Kako da prodam svoju zlatnu polugu?",
    a: "Donesite svoju polugu u originalnom pakovanju, naši stručnjaci će obaviti vizuelnu proveru serijskih brojeva i stanja, a novac (po jasno istaknutim otkupnim cenama sa sajta) vam se isplaćuje istog dana na račun ili u gotovini. Otkupljujemo i poluge koje ste kupili kod drugih trgovaca.",
  },
  {
    q: "Koja su ograničenja za plaćanje u kešu?",
    a: "Svako fizičko lice može slobodno i legalno kupovati investiciono zlato. Važno je napomenuti da se sve transakcije odvijaju u potpunosti u skladu sa Zakonom o sprečavanju pranja novca i finansiranja terorizma u Republici Srbiji. Za gotovinske uplate postoje određeni zakonski limiti (trenutno do 10.000 evra u dinarskoj protivvrednosti za keš transakcije), dok se sve kupovine iznad tog iznosa obavezno moraju realizovati bezgotovinski.",
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
    q: "Mogu li platiti pouzećem?",
    a: "Da, nudimo i opciju plaćanja pouzećem. Svoju porudžbinu možete platiti kuriru u gotovini tek prilikom preuzimanja osiguranog paketa na vašoj adresi, uz strogo poštovanje gore navedenog zakonskog limita za keš transakcije.",
  },
  {
    q: "Da li fizička lica mogu kupovati investiciono zlato bez ograničenja?",
    a: "Da, svako fizičko lice može slobodno i legalno kupovati investiciono zlato. Važno je napomenuti da se sve transakcije odvijaju u potpunosti u skladu sa Zakonom o sprečavanju pranja novca i finansiranja terorizma u Republici Srbiji. To podrazumeva da za gotovinske uplate postoje određeni zakonski limiti (trenutno do 10.000 evra u dinarskoj protivvrednosti za keš transakcije), dok se sve kupovine iznad tog iznosa obavezno moraju realizovati bezgotovinski, odnosno transferom novca sa računa klijenta na račun Gold Invest-a, čime se obezbeđuje potpuna transparentnost i sigurnost obe strane.",
  },
];

// Mock fallback (isti pattern kao homepage)
const MOCK_SNAPSHOT = { id: "mock", xau_usd: 2700, xau_eur: 4375, usd_rsd: 108, eur_rsd: 117.5, price_per_g_rsd: 16500, source: "mock", fetched_at: new Date().toISOString() };
const MOCK_TIERS = [{ id: "t1", name: "default", category: null, min_g: 0, max_g: 99999, margin_stock_pct: 4.5, margin_advance_pct: 3.5, margin_purchase_pct: 2, created_at: "" }];
const MOCK_POLUGE = [
  { id: "p1", product_id: "p1", slug: "zlatna-poluga-1-unca-argor", weight_g: 31.1, weight_oz: 1, purity: 0.9999, fine_weight_g: 31.1, sku: null, stock_qty: 4, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 1, is_active: true, products: { name: "Zlatna poluga 1 unca", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p2", product_id: "p2", slug: "zlatna-poluga-50g-umicore", weight_g: 50, weight_oz: 1.607, purity: 0.9999, fine_weight_g: 50, sku: null, stock_qty: 2, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 2, is_active: true, products: { name: "Zlatna poluga 50g", brand: "Umicore", origin: "Belgija", category: "poluga" }, pricing_rules: null },
  { id: "p3", product_id: "p3", slug: "zlatna-poluga-100g-argor", weight_g: 100, weight_oz: 3.215, purity: 0.9999, fine_weight_g: 100, sku: null, stock_qty: 3, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 3, is_active: true, products: { name: "Zlatna poluga 100g", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p4", product_id: "p4", slug: "zlatna-poluga-250g-argor", weight_g: 250, weight_oz: 8.037, purity: 0.9999, fine_weight_g: 250, sku: null, stock_qty: 1, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 4, is_active: true, products: { name: "Zlatna poluga 250g", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p5", product_id: "p5", slug: "zlatna-poluga-500g-argor", weight_g: 500, weight_oz: 16.075, purity: 0.9999, fine_weight_g: 500, sku: null, stock_qty: 1, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 5, is_active: true, products: { name: "Zlatna poluga 500g", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p6", product_id: "p6", slug: "zlatna-poluga-1kg-argor", weight_g: 1000, weight_oz: 32.151, purity: 0.9999, fine_weight_g: 1000, sku: null, stock_qty: 1, availability: "available_on_request", lead_time_weeks: 1, images: ["/images/product-poluga.png"], sort_order: 6, is_active: true, products: { name: "Zlatna poluga 1kg", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
];

export default async function ZlatnePolugePage() {
  let variants: any = MOCK_POLUGE;
  let tiers: any = MOCK_TIERS;
  let snapshotRow: any = MOCK_SNAPSHOT;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("products.category", "poluga")
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
    <main className="bg-white">
      {/* Breadcrumb — above hero */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <Breadcrumb items={BREADCRUMBS} variant="light" />
        </div>
      </section>

      {/* Hero — homepage style */}
      <CategoryHero
        title="Zlatne poluge"
        introFull={INTRO_FULL}
        pills={[]}
        introMaxWidth="none"
        centerOnDesktop
      />

      {/* Products + Filter/Sort */}
      <section className="bg-white py-12">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8">
          <ProductGrid
            variants={variants as any}
            tiers={tiers}
            snapshot={snapshotRow}
            filterConfig={{
              showCategoryFilter: false,
              weightOptions: [
                { label: "Zlatna poluga 1 unca", value: 31.1 },
                { label: "Zlatna poluga 50g", value: 50 },
                { label: "Zlatna poluga 100g", value: 100 },
                { label: "Zlatna poluga 250g", value: 250 },
                { label: "Zlatna poluga 500g", value: 500 },
                { label: "Zlatna poluga 1kg", value: 1000 },
              ],
              priceOptions: [
                { label: "Do 600.000 RSD", value: 600_000 },
                { label: "Do 800.000 RSD", value: 800_000 },
                { label: "Do 1.000.000 RSD", value: 1_000_000 },
                { label: "Do 1.200.000 RSD", value: 1_200_000 },
                { label: "Do 1.500.000 RSD", value: 1_500_000 },
                { label: "Do 2.000.000 RSD", value: 2_000_000 },
              ],
            }}
          />
        </div>
      </section>

      {/* Težine poluga — u stilu sajta (heading + 3 kartice) */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="text-left md:text-center mb-12">
            <h2
              className="text-[#1B1B1C] mb-4"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontWeight: 500,
                fontSize: 30,
                lineHeight: "27px",
                letterSpacing: "-1px",
              }}
            >
              Koje težine zlatnih poluga postoje?
            </h2>
            <p
              className="max-w-[780px] md:mx-auto md:text-center"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontWeight: 400,
                fontSize: 17,
                lineHeight: "22px",
                letterSpacing: 0,
                color: "#9D9072",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              U Gold Invest asortimanu nalaze se isključivo investicione poluge maksimalne čistoće od 99.99% (24 karata). Evo jednostavnog pregleda formata — od fleksibilnih manjih težina do poluga za ozbiljne investitore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
              <p className="text-[#1B1B1C] text-[15px] font-semibold mb-2 leading-snug">
                Manje težine (1g, 2g, 5g, 10g i 20g){" "}
                <span className="font-normal text-[#6B6B6B]">— </span>
                <Link
                  href="/kategorija/zlatne-plocice"
                  className="font-semibold text-[#1B1B1C] underline decoration-[#BEAD87] hover:text-[#BEAD87] transition-colors"
                >
                  Zlatne pločice
                </Link>
              </p>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                Savršen način da započnete investicionu priču ili obezbedite najvredniji poklon. Premija po gramu je nešto viša, ali dobijate maksimalnu fleksibilnost — kada vam zatreba gotovina, prodajete samo manju polugu.
              </p>
            </div>

            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
              <p className="text-[#1B1B1C] text-[15px] font-semibold mb-2 leading-snug">
                Srednje poluge (50g i 100g) — zlatna sredina
              </p>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                Najtraženiji format na tržištu. Poluga od 100g je čest izbor kao odličan balans: niža premija po gramu i odlična likvidnost — kapital možete prodavati u delovima.
              </p>
            </div>

            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
              <p className="text-[#1B1B1C] text-[15px] font-semibold mb-2 leading-snug">
                Velike poluge (250g, 500g i 1kg)
              </p>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                Za ozbiljne investitore. Kupovinom 500g ili 1kg dobijate najnižu cenu po gramu. Zbog specifične gustine zlata, čak i poluga od 1kg je manja od prosečnog mobilnog telefona — praktična za čuvanje u bankarskom sefu.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-[920px] md:mx-auto">
            <div className="bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-5 sm:px-7 sm:py-6 flex gap-4 items-start">
              <span className="mt-0.5 w-10 h-10 rounded-xl bg-[#1B1B1C] text-white flex items-center justify-center shrink-0">
                <Info size={18} />
              </span>
              <p
                className="text-[#3A3A3A] leading-relaxed mb-0 text-left md:text-center md:mx-auto"
                style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16, lineHeight: "1.6em" }}
              >
                Ukoliko vam zatreba manji iznos gotovine, možete prodati samo polugu od 5g ili 10g. Takođe, ukoliko tražite tradicionalniji format za poklon ili čuvanje vrednosti, preporučujemo da pogledate i{" "}
                <Link
                  href="/kategorija/zlatni-dukati"
                  className="font-semibold text-[#1B1B1C] underline decoration-[#BEAD87] hover:text-[#BEAD87] transition-colors"
                >
                  zlatne dukate
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sertifikati — kao homepage "Od čega se sastoji cena?" (3 kartice, bez slika) */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          {/* Heading — left on mobile, centered on desktop */}
          <div className="text-left md:text-center mb-12 py-1">
            <h2
              className="text-[#1B1B1C] mb-4"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontWeight: 500,
                fontSize: 30,
                lineHeight: "27px",
                letterSpacing: "-1px",
              }}
            >
              Sertifikati i LBMA standard zlatnih poluga
            </h2>
            <p
              className="max-w-[780px] md:mx-auto md:text-center"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontWeight: 400,
                fontSize: 17,
                lineHeight: "22px",
                letterSpacing: 0,
                color: "#9D9072",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Svaka zlatna poluga u Gold Invest ponudi dolazi isključivo iz najprestižnijih svetskih rafinerija i poseduje LBMA (London Bullion Market Association) sertifikat — garanciju da kupujete zlato najvišeg ranga, priznato i lako naplativo svuda u svetu.
            </p>
          </div>

          {/* 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
              <p className="text-[#1B1B1C] text-[15px] font-semibold mb-2 leading-snug">
                Šta vama donosi LBMA Good Delivery status?
              </p>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                To nije samo prestižna oznaka, već najrigoroznija globalna garancija kvaliteta — potvrda čistoće, tačne gramaže i strogo kontrolisanog, etičkog porekla metala.
              </p>
            </div>

            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
              <p className="text-[#1B1B1C] text-[15px] font-semibold mb-2 leading-snug">
                Gde se nalazi sertifikat moje poluge?
              </p>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                Kod modernih poluga, sertifikat je sigurnosno blister pakovanje. Na njemu su logo kovnice, težina, čistoća i serijski broj — koji mora da se poklapa sa brojem urezanim na samoj poluzi.
              </p>
            </div>

            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
              <p className="text-[#1B1B1C] text-[15px] font-semibold mb-2 leading-snug">
                Zlatno pravilo (Upozorenje): Ne otvarajte ambalažu
              </p>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                Čak i najmanje oštećenje blistera može trajno poništiti investicioni status poluge. Ako se poluga izvadi, pri otkupu se cena obara jer zahteva skupe provere autentičnosti pre pretapanja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark quote — LBMA / sertifikati */}
      <section className="bg-[#0D0D0D] py-16 sm:py-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 flex flex-col items-start text-left md:items-center md:text-center">
            <span className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-6 block">
              Garancija kvaliteta
            </span>
            <h2
              className="text-white leading-[1.15] mb-10 max-w-[820px]"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontSize: "clamp(22px, 3.2vw, 42px)",
                fontWeight: 400,
              }}
            >
              <span style={{ fontStyle: "normal" }}>
                LBMA sertifikat nije samo oznaka,
              </span>
              <br />
              <span style={{ fontStyle: "italic" }}>
                {" "}to je najstroža globalna garancija da vaša poluga ima besprekornu čistoću i priznata je svuda u svetu.
              </span>
            </h2>

            <Link
              href="/#faq"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: "#BEAD87",
                fontSize: "12.1px",
                boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
              }}
            >
              Saznaj više
            </Link>
        </div>
      </section>

      <BrandCardsSection
        title="Brendovi zlatnih poluga"
        description={'Gold Invest u ponudi ima isključivo proizvode najeminentnijih evropskih kovnica sa LBMA "Good Delivery" sertifikatom. Naš asortiman se oslanja na apsolutne lidere u preradi plemenitih metala:'}
        brands={[
          {
            img: "/images/brands/argor-heraeus.png",
            title: "Argor-Heraeus",
            origin: "Švajcarska",
            text: "Švajcarska preciznost i industrijski standard. Jedna od najvećih i najpouzdanijih svetskih rafinerija, čije su poluge sinonim za sigurnost i izuzetno su tražene na celom evropskom tržištu.",
          },
          {
            img: "/images/brands/c-hafner.png",
            title: "C. Hafner",
            origin: "Nemačka",
            text: "Nemački premium kvalitet bez kompromisa. Rafinerija sa tradicijom dugom preko 170 godina, poznata po najvišim tehnološkim standardima i besprekornoj izradi. Njihove poluge ulivaju ogromno poverenje tradicionalnim investitorima.",
            imageScale: 0.9,
          },
          {
            img: "/images/brands/logo-royal-mint.png",
            title: "The Royal Mint (Kraljevska kovnica)",
            origin: "Velika Britanija",
            text: "Britanski prestiž. Zvanična državna kovnica Velike Britanije i jedna od najstarijih i najuglednijih institucija na svetu. Njihove investicione poluge predstavljaju sam vrh globalnog tržišta i nose dodatnu težinu istorijskog autoriteta.",
          },
        ]}
      />

      {/* Prodaja / isporuka — 3 kartice (vizuelno, u stilu sajta) */}
      <section className="bg-[#F9F9F9] py-16 sm:py-20 border-t border-[#F0EDE6]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="text-left md:text-center mb-12">
            <h2
              className="text-[#1B1B1C] mb-4"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontWeight: 500,
                fontSize: 30,
                lineHeight: "27px",
                letterSpacing: "-1px",
              }}
            >
              Prodaja zlatnih poluga Beograd — Gold Invest
            </h2>
            <p
              className="max-w-[780px] md:mx-auto md:text-center"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontWeight: 400,
                fontSize: 17,
                lineHeight: "22px",
                letterSpacing: 0,
                color: "#9D9072",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Kupovina investicionih poluga zahteva maksimalnu diskreciju, sigurnost i profesionalizam. Zato nudimo više opcija preuzimanja i isporuke — uvek osigurano i neprimetno.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-xl bg-[#1B1B1C] text-white flex items-center justify-center">
                  <MapPin size={18} />
                </span>
                <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-0">
                  Lično preuzimanje (Beograd)
                </p>
              </div>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                Posetite nas na adresi Bulevar oslobođenja 123. Obezbedili smo diskretno okruženje za preuzimanje poluga i potpisivanje dokumentacije.
              </p>
            </div>

            <div className="bg-white border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-xl bg-[#1B1B1C] text-white flex items-center justify-center">
                  <Truck size={18} />
                </span>
                <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-0">
                  Beograd — dan za dan
                </p>
              </div>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                Za porudžbine evidentirane radnim danima do 12h, isporuka na adresu istog dana do 18h (dan za dan).
              </p>
            </div>

            <div className="bg-white border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-xl bg-[#1B1B1C] text-white flex items-center justify-center">
                  <ShieldCheck size={18} />
                </span>
                <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-0">
                  Isporuka za celu Srbiju
                </p>
              </div>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                Maksimalno osigurana, potpuno neprimetna pošiljka — rok isporuke 1 do 3 radna dana (avansne kupovine po dogovoru).
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-center">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: "#BEAD87",
                fontSize: "12.1px",
                boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
              }}
            >
              Kontakt forma
            </Link>
            <a
              href="tel:+381612698569"
              className="inline-flex items-center justify-center px-7 py-3 rounded-full font-semibold transition-all duration-200"
              style={{
                border: "0.5px solid #1B1B1C",
                color: "#1B1B1C",
                fontSize: "12.1px",
              }}
            >
              Pozovi: 061/269-8569
            </a>
          </div>
        </div>
      </section>

      {/* Cena — 3 koraka (Trenutna / Avansna / Otkupna) */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="text-left md:text-center mb-12">
            <h2
              className="text-[#1B1B1C] mb-4"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontWeight: 500,
                fontSize: 30,
                lineHeight: "27px",
                letterSpacing: "-1px",
              }}
            >
              Cena zlatnih poluga — Trenutna / Avansna / Otkupna
            </h2>
            <p
              className="max-w-[780px] md:mx-auto md:text-center"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontWeight: 400,
                fontSize: 17,
                lineHeight: "22px",
                letterSpacing: 0,
                color: "#9D9072",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Kao i kod ostatka našeg asortimana, Gold Invest vam pruža opciju da optimizujete svoje troškove kada je u pitanju kupovina zlatnih poluga:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1 */}
            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1B1B1C] text-white text-sm font-semibold">
                  1
                </span>
                <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-0">
                  Trenutna kupovina (Roba na stanju)
                </p>
              </div>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                Plaćate i istog dana preuzimate polugu iz našeg trezora (ili vam je šaljemo na adresu).
              </p>
            </div>

            {/* 2 */}
            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1B1B1C] text-white text-sm font-semibold">
                  2
                </span>
                <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-0">
                  Avansna kupovina (Najbolja cena zlata)
                </p>
              </div>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                Uplaćujete unapred, zaključavate trenutnu (nižu) cenu i čekate isporuku direktno iz inostrane kovnice. Za velike iznose, ušteda može biti izuzetno značajna.
              </p>
            </div>

            {/* 3 */}
            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#1B1B1C] text-white text-sm font-semibold">
                  3
                </span>
                <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-0">
                  Otkupna cena (Garantovana likvidnost)
                </p>
              </div>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                Ovo je javno istaknuta cena po kojoj Gold Invest garantovano otkupljuje vaše poluge, uz isplatu istog dana. Spread (razlika prodajne i otkupne) je kod poluga najniži — investicija brže prelazi u profit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ — homepage FaqSection style */}
      <CategoryFaq
        title="Česta pitanja o zlatnim polugama"
        items={FAQ_ITEMS}
        ctaHref="/#faq"
        ctaLabel="Pogledaj sva pitanja"
      />

      {/* CTA — iznad footera */}
      <WhatIsGoldSection />
    </main>
  );
}
