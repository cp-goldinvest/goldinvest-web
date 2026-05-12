import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { GOLDINVEST_SITE_ID } from "@/lib/site";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { PriceStructureSection } from "@/components/catalog/PriceStructureSection";
import { DeliverySection } from "@/components/catalog/DeliverySection";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCard } from "@/components/ui/InfoCard";
import { BrandCardsSection, mapBrandsToLogos } from "@/components/catalog/BrandCardsSection";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/schema";

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
  /** Extended SEO content - only defined for slugs with a full SEO document */
  seo?: SeoSections;
};

// ── Weight config per slug ─────────────────────────────────────────────────

const WEIGHT_CONFIGS: Record<string, WeightConfig> = {
  "zlatna-plocica-1g": {
    grams: 1,
    label: "Zlatna pločica 1g",
    metaTitle: "Zlatna pločica 1g | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite zlatnu pločicu 1g čistoće 999,9 - C. Hafner, Argor-Heraeus. Najpopularniji poklon za krštenje i rođenje, oslobođena PDV-a. Transparentne cene, brza dostava.",
    intro:
      "Zlatna pločica od 1 grama je najpristupačniji ulaz u svet investicionog zlata i apsolutni broj jedan kada je reč o poklonima za krštenje i rođenje. Sadrži 99,99% čistog zlata (24 karata), dolazi fabrički zapečaćena u sigurnosnom blisteru koji je ujedno i sertifikat - i u potpunosti je oslobođena PDV-a. Poruči putem kontakt forme ili na broj 0614264129 - BRZA dostava!",
    seo: {
      brands: {
        heading: "Naša ponuda - pločice od 1g (LBMA standard)",
        description:
          "Sve pločice od 1g koje nudimo potiču isključivo od svetski priznatih rafinerija sa LBMA liste. Svaka dolazi fabrički zapečaćena u sigurnosnom blister pakovanju veličine bankovne kartice - vaš zvanični sertifikat čistoće 999,9.",
        cards: [
          {
            title: "C. Hafner 1g - Nemačka",
            body: "Nemačka rafinerija C. Hafner posebno je cenjena zbog svog ekološkog pristupa - sve njihove pločice se kuju isključivo od recikliranog zlata, bez negativnog uticaja na životnu sredinu. Njihova pločica od 1g dolazi u elegantnom, tamnom blister pakovanju sa hologramom i karakterističnim, modernim dizajnom. Odličan izbor za one koji žele spoj kvaliteta i etičke proizvodnje.",
          },
          {
            title: "Argor-Heraeus 1g - Švajcarska",
            body: "Švajcarski Argor-Heraeus je jedan od industrijskih standarda u svetu rafinerisanja zlata. Njihova pločica od 1g odlikuje se čistim, klasičnim dizajnom sa jasno istaknutim logotipom, težinom, oznakom čistoće i serijskim brojem. Izuzetno je tražena i prepoznatljiva na globalnom tržištu - garantovana likvidnost bilo gde u svetu.",
          },
          {
            title: "The Royal Mint 1g - Velika Britanija",
            body: "Zvanična britanska državna kovnica nudi pločice od 1g sa prepoznatljivim motivom 'Britanije'. Dolaze u sigurnosnom blisteru i nose ogroman istorijski prestiž koji ih čini posebno atraktivnim i kao kolekcionarskim predmetom, ali i kao investicijom.",
          },
        ],
      },
      whyBuy: {
        heading: "Zašto je zlatna pločica od 1g idealan poklon i investicija?",
        description:
          "Pločica od 1g je najmanja i najpristupačnija forma investicionog zlata - ali ne i najmanje vredna. Evo zašto je ovo format koji prodajemo više od bilo kog drugog:",
        cards: [
          {
            title: "Najpopularniji poklon za krštenje i rođenje",
            body: "Koverta sa novcem se lako potroši i brzo zaboravi. Zlatna pločica od 1g je poklon koji ostaje zauvek - čuva vrednost, ne gubi na inflaciji i predstavlja pravo malo blago za dete koje odrasta. Pakovanje blister sertifikata izgleda izuzetno luksuzno i nosi utisak mnogo vrednijeg poklona nego što je njegova cena.",
          },
          {
            title: "Ulaz u investiciono zlato za svaki budžet",
            body: "Ne morate imati visok budžet da biste počeli da štedite u zlatu. Pločica od 1g omogućava vam da kupite malo zlata danas, malo sutra, i postepeno gradite portfolio. Svaki gram koji kupite je gram koji inflacija ne može da pojede.",
          },
          {
            title: "Oslobođena PDV-a - ceo iznos ide u zlato",
            body: "Za razliku od zlatnog nakita iz zlatare (gde plaćate 20% PDV-a i visoku maržu za rad), zlatna pločica od 1g je po zakonu oslobođena svih poreza. Svaki dinar koji date pretvara se direktno u vrednost čistog zlata u vašim rukama.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne pločice od 1g",
        description:
          "Gold Invest vam pruža apsolutnu transparentnost cena - bez skrivenih troškova. Svaka pločica od 1g ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za pločice koje su fizički prisutne u našem trezoru. Uplatite i preuzmite svoje zlato istog dana - bez čekanja.",
        card2Body:
          "Želite da kupite veći broj pločica od 1g odjednom (npr. za poklon na krštenici)? Uplatite iznos unapred, zaključajte trenutnu berzansku cenu i mi robu direktno poručujemo iz kovnice uz značajnu uštedu.",
        card3Body:
          "Garantovani iznos po kom Gold Invest u svakom trenutku otkupljuje vaše pločice - javno istaknut, bez iznenađenja. Likvidnost investicionog zlata je apsolutna.",
      },
      delivery: {
        heading: "Prodaja zlatnih pločica 1g Beograd - Gold Invest",
        description:
          "Kupovina zlatnih pločica od 1g je brza i potpuno bezbedna. Nudimo preuzimanje na više načina - uvek diskretno i osigurano.",
        pickupCardBody:
          "Posetite nas lično u Beogradu. Diskretno okruženje, stručna provera i preuzimanje na licu mesta - bez čekanja.",
      },
      faq: {
        title: "Česta pitanja o zlatnoj pločici od 1g",
        items: [
          {
            q: "Zašto je premija (marža) na pločicu od 1g veća nego na veće formate?",
            a: "Troškovi proizvodnje, pakovanja i sertifikacije su gotovo isti bez obzira da li se kuje pločica od 1g ili od 100g. Kada se ti fiksni troškovi podele na samo 1 gram zlata, premija po gramu je matematički veća. Zato je pločica od 1g idealna kao poklon ili početni korak u štednji, ali ako želite da investirate veću sumu, isplativije je kupiti više pločica od 5g ili 10g.",
          },
          {
            q: "Da li uz pločicu dobijam sertifikat?",
            a: "Da. Pločica dolazi fabrički zapečaćena u čvrstom plastičnom blisteru veličine platne kartice. Na pakovanju su odštampani logo rafinerije, čistoća, težina i jedinstveni serijski broj koji je laserski upisan i na samu pločicu. To pakovanje je vaš sertifikat. Nikada ga ne otvarajte - otvoreno pakovanje trajno smanjuje otkupnu vrednost pločice.",
          },
          {
            q: "Da li se na pločicu od 1g plaća PDV?",
            a: "Ne. Sve pločice čistoće iznad 995/1000 tretiraju se po zakonu kao investiciono zlato i u potpunosti su oslobođene plaćanja PDV-a od 20% i poreza na kapitalnu dobit u Republici Srbiji.",
          },
          {
            q: "Kako da pločicu poklonite kao poklon za krštenje?",
            a: "Pločica od 1g već u svom originalnom blisteru izgleda izuzetno elegantno i luksuzno. Gold Invest dodatno nudi mogućnost pakovanja u ekskluzivnu poklon kutijicu, što dar čini potpuno gotovim za predaju. Kontaktirajte nas za detalje o pakovanju.",
          },
          {
            q: "Koji je limit za plaćanje u gotovini?",
            a: "Zakon o sprečavanju pranja novca dozvoljava gotovinska plaćanja do 1.160.000 dinara (10.000 evra). S obzirom na cenu pločice od 1g, možete bez ikakvih problema kupiti i veći broj pločica i platiti u kešu.",
          },
          {
            q: "Koliko traje isporuka?",
            a: "Za klijente u Beogradu nudimo isporuku dan za dan - ukoliko je porudžbina evidentirana radnim danima do 12h, zlato stiže na vašu adresu istog dana do 18h. Za porudžbine iz ostalih gradova Srbije, diskretna i osigurana dostava traje od 1 do 3 radna dana.",
          },
        ],
      },
    },
  },
  "zlatna-plocica-2g": {
    grams: 2,
    label: "Zlatna pločica 2g",
    metaTitle: "Zlatna pločica 2g | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite zlatnu pločicu 2g čistoće 999,9 - Argor-Heraeus, C. Hafner. Odličan poklon i početni korak u štednji zlata. Oslobođena PDV-a. Brza dostava Beograd i Srbija.",
    intro:
      "Zlatna pločica od 2 grama je savršen balans između simboličnog poklona i ozbiljnog prvog koraka u štednji. Duplo više zlata od najmanjih pločica, uz nešto povoljniju premiju po gramu - a i dalje sadrži 99,99% čistog zlata (24 karata), dolazi u LBMA sertifikovanom blisteru i u potpunosti je oslobođena PDV-a. Poruči putem kontakt forme ili na broj 0614264129 - BRZA dostava!",
    seo: {
      brands: {
        heading: "Naša ponuda - pločice od 2g (LBMA standard)",
        description:
          "Sve pločice od 2g u našoj ponudi potiču od svetski priznatih LBMA rafinerija. Svaka dolazi fabrički zapečaćena - pakovanje je ujedno i sertifikat čistoće 999,9, sa upisanim serijskim brojem.",
        cards: [
          {
            title: "Argor-Heraeus 2g - Švajcarska",
            body: "Švajcarski Argor-Heraeus je jedan od simbola pouzdanosti na globalnom tržištu zlata. Njihova pločica od 2g nosi precizni laserski serijski broj, logo kovnice i oznaku čistoće. Sveden, klasičan dizajn garantuje maksimalnu prepoznatljivost i likvidnost na svim tržištima.",
          },
          {
            title: "C. Hafner 2g - Nemačka",
            body: "Nemačka rafinerija C. Hafner kuje pločice isključivo od recikliranog zlata, što ih čini posebno privlačnim za kupce koji vode računa o etičkom poreklu metala. Pločica od 2g pakuje se u karakteristični tamni blister sa hologramom - elegantan i upečatljiv i kao poklon.",
          },
          {
            title: "The Royal Mint 2g - Velika Britanija",
            body: "Zvanična britanska kovnica, jedna od najstarijih na svetu, nudi pločice od 2g sa prepoznatljivim ikonografskim dizajnom. Dolaze u sigurnosnom blisteru i nose autoritet britanske državne institucije - idealne i za kolekcionare i za investitore.",
          },
        ],
      },
      whyBuy: {
        heading: "Zašto kupiti zlatnu pločicu od 2g?",
        description:
          "Pločica od 2g je idealan kompromis - vredna je više od simbolične pločice od 1g, a i dalje pristupačna kao poklon ili početna štednja. Evo konkretnih razloga:",
        cards: [
          {
            title: "Povoljnija premija nego pločica od 1g",
            body: "Isti fiksni troškovi proizvodnje i pakovanja sada se dele na duplo više grama zlata. To znači da je cena po gramu čistog zlata kod pločice od 2g niža nego kod pločice od 1g - uz isti nivo kvaliteta, pakovanja i sertifikacije. Matematički pametniji korak ako imate budžet.",
          },
          {
            title: "Poklon koji impresionira - za svadbe, krštenja, rođendane",
            body: "Pločica od 2g u svom blisteru izgleda impresivno i luksuzno, a apsolutna vrednost poklona je opipljivo veća od pločice od 1g. Postala je popularni izbor za kumove i blisku rodbinu na krštenjima, ali i kao godišnji poklon partnerima i roditeljima.",
          },
          {
            title: "Početna tačka sistemske štednje",
            body: "Kupovina jedne pločice od 2g mesečno je disciplinovana strategija gradnje zlatnog portfolija. Za godinu dana imate 24 grama investicionog zlata koje je u potpunosti sačuvano od inflacije - bez bankovnih provizija, bez poreza, bez rizika.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne pločice od 2g",
        description:
          "Transparentnost je osnova našeg poslovanja. Svaka pločica od 2g ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za pločice koje su fizički u našem trezoru. Uplatite i preuzmite istog dana - bez čekanja i skrivenih troškova.",
        card2Body:
          "Kupujete više pločica od 2g? Unaprednom uplatom zaključavate trenutnu berzansku cenu i robu direktno poručujemo iz rafinerije uz značajnu uštedu po gramu.",
        card3Body:
          "Iznos po kom Gold Invest garantovano otkupljuje vaše pločice od 2g u svakom trenutku - uvek javno istaknut, bez iznenađenja.",
      },
      delivery: {
        heading: "Prodaja zlatnih pločica 2g Beograd - Gold Invest",
        description:
          "Kupovina pločica od 2g je brza i potpuno bezbedna. Nudimo više načina preuzimanja - uvek diskretno i osigurano.",
        pickupCardBody:
          "Posetite nas lično u Beogradu. Diskretno okruženje, stručna provera autentičnosti i preuzimanje na licu mesta - bez čekanja.",
      },
      faq: {
        title: "Česta pitanja o zlatnoj pločici od 2g",
        items: [
          {
            q: "Koja je razlika između pločice od 1g i 2g - koja se više isplati?",
            a: "Oba formata su odličan izbor, ali pločica od 2g nudi nešto povoljniju premiju (maržu) po gramu, jer se fiksni troškovi proizvodnje i pakovanja dele na duplo više zlata. Ako vam je cilj isključivo poklon sa simboličnom vrednošću - 1g je dovoljna. Ako želite maksimalnu vrednost za isti budžet - 2g je pametniji izbor.",
          },
          {
            q: "Da li uz pločicu dobijam sertifikat?",
            a: "Da. Pločica dolazi fabrički zapečaćena u čvrstom blisteru sa logom rafinerije, čistoćom, težinom i jedinstvenim serijskim brojem laserski upisanim i na samu pločicu. To pakovanje je vaš sertifikat. Nikada ga ne otvarajte - otvoreno pakovanje smanjuje otkupnu vrednost.",
          },
          {
            q: "Da li se na pločicu od 2g plaća PDV?",
            a: "Ne. Sve pločice čistoće iznad 995/1000 po zakonu su investiciono zlato i potpuno su oslobođene PDV-a od 20% i poreza na kapitalnu dobit u Srbiji.",
          },
          {
            q: "Mogu li da kupim više pločica odjednom?",
            a: "Apsolutno. Kupovina veće količine pločica od 2g je čest slučaj - bilo za poklone (krštenja, svadbe), bilo za sistematsku mesečnu štednju. Za veće količine preporučujemo avansnu kupovinu kojom zaključavate povoljniju cenu.",
          },
          {
            q: "Koji je limit za plaćanje u gotovini?",
            a: "Zakon dozvoljava gotovinska plaćanja do 1.160.000 dinara (10.000 evra). S obzirom na cenu pločice od 2g, bez ikakvih problema možete kupiti veći broj i platiti u kešu.",
          },
          {
            q: "Koliko traje isporuka?",
            a: "Za klijente u Beogradu nudimo isporuku dan za dan - porudžbine evidentirane radnim danima do 12h stižu istog dana do 18h. Za ostatak Srbije, diskretna i osigurana dostava traje 1 do 3 radna dana.",
          },
        ],
      },
    },
  },
  "zlatna-plocica-5g": {
    grams: 5,
    label: "Zlatna pločica 5g",
    metaTitle: "Zlatna pločica 5g | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite zlatnu pločicu 5g čistoće 999,9 - Argor-Heraeus, C. Hafner. Najpopularniji format za mesečnu štednju u zlatu. Oslobođena PDV-a. Brza dostava Beograd i Srbija.",
    intro:
      "Zlatna pločica od 5 grama je najpopularniji format za sistematsku mesečnu štednju u zlatu. Nudi značajno povoljniju premiju po gramu u poređenju sa manjim pločicama, dovoljno je pristupačna da je možete kupovati redovno, a dovoljno vredna da za godinu dana osetite razliku. Sadrži 99,99% čistog zlata (24 karata), potpuno je oslobođena PDV-a. Poruči putem kontakt forme ili na broj 0614264129 - BRZA dostava!",
    seo: {
      brands: {
        heading: "Naša ponuda - pločice od 5g (LBMA standard)",
        description:
          "Sve pločice od 5g u našoj ponudi kuju se u rafinerijama sa LBMA liste - svetskog standarda za investiciono zlato. Svaka dolazi fabrički zapečaćena u sigurnosnom blisteru koji je ujedno i sertifikat čistoće 999,9.",
        cards: [
          {
            title: "Argor-Heraeus 5g - Švajcarska",
            body: "Argor-Heraeus je referentna švajcarska rafinerija i jedan od najprepoznatljivijih brendova u svetu investicionog zlata. Njihova pločica od 5g je klasičan, sveden dizajn sa serijskim brojem, logom i oznakom čistoće - garantovana likvidnost na svim kontinentima.",
          },
          {
            title: "C. Hafner 5g - Nemačka",
            body: "Nemačka rafinerija C. Hafner sa tradicijom od 170+ godina kuje pločice isključivo od recikliranog zlata. Pločica od 5g dolazi u elegantnom tamnom blisteru sa hologramom. Posebno popularna među kupcima koji cene etičko poreklo metala uz vrhunski nemački kvalitet.",
          },
          {
            title: "The Royal Mint 5g - Velika Britanija",
            body: "Britanska državna kovnica nudi pločice od 5g sa prepoznatljivim ikonografskim dizajnom i autoritetom jedne od najstarijih kovnica na svetu. Dolaze u sigurnosnom blisteru i odličan su izbor za kolekcionare koji žele da kombinuju estetiku i investicionu vrednost.",
          },
        ],
      },
      whyBuy: {
        heading: "Zašto je zlatna pločica od 5g idealna za mesečnu štednju?",
        description:
          "Format od 5 grama je tačka na kojoj premija po gramu počinje ozbiljno da pada, a vrednost svake kupovine počinje ozbiljno da raste. Evo zašto ga preporučujemo svima koji žele da sistematski grade portfolio:",
        cards: [
          {
            title: "Značajno niža premija nego kod 1g i 2g",
            body: "Na pločici od 5g isti fiksni troškovi proizvodnje i sertifikacije dele se na 5 puta više zlata nego kod pločice od 1g. Rezultat: cena po gramu čistog zlata je osetno niža. To je finansijski najvažnija razlika - za isti budžet dobijate više stvarnog zlata.",
          },
          {
            title: "Optimalan format za mesečnu štednju",
            body: "Kupovina jedne pločice od 5g mesečno je strategija kojom za godinu dana akumulirate 60 grama investicionog zlata. Svaki gram je zaštićen od inflacije, dostupan u svakom trenutku, i može se unovčiti bez poreza. Banka ne može to da vam ponudi.",
          },
          {
            title: "Dovoljno mala da je fleksibilna, dovoljno velika da je vredna",
            body: "Za razliku od poluga od 50g ili 100g koje morate prodati odjednom, pločice od 5g vam daju kontrolu - prodate tačno onoliko koliko vam treba. Kombinacija fleksibilnosti i povoljne premije čini je „zlatnim standardom“ u kategoriji pločica.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne pločice od 5g",
        description:
          "Transparentnost je osnova našeg poslovanja. Svaka pločica od 5g ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za pločice koje su fizički u našem trezoru. Uplatite i preuzmite zlato istog dana - bez čekanja.",
        card2Body:
          "Kupujete 5, 10 ili više pločica od 5g? Avansom zaključavate trenutnu berzansku cenu i robu direktno poručujemo iz rafinerije (Švajcarska, Nemačka). Vi dobijate najpovoljniju moguću cenu.",
        card3Body:
          "Garantovani iznos po kom Gold Invest otkupljuje vaše pločice od 5g - uvek javno istaknut. Zbog visoke likvidnosti ovog formata, spread je minimalan.",
      },
      delivery: {
        heading: "Prodaja zlatnih pločica 5g Beograd - Gold Invest",
        description:
          "Kupovina pločica od 5g je brza i potpuno bezbedna. Nudimo više načina preuzimanja - uvek diskretno i maksimalno osigurano.",
        pickupCardBody:
          "Posetite nas lično u Beogradu. Stručna provera autentičnosti i preuzimanje na licu mesta - bez čekanja, u potpuno diskretnom okruženju.",
      },
      faq: {
        title: "Česta pitanja o zlatnoj pločici od 5g",
        items: [
          {
            q: "Da li je pločica od 5g bolja investicija od pločice od 1g?",
            a: "Sa čisto finansijskog stanovišta - da. Premija (marža) po gramu je niža kod pločice od 5g jer se fiksni troškovi proizvodnje i sertifikacije dele na pet puta više zlata. Međutim, pločica od 1g ima prednost kao poklon (simbolična vrednost, pristupačna cena). Za sistematsku štednju i investiranje, 5g je osetno isplativiji format.",
          },
          {
            q: "Da li uz pločicu dobijam sertifikat?",
            a: "Da. Pločica dolazi fabrički zapečaćena u čvrstom blisteru sa logom rafinerije, čistoćom, težinom i jedinstvenim serijskim brojem laserski upisanim i na samu pločicu. To pakovanje je vaš sertifikat autentičnosti. Zlatno pravilo: nikada ga ne otvarajte.",
          },
          {
            q: "Da li se na pločicu od 5g plaća PDV?",
            a: "Ne. Sve pločice čistoće iznad 995/1000 tretiraju se po zakonu kao investiciono zlato i potpuno su oslobođene PDV-a i poreza na kapitalnu dobit u Srbiji.",
          },
          {
            q: "Koliko pločica od 5g treba kupiti da bi štednja imala smisla?",
            a: "Ne postoji minimalni prag - čak i jedna pločica mesečno je korisna. Međutim, većina naših klijenata koji redovno štede bira ritam od 2 do 4 pločice mesečno (10g do 20g), što im godišnje daje 120g do 240g zlata - ozbiljan finansijski jastuk.",
          },
          {
            q: "Koji je limit za plaćanje u gotovini?",
            a: "Zakon dozvoljava gotovinska plaćanja do 1.160.000 dinara (10.000 evra). Možete bez problema kupiti veći broj pločica od 5g i platiti u kešu.",
          },
          {
            q: "Koliko traje isporuka?",
            a: "Za klijente u Beogradu nudimo isporuku dan za dan - porudžbine evidentirane radnim danima do 12h stižu istog dana do 18h. Za ostatak Srbije, diskretna i osigurana dostava traje 1 do 3 radna dana.",
          },
        ],
      },
    },
  },
  "zlatna-plocica-10g": {
    grams: 10,
    label: "Zlatna pločica 10g",
    metaTitle: "Zlatna pločica 10g | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite LBMA sertifikovanu zlatnu pločicu 10g čistoće 999,9 - Argor-Heraeus, C. Hafner, The Royal Mint. Idealna za redovnu štednju i poklon. Transparentne cene, brza dostava.",
    intro:
      "Zlatna pločica 10 grama je idealan izbor za redovnu mesečnu štednju, ali i kao izuzetno vredan i prestižan poklon. U našoj ponudi se nalaze isključivo pločice čistoće 999,9 svetskih lidera: Argor-Heraeus, C. Hafner i The Royal Mint. Poruči putem kontakt forme ili na broj 0614264129 - BRZA dostava!",
    seo: {
      brands: {
        heading: "Naša ponuda - evropski brendovi (LBMA standard)",
        description:
          "Sve pločice su investiciono zlato koje ispunjava najstrože svetske LBMA ('Good Delivery') standarde, maksimalne finoće od 99.99% (24 karata) i dolaze fabrički zapečaćene u sigurnosnom blister pakovanju - vaš zvanični sertifikat.",
        cards: [
          {
            title: "Argor-Heraeus 10g - Švajcarska",
            body: "Švajcarski Argor-Heraeus je jedna od najvećih rafinerija na svetu. Njihova pločica od 10g odlikuje se svedenim, klasičnim dizajnom sa jasno istaknutim logotipom, težinom, oznakom čistoće i jedinstvenim serijskim brojem. Izuzetno je tražena i priznata na svim kontinentima.",
          },
          {
            title: "C. Hafner 10g - Nemačka",
            body: "C. Hafner je prestižna nemačka rafinerija sa tradicijom od preko 170 godina. Njihove pločice su posebno cenjene jer dolaze isključivo od recikliranog zlata - besprekorna izrada (999,9) uz nulti negativan uticaj na životnu sredinu. Pakuju se u elegantne, tamne blister sertifikate.",
          },
          {
            title: "The Royal Mint Britannia 10g - Britanija",
            body: "Zvanična državna kovnica Velike Britanije nudi pločicu koja je pravo umetničko delo. Na njoj se nalazi prepoznatljivi motiv 'Britanije' - simbola britanske pomorske moći. Dolazi u sigurnosnom blisteru i često je prvi izbor kolekcionara.",
          },
        ],
      },
      whyBuy: {
        heading: "Zašto je zlatna pločica od 10g idealna investicija?",
        description:
          "Format od 10 grama se smatra 'kraljem pametne štednje'. Ukoliko tek ulazite u svet plemenitih metala, ovo je idealna gramaža - a evo i zašto:",
        cards: [
          {
            title: "Odlična cena po gramu",
            body: "Za razliku od najmanjih pločica (1g ili 2g) gde su troškovi proizvodnje u odnosu na količinu zlata viši, pločica od 10g nudi znatno nižu premiju (maržu) - što je čini matematički veoma isplativom investicijom.",
          },
          {
            title: "Maksimalna fleksibilnost i likvidnost",
            body: "Ako uložite novac u velike zlatne poluge, a zatreba vam samo manji iznos gotovine, moraćete da prodate celu polugu. Kupovinom više pločica od 10g zadržavate potpunu kontrolu - unovčite samo onoliko grama koliko vam je u tom trenutku potrebno.",
          },
          {
            title: "Vredan poklon za krštenje ili rođenje",
            body: "Koverta sa novcem se lako potroši i brzo zaboravi. Zlatna pločica od 10 grama je jedan od najupečatljivijih poklona koji ostaje zauvek, ali i čuva vrednost za onoga kome je poklonjena.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne pločice od 10g",
        description:
          "Gold Invest vam pruža apsolutnu transparentnost cena zlata - bez skrivenih troškova. Svaka pločica od 10g ima jasno istaknute sve tri cene:",
        card1Body:
          "Važi za pločice koje su fizički prisutne u našem trezoru. Uplatite i preuzmite svoje zlato istog dana.",
        card2Body:
          "Želite da kupite 5, 10 ili više pločica od 10g? Uplatite celokupni iznos unapred i zaključajte trenutnu berzansku cenu. Mi robu direktno poručujemo iz kovnica (Švajcarska, Nemačka, Britanija), a vi dobijate najpovoljniju moguću cenu.",
        card3Body:
          "Garantovani iznos po kojem Gold Invest u svakom trenutku otkupljuje vaše pločice. Zbog ogromne popularnosti gramaže od 10g, naš spread (razlika između prodajne i otkupne cene) je minimalan.",
      },
      delivery: {
        heading: "Prodaja zlatnih pločica 10g Beograd - Gold Invest",
        description:
          "Kupovina zlatnih pločica od 10g je brza i bezbedna. Nudimo tri načina preuzimanja - uvek diskretno i osigurano.",
        pickupCardBody:
          "Čekamo vas u sigurnoj kancelariji u Beogradu. Bez čekanja, u potpuno diskretnom okruženju.",
      },
      faq: {
        title: "Česta pitanja o zlatnoj pločici od 10g",
        items: [
          {
            q: "Šta predstavlja oznaka 999,9?",
            a: "Oznaka 999,9 (poznata i kao 'četiri devetke') predstavlja maksimalan nivo čistoće investicionog zlata koji se može postići u rafinerijskoj obradi. To znači da je vaša zlatna pločica izrađena od 99,99% čistog zlata, što u potpunosti odgovara vrednosti od 24 karata. Kod investicionih pločica, ovo je ultimativni standard koji garantuje maksimalnu likvidnost i oslobađanje od poreza.",
          },
          {
            q: "Da li uz pločicu dobijam sertifikat?",
            a: "Da. Sama pločica je isporučena iz kovnice u čvrstom plastičnom pakovanju (blisteru) veličine platne bankovne kartice. Na tom pakovanju su jasno odštampani logo rafinerije, čistoća, težina i jedinstveni serijski broj koji je laserski upisan i na samu pločicu. To pakovanje predstavlja vaš neosporivi sertifikat. Zlatno pravilo: nikada ne otvarajte i ne sečete pakovanje, jer time trajno narušavate vrednost svog zlata.",
          },
          {
            q: "Da li se na pločicu od 10g plaća PDV?",
            a: "Ne. Sve pločice od 10 grama u našoj ponudi ispunjavaju zakonski uslov čistoće iznad 995/1000 (naše su 999,9), što znači da se tretiraju kao investiciono zlato i u potpunosti su oslobođene plaćanja PDV-a i poreza na kapitalnu dobit u Republici Srbiji.",
          },
          {
            q: "Koji je limit za plaćanje u gotovini?",
            a: "Zakon o sprečavanju pranja novca dozvoljava gotovinska plaćanja do maksimalnog iznosa od 1.160.000 dinara (10.000 evra). S obzirom na trenutne cene na berzi, kupovinu jedne ili čak nekoliko pločica od 10 grama možete bez ikakvih problema obaviti i platiti u kešu. Sve kupovine preko zakonskog limita vrše se bezgotovinski, transferom preko računa.",
          },
          {
            q: "Mogu li da plaćam platnom karticom?",
            a: "Ne, plaćanje platnim karticama trenutno nije moguće. Razlog za to su visoke provizije banaka (često i do 2–3%) koje bi neizbežno morale da se ugrade u krajnju cenu zlata. Naš cilj je da vam obezbedimo najpovoljniju moguću cenu na tržištu bez skrivenih troškova, zbog čega prihvatamo isključivo plaćanje gotovinom, bankovnim transferom ili pouzećem.",
          },
          {
            q: "Koliko traje isporuka?",
            a: "Za klijente u Beogradu nudimo isporuku dan za dan - ukoliko je porudžbina evidentirana radnim danima do 12h, zlato stiže na vašu adresu istog dana do 18h. Za porudžbine iz ostalih gradova Srbije, diskretna i osigurana dostava traje od 1 do 3 radna dana (ovo ne važi za avansne kupovine, za koje se rok isporuke precizno definiše pri samoj kupovini).",
          },
        ],
      },
    },
  },
  "zlatna-plocica-20g": {
    grams: 20,
    label: "Zlatna pločica 20g",
    metaTitle: "Zlatna pločica 20g | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite zlatnu pločicu 20g čistoće 999,9 - Argor-Heraeus, C. Hafner. Najbolja premija u kategoriji pločica. Oslobođena PDV-a. Transparentne cene, brza dostava.",
    intro:
      "Zlatna pločica od 20 grama je najveći format u kategoriji pločica i nudi najbolju premiju po gramu u celoj liniji - bez kompromisa po pitanju fleksibilnosti. Sadrži 99,99% čistog zlata (24 karata), dolazi u LBMA sertifikovanom blisteru i u potpunosti je oslobođena PDV-a. Idealna za ozbiljne investitore koji žele veću vrednost u kompaktnom formatu. Poruči putem kontakt forme ili na broj 0614264129 - BRZA dostava!",
    seo: {
      brands: {
        heading: "Naša ponuda - pločice od 20g (LBMA standard)",
        description:
          "Sve pločice od 20g u našoj ponudi kuju se isključivo u rafinerijama sa LBMA 'Good Delivery' liste - globalnog standarda koji garantuje čistotu od 99,99%, tačnu gramažu i legalno poreklo metala.",
        cards: [
          {
            title: "Argor-Heraeus 20g - Švajcarska",
            body: "Švajcarski Argor-Heraeus je jedan od najvećih svetskih procesora plemenitih metala i sinonim za pouzdanost. Njihova pločica od 20g odlikuje se preciznom izradom, jasno istaknutim serijskim brojem i logom - maksimalna prepoznatljivost na globalnom tržištu garantuje i maksimalnu likvidnost.",
          },
          {
            title: "C. Hafner 20g - Nemačka",
            body: "Nemačka rafinerija C. Hafner sa 170 godina tradicije kuje pločice isključivo od recikliranog zlata. Format od 20g je jedan od njihovih najtraženijih - dolazi u karakterističnom tamnom blisteru sa hologramom i kombinuje etičko poreklo sa besprekornom izradom.",
          },
          {
            title: "The Royal Mint 20g - Velika Britanija",
            body: "Britanska državna kovnica nudi pločice od 20g sa prepoznatljivim dizajnom i autoritetom jedne od najstarijih i najuglednijih institucija u svetu kovanog novca. Dolaze u sigurnosnom blisteru - odličan izbor za ozbiljne investitore i kolekcionare.",
          },
        ],
      },
      whyBuy: {
        heading: "Zašto je zlatna pločica od 20g idealna za ozbiljnog investitora?",
        description:
          "Format od 20g je tačka na kojoj pločice prestaju da budu „poklon format“ i postaju pravo investiciono sredstvo. Evo konkretnih razloga zašto ovaj format privlači ozbiljne investitore:",
        cards: [
          {
            title: "Najbolja premija u celoj kategoriji pločica",
            body: "Pločica od 20g nudi najnižu premiju (maržu) po gramu od svih pločica u našoj ponudi. Fiksni troškovi proizvodnje i sertifikacije se ovde dele na 20 grama zlata, što rezultira cenom po gramu koja se polako približava onoj kod malih poluga - ali uz zadržanu fleksibilnost pločice.",
          },
          {
            title: "Fleksibilnost kakvu poluge ne mogu da pruže",
            body: "Zlatna poluga od 50g ili 100g mora se prodati odjednom. Pločica od 20g je i dalje jedan komad koji možete unovčiti kada vam tačno ta vrednost zatreba - bez prinudne prodaje više zlata nego što je potrebno. Idealno za gradnju portfolija koji možete precizno kontrolisati.",
          },
          {
            title: "Ozbiljna vrednost, kompaktan format",
            body: "Pločica od 20g ima vrednost koja ozbiljno impresionira, a fizički je manja od bankovne kartice. To je format koji lako uskladištite, čuvate i po potrebi nosite - bez birokratije, bez troškova čuvanja, bez posrednika.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne pločice od 20g",
        description:
          "Transparentnost je osnova našeg poslovanja. Svaka pločica od 20g ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za pločice koje su fizički u našem trezoru. Uplatite i preuzmite zlato istog dana - bez čekanja i skrivenih troškova.",
        card2Body:
          "Kupujete više pločica od 20g ili želite što bolju cenu po gramu? Avansnom uplatom zaključavate trenutnu berzansku cenu i mi robu direktno poručujemo iz rafinerije. Ovo je opcija sa kojom naši klijenti najčešće ostvare najveću uštedu.",
        card3Body:
          "Garantovani iznos po kom Gold Invest u svakom trenutku otkupljuje vaše pločice od 20g - uvek javno istaknut. Zbog visoke vrednosti ovog formata, spread je među najnižima u celoj ponudi.",
      },
      delivery: {
        heading: "Prodaja zlatnih pločica 20g Beograd - Gold Invest",
        description:
          "Kupovina pločica od 20g je brza i potpuno bezbedna. Nudimo više načina preuzimanja - uvek diskretno i maksimalno osigurano.",
        pickupCardBody:
          "Posetite nas lično u Beogradu. Stručna provera autentičnosti i preuzimanje na licu mesta - bez čekanja, u potpuno diskretnom okruženju.",
      },
      faq: {
        title: "Česta pitanja o zlatnoj pločici od 20g",
        items: [
          {
            q: "Koja je razlika između pločice od 20g i poluge od 50g?",
            a: "Oba formata su LBMA investiciono zlato čistoće 999,9 i oba su oslobođena PDV-a. Ključna razlika je u premiji i fleksibilnosti. Poluga od 50g nudi još nižu premiju po gramu, ali je morate prodati odjednom. Pločica od 20g je nešto skuplja po gramu, ali je jedan komad koji možete unovčiti tačno kada vam ta specifična vrednost zatreba. Za portfolije ispod 200g ukupne težine, 20g pločice su često pametniji izbor.",
          },
          {
            q: "Da li uz pločicu dobijam sertifikat?",
            a: "Da. Pločica dolazi fabrički zapečaćena u čvrstom blisteru sa logom rafinerije, čistoćom, težinom i jedinstvenim serijskim brojem laserski upisanim i na samu pločicu. To pakovanje je vaš sertifikat. Nikada ga ne otvarajte - otvoreno pakovanje smanjuje otkupnu vrednost.",
          },
          {
            q: "Da li se na pločicu od 20g plaća PDV?",
            a: "Ne. Sve pločice čistoće iznad 995/1000 tretiraju se po zakonu kao investiciono zlato i potpuno su oslobođene PDV-a od 20% i poreza na kapitalnu dobit u Republici Srbiji.",
          },
          {
            q: "Koji je limit za plaćanje u gotovini?",
            a: "Zakon dozvoljava gotovinska plaćanja do 1.160.000 dinara (10.000 evra). U zavisnosti od trenutne cene zlata, jedna pločica od 20g se najčešće može platiti u gotovini. Za više pločica ili veće iznose, koristimo bankovni transfer.",
          },
          {
            q: "Mogu li da platim platnom karticom?",
            a: "Ne, plaćanje karticama trenutno nije moguće. Visoke bankarske provizije (2–3%) bi se neizbežno ugradile u cenu zlata - a naš cilj je da vam obezbedimo najpovoljniju cenu na tržištu. Prihvatamo gotovinu, bankovni transfer i pouzećem.",
          },
          {
            q: "Koliko traje isporuka?",
            a: "Za klijente u Beogradu nudimo isporuku dan za dan - porudžbine evidentirane radnim danima do 12h stižu istog dana do 18h. Za ostatak Srbije, diskretna i osigurana dostava traje 1 do 3 radna dana.",
          },
        ],
      },
    },
  },
};

// ── Static params (SSG) ────────────────────────────────────────────────────
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
      canonical: `https://goldinvest.rs/kategorija/zlatne-plocice/${slug}`,
    },
  };
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function PlocicaWeightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = WEIGHT_CONFIGS[slug];
  if (!config) notFound();

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
        .eq("weight_g", config.grams)
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

  const breadcrumbs = [
    { label: "Investiciono zlato", href: "/" },
    { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
    { label: config.label, href: `/kategorija/zlatne-plocice/${slug}` },
  ];

  const heroImg =
    variants?.[0]?.images?.[0] ?? "/images/product-poluga.webp";
  const heroTitle = config.label.replace("g", " grama");

  return (
    <main className="bg-white">
      {/* Schema.org */}
      <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
      {config.seo && (
        <SchemaScript schema={buildFaqSchema(config.seo.faq.items)} />
      )}

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={breadcrumbs} variant="light" />
        </SectionContainer>
      </section>

      {/* ── Hero (homepage style) ────────────────────────────────────────── */}
      <section
        className="overflow-hidden py-6"
        style={{
          background: "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            {/* Left image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#F9F9F9]" style={{ height: 320 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* Image is handled by next/image via component below */}
              <Image
                src={heroImg}
                alt={config.label}
                fill
                className="object-contain p-8"
              />
            </div>

            {/* Right content */}
            <div className="text-left md:text-left">
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
                  href="tel:+381614264129"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-[#BEAD87] text-[#1B1B1C] font-semibold transition-opacity hover:opacity-90"
                  style={{ fontSize: 12.1 }}
                >
                  POZOVITE +381 61/426 4129
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Offer section ─────────────────────────────────────────────── */}
      <section className="bg-white py-12 border-t border-[#F0EDE6]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <h2
            className="text-[#1B1B1C] mb-8"
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontWeight: 500,
              letterSpacing: "-0.5px",
              fontSize: 22,
            }}
          >
            PONUDA U OVOJ KATEGORIJI
          </h2>

          <ProductGrid
            variants={variants as any}
            tiers={tiers}
            snapshot={snapshotRow}
            hideFilterSortBar
            gridClassName="grid grid-cols-1 sm:grid-cols-3 gap-6"
            maxItems={9}
          />
        </div>
      </section>

      {/* ── SEO content sections (only for slugs with a full SEO document) ── */}
      {config.seo && (
        <>
          {/* H2: Zašto je idealna investicija */}
          <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
            <SectionContainer>
              <SectionHeading
                title={config.seo.whyBuy.heading}
                description={config.seo.whyBuy.description}
              />

              {/* Creative layout: 1 highlighted reason + 2 supporting reasons */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-[1.02fr_0.98fr] gap-8 items-stretch">
                {/* Highlight: 1 */}
                <div className="relative bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl p-6 sm:p-8 overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#BEAD87]/20 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-start gap-3 mb-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#1B1B1C] text-white text-sm font-semibold shrink-0">
                        1
                      </span>
                      <div className="pt-1">
                        <p className="text-[#BF8E41] text-[11px] font-semibold tracking-widest uppercase mb-2">
                          Najveći benefit
                        </p>
                        <p className="text-[#1B1B1C] text-[15px] sm:text-[16px] font-semibold leading-snug mb-0">
                          {config.seo.whyBuy.cards[0]?.title}
                        </p>
                      </div>
                    </div>
                    <p className="text-[#6B6B6B] text-[13.5px] sm:text-[14px] leading-relaxed mb-0">
                      {config.seo.whyBuy.cards[0]?.body}
                    </p>
                    <div className="mt-7 h-px w-16 bg-[#BEAD87]" />
                  </div>
                </div>

                {/* Right: 2 + 3 (single grouped block) */}
                <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl overflow-hidden">
                  <div className="px-5 sm:px-6 py-4 sm:py-5 bg-white/40 border-b border-[#F0EDE6]">
                    <p className="text-[#1B1B1C] text-[14px] sm:text-[15px] font-semibold leading-snug mb-0">
                      Još dve ključne stvari
                    </p>
                  </div>

                  <div className="divide-y divide-[#F0EDE6]">
                    {config.seo.whyBuy.cards.slice(1, 3).map((card, i) => {
                      const number = i + 2;
                      return (
                        <div
                          key={card.title}
                          className="p-5 sm:p-6 flex items-start gap-3"
                        >
                          <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#1B1B1C] text-white text-sm font-semibold shrink-0">
                            {number}
                          </span>
                          <div>
                            <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-1">
                              {card.title}
                            </p>
                            <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                              {card.body}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SectionContainer>
          </section>

          {/* H2: Cena */}
          <PriceStructureSection
            title={config.seo.priceStructure.title}
            description={config.seo.priceStructure.description}
            card1Body={config.seo.priceStructure.card1Body}
            card2Body={config.seo.priceStructure.card2Body}
            card3Body={config.seo.priceStructure.card3Body}
          />

          {/* H2: Naša ponuda - evropski brendovi (LBMA standard) */}
          <div className="mt-6">
            <BrandCardsSection
              title={config.seo.brands.heading}
              description={config.seo.brands.description}
              brands={mapBrandsToLogos(config.seo.brands.cards)}
            />
          </div>

          {/* H2: Prodaja / Dostava */}
          <DeliverySection
            heading={config.seo.delivery.heading}
            description={config.seo.delivery.description}
            pickupCardBody={config.seo.delivery.pickupCardBody}
          />

          {/* H2: Česta pitanja */}
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
