import type { Metadata } from "next";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import { CategoryPageTemplate } from "@/components/catalog/CategoryPageTemplate";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Zlatne poluge | Prodaja zlatnih poluga - Najpovoljnija Cena",
  description:
    "Kupite LBMA sertifikovane zlatne poluge čistoće 999,9 - Argor-Heraeus, C. Hafner, The Royal Mint. Transparentne prodajne, avansne i otkupne cene. Dostava za celu Srbiju.",
  alternates: { canonical: "https://goldinvest.rs/kategorija/zlatne-poluge" },
  openGraph: {
    title: "Zlatne poluge - LBMA sertifikovane, čistoća 999,9 | Gold Invest",
    description: "Kupite zlatne poluge od 1 unce do 1 kg - Argor-Heraeus, C. Hafner, The Royal Mint. Bez PDV-a, transparentne cene, dostava po Srbiji.",
    url: "https://goldinvest.rs/kategorija/zlatne-poluge",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

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
    a: "Za klijente u Beogradu nudimo isporuku dan za dan - ukoliko je porudžbina evidentirana radnim danima do 12h, zlato stiže na vašu adresu istog dana do 18h. Za porudžbine iz ostalih gradova Srbije, diskretna i osigurana dostava traje od 1 do 3 radna dana (ovo ne važi za avansne kupovine, za koje se rok isporuke precizno definiše pri samoj kupovini).",
  },
  {
    q: "Koliko košta dostava?",
    a: "Cena bezbedne i osigurane dostave zavisi od težine i vrednosti porudžbine. Kontaktirajte nas na 061 426 4129 ili putem kontakt forme za tačan iznos.",
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


export default async function ZlatnePolugePage() {
  let variants: any = [];
  let tiers: any = [];
  let snapshotRow: any = null;

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
      infoSectionBImageSrc="/images/bento-gold-bar.webp"
      infoSectionBImageAlt="Zlatna poluga"
      breadcrumbs={[
        { label: "Investiciono zlato", href: "/" },
        { label: "Zlatne poluge", href: "/kategorija/zlatne-poluge" },
      ]}
      heroTitle="Zlatne poluge"
      heroIntro="Zlatne poluge su najsigurniji način da zaštitite veći kapital od inflacije i ekonomskih potresa. Naša ponuda obuhvata isključivo LBMA sertifikovane poluge finoće 999,9, poznatih svetskih kovnica. Obezbedili smo vam transparentne cene za trenutnu i avansnu kupovinu, uz garantovan i siguran otkup. Poruči putem kontakt forme ili na broj 0614264129 - BRZA dostava!"
      heroPills={[
        { label: "1 unca zlata (zlatna poluga 1 unca)", href: "/kategorija/zlatne-poluge/zlatna-poluga-1-unca" },
        { label: "Zlatna poluga 50 g", href: "/kategorija/zlatne-poluge/zlatna-poluga-50g" },
        { label: "Zlatna poluga 100 grama", href: "/kategorija/zlatne-poluge/zlatna-poluga-100g" },
        { label: "Zlatna poluga 250 g", href: "/kategorija/zlatne-poluge/zlatna-poluga-250g" },
        { label: "Zlatna poluga 500 grama", href: "/kategorija/zlatne-poluge/zlatna-poluga-500g" },
        { label: "Zlatna poluga 1 kg", href: "/kategorija/zlatne-poluge/zlatna-poluga-1kg" },
      ]}
      variants={variants}
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
      infoSectionA={{
        heading: "Koje težine zlatnih poluga postoje?",
        description: "U Gold Invest asortimanu nalaze se isključivo investicione poluge maksimalne čistoće od 99.99% (24 karata). Evo jednostavnog pregleda formata - od fleksibilnih manjih težina do poluga za ozbiljne investitore.",
        cards: [
          {
            title: (
              <>
                Manje težine (1g, 2g, 5g, 10g i 20g){" "}
                <span className="font-normal text-[#6B6B6B]">- </span>
                <Link
                  href="/kategorija/zlatne-plocice"
                  className="font-semibold text-[#1B1B1C] underline decoration-[#BEAD87] hover:text-[#BEAD87] transition-colors"
                >
                  Zlatne pločice
                </Link>
              </>
            ),
            body: "Savršen način da započnete investicionu priču ili obezbedite najvredniji poklon. Premija po gramu je nešto viša, ali dobijate maksimalnu fleksibilnost - kada vam zatreba gotovina, prodajete samo manju polugu.",
          },
          {
            title: "Srednje poluge (50g i 100g) - zlatna sredina",
            body: "Najtraženiji format na tržištu. Poluga od 100g je čest izbor kao odličan balans: niža premija po gramu i odlična likvidnost - kapital možete prodavati u delovima.",
          },
          {
            title: "Velike poluge (250g, 500g i 1kg)",
            body: "Za ozbiljne investitore. Kupovinom 500g ili 1kg dobijate najnižu cenu po gramu. Zbog specifične gustine zlata, čak i poluga od 1kg je manja od prosečnog mobilnog telefona - praktična za čuvanje u bankarskom sefu.",
          },
        ],
        infoBoxContent: (
          <>
            Ukoliko vam zatreba manji iznos gotovine, možete prodati samo polugu od 5g ili 10g. Takođe, ukoliko tražite tradicionalniji format za poklon ili čuvanje vrednosti, preporučujemo da pogledate i{" "}
            <Link
              href="/kategorija/zlatni-dukati"
              className="font-semibold text-[#1B1B1C] underline decoration-[#BEAD87] hover:text-[#BEAD87] transition-colors"
            >
              zlatne dukate
            </Link>
            .
          </>
        ),
      }}
      infoSectionB={{
        heading: "Sertifikati i LBMA standard zlatnih poluga",
        description: "Svaka zlatna poluga u Gold Invest ponudi dolazi isključivo iz najprestižnijih svetskih rafinerija i poseduje LBMA (London Bullion Market Association) sertifikat - garanciju da kupujete zlato najvišeg ranga, priznato i lako naplativo svuda u svetu.",
        headingClassName: "py-1",
        cards: [
          {
            title: "Šta vama donosi LBMA Good Delivery status?",
            body: "To nije samo prestižna oznaka, već najrigoroznija globalna garancija kvaliteta - potvrda čistoće, tačne gramaže i strogo kontrolisanog, etičkog porekla metala.",
          },
          {
            title: "Gde se nalazi sertifikat moje poluge?",
            body: "Kod modernih poluga, sertifikat je sigurnosno blister pakovanje. Na njemu su logo kovnice, težina, čistoća i serijski broj - koji mora da se poklapa sa brojem urezanim na samoj poluzi.",
          },
          {
            title: "Zlatno pravilo (Upozorenje): Ne otvarajte ambalažu",
            body: "Čak i najmanje oštećenje blistera može trajno poništiti investicioni status poluge. Ako se poluga izvadi, pri otkupu se cena obara jer zahteva skupe provere autentičnosti pre pretapanja.",
          },
        ],
      }}
      darkQuote={{
        eyebrow: "Garancija kvaliteta",
        normalText: "LBMA sertifikat nije samo oznaka,",
        italicText: "to je najstroža globalna garancija da vaša poluga ima besprekornu čistoću i priznata je svuda u svetu.",
        ctaHref: "/#faq",
        ctaLabel: "Saznaj više",
      }}
      brandsSection={{
        title: "Brendovi zlatnih poluga",
        description: 'Gold Invest u ponudi ima isključivo proizvode najeminentnijih evropskih kovnica sa LBMA "Good Delivery" sertifikatom. Naš asortiman se oslanja na apsolutne lidere u preradi plemenitih metala:',
        brands: [
          {
            img: "/images/brands/argor-heraeus.webp",
            title: "Argor-Heraeus",
            origin: "Švajcarska",
            text: "Švajcarska preciznost i industrijski standard. Jedna od najvećih i najpouzdanijih svetskih rafinerija, čije su poluge sinonim za sigurnost i izuzetno su tražene na celom evropskom tržištu.",
          },
          {
            img: "/images/brands/c-hafner.webp",
            title: "C. Hafner",
            origin: "Nemačka",
            text: "Nemački premium kvalitet bez kompromisa. Rafinerija sa tradicijom dugom preko 170 godina, poznata po najvišim tehnološkim standardima i besprekornoj izradi. Njihove poluge ulivaju ogromno poverenje tradicionalnim investitorima.",
            imageScale: 0.9,
          },
          {
            img: "/images/brands/logo-royal-mint.webp",
            title: "The Royal Mint (Kraljevska kovnica)",
            origin: "Velika Britanija",
            text: "Britanski prestiž. Zvanična državna kovnica Velike Britanije i jedna od najstarijih i najuglednijih institucija na svetu. Njihove investicione poluge predstavljaju sam vrh globalnog tržišta i nose dodatnu težinu istorijskog autoriteta.",
          },
        ],
      }}
      delivery={{
        heading: "Prodaja zlatnih poluga Beograd - Gold Invest",
        description: "Kupovina investicionih poluga zahteva maksimalnu diskreciju, sigurnost i profesionalizam. Zato nudimo više opcija preuzimanja i isporuke - uvek osigurano i neprimetno.",
        pickupCardBody: "Posetite nas u Beogradu - lokacija dostupna telefonom. Obezbedili smo diskretno okruženje za preuzimanje poluga i potpisivanje dokumentacije.",
      }}
      priceStructure={{
        title: "Cena zlatnih poluga - Trenutna / Avansna / Otkupna",
        description: "Kao i kod ostatka našeg asortimana, Gold Invest vam pruža opciju da optimizujete svoje troškove kada je u pitanju kupovina zlatnih poluga:",
        card1Body: "Plaćate i istog dana preuzimate polugu iz našeg trezora (ili vam je šaljemo na adresu).",
        card2Body: "Uplaćujete unapred, zaključavate trenutnu (nižu) cenu i čekate isporuku direktno iz inostrane kovnice. Za velike iznose, ušteda može biti izuzetno značajna.",
        card3Body: "Ovo je javno istaknuta cena po kojoj Gold Invest garantovano otkupljuje vaše poluge, uz isplatu istog dana. Spread (razlika prodajne i otkupne) je kod poluga najniži - investicija brže prelazi u profit.",
      }}
      faq={{
        title: "Česta pitanja o zlatnim polugama",
        items: FAQ_ITEMS,
      }}
    />
  );
}
