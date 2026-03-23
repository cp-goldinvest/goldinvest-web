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
  title: `Argor-Heraeus ${weight} — Švajcarska`,
  body: "Argor-Heraeus je jedna od najvećih i najcenjenijih rafinerija plemenitih metala na svetu. Njihove poluge se odlikuju besprekornom izradom, laserski upisanim serijskim brojem i LBMA 'Good Delivery' statusom — garantovana prepoznatljivost i likvidnost na svim kontinentima.",
});

const BRAND_HAFNER = (weight: string) => ({
  title: `C. Hafner ${weight} — Nemačka`,
  body: "Nemačka rafinerija C. Hafner sa tradicijom od preko 170 godina kuje poluge isključivo od recikliranog zlata — bez negativnog uticaja na životnu sredinu. Besprekoran nemački kvalitet (999,9), elegantno blister pakovanje sa hologramom i etički lanac nabavke metala.",
});

const BRAND_UMICORE = (weight: string) => ({
  title: `Umicore ${weight} — Belgija`,
  body: "Belgijska Umicore je globalni lider u recikliranju i preradi plemenitih metala. Njihove poluge nose LBMA 'Good Delivery' status i posebno su cenjene u zapadnoj Evropi zbog stroge kontrole kvaliteta i etičkog porekla zlata.",
});

// ── Shared FAQ items ───────────────────────────────────────────────────────

const FAQ_SERTIFIKAT: FaqItem = {
  q: "Da li uz polugu dobijam sertifikat?",
  a: "Da. Svaka poluga dolazi fabrički zapečaćena u čvrstom sigurnosnom blisteru veličine bankovne kartice. Na pakovanju se nalaze logo rafinerije, čistoća, tačna gramaža i jedinstveni serijski broj koji je laserski ugraviran i na samu polugu. To pakovanje je vaš neosporivi sertifikat. Zlatno pravilo: nikada ne otvarajte blister — otvorena poluga gubi 'Good Delivery' status i otkupljuje se po nižoj ceni.",
};

const FAQ_PDV: FaqItem = {
  q: "Da li se na zlatne poluge plaća PDV?",
  a: "Ne. Sve zlatne poluge čistoće iznad 995/1000 tretiraju se po zakonu kao investiciono zlato i u potpunosti su oslobođene PDV-a od 20% i poreza na kapitalnu dobit u Republici Srbiji. Svaki dinar koji date ide direktno u vrednost čistog zlata.",
};

const FAQ_KARTICA: FaqItem = {
  q: "Mogu li da platim platnom karticom?",
  a: "Ne, plaćanje platnim karticama trenutno nije moguće. Visoke provizije banaka (2–3%) bi se neizbežno ugradile u cenu zlata. Naš cilj je najpovoljnija cena na tržištu — prihvatamo gotovinu, bankovni transfer i pouzećem.",
};

const FAQ_DOSTAVA: FaqItem = {
  q: "Koliko traje isporuka?",
  a: "Za klijente u Beogradu nudimo isporuku dan za dan — porudžbine evidentirane radnim danima do 12h stižu na adresu istog dana do 18h. Za ostatak Srbije, diskretna i maksimalno osigurana dostava traje 1 do 3 radna dana.",
};

const FAQ_GOTOVINA = (weight: string): FaqItem => ({
  q: "Koji je limit za plaćanje u gotovini?",
  a: `Zakon o sprečavanju pranja novca dozvoljava gotovinska plaćanja do 1.160.000 dinara (10.000 evra). S obzirom na vrednost poluge od ${weight}, kupovina se najčešće realizuje bankovnim transferom. Kontaktirajte nas za detalje.`,
});

const FAQ_LBMA: FaqItem = {
  q: "Šta je LBMA 'Good Delivery' standard?",
  a: "LBMA (London Bullion Market Association) je najuticajnija svetska organizacija za standardizaciju plemenitih metala. 'Good Delivery' status je njena najstrožija sertifikacija — garantuje da poluga ima tačno deklarisanu gramažu, čistotu od najmanje 999,9/1000 i legalno, sledljivo poreklo metala. Poluge sa ovim statusom prihvataju se bez provere svuda u svetu.",
};

