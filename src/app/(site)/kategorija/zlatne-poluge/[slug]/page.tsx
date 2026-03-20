import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { PriceStructureSection } from "@/components/catalog/PriceStructureSection";
import { DeliverySection } from "@/components/catalog/DeliverySection";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { BrandCardsSection } from "@/components/catalog/BrandCardsSection";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCard } from "@/components/ui/InfoCard";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildFaqSchema, buildProductSchema } from "@/lib/schema";

export const revalidate = 60;

// ── Types ──────────────────────────────────────────────────────────────────

type FaqItem = { q: string; a: string };

type SeoSections = {
  brands: {
    heading: string;
    description: string;
    cards: { title: string; body: string }[];
  };
  whyBuy: {
    heading: string;
    description: string;
    cards: { title: string; body: string }[];
  };
  priceStructure: {
    title: string;
    description: string;
    card1Body: string;
    card2Body: string;
    card3Body: string;
  };
  delivery: {
    heading: string;
    description: string;
    pickupCardBody: string;
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
};

type WeightConfig = {
  grams: number;
  label: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  seo?: SeoSections;
};

// ── Shared brand cards ─────────────────────────────────────────────────────

const BRAND_ARGOR = (weight: string) => ({
  title: `Argor-Heraeus ${weight} — Svajcarska`,
  body: "Argor-Heraeus je jedna od najvecih i najcenjenijih rafinerija plemenitih metala na svetu. Njihove poluge se odlikuju besprekornoom izradom, laserski upisanim serijskim brojem i LBMA 'Good Delivery' statusom — garantovana prepoznatljivost i likvidnost na svim kontinentima.",
});

const BRAND_HAFNER = (weight: string) => ({
  title: `C. Hafner ${weight} — Nemacka`,
  body: "Nemacka rafinerija C. Hafner sa tradicijom od preko 170 godina kuje poluge iskljucivo od recikliranog zlata — bez negativnog uticaja na zivotnu sredinu. Besprekoran nemacki kvalitet (999,9), elegantno blister pakovanje sa hologramom i eticki lanac nabavke metala.",
});

const BRAND_UMICORE = (weight: string) => ({
  title: `Umicore ${weight} — Belgija`,
  body: "Belgijska Umicore je globalni lider u reciklazi i preradi plemenitih metala. Njihove poluge nose LBMA 'Good Delivery' status i posebno su cenjene u zapadnoj Evropi zbog stroge kontrole kvaliteta i etickog porekla zlata.",
});

// ── Shared FAQ items ───────────────────────────────────────────────────────

const FAQ_SERTIFIKAT: FaqItem = {
  q: "Da li uz polugu dobijam sertifikat?",
  a: "Da. Svaka poluga dolazi fabricki zapecacena u cvrstom sigurnosnom blisteru velicine bankovne kartice. Na pakovanju se nalaze logo rafinerije, cistoca, tacna gramaza i jedinstveni serijski broj koji je laserski ugraviran i na samu polugu. To pakovanje je vas neosporivi sertifikat. Zlatno pravilo: nikada ne otvarajte blister — otvorena poluga gubi 'Good Delivery' status i otkupljuje se po nizoj ceni.",
};

const FAQ_PDV: FaqItem = {
  q: "Da li se na zlatne poluge placa PDV?",
  a: "Ne. Sve zlatne poluge cistote iznad 995/1000 tretiraju se po zakonu kao investiciono zlato i u potpunosti su oslobodjene PDV-a od 20% i poreza na kapitalnu dobit u Republici Srbiji. Svaki dinar koji date ide direktno u vrednost cistog zlata.",
};

const FAQ_KARTICA: FaqItem = {
  q: "Mogu li da platim platnom karticom?",
  a: "Ne, placanje platnim karticama trenutno nije moguce. Visoke provizije banaka (2-3%) bi se neizbezno ugradile u cenu zlata. Nas cilj je najpovoljnija cena na trzistu — prihvatamo gotovinu, bankovni transfer i pouzecem.",
};

const FAQ_DOSTAVA: FaqItem = {
  q: "Koliko traje isporuka?",
  a: "Za klijente u Beogradu nudimo isporuku dan za dan — porudzbine evidentirane radnim danima do 12h stizu na adresu istog dana do 18h. Za ostatak Srbije, diskretna i maksimalno osigurana dostava traje 1 do 3 radna dana.",
};

const FAQ_GOTOVINA = (weight: string): FaqItem => ({
  q: "Koji je limit za placanje u gotovini?",
  a: `Zakon o sprecavanju pranja novca dozvoljava gotovinska placanja do 1.160.000 dinara (10.000 evra). S obzirom na vrednost poluge od ${weight}, kupovina se najcesce realizuje bankovnim transferom. Kontaktirajte nas za detalje.`,
});

const FAQ_LBMA: FaqItem = {
  q: "Sta je LBMA 'Good Delivery' standard?",
  a: "LBMA (London Bullion Market Association) je najuticajnija svetska organizacija za standardizaciju plemenitih metala. 'Good Delivery' status je njena najstrozija sertifikacija — garantuje da poluga ima tacno deklarisanu gramazu, cistotu od najmanje 999,9/1000 i legalno, sledljivo poreklo metala. Poluge sa ovim statusom prihvataju se bez provere svuda u svetu.",
};

const FAQ_RAZLIKA_PLOCICA: FaqItem = {
  q: "Koja je razlika izmedju zlatne poluge i zlatne plocice?",
  a: "Tehnicki, i poluge i plocice su investiciono zlato cistote 999,9 i oba formata su oslobodjena PDV-a. Razlika je u gramazi i premiji. Plocice (1g-20g) nude visu premiju po gramu ali maksimalnu fleksibilnost. Poluge (od 31g naviše) imaju nizu premiju — vise cistog zlata za isti novac — ali ih morate prodati odjednom. Plocice su za fleksibilnost, poluge za efikasnost kapitala.",
};

// ── Weight configs ─────────────────────────────────────────────────────────

const WEIGHT_CONFIGS: Record<string, WeightConfig> = {
  "zlatna-poluga-1-unca": {
    grams: 31.1,
    label: "Zlatna poluga 1 unca (31,1g)",
    metaTitle: "Zlatna poluga 1 unca | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite zlatnu polugu 1 troy uncu (31,1g) cistote 999,9 — Argor-Heraeus, C. Hafner. Globalno najlikvidniji format. Oslobodjena PDV-a. Brza dostava Beograd i Srbija.",
    intro:
      "Zlatna poluga od 1 troy unce (31,1034g) je globalno najlikvidniji i najprepoznatljiviji format investicionog zlata. Sva berza i svi dileri na svetu kotiraju cenu u trojskim uncama — sto znaci da je ova poluga prihvacena i odmah naplativa apsolutno svuda. Sadrzi 99,99% cistog zlata (24 karata), dolazi u LBMA sertifikovanom blisteru i u potpunosti je oslobodjena PDV-a. Porucite putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    seo: {
      brands: {
        heading: "Nasa ponuda — poluge od 1 unce (LBMA Good Delivery)",
        description:
          "Sve poluge od 1 troy unce u nasoj ponudi kuju se u rafinerijama sa LBMA 'Good Delivery' liste — svetskog standarda koji garantuje cistotu od 999,9, tacnu gramazu i legalno poreklo metala.",
        cards: [
          BRAND_ARGOR("1 unca"),
          BRAND_HAFNER("1 unca"),
          BRAND_UMICORE("1 unca"),
        ],
      },
      whyBuy: {
        heading: "Zasto je poluga od 1 unce globalni investicioni standard?",
        description:
          "Poluga od 1 troy unce nije samo format — to je svetski jezik investicionog zlata. Evo konkretnih razloga zasto je ovo jedan od nasih najprodavanijih artikala:",
        cards: [
          {
            title: "Berza kotira cenu u uncama — ovo je direktna veza",
            body: "Sva svetska berza zlata (London, New York, Zurich) kotira spot cenu u trojskim uncama. Kupovinom poluge od 1 unce kupujete tacno ono sto berza kotira — bez konverzija, bez gubitaka u prevodu. Cena je potpuno transparentna i proverljiva u realnom vremenu.",
          },
          {
            title: "Prihvacena svuda u svetu bez provere",
            body: "Poluge od 1 unce svetskih LBMA rafinerija (Argor-Heraeus, C. Hafner, Umicore) prihvataju se bez ikakve provere u svakoj menjacnici zlata, kod svakog dilera i u svakoj banci koja trguje plemenitim metalima. To je maksimalna likvidnost — mozete je unovciti u roku od minuta, bilo gde na planeti.",
          },
          {
            title: "Povoljnija premija od plocica, fleksibilnija od vecih poluga",
            body: "Poluga od 1 unce (31,1g) nudi osetno povoljniju premiju po gramu nego zlatne plocice (1g-20g), a istovremeno je dovoljno mala da mozete prodati jednu po jednu — bez prinudne prodaje celokupne rezerve. Idealan kompromis izmedju efikasnosti i fleksibilnosti.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne poluge 1 unca",
        description:
          "Gold Invest vam pruza apsolutnu transparentnost cena. Svaka poluga od 1 unce ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za poluge koje su fizicki u nasem beogradskom trezoru. Uplatite i preuzmite zlato istog dana — bez cekanja.",
        card2Body:
          "Kupujete vise poluga od 1 unce? Avansnom uplatom zakljucavate trenutnu berzansku cenu i mi robu direktno porucujemo iz rafinerije uz znacajnu ustedu.",
        card3Body:
          "Garantovani iznos po kom Gold Invest otkupljuje vase poluge od 1 unce — uvek javno istaknut. Format od 1 unce je jedan od najlikvidnijih na trzistu, sto znaci minimalan spread.",
      },
      delivery: {
        heading: "Prodaja zlatnih poluga 1 unca Beograd — Gold Invest",
        description:
          "Kupovina poluge od 1 unce je brza i potpuno bezbedna. Nudimo vise nacina preuzimanja — uvek diskretno i maksimalno osigurano.",
        pickupCardBody:
          "Posetite nas licno u Beogradu. Strucna provera autenticnosti i preuzimanje na licu mesta — bez cekanja, u potpuno diskretnom okruzenju.",
      },
      faq: {
        title: "Cesta pitanja o zlatnoj poluzi od 1 unce",
        items: [
          FAQ_LBMA,
          FAQ_SERTIFIKAT,
          FAQ_PDV,
          {
            q: "Sta je troy unca i koliko grama iznosi?",
            a: "Troy unca (oznaka 'oz t' ili samo 'oz') je merna jedinica koja se iskljucivo koristi za plemenite metale. Jedna troy unca iznosi tacno 31,1034768 grama. Nije ista kao obicna unca (28,35g) koja se koristi u SAD za svakodnevne namirnice. Sve cene zlata na svetskim berzama — ukljucujuci i grafikon na nasem sajtu — izrazavaju se po troy unci.",
          },
          FAQ_RAZLIKA_PLOCICA,
          FAQ_DOSTAVA,
        ],
      },
    },
  },

  "zlatna-poluga-50g": {
    grams: 50,
    label: "Zlatna poluga 50g",
    metaTitle: "Zlatna poluga 50g | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite zlatnu polugu 50g cistote 999,9 — Argor-Heraeus, C. Hafner. Ulaz u svet pravih poluga sa povoljnom premijom. Oslobodjena PDV-a. Brza dostava Beograd i Srbija.",
    intro:
      "Zlatna poluga od 50 grama je idealan prvi korak u svetu pravih investicionih poluga. Nudi osetno povoljniju premiju po gramu od svih zlatnih plocica, a jos uvek je dovoljno pristupacna da je mogu priustiti investitori sa srednjim budzet. Sadrzi 99,99% cistog zlata (24 karata), dolazi u LBMA sertifikovanom blisteru i u potpunosti je oslobodjena PDV-a. Porucite putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    seo: {
      brands: {
        heading: "Nasa ponuda — poluge od 50g (LBMA Good Delivery)",
        description:
          "Sve poluge od 50g u nasoj ponudi kuju se u rafinerijama sa LBMA 'Good Delivery' liste. Svaka dolazi fabricki zapecacena u sigurnosnom blisteru koji je ujedno i vas sertifikat cistote 999,9.",
        cards: [
          BRAND_ARGOR("50g"),
          BRAND_HAFNER("50g"),
          BRAND_UMICORE("50g"),
        ],
      },
      whyBuy: {
        heading: "Zasto kupiti zlatnu polugu od 50g?",
        description:
          "Format od 50g oznacava granicu na kojoj investiciono zlato prestaje da bude simbolicno i postaje ozbiljna finansijska rezerva. Evo konkretnih razloga:",
        cards: [
          {
            title: "Znacajno niza premija od zlatnih plocica",
            body: "Na poluzi od 50g isti fiksni troskovi LBMA sertifikacije i pakovanja dele se na 50 grama zlata. Rezultat: premija po gramu je osetno niza nego kod plocica (1g-20g) — za isti novac dobijate vise cistog zlata. Ovo je granica na kojoj postaje finansijski isplativije prelaziti na poluge.",
          },
          {
            title: "Ulaz u svet pravih poluga — uz zadrzanu fleksibilnost",
            body: "Poluga od 50g je dovoljno mala da je mozete prodati odjednom kad vam zatreba tacno ta vrednost, a dovoljno velika da je svaki ozbiljan diler i menjacnica prihvati bez rezervi. Bridz izmedju sveta plocica i vecih poluga.",
          },
          {
            title: "Realna finansijska rezerva koja staje u dzep",
            body: "Poluga od 50g fizicki je mala kao par kreditnih kartica, ali nosi ozbiljnu vrednost. Lako se skladi u kuci (sef, kaseta), ne zahteva posebne uslove cuvanja i u svakom trenutku je dostupna — za razliku od novca na bankovnom racunu koji moze biti blokiran.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne poluge od 50g",
        description:
          "Transparentnost je osnova naseg poslovanja. Svaka poluga od 50g ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za poluge koje su fizicki u nasem trezoru. Uplatite i preuzmite zlato istog dana — bez cekanja i skrivenih troskova.",
        card2Body:
          "Kupujete vise poluga od 50g? Avansnom uplatom zakljucavate trenutnu berzansku cenu i mi robu direktno porucujemo iz rafinerije uz znacajnu ustedu po gramu.",
        card3Body:
          "Garantovani iznos po kom Gold Invest otkupljuje vase poluge od 50g — uvek javno istaknut, bez iznenadenja.",
      },
      delivery: {
        heading: "Prodaja zlatnih poluga 50g Beograd — Gold Invest",
        description:
          "Kupovina poluge od 50g je brza i potpuno bezbedna. Nudimo vise nacina preuzimanja — uvek diskretno i maksimalno osigurano.",
        pickupCardBody:
          "Posetite nas licno u Beogradu. Strucna provera autenticnosti i preuzimanje na licu mesta — bez cekanja, u potpuno diskretnom okruzenju.",
      },
      faq: {
        title: "Cesta pitanja o zlatnoj poluzi od 50g",
        items: [
          FAQ_LBMA,
          FAQ_SERTIFIKAT,
          FAQ_PDV,
          FAQ_RAZLIKA_PLOCICA,
          FAQ_GOTOVINA("50g"),
          FAQ_DOSTAVA,
        ],
      },
    },
  },

  "zlatna-poluga-100g": {
    grams: 100,
    label: "Zlatna poluga 100g",
    metaTitle: "Zlatna poluga 100g | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite zlatnu polugu 100g cistote 999,9 — Argor-Heraeus, C. Hafner. Najprodavaniji format na srpskom i evropskom trzistu. Oslobodjena PDV-a. Brza dostava.",
    intro:
      "Zlatna poluga od 100 grama je apsolutno najprodavaniji format na domacem i evropskom trzistu investicionog zlata — i to nije slucajnost. Nudi optimalan balans izmedju povoljne premije po gramu, lakoce cuvanja i maksimalne likvidnosti pri prodaji. Sadrzi 99,99% cistog zlata (24 karata), dolazi u LBMA sertifikovanom blisteru i u potpunosti je oslobodjena PDV-a. Porucite putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    seo: {
      brands: {
        heading: "Nasa ponuda — poluge od 100g (LBMA Good Delivery)",
        description:
          "Sve poluge od 100g u nasoj ponudi dolaze iskljucivo iz rafinerija sa LBMA 'Good Delivery' liste. Svaka je fabricki zapecacena u sigurnosnom blisteru — vasem zvanicnom sertifikatu cistote 999,9.",
        cards: [
          BRAND_ARGOR("100g"),
          BRAND_HAFNER("100g"),
          BRAND_UMICORE("100g"),
        ],
      },
      whyBuy: {
        heading: "Zasto je poluga od 100g benchmark format?",
        description:
          "Ne postoji slucajnost u tome sto je poluga od 100g najprodavaniji format na celom evropskom trzistu. Evo zasto ju je odabralo toliko iskusnih investitora:",
        cards: [
          {
            title: "Optimalna premija — ni previse, ni premalo",
            body: "Poluga od 100g nudi premiju po gramu koja je osetno niza od plocica i poluge od 50g, ali i dalje dovoljno malu da kupite vise komada bez gubitka likvidnosti. To je tacka na kojoj svaki euro koji date maksimalno prelazi u vrednost zlata.",
          },
          {
            title: "Najlikvidniji format na srpskom trzistu",
            body: "Kada biste sutra hteli da prodate svoju polugu od 100g, svaki ozbiljan diler, menjacnica zlata i banka u Srbiji i Evropi prihvatice je odmah i po fer ceni. Nema formata koji se brze i lakse unovcuje. Ovo je format koji svi poznaju i svi prihvataju.",
          },
          {
            title: "Fleksibilnost kroz kupovinu vise komada",
            body: "Investitori koji imaju 500g ili 1kg zlata u portfoliju cesto ga drze u obliku pet ili deset poluga od 100g — a ne u jednom komadu od 500g ili 1kg. Razlog je prost: ako vam zatreba deo gotovine, prodate samo jednu polugu od 100g i ostatak investicije ostaje netaknut.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne poluge od 100g",
        description:
          "Gold Invest vam pruza apsolutnu transparentnost cena. Svaka poluga od 100g ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za poluge koje su fizicki u nasem beogradskom trezoru. Uplatite i preuzmite zlato istog dana — bez cekanja.",
        card2Body:
          "Kupujete vise poluga od 100g? Avansnom uplatom zakljucavate trenutnu berzansku cenu i mi robu direktno porucujemo iz rafinerije (Svajcarska, Nemacka, Belgija). Znacajna usteda na vecim kolicinama.",
        card3Body:
          "Garantovani iznos po kom Gold Invest otkupljuje vase poluge od 100g — uvek javno istaknut. Zbog ogromne likvidnosti ovog formata, spread je medjju najnizima u celoj ponudi.",
      },
      delivery: {
        heading: "Prodaja zlatnih poluga 100g Beograd — Gold Invest",
        description:
          "Kupovina poluge od 100g je brza i potpuno bezbedna. Nudimo vise nacina preuzimanja — uvek diskretno i maksimalno osigurano.",
        pickupCardBody:
          "Posetite nas licno u Beogradu. Strucna provera autenticnosti i preuzimanje na licu mesta — bez cekanja, u potpuno diskretnom okruzenju.",
      },
      faq: {
        title: "Cesta pitanja o zlatnoj poluzi od 100g",
        items: [
          FAQ_LBMA,
          FAQ_SERTIFIKAT,
          FAQ_PDV,
          {
            q: "Zasto je poluga od 100g najprodavaniji format u Srbiji i Evropi?",
            a: "Poluga od 100g je benchmark format koji nudi najoptimalniji odnos tri kljucna faktora: premija po gramu (dovoljno niska da se isplati), likvidnost (svi dileri je prihvataju) i fleksibilnost (mozete prodati jedan komad bez prodaje celog portfolija). Veci formati (250g, 500g, 1kg) imaju jos nizu premiju, ali su i tezi za unovcavanje brzo i po fer ceni.",
          },
          FAQ_RAZLIKA_PLOCICA,
          FAQ_GOTOVINA("100g"),
          FAQ_DOSTAVA,
        ],
      },
    },
  },

  "zlatna-poluga-250g": {
    grams: 250,
    label: "Zlatna poluga 250g",
    metaTitle: "Zlatna poluga 250g | Investiciono zlato - Gold Invest",
    metaDescription:
      "LBMA sertifikovana zlatna poluga 250g cistote 999,9. Za ozbiljne investitore koji zele manji spread i vece kolicine zlata u trezoru. Dostava za celu Srbiju.",
    intro:
      "Zlatna poluga od 250 grama nudi znacajno manji procentualni spread od manjih formata, sto je cini izborom iskusnijih investitora koji grade vece zlatne rezerve.",
  },

  "zlatna-poluga-500g": {
    grams: 500,
    label: "Zlatna poluga 500g",
    metaTitle: "Zlatna poluga 500g | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite zlatnu polugu 500g cistote 999,9 — Argor-Heraeus, C. Hafner. Minimalna premija, maksimalna efikasnost kapitala. Oslobodjena PDV-a. Individualna ponuda.",
    intro:
      "Zlatna poluga od 500 grama je izbor ozbiljnih investitora koji zele da maksimizuju kolicinu cistog zlata za svaki ulozeni dinar. Nudi jednu od najnizih premija u kategoriji, a vrednost poluge je dovoljno znacajna da se tretira kao ozbiljna finansijska rezerva. Sadrzi 99,99% cistog zlata (24 karata), u LBMA sertifikovanom blisteru, oslobodjena PDV-a. Kontaktirajte nas za aktuelnu cenu: 0612698569.",
    seo: {
      brands: {
        heading: "Nasa ponuda — poluge od 500g (LBMA Good Delivery)",
        description:
          "Poluge od 500g u nasoj ponudi dolaze iskljucivo od LBMA rafinerija — svetski priznatih institucija koje garantuju cistotu od 999,9, tacnu gramazu i legalno sledljivo poreklo metala.",
        cards: [
          BRAND_ARGOR("500g"),
          BRAND_HAFNER("500g"),
          BRAND_UMICORE("500g"),
        ],
      },
      whyBuy: {
        heading: "Zasto kupiti zlatnu polugu od 500g?",
        description:
          "Poluga od 500g nije za pocetnike — to je format za investitore koji vec razumeju zlato i zele da kapital premeste u najefikasnijem obliku. Evo konkretnih razloga:",
        cards: [
          {
            title: "Minimalna premija — maksimalno zlato za isti novac",
            body: "Fiksni troskovi LBMA sertifikacije i pakovanja se na poluzi od 500g dele na 500 grama zlata. Premija po gramu je jedna od najnizih u celoj nasoj ponudi — daleko ispod plocica i manjih poluga. Za istu sumu novca dobijate osetno vise cistog zlata nego u bilo kom manjem formatu.",
          },
          {
            title: "Efikasno uskladistenje velikog kapitala",
            body: "Poluga od 500g je kompaktnija nego sto mnogi misle — dimenzijama je slicna debeloj knjizi. U standardnom kucanskom sefu moze da stane vise poluga od 500g, sto je cini izuzetno efikasnom za uskladistenje velikog kapitala bez skupih bankovnih trezora.",
          },
          {
            title: "Institucijalni standard — prihvacena svuda bez provere",
            body: "Poluge od 500g svetskih LBMA rafinerija prihvataju se odmah i po fer ceni od strane svakog profesionalnog dilera zlata u Srbiji, Evropi i svetu. Nema potrebe za posebnom provererom — LBMA status je globalna garancija.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne poluge od 500g",
        description:
          "Transparentnost je osnova naseg poslovanja. Svaka poluga od 500g ima jasno istaknute sve tri cene. Za aktuelnu cenu kontaktirajte nas direktno:",
        card1Body:
          "Cena za poluge koje su fizicki u nasem trezoru. Za poluge ove gramaze, kupovina se najcesce realizuje uz kratku najavu radi pripreme i provere dokumentacije.",
        card2Body:
          "Avansnom uplatom zakljucavate trenutnu berzansku cenu i mi robu direktno porucujemo iz rafinerije. Za kolicine od 500g+ ova opcija nudi najvecu ustedu.",
        card3Body:
          "Garantovani otkupni iznos koji Gold Invest isplacuje za vase poluge od 500g. Zbog visoke vrednosti ovog formata, spread je medjju najnizima u celoj nasoj ponudi.",
      },
      delivery: {
        heading: "Prodaja zlatnih poluga 500g Beograd — Gold Invest",
        description:
          "Kupovina poluge od 500g zahteva kratku koordinaciju radi pripreme i bezbednog prenosa. Uvek diskretno i maksimalno osigurano.",
        pickupCardBody:
          "Za poluge ove vrednosti preporucujemo licno preuzimanje u Beogradu. Diskretno okruzenje, kompletna dokumentacija i strucna provera autenticnosti na licu mesta.",
      },
      faq: {
        title: "Cesta pitanja o zlatnoj poluzi od 500g",
        items: [
          FAQ_LBMA,
          FAQ_SERTIFIKAT,
          FAQ_PDV,
          {
            q: "Da li je bolje kupiti jednu polugu od 500g ili pet poluga od 100g?",
            a: "Ovo je kljucno pitanje za svakog ozbiljnog investitora. Jedna poluga od 500g nudi nizu premiju po gramu — dobijate vise zlata za isti novac. Medutim, pet poluga od 100g vam daju visu fleksibilnost — mozete prodati jednu po jednu kada vam zatreba deo gotovine. Nasa preporuka: ako niste sigurni da li cete ikad trebati da delimicno unovcite investiciju, uzmite polugu od 500g. Ako zelite mogucnost postepene prodaje, uzmite pet po 100g.",
          },
          FAQ_GOTOVINA("500g"),
          FAQ_KARTICA,
          FAQ_DOSTAVA,
        ],
      },
    },
  },

  "zlatna-poluga-1kg": {
    grams: 1000,
    label: "Zlatna poluga 1kg",
    metaTitle: "Zlatna poluga 1kg | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite zlatnu polugu 1kg cistote 999,9 — matematicki najefikasniji format investicionog zlata. LBMA Good Delivery. Oslobodjena PDV-a. Individualna ponuda — pozovite nas.",
    intro:
      "Zlatna poluga od 1 kilograma je matematicki najefikasniji format investicionog zlata i standard kojim trguju centralne banke celog sveta. Minimalan spread, maksimalna vrednost po gramu — i ni gram vise premije nego sto je neophodno. Sadrzi 99,99% cistog zlata (24 karata), u LBMA 'Good Delivery' sertifikovanom pakovanju, u potpunosti oslobodjena PDV-a. Za aktuelnu cenu i uslove, pozovite nas na 0612698569.",
    seo: {
      brands: {
        heading: "Nasa ponuda — poluge od 1kg (LBMA Good Delivery)",
        description:
          "Poluge od 1kg dolaze iskljucivo od rafinerija sa LBMA 'Good Delivery' liste — standarda koji koriste centralne banke celog sveta. Cistoca 999,9 garantovana, poreklo sledljivo, vrednost neupitna.",
        cards: [
          BRAND_ARGOR("1kg"),
          BRAND_HAFNER("1kg"),
          BRAND_UMICORE("1kg"),
        ],
      },
      whyBuy: {
        heading: "Zasto je poluga od 1kg ultimativna investicija u zlato?",
        description:
          "Poluga od 1kg nije impulsivna kupovina — to je strateska odluka. Evo zasto je ovo format koji biraju institucije, fondovi i najiskusniji privatni investitori:",
        cards: [
          {
            title: "Apsolutno najniza premija u celoj ponudi",
            body: "Na poluzi od 1kg fiksni troskovi sertifikacije i pakovanja su zanemarljivi u odnosu na vrednost zlata koje sadrzi. Premija po gramu je niza nego kod bilo kog drugog formata — svaki dinar koji ulozite gotovo u potpunosti prelazi u cisto zlato. Nema efikasnijeg nacina da prenesete kapital u fizicki metal.",
          },
          {
            title: "Standard centralnih banaka — maksimalan prestiž i likvidnost",
            body: "Poluga od 1kg (poznatija kao 'Good Delivery bar') je format kojim trguju i kojim se procenjuju zlatne rezerve centralnih banaka. Kad imate polugu ovog standarda, imate apsolutnu garanciju likvidnosti — prihvacena je odmah i po berzi, bez ikakve provere, od strane bilo kog profesionalnog ucesnika na globalnom trzistu zlata.",
          },
          {
            title: "Efikasno uskladistenje — 1kg stane u jednoj ruci",
            body: "Poluga od 1kg fizicki je manja nego sto vecina ljudi zamislja — velicine je otprilike kao deblji mobilni telefon. U standardnom sefu moze stajati vise kilogramskih poluga, sto je cini izuzetno efikasnom za uskladistenje ogromnog kapitala na minimalnom prostoru.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne poluge od 1kg",
        description:
          "Zbog visine investicije, cenu poluge od 1kg formiramo individualno na osnovu aktuelne berzanske cene. Kontaktirajte nas direktno za preciznu ponudu:",
        card1Body:
          "Poluge od 1kg najcesce se nabavljaju avansno direktno iz rafinerije. Kontaktirajte nas i mi cemo vam rezervisati aktuelnu berzansku cenu dok organizujemo isporuku.",
        card2Body:
          "Avansna kupovina je standardni model za poluge ove gramaze — zakljucujete berzansku cenu u trenutku uplate, a isporuku organizujemo direktno iz LBMA rafinerije.",
        card3Body:
          "Otkupna cena poluge od 1kg je najbliza spot berzi od svih nasih formata — minimalan spread koji smo u stanju da ponudimo. Kontaktirajte nas za aktuelni otkupni kurs.",
      },
      delivery: {
        heading: "Prodaja zlatnih poluga 1kg Beograd — Gold Invest",
        description:
          "Kupovina i isporuka poluge od 1kg zahteva individualnu koordinaciju. Svaka transakcija se organizuje diskretno, sa svom potrebnom dokumentacijom i maksimalnim osiguranjem.",
        pickupCardBody:
          "Za poluge ove vrednosti strogo preporucujemo licno preuzimanje u Beogradu, u potpuno diskretnom okruzenju, uz svu prateCu dokumentaciju.",
      },
      faq: {
        title: "Cesta pitanja o zlatnoj poluzi od 1kg",
        items: [
          FAQ_LBMA,
          FAQ_PDV,
          {
            q: "Da li je bolje kupiti jednu polugu od 1kg ili deset poluga od 100g?",
            a: "Jedna poluga od 1kg nudi apsolutno najnizu premiju po gramu — za isti novac dobijate vise cistog zlata nego u bilo kom drugom formatu. Medutim, deset poluga od 100g daju vam mogucnost postepene prodaje — prodate jednu po jednu kad vam zatreba deo gotovine. Nasa preporuka: ako ste sigurni da necete trebati delic rezerve u kratkom roku — 1kg je finansijski najoptimalniji izbor. Ako zelite fleksibilnost, idite na 100g komade.",
          },
          {
            q: "Kako se organizuje kupovina poluge od 1kg?",
            a: "Za poluge ove gramaze, kupovina se odvija uz kratku koordinaciju. Pozovite nas na 0612698569 ili posaljite upit putem kontakt forme. Dogovoricemo aktuelnu cenu, nacin uplate i termin preuzimanja. Cela transakcija je diskretna, sa potpunom dokumentacijom i garancijom autenticnosti.",
          },
          {
            q: "Sta je 'Good Delivery bar' standard?",
            a: "Good Delivery bar je naziv za polugu koja ispunjava najstrozije LBMA standarde — cistotu od 995/1000 ili vise, tacnu gramazu, sledljivo poreklo i specificne fizicke dimenzije. Nase kilogramske poluge su cistote 999,9 — iznad minimalnog standarda. To je format koji koriste centralne banke i koji se prihvata bez provere na svim institucionalnim trzistima.",
          },
          FAQ_SERTIFIKAT,
          FAQ_KARTICA,
        ],
      },
    },
  },
};

// ── Static params ──────────────────────────────────────────────────────────
export function generateStaticParams() {
  return Object.keys(WEIGHT_CONFIGS).map((slug) => ({ slug }));
}

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = WEIGHT_CONFIGS[slug];
  if (!config) return {};
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: `https://goldinvest.rs/kategorija/zlatne-poluge/${slug}`,
    },
  };
}

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_SNAPSHOT = {
  id: "mock", xau_usd: 2700, xau_eur: 4375, usd_rsd: 108, eur_rsd: 117.5,
  price_per_g_rsd: 16500, source: "mock", fetched_at: new Date().toISOString(),
};
const MOCK_TIERS = [{
  id: "t1", name: "default", category: null, min_g: 0, max_g: 99999,
  margin_stock_pct: 3.5, margin_advance_pct: 2.5, margin_purchase_pct: 1.5, created_at: "",
}];
const ALL_MOCK_POLUGE = [
  { id: "p1", product_id: "p1", slug: "zlatna-poluga-1-unca-argor", weight_g: 31.1, weight_oz: 1, purity: 0.9999, fine_weight_g: 31.1, sku: null, stock_qty: 4, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 1, is_active: true, products: { name: "Zlatna poluga 1 unca", brand: "Argor-Heraeus", origin: "Svajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p2", product_id: "p2", slug: "zlatna-poluga-50g-hafner", weight_g: 50, weight_oz: 1.607, purity: 0.9999, fine_weight_g: 50, sku: null, stock_qty: 3, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 2, is_active: true, products: { name: "Zlatna poluga 50g", brand: "C. Hafner", origin: "Nemacka", category: "poluga" }, pricing_rules: null },
  { id: "p3", product_id: "p3", slug: "zlatna-poluga-100g-argor", weight_g: 100, weight_oz: 3.215, purity: 0.9999, fine_weight_g: 100, sku: null, stock_qty: 3, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 3, is_active: true, products: { name: "Zlatna poluga 100g", brand: "Argor-Heraeus", origin: "Svajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p4", product_id: "p4", slug: "zlatna-poluga-250g-argor", weight_g: 250, weight_oz: 8.037, purity: 0.9999, fine_weight_g: 250, sku: null, stock_qty: 1, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 4, is_active: true, products: { name: "Zlatna poluga 250g", brand: "Argor-Heraeus", origin: "Svajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p5", product_id: "p5", slug: "zlatna-poluga-500g-argor", weight_g: 500, weight_oz: 16.075, purity: 0.9999, fine_weight_g: 500, sku: null, stock_qty: 1, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 5, is_active: true, products: { name: "Zlatna poluga 500g", brand: "Argor-Heraeus", origin: "Svajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p6", product_id: "p6", slug: "zlatna-poluga-1kg-argor", weight_g: 1000, weight_oz: 32.151, purity: 0.9999, fine_weight_g: 1000, sku: null, stock_qty: 1, availability: "available_on_request", lead_time_weeks: 1, images: ["/images/product-poluga.png"], sort_order: 6, is_active: true, products: { name: "Zlatna poluga 1kg", brand: "Argor-Heraeus", origin: "Svajcarska", category: "poluga" }, pricing_rules: null },
];

// ── Page ───────────────────────────────────────────────────────────────────
export default async function PolugaWeightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = WEIGHT_CONFIGS[slug];
  if (!config) notFound();

  let variants: any = ALL_MOCK_POLUGE.filter((v) => Number(v.weight_g) === config.grams);
  let tiers: any = MOCK_TIERS;
  let snapshotRow: any = MOCK_SNAPSHOT;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("products.category", "poluga")
        .eq("weight_g", config.grams)
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

  const breadcrumbs = [
    { label: "Investiciono zlato", href: "/" },
    { label: "Zlatne poluge", href: "/kategorija/zlatne-poluge" },
    { label: config.label, href: `/kategorija/zlatne-poluge/${slug}` },
  ];

  const heroImg = variants?.[0]?.images?.[0] ?? "/images/product-poluga.png";
  const heroTitle = config.label;

  return (
    <main className="bg-white">
      {/* Schema.org */}
      <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
      <SchemaScript
        schema={buildProductSchema({
          name: config.label,
          description: config.metaDescription,
          brand: "Argor-Heraeus / C. Hafner / Umicore",
          slug: `/kategorija/zlatne-poluge/${slug}`,
          image: heroImg,
          purity: "999.9/1000",
          weightGrams: config.grams,
        })}
      />
      {config.seo && <SchemaScript schema={buildFaqSchema(config.seo.faq.items)} />}

      {/* ── Breadcrumb + hero ──────────────────────────────────────────── */}
      <section className="bg-white py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <Breadcrumb items={breadcrumbs} variant="light" />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            <div className="relative rounded-2xl overflow-hidden bg-[#F9F9F9]" style={{ height: 320 }}>
              <Image src={heroImg} alt={heroTitle} fill className="object-contain p-8" />
            </div>

            <div>
              <h1
                className="text-[#1B1B1C] leading-[1.05]"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontSize: "clamp(28px, 3.8vw, 54px)",
                  fontWeight: 400,
                }}
              >
                {heroTitle}
              </h1>
              <p
                className="text-[#6B6B6B] mt-4"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 16,
                  lineHeight: "1.6em",
                  maxWidth: 520,
                }}
              >
                {config.intro}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
                <a
                  href="/kontakt"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#1B1B1C] text-white font-semibold transition-opacity hover:opacity-90"
                  style={{ fontSize: 12.1, boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)" }}
                >
                  UPIT ZA CENU
                </a>
                <a
                  href="tel:+381612698569"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#BEAD87] text-[#1B1B1C] font-semibold transition-opacity hover:opacity-90"
                  style={{ fontSize: 12.1 }}
                >
                  POZOVITE +381 61/269 8569
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product grid ──────────────────────────────────────────────────── */}
      <section className="bg-white py-12 border-t border-[#F0EDE6]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <h2
            className="text-[#1B1B1C] mb-8"
            style={{ fontFamily: "var(--font-rethink), sans-serif", fontWeight: 500, letterSpacing: "-0.5px", fontSize: 22 }}
          >
            PONUDA U OVOJ KATEGORIJI
          </h2>
          <ProductGrid
            variants={variants as any}
            tiers={tiers}
            snapshot={snapshotRow}
            hideFilterSortBar
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            maxItems={6}
          />
        </div>
      </section>

      {/* ── SEO sections ─────────────────────────────────────────────────── */}
      {config.seo && (
        <>
          {/* whyBuy */}
          <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
            <SectionContainer>
              <SectionHeading
                title={config.seo.whyBuy.heading}
                description={config.seo.whyBuy.description}
              />
              <div className="mt-6 grid grid-cols-1 md:grid-cols-[1.02fr_0.98fr] gap-8 items-stretch">
                {/* Highlighted first card */}
                <div className="relative bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl p-6 sm:p-8 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#BEAD87]/20 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#1B1B1C] text-white text-sm font-semibold shrink-0">
                        1
                      </span>
                      <div className="pt-1">
                        <p className="text-[#BF8E41] text-[11px] font-semibold tracking-widest uppercase mb-2">
                          Kljucna prednost
                        </p>
                        <p className="text-[#1B1B1C] text-[15px] sm:text-[16px] font-semibold leading-snug">
                          {config.seo.whyBuy.cards[0]?.title}
                        </p>
                      </div>
                    </div>
                    <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                      {config.seo.whyBuy.cards[0]?.body}
                    </p>
                    <div className="mt-7 h-px w-16 bg-[#BEAD87]" />
                  </div>
                </div>

                {/* Cards 2 + 3 grouped */}
                <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 sm:py-5 bg-white/40 border-b border-[#F0EDE6]">
                    <p className="text-[#1B1B1C] text-[14px] sm:text-[15px] font-semibold leading-snug">
                      Jos dve kljucne prednosti
                    </p>
                  </div>
                  <div className="divide-y divide-[#F0EDE6]">
                    {config.seo.whyBuy.cards.slice(1, 3).map((card, i) => (
                      <div key={card.title} className="p-5 sm:p-6 flex items-start gap-3">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#1B1B1C] text-white text-sm font-semibold shrink-0">
                          {i + 2}
                        </span>
                        <div>
                          <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-1">
                            {card.title}
                          </p>
                          <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed">
                            {card.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionContainer>
          </section>

          {/* Price structure */}
          <PriceStructureSection
            title={config.seo.priceStructure.title}
            description={config.seo.priceStructure.description}
            card1Body={config.seo.priceStructure.card1Body}
            card2Body={config.seo.priceStructure.card2Body}
            card3Body={config.seo.priceStructure.card3Body}
          />

          {/* Brands */}
          <BrandCardsSection
            title={config.seo.brands.heading}
            description={config.seo.brands.description}
            brands={config.seo.brands.cards.map((c) => {
              const lower = c.title.toLowerCase();
              let img = "/images/brands/bento-center-gold.png";
              let origin = "—";
              if (lower.includes("argor")) { img = "/images/brands/argor-heraeus.png"; origin = "Svajcarska"; }
              else if (lower.includes("hafner")) { img = "/images/brands/c-hafner.png"; origin = "Nemacka"; }
              else if (lower.includes("umicore")) { img = "/images/brands/bento-center-gold.png"; origin = "Belgija"; }
              return { img, title: c.title.split("—")[0].trim(), origin, text: c.body };
            })}
          />

          {/* Delivery */}
          <DeliverySection
            heading={config.seo.delivery.heading}
            description={config.seo.delivery.description}
            pickupCardBody={config.seo.delivery.pickupCardBody}
          />

          {/* FAQ */}
          <CategoryFaq
            title={config.seo.faq.title}
            items={config.seo.faq.items}
            ctaHref="/kontakt"
            ctaLabel="Kontaktirajte nas"
          />

          <WhatIsGoldSection />
        </>
      )}
    </main>
  );
}
