import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { SeoSection } from "@/components/catalog/SeoSection";
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

const INTRO_FIRST =
  "Zlatne poluge su najsigurniji način da zaštitite veći kapital od inflacije i ekonomskih potresa.";

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

export default async function ZlatnePolugePage() {
  const supabase = createServiceClient();

  const [{ data: variants }, { data: tiers }, { data: snapshotRow }] =
    await Promise.all([
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

  if (!snapshotRow || !variants || !tiers) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto px-4 py-20 text-center text-[#6B6B6B]">
          Cene trenutno nisu dostupne. Pokušajte ponovo.
        </div>
      </main>
    );
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
        introFirstSentence={INTRO_FIRST}
        pills={CATEGORY_PILLS}
        expandableIntro
      />

      {/* Products + Filter/Sort */}
      <section className="bg-white py-12">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-8">
          <ProductGrid
            variants={variants as any}
            tiers={tiers}
            snapshot={snapshotRow}
          />
        </div>
      </section>

      {/* SEO content sections — white bg, homepage typography */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="max-w-[820px]">

            <SeoSection title="Koje težine zlatnih poluga postoje?">
              <p>
                U Gold Invest asortimanu nalaze se isključivo investicione poluge maksimalne
                čistoće od 99.99% (24 karata). Da biste lakše isplanirali svoju investiciju u
                investiciono zlato, evo detaljnog pregleda formata poluga:
              </p>
              <ul>
                <li>
                  <strong>Zlatne pločice manje težine (1g, 2g, 5g, 10g i 20g)</strong> — savršen način da
                  započnete svoju investicionu priču ili obezbedite najvredniji mogući poklon za
                  krštenja, rođenja i venčanja. Iako je premija kovanja po gramu kod ovih
                  formata nešto viša, one vam daju apsolutnu fleksibilnost. Ukoliko vam zatreba
                  manji iznos gotovine, možete prodati samo polugu od 5g ili 10g, bez potrebe
                  da unovčavate celu ušteđevinu.
                </li>
                <li>
                  <strong>Srednje poluge (50g i 100g) — zlatna sredina</strong> — ovo je apsolutno najtraženiji
                  format na domaćem i evropskom tržištu. Poluga od 100 grama je najčešći
                  izbor kao savršen investicioni balans — dovoljno je velika da cena po gramu
                  bude izuzetno isplativa (niska premija), a dovoljno praktična da zadržite
                  odličnu likvidnost portfolija.
                </li>
                <li>
                  <strong>Velike poluge (250g, 500g i 1kg)</strong> — ultimativni izbor za ozbiljne investitore koji
                  prebacuju veće sume novca iz nesigurnog bankarskog sistema u opipljivu
                  imovinu. Kupovinom poluge od 500g ili 1kg dobijate ubedljivo najnižu cenu po
                  gramu zlata na tržištu. Zbog specifične gustine zlata, čak i poluga od jednog
                  kilograma je manja od prosečnog mobilnog telefona, što neverovatno
                  olakšava njeno skladištenje u bankarskim sefovima.
                </li>
              </ul>
              <p>
                Ukoliko vam zatreba manji iznos gotovine, možete prodati samo polugu od 5g ili 10g.
                Takođe, ukoliko tražite tradicionalniji format za poklon ili čuvanje vrednosti,
                preporučujemo da pogledate i zlatne dukate (gde se posebno izdvaja čuveni Dukat
                Franc Jozef).
              </p>
            </SeoSection>

            <SeoSection title="Sertifikati i LBMA standard zlatnih poluga">
              <p>
                Svaka zlatna poluga u Gold Invest ponudi dolazi isključivo iz najprestižnijih svetskih
                rafinerija i poseduje LBMA (London Bullion Market Association) sertifikat. Ovo je
                vaša ultimativna garancija da kupujete zlato najvišeg svetskog ranga, koje je
                priznato i lako naplativo svuda u svetu.
              </p>
              <p>Evo šta to konkretno znači za vašu investiciju:</p>
              <ul>
                <li>
                  <strong>Šta vama donosi LBMA Good Delivery status?</strong> To nije samo prestižna
                  oznaka, već najrigoroznija globalna garancija kvaliteta. Ona osigurava da
                  vaša poluga ima besprekornu čistoću od 99.99% (24 karata), apsolutno tačnu
                  gramažu i strogo kontrolisano, etičko poreklo metala.
                </li>
                <li>
                  <strong>Gde se nalazi sertifikat moje poluge?</strong> Kod modernih zlatnih poluga, papirni
                  sertifikati su prevaziđeni jer se lako mogu falsifikovati. Vaša poluga vam se
                  isporučuje fabrički zapečaćena u sigurnosno blister pakovanje (od čvrste
                  plastike). Na tom pakovanju su jasno utisnuti logo kovnice, težina, čistoća i
                  jedinstveni serijski broj — koji se u cifru mora poklapati sa brojem laserski
                  urezanim na samoj poluzi. Vaše pakovanje je zapravo vaš zvanični sertifikat.
                </li>
                <li>
                  <strong>Zlatno pravilo (Upozorenje):</strong> Ne otvarajte ambalažu! Najskuplja greška koju
                  novi investitori prave jeste vađenje poluge iz zaštitne plastike. Čak i najmanje
                  oštećenje ili zasecanje blistera trajno uništava investicioni Good Delivery
                  status vaše poluge. Ukoliko se poluga izvadi, prilikom kasnijeg otkupa biće joj
                  znatno oborena cena, jer takvo zlato zahteva ponovne, skupe fizičke i
                  laboratorijske provere autentičnosti pre nego što se pretopi.
                </li>
              </ul>
            </SeoSection>

            <SeoSection title="Brendovi zlatnih poluga">
              <p>
                Gold Invest u ponudi ima isključivo proizvode najeminentnijih evropskih kovnica sa
                LBMA Good Delivery sertifikatom. Naš asortiman se oslanja na apsolutne lidere u
                preradi plemenitih metala:
              </p>
              <ul>
                <li>
                  <strong>Argor-Heraeus</strong> — švajcarska preciznost i industrijski standard. Jedna od
                  najvećih i najpouzdanijih svetskih rafinerija, čije su poluge sinonim za sigurnost
                  i izuzetno su tražene na celom evropskom tržištu.
                </li>
                <li>
                  <strong>C. Hafner</strong> — nemački premium kvalitet bez kompromisa. Rafinerija sa
                  tradicijom dugom preko 170 godina, poznata po najvišim tehnološkim
                  standardima i besprekornoj izradi. Njihove poluge ulivaju ogromno poverenje
                  tradicionalnim investitorima.
                </li>
                <li>
                  <strong>The Royal Mint (Kraljevska kovnica)</strong> — britanski prestiž. Zvanična državna
                  kovnica Velike Britanije i jedna od najstarijih i najuglednijih institucija na svetu.
                  Njihove investicione poluge predstavljaju sam vrh globalnog tržišta i nose
                  dodatnu težinu istorijskog autoriteta.
                </li>
              </ul>
            </SeoSection>

            <SeoSection title="Prodaja zlatnih poluga Beograd - Gold Invest">
              <p>
                Kupovina investicionih poluga zahteva maksimalnu diskreciju, sigurnost i
                profesionalizam. Vaš kapital zaslužuje pouzdanog partnera koji garantuje
                bezbednost svake transakcije:
              </p>
              <ul>
                <li>
                  <strong>Lično preuzimanje (Beograd)</strong> — posetite nas na adresi Bulevar oslobođenja 123 (Beograd).
                  Obezbedili smo potpuno sigurno i diskretno okruženje za preuzimanje vaših poluga i potpisivanje dokumentacije.
                </li>
                <li>
                  <strong>Sigurna isporuka za Beograd</strong> — za porudžbine i uplate evidentirane radnim
                  danima do 12h, vaše zlatne poluge bezbedno dostavljamo na adresu istog
                  dana do 18h (dan za dan).
                </li>
                <li>
                  <strong>Isporuka za celu Srbiju</strong> — ukoliko niste u mogućnosti da dođete lično, vaše
                  poluge šaljemo maksimalno osigurane na teritoriju cele države. Paket stiže u
                  roku od 1 do 3 radna dana, potpuno neprimetno upakovan, tako da niko osim
                  vas ne zna njegov dragoceni sadržaj.
                </li>
              </ul>
            </SeoSection>

            <SeoSection title="Cena zlatnih poluga - Trenutna/Avansna/Otkupna">
              <p>
                Kao i kod ostatka našeg asortimana, Gold Invest vam pruža opciju da optimizujete
                svoje troškove kada je u pitanju kupovina zlatnih poluga:
              </p>
              <ol>
                <li>
                  <strong>Trenutna kupovina (Roba na stanju)</strong> — plaćate i istog dana preuzimate
                  polugu iz našeg trezora (ili vam je šaljemo na adresu).
                </li>
                <li>
                  <strong>Avansna kupovina (Najbolja cena zlata)</strong> — ukoliko planirate kupovinu većih
                  poluga (poput 500g ili 1kg), avansna kupovina vam omogućava da uplatite
                  novac unapred, zaključate trenutnu (nižu) cenu i sačekate isporuku direktno iz
                  inostrane kovnice. Za velike iznose, ova ušteda može biti izuzetno značajna.
                </li>
                <li>
                  <strong>Otkupna cena poluga (Garantovana likvidnost)</strong> — zlatne poluge su
                  najlikvidniji oblik fizičke imovine. Ovo je javno istaknuta cena po kojoj Gold
                  Invest garantovano otkupljuje vaše poluge, uz isplatu istog dana. Ono što
                  poluge čini superiornim jeste činjenica da je razlika između prodajne i otkupne
                  cene (tzv. spread) kod njih najniža. To znači da vaša investicija najbrže prelazi
                  u zonu čistog profita.
                </li>
              </ol>
            </SeoSection>

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