const FAQ_RAZLIKA_PLOCICA: FaqItem = {
  q: "Koja je razlika između zlatne poluge i zlatne pločice?",
  a: "Tehnički, i poluge i pločice su investiciono zlato čistoće 999,9 i oba formata su oslobođena PDV-a. Razlika je u gramazi i premiji. Pločice (1g–20g) nude višu premiju po gramu ali maksimalnu fleksibilnost. Poluge (od 31g naviše) imaju nižu premiju — više čistog zlata za isti novac — ali ih morate prodati odjednom. Pločice su za fleksibilnost, poluge za efikasnost kapitala.",
};

// ── Weight configs ─────────────────────────────────────────────────────────

const WEIGHT_CONFIGS: Record<string, WeightConfig> = {
  "zlatna-poluga-1-unca": {
    grams: 31.1,
    label: "Zlatna poluga 1 unca (31,1g)",
    metaTitle: "Zlatna poluga 1 unca | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite zlatnu polugu 1 troy uncu (31,1g) čistoće 999,9 — Argor-Heraeus, C. Hafner. Globalno najlikvidniji format. Oslobođena PDV-a. Brza dostava Beograd i Srbija.",
    intro:
      "Zlatna poluga od 1 troy unce (31,1034g) je globalno najlikvidniji i najprepoznatljiviji format investicionog zlata. Sva berza i svi dileri na svetu kotiraju cenu u trojskim uncama — što znači da je ova poluga prihvaćena i odmah naplativa apsolutno svuda. Sadrži 99,99% čistog zlata (24 karata), dolazi u LBMA sertifikovanom blisteru i u potpunosti je oslobođena PDV-a. Poručite putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    seo: {
      brands: {
        heading: "Naša ponuda — poluge od 1 unce (LBMA Good Delivery)",
        description:
          "Sve poluge od 1 troy unce u našoj ponudi kuju se u rafinerijama sa LBMA 'Good Delivery' liste — svetskog standarda koji garantuje čistoću od 999,9, tačnu gramažu i legalno poreklo metala.",
        cards: [
          BRAND_ARGOR("1 unca"),
          BRAND_HAFNER("1 unca"),
          BRAND_UMICORE("1 unca"),
        ],
      },
      whyBuy: {
        heading: "Zašto je poluga od 1 unce globalni investicioni standard?",
        description:
          "Poluga od 1 troy unce nije samo format — to je svetski jezik investicionog zlata. Evo konkretnih razloga zašto je ovo jedan od naših najprodavanijih artikala:",
        cards: [
          {
            title: "Berza kotira cenu u uncama — ovo je direktna veza",
            body: "Sva svetska berza zlata (London, New York, Zurich) kotira spot cenu u trojskim uncama. Kupovinom poluge od 1 unce kupujete tačno ono što berza kotira — bez konverzija, bez gubitaka u prevodu. Cena je potpuno transparentna i proverljiva u realnom vremenu.",
          },
          {
            title: "Prihvaćena svuda u svetu bez provere",
            body: "Poluge od 1 unce svetskih LBMA rafinerija (Argor-Heraeus, C. Hafner, Umicore) prihvataju se bez ikakve provere u svakoj menjačnici zlata, kod svakog dilera i u svakoj banci koja trguje plemenitim metalima. To je maksimalna likvidnost — možete je unovčiti u roku od minuta, bilo gde na planeti.",
          },
          {
            title: "Povoljnija premija od pločica, fleksibilnija od većih poluga",
            body: "Poluga od 1 unce (31,1g) nudi osetno povoljniju premiju po gramu nego zlatne pločice (1g–20g), a istovremeno je dovoljno mala da možete prodati jednu po jednu — bez prinudne prodaje celokupne rezerve. Idealan kompromis između efikasnosti i fleksibilnosti.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne poluge 1 unca",
        description:
          "Gold Invest vam pruža apsolutnu transparentnost cena. Svaka poluga od 1 unce ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za poluge koje su fizički u našem beogradskom trezoru. Uplatite i preuzmite zlato istog dana — bez čekanja.",
        card2Body:
          "Kupujete više poluga od 1 unce? Avansnom uplatom zaključavate trenutnu berzansku cenu i mi robu direktno poručujemo iz rafinerije uz značajnu uštedu.",
        card3Body:
          "Garantovani iznos po kom Gold Invest otkupljuje vaše poluge od 1 unce — uvek javno istaknut. Format od 1 unce je jedan od najlikvidnijih na tržištu, što znači minimalan spread.",
      },
      delivery: {
        heading: "Prodaja zlatnih poluga 1 unca Beograd — Gold Invest",
        description:
          "Kupovina poluge od 1 unce je brza i potpuno bezbedna. Nudimo više načina preuzimanja — uvek diskretno i maksimalno osigurano.",
        pickupCardBody:
          "Posetite nas lično u Beogradu. Stručna provera autentičnosti i preuzimanje na licu mesta — bez čekanja, u potpuno diskretnom okruženju.",
      },
      faq: {
        title: "Česta pitanja o zlatnoj poluzi od 1 unce",
        items: [
          FAQ_LBMA,
          FAQ_SERTIFIKAT,
          FAQ_PDV,
          {
            q: "Šta je troy unca i koliko grama iznosi?",
            a: "Troy unca (oznaka 'oz t' ili samo 'oz') je merna jedinica koja se isključivo koristi za plemenite metale. Jedna troy unca iznosi tačno 31,1034768 grama. Nije ista kao obična unca (28,35g) koja se koristi u SAD za svakodnevne namirnice. Sve cene zlata na svetskim berzama — uključujući i grafikon na našem sajtu — izražavaju se po troy unci.",
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
      "Kupite zlatnu polugu 50g čistoće 999,9 — Argor-Heraeus, C. Hafner. Ulaz u svet pravih poluga sa povoljnom premijom. Oslobođena PDV-a. Brza dostava Beograd i Srbija.",
    intro:
      "Zlatna poluga od 50 grama je idealan prvi korak u svetu pravih investicionih poluga. Nudi osetno povoljniju premiju po gramu od svih zlatnih pločica, a još uvek je dovoljno pristupačna da je mogu priuštiti investitori sa srednjim budžetom. Sadrži 99,99% čistog zlata (24 karata), dolazi u LBMA sertifikovanom blisteru i u potpunosti je oslobođena PDV-a. Poručite putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    seo: {
      brands: {
        heading: "Naša ponuda — poluge od 50g (LBMA Good Delivery)",
        description:
          "Sve poluge od 50g u našoj ponudi kuju se u rafinerijama sa LBMA 'Good Delivery' liste. Svaka dolazi fabrički zapečaćena u sigurnosnom blisteru koji je ujedno i vaš sertifikat čistoće 999,9.",
        cards: [
          BRAND_ARGOR("50g"),
          BRAND_HAFNER("50g"),
          BRAND_UMICORE("50g"),
        ],
      },
      whyBuy: {
        heading: "Zašto kupiti zlatnu polugu od 50g?",
        description:
          "Format od 50g označava granicu na kojoj investiciono zlato prestaje da bude simbolično i postaje ozbiljna finansijska rezerva. Evo konkretnih razloga:",
        cards: [
          {
            title: "Značajno niža premija od zlatnih pločica",
            body: "Na poluzi od 50g isti fiksni troškovi LBMA sertifikacije i pakovanja dele se na 50 grama zlata. Rezultat: premija po gramu je osetno niža nego kod pločica (1g–20g) — za isti novac dobijate više čistog zlata. Ovo je granica na kojoj postaje finansijski isplativije prelaziti na poluge.",
          },
          {
            title: "Ulaz u svet pravih poluga — uz zadržanu fleksibilnost",
            body: "Poluga od 50g je dovoljno mala da je možete prodati odjednom kad vam zatreba tačno ta vrednost, a dovoljno velika da je svaki ozbiljan diler i menjačnica prihvati bez rezervi. Bridž između sveta pločica i većih poluga.",
          },
          {
            title: "Realna finansijska rezerva koja staje u džep",
            body: "Poluga od 50g fizički je mala kao par kreditnih kartica, ali nosi ozbiljnu vrednost. Lako se skladi u kući (sef, kaseta), ne zahteva posebne uslove čuvanja i u svakom trenutku je dostupna — za razliku od novca na bankovnom računu koji može biti blokiran.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne poluge od 50g",
        description:
          "Transparentnost je osnova našeg poslovanja. Svaka poluga od 50g ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za poluge koje su fizički u našem trezoru. Uplatite i preuzmite zlato istog dana — bez čekanja i skrivenih troškova.",
        card2Body:
          "Kupujete više poluga od 50g? Avansnom uplatom zaključavate trenutnu berzansku cenu i mi robu direktno poručujemo iz rafinerije uz značajnu uštedu po gramu.",
        card3Body:
          "Garantovani iznos po kom Gold Invest otkupljuje vaše poluge od 50g — uvek javno istaknut, bez iznenađenja.",
      },
      delivery: {
        heading: "Prodaja zlatnih poluga 50g Beograd — Gold Invest",
        description:
          "Kupovina poluge od 50g je brza i potpuno bezbedna. Nudimo više načina preuzimanja — uvek diskretno i maksimalno osigurano.",
        pickupCardBody:
          "Posetite nas lično u Beogradu. Stručna provera autentičnosti i preuzimanje na licu mesta — bez čekanja, u potpuno diskretnom okruženju.",
      },
      faq: {
        title: "Česta pitanja o zlatnoj poluzi od 50g",
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
      "Kupite zlatnu polugu 100g čistoće 999,9 — Argor-Heraeus, C. Hafner. Najprodavaniji format na srpskom i evropskom tržištu. Oslobođena PDV-a. Brza dostava.",
    intro:
      "Zlatna poluga od 100 grama je apsolutno najprodavaniji format na domaćem i evropskom tržištu investicionog zlata — i to nije slučajnost. Nudi optimalan balans između povoljne premije po gramu, lakoće čuvanja i maksimalne likvidnosti pri prodaji. Sadrži 99,99% čistog zlata (24 karata), dolazi u LBMA sertifikovanom blisteru i u potpunosti je oslobođena PDV-a. Poručite putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    seo: {
      brands: {
        heading: "Naša ponuda — poluge od 100g (LBMA Good Delivery)",
        description:
          "Sve poluge od 100g u našoj ponudi dolaze isključivo iz rafinerija sa LBMA 'Good Delivery' liste. Svaka je fabrički zapečaćena u sigurnosnom blisteru — vašem zvaničnom sertifikatu čistoće 999,9.",
        cards: [
          BRAND_ARGOR("100g"),
          BRAND_HAFNER("100g"),
          BRAND_UMICORE("100g"),
        ],
      },
      whyBuy: {
        heading: "Zašto je poluga od 100g benchmark format?",
        description:
          "Ne postoji slučajnost u tome što je poluga od 100g najprodavaniji format na celom evropskom tržištu. Evo zašto ju je odabralo toliko iskusnih investitora:",
        cards: [
          {
            title: "Optimalna premija — ni previše, ni premalo",
            body: "Poluga od 100g nudi premiju po gramu koja je osetno niža od pločica i poluge od 50g, ali i dalje dovoljno malu da kupite više komada bez gubitka likvidnosti. To je tačka na kojoj svaki evro koji date maksimalno prelazi u vrednost zlata.",
          },
          {
            title: "Najlikvidniji format na srpskom tržištu",
            body: "Kada biste sutra hteli da prodate svoju polugu od 100g, svaki ozbiljan diler, menjačnica zlata i banka u Srbiji i Evropi prihvatiće je odmah i po fer ceni. Nema formata koji se brže i lakše unovčuje. Ovo je format koji svi poznaju i svi prihvataju.",
          },
          {
            title: "Fleksibilnost kroz kupovinu više komada",
            body: "Investitori koji imaju 500g ili 1kg zlata u portfoliju često ga drže u obliku pet ili deset poluga od 100g — a ne u jednom komadu od 500g ili 1kg. Razlog je prost: ako vam zatreba deo gotovine, prodate samo jednu polugu od 100g i ostatak investicije ostaje netaknut.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne poluge od 100g",
        description:
          "Gold Invest vam pruža apsolutnu transparentnost cena. Svaka poluga od 100g ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za poluge koje su fizički u našem beogradskom trezoru. Uplatite i preuzmite zlato istog dana — bez čekanja.",
        card2Body:
          "Kupujete više poluga od 100g? Avansnom uplatom zaključavate trenutnu berzansku cenu i mi robu direktno poručujemo iz rafinerije (Švajcarska, Nemačka, Belgija). Značajna ušteda na većim količinama.",
        card3Body:
          "Garantovani iznos po kom Gold Invest otkupljuje vaše poluge od 100g — uvek javno istaknut. Zbog ogromne likvidnosti ovog formata, spread je među najnižima u celoj ponudi.",
      },
      delivery: {
        heading: "Prodaja zlatnih poluga 100g Beograd — Gold Invest",
        description:
          "Kupovina poluge od 100g je brza i potpuno bezbedna. Nudimo više načina preuzimanja — uvek diskretno i maksimalno osigurano.",
        pickupCardBody:
          "Posetite nas lično u Beogradu. Stručna provera autentičnosti i preuzimanje na licu mesta — bez čekanja, u potpuno diskretnom okruženju.",
      },
      faq: {
        title: "Česta pitanja o zlatnoj poluzi od 100g",
        items: [
          FAQ_LBMA,
          FAQ_SERTIFIKAT,
          FAQ_PDV,
          {
            q: "Zašto je poluga od 100g najprodavaniji format u Srbiji i Evropi?",
            a: "Poluga od 100g je benchmark format koji nudi najoptimalniji odnos tri ključna faktora: premija po gramu (dovoljno niska da se isplati), likvidnost (svi dileri je prihvataju) i fleksibilnost (možete prodati jedan komad bez prodaje celog portfolija). Veći formati (250g, 500g, 1kg) imaju još nižu premiju, ali su i teži za unovčavanje brzo i po fer ceni.",
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
      "LBMA sertifikovana zlatna poluga 250g čistoće 999,9. Za ozbiljne investitore koji žele manji spread i veće količine zlata u trezoru. Dostava za celu Srbiju.",
    intro:
      "Zlatna poluga od 250 grama nudi značajno manji procentualni spread od manjih formata, što je čini izborom iskusnijih investitora koji grade veće zlatne rezerve.",
  },

  "zlatna-poluga-500g": {
    grams: 500,
    label: "Zlatna poluga 500g",
    metaTitle: "Zlatna poluga 500g | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite zlatnu polugu 500g čistoće 999,9 — Argor-Heraeus, C. Hafner. Minimalna premija, maksimalna efikasnost kapitala. Oslobođena PDV-a. Individualna ponuda.",
    intro:
      "Zlatna poluga od 500 grama je izbor ozbiljnih investitora koji žele da maksimizuju količinu čistog zlata za svaki uloženi dinar. Nudi jednu od najnižih premija u kategoriji, a vrednost poluge je dovoljno značajna da se tretira kao ozbiljna finansijska rezerva. Sadrži 99,99% čistog zlata (24 karata), u LBMA sertifikovanom blisteru, oslobođena PDV-a. Kontaktirajte nas za aktuelnu cenu: 0612698569.",
    seo: {
      brands: {
        heading: "Naša ponuda — poluge od 500g (LBMA Good Delivery)",
        description:
          "Poluge od 500g u našoj ponudi dolaze isključivo od LBMA rafinerija — svetski priznatih institucija koje garantuju čistoću od 999,9, tačnu gramažu i legalno sledljivo poreklo metala.",
        cards: [
          BRAND_ARGOR("500g"),
          BRAND_HAFNER("500g"),
          BRAND_UMICORE("500g"),
        ],
      },
      whyBuy: {
        heading: "Zašto kupiti zlatnu polugu od 500g?",
        description:
          "Poluga od 500g nije za početnike — to je format za investitore koji već razumeju zlato i žele da kapital prenesu u najefikasnijem obliku. Evo konkretnih razloga:",
        cards: [
          {
            title: "Minimalna premija — maksimalno zlato za isti novac",
            body: "Fiksni troškovi LBMA sertifikacije i pakovanja se na poluzi od 500g dele na 500 grama zlata. Premija po gramu je jedna od najnižih u celoj našoj ponudi — daleko ispod pločica i manjih poluga. Za istu sumu novca dobijate osetno više čistog zlata nego u bilo kom manjem formatu.",
          },
          {
            title: "Efikasno uskladištenje velikog kapitala",
            body: "Poluga od 500g je kompaktnija nego što mnogi misle — dimenzijama je slična debeloj knjizi. U standardnom kućanskom sefu može da stane više poluga od 500g, što je čini izuzetno efikasnom za uskladištenje velikog kapitala bez skupih bankovnih trezora.",
          },
          {
            title: "Institucijalni standard — prihvaćena svuda bez provere",
            body: "Poluge od 500g svetskih LBMA rafinerija prihvataju se odmah i po fer ceni od strane svakog profesionalnog dilera zlata u Srbiji, Evropi i svetu. Nema potrebe za posebnom proverom — LBMA status je globalna garancija.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne poluge od 500g",
        description:
          "Transparentnost je osnova našeg poslovanja. Svaka poluga od 500g ima jasno istaknute sve tri cene. Za aktuelnu cenu kontaktirajte nas direktno:",
        card1Body:
          "Cena za poluge koje su fizički u našem trezoru. Za poluge ove gramaže, kupovina se najčešće realizuje uz kratku najavu radi pripreme i provere dokumentacije.",
        card2Body:
          "Avansnom uplatom zaključavate trenutnu berzansku cenu i mi robu direktno poručujemo iz rafinerije. Za količine od 500g+ ova opcija nudi najveću uštedu.",
        card3Body:
          "Garantovani otkupni iznos koji Gold Invest isplaćuje za vaše poluge od 500g. Zbog visoke vrednosti ovog formata, spread je među najnižima u celoj našoj ponudi.",
      },
      delivery: {
        heading: "Prodaja zlatnih poluga 500g Beograd — Gold Invest",
        description:
          "Kupovina poluge od 500g zahteva kratku koordinaciju radi pripreme i bezbednog prenosa. Uvek diskretno i maksimalno osigurano.",
        pickupCardBody:
          "Za poluge ove vrednosti preporučujemo lično preuzimanje u Beogradu. Diskretno okruženje, kompletna dokumentacija i stručna provera autentičnosti na licu mesta.",
      },
      faq: {
        title: "Česta pitanja o zlatnoj poluzi od 500g",
        items: [
          FAQ_LBMA,
          FAQ_SERTIFIKAT,
          FAQ_PDV,
          {
            q: "Da li je bolje kupiti jednu polugu od 500g ili pet poluga od 100g?",
            a: "Ovo je ključno pitanje za svakog ozbiljnog investitora. Jedna poluga od 500g nudi nižu premiju po gramu — dobijate više zlata za isti novac. Međutim, pet poluga od 100g vam daju višu fleksibilnost — možete prodati jednu po jednu kada vam zatreba deo gotovine. Naša preporuka: ako niste sigurni da li ćete ikad trebati da delimično unovčite investiciju, uzmite polugu od 500g. Ako želite mogućnost postepene prodaje, uzmite pet po 100g.",
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
      "Kupite zlatnu polugu 1kg čistoće 999,9 — matematički najefikasniji format investicionog zlata. LBMA Good Delivery. Oslobođena PDV-a. Individualna ponuda — pozovite nas.",
    intro:
      "Zlatna poluga od 1 kilograma je matematički najefikasniji format investicionog zlata i standard kojim trguju centralne banke celog sveta. Minimalan spread, maksimalna vrednost po gramu — i ni gram više premije nego što je neophodno. Sadrži 99,99% čistog zlata (24 karata), u LBMA 'Good Delivery' sertifikovanom pakovanju, u potpunosti oslobođena PDV-a. Za aktuelnu cenu i uslove, pozovite nas na 0612698569.",
    seo: {
      brands: {
        heading: "Naša ponuda — poluge od 1kg (LBMA Good Delivery)",
        description:
          "Poluge od 1kg dolaze isključivo od rafinerija sa LBMA 'Good Delivery' liste — standarda koji koriste centralne banke celog sveta. Čistoća 999,9 garantovana, poreklo sledljivo, vrednost neupitna.",
        cards: [
          BRAND_ARGOR("1kg"),
          BRAND_HAFNER("1kg"),
          BRAND_UMICORE("1kg"),
        ],
      },
      whyBuy: {
        heading: "Zašto je poluga od 1kg ultimativna investicija u zlato?",
        description:
          "Poluga od 1kg nije impulsivna kupovina — to je strateška odluka. Evo zašto je ovo format koji biraju institucije, fondovi i najiskusniji privatni investitori:",
        cards: [
          {
            title: "Apsolutno najniža premija u celoj ponudi",
            body: "Na poluzi od 1kg fiksni troškovi sertifikacije i pakovanja su zanemarljivi u odnosu na vrednost zlata koje sadrži. Premija po gramu je niža nego kod bilo kog drugog formata — svaki dinar koji uložite gotovo u potpunosti prelazi u čisto zlato. Nema efikasnijeg načina da prenesete kapital u fizički metal.",
          },
          {
            title: "Standard centralnih banaka — maksimalan prestiž i likvidnost",
            body: "Poluga od 1kg (poznatija kao 'Good Delivery bar') je format kojim trguju i kojim se procenjuju zlatne rezerve centralnih banaka. Kad imate polugu ovog standarda, imate apsolutnu garanciju likvidnosti — prihvaćena je odmah i po berzi, bez ikakve provere, od strane bilo kog profesionalnog učesnika na globalnom tržištu zlata.",
          },
          {
            title: "Efikasno uskladištenje — 1kg stane u jednoj ruci",
            body: "Poluga od 1kg fizički je manja nego što većina ljudi zamišlja — veličine je otprilike kao deblji mobilni telefon. U standardnom sefu može stajati više kilogramskih poluga, što je čini izuzetno efikasnom za uskladištenje ogromnog kapitala na minimalnom prostoru.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne poluge od 1kg",
        description:
          "Zbog visine investicije, cenu poluge od 1kg formiramo individualno na osnovu aktuelne berzanske cene. Kontaktirajte nas direktno za preciznu ponudu:",
        card1Body:
          "Poluge od 1kg najčešće se nabavljaju avansno direktno iz rafinerije. Kontaktirajte nas i mi ćemo vam rezervisati aktuelnu berzansku cenu dok organizujemo isporuku.",
        card2Body:
          "Avansna kupovina je standardni model za poluge ove gramaže — zaključujete berzansku cenu u trenutku uplate, a isporuku organizujemo direktno iz LBMA rafinerije.",
        card3Body:
          "Otkupna cena poluge od 1kg je najbliža spot berzi od svih naših formata — minimalan spread koji smo u stanju da ponudimo. Kontaktirajte nas za aktuelni otkupni kurs.",
      },
      delivery: {
        heading: "Prodaja zlatnih poluga 1kg Beograd — Gold Invest",
        description:
          "Kupovina i isporuka poluge od 1kg zahteva individualnu koordinaciju. Svaka transakcija se organizuje diskretno, sa svom potrebnom dokumentacijom i maksimalnim osiguranjem.",
        pickupCardBody:
          "Za poluge ove vrednosti strogo preporučujemo lično preuzimanje u Beogradu, u potpuno diskretnom okruženju, uz svu prateću dokumentaciju.",
      },
      faq: {
        title: "Česta pitanja o zlatnoj poluzi od 1kg",
        items: [
          FAQ_LBMA,
          FAQ_PDV,
          {
            q: "Da li je bolje kupiti jednu polugu od 1kg ili deset poluga od 100g?",
            a: "Jedna poluga od 1kg nudi apsolutno najnižu premiju po gramu — za isti novac dobijate više čistog zlata nego u bilo kom drugom formatu. Međutim, deset poluga od 100g daju vam mogućnost postepene prodaje — prodate jednu po jednu kad vam zatreba deo gotovine. Naša preporuka: ako ste sigurni da nećete trebati delić rezerve u kratkom roku — 1kg je finansijski najoptimalniji izbor. Ako želite fleksibilnost, idite na 100g komade.",
          },
          {
            q: "Kako se organizuje kupovina poluge od 1kg?",
            a: "Za poluge ove gramaže, kupovina se odvija uz kratku koordinaciju. Pozovite nas na 0612698569 ili pošaljite upit putem kontakt forme. Dogovorićemo aktuelnu cenu, način uplate i termin preuzimanja. Cela transakcija je diskretna, sa potpunom dokumentacijom i garancijom autentičnosti.",
          },
          {
            q: "Šta je 'Good Delivery bar' standard?",
            a: "Good Delivery bar je naziv za polugu koja ispunjava najstrožije LBMA standarde — čistoću od 995/1000 ili više, tačnu gramažu, sledljivo poreklo i specifične fizičke dimenzije. Naše kilogramske poluge su čistoće 999,9 — iznad minimalnog standarda. To je format koji koriste centralne banke i koji se prihvata bez provere na svim institucionalnim tržištima.",
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
  { id: "p1", product_id: "p1", slug: "zlatna-poluga-1-unca-argor", weight_g: 31.1, weight_oz: 1, purity: 0.9999, fine_weight_g: 31.1, sku: null, stock_qty: 4, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 1, is_active: true, products: { name: "Zlatna poluga 1 unca", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p2", product_id: "p2", slug: "zlatna-poluga-50g-hafner", weight_g: 50, weight_oz: 1.607, purity: 0.9999, fine_weight_g: 50, sku: null, stock_qty: 3, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 2, is_active: true, products: { name: "Zlatna poluga 50g", brand: "C. Hafner", origin: "Nemačka", category: "poluga" }, pricing_rules: null },
  { id: "p3", product_id: "p3", slug: "zlatna-poluga-100g-argor", weight_g: 100, weight_oz: 3.215, purity: 0.9999, fine_weight_g: 100, sku: null, stock_qty: 3, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 3, is_active: true, products: { name: "Zlatna poluga 100g", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p4", product_id: "p4", slug: "zlatna-poluga-250g-argor", weight_g: 250, weight_oz: 8.037, purity: 0.9999, fine_weight_g: 250, sku: null, stock_qty: 1, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 4, is_active: true, products: { name: "Zlatna poluga 250g", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p5", product_id: "p5", slug: "zlatna-poluga-500g-argor", weight_g: 500, weight_oz: 16.075, purity: 0.9999, fine_weight_g: 500, sku: null, stock_qty: 1, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 5, is_active: true, products: { name: "Zlatna poluga 500g", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
  { id: "p6", product_id: "p6", slug: "zlatna-poluga-1kg-argor", weight_g: 1000, weight_oz: 32.151, purity: 0.9999, fine_weight_g: 1000, sku: null, stock_qty: 1, availability: "available_on_request", lead_time_weeks: 1, images: ["/images/product-poluga.png"], sort_order: 6, is_active: true, products: { name: "Zlatna poluga 1kg", brand: "Argor-Heraeus", origin: "Švajcarska", category: "poluga" }, pricing_rules: null },
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
                          Ključna prednost
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
                      Još dve ključne prednosti
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
              if (lower.includes("argor")) { img = "/images/brands/argor-heraeus.png"; origin = "Švajcarska"; }
              else if (lower.includes("hafner")) { img = "/images/brands/c-hafner.png"; origin = "Nemačka"; }
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
