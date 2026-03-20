import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { PriceStructureSection } from "@/components/catalog/PriceStructureSection";
import { DeliverySection } from "@/components/catalog/DeliverySection";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCard } from "@/components/ui/InfoCard";
import { BrandCardsSection, type BrandCard } from "@/components/catalog/BrandCardsSection";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildFaqSchema, buildProductSchema } from "@/lib/schema";

function mapBrandsToLogos(brands: { title: string; body: string }[]): BrandCard[] {
  return brands.map((b) => {
    const rawTitle = b.title ?? "";
    const lower = rawTitle.toLowerCase();

    let img = "/images/brands/bento-center-gold.png";
    let origin = "—";

    if (lower.includes("argor")) {
      img = "/images/brands/argor-heraeus.png";
      origin = "Švajcarska";
    } else if (lower.includes("hafner")) {
      img = "/images/brands/c-hafner.png";
      origin = "Nemačka";
    } else if (lower.includes("royal mint") || lower.includes("britannia")) {
      img = "/images/brands/logo-royal-mint.png";
      origin = "Britanija";
    }

    const left = rawTitle.split("—")[0]?.trim() ?? rawTitle.trim();
    // remove trailing weight part, e.g. "10g"
    const cleanedTitle = left.replace(/\s*\d+\s*g\s*$/i, "").trim();

    return {
      img,
      title: cleanedTitle || rawTitle,
      origin,
      text: b.body,
    };
  });
}

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
  /** Extended SEO content — only defined for slugs with a full SEO document */
  seo?: SeoSections;
};

// ── Weight config per slug ─────────────────────────────────────────────────

const WEIGHT_CONFIGS: Record<string, WeightConfig> = {
  "zlatna-plocica-1g": {
    grams: 1,
    label: "Zlatna pločica 1g",
    metaTitle: "Zlatna pločica 1g | Cena i Prodaja - Gold Invest Beograd",
    metaDescription:
      "Kupite zlatnu pločicu 1g čistoće 999,9 — C. Hafner, Argor-Heraeus. Najpopularniji poklon za krštenje i rođenje, oslobođen PDV-a. Transparentne cene, brza dostava.",
    intro:
      "Zlatna pločica od 1 grama je najpristupačniji ulaz u svet investicionog zlata i apsolutni broj jedan kada je reč o poklonima za krštenje i rođenje. Sadrži 99,99% čistog zlata (24 karata), dolazi fabrički zapečaćena u sigurnosnom blisteru koji je ujedno i sertifikat — i u potpunosti je oslobođena PDV-a. Poruči putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    seo: {
      brands: {
        heading: "Nasa ponuda — plocice od 1g (LBMA standard)",
        description:
          "Sve plocice od 1g koje nudimo poticu iskljucivo od svetski priznatih rafinerija sa LBMA liste. Svaka dolazi fabricki zapecacena u sigurnosno blister pakovanje velicine bankovne kartice — vas zvanicni sertifikat cistote 999,9.",
        cards: [
          {
            title: "C. Hafner 1g — Nemacka",
            body: "Nemacka rafinerija C. Hafner posebno je cenjena zbog svog ekoloskog pristupa — sve njihove plocice se kuju iskljucivo od recikliranog zlata, bez negativnog uticaja na zivotnu sredinu. Njihova plocica od 1g dolazi u elegantnom, tamnom blister pakovanju sa hologramom i karakteristicnim, modernim dizajnom. Odlican izbor za one koji zele spoj kvaliteta i eticke proizvodnje.",
          },
          {
            title: "Argor-Heraeus 1g — Svajcarska",
            body: "Svajcarski Argor-Heraeus je jedan od industrijskih standarda u svetu rafinerisanja zlata. Njihova plocica od 1g odlikuje se cistim, klasicnim dizajnom sa jasno istaknutim logotipom, tezinom, oznakom cistote i serijskim brojem. Izuzetno je trazena i prepoznatljiva na globalnom trzistu — garantovana likvidnost bilo gde u svetu.",
          },
          {
            title: "The Royal Mint 1g — Velika Britanija",
            body: "Zvanicna britanska drzavna kovnica nudi plocice od 1g sa prepoznatljivim motivom 'Britanije'. Dolaze u sigurnosnom blisteru i nose ogroman istorijski prrestiz koji ih cini posebno atraktivnim i kao kolekcionarskim predmetom, ali i kao investicijom.",
          },
        ],
      },
      whyBuy: {
        heading: "Zasto je zlatna plocica od 1g idealan poklon i investicija?",
        description:
          "Plocica od 1g je najmanja i najpristupacnija forma investicionog zlata — ali ne i najmanje vredna. Evo zasto je ovo format koji prodajemo vise od bilo kog drugog:",
        cards: [
          {
            title: "Najpopularniji poklon za krstenje i rodjenje",
            body: "Koverta sa novcem se lako potrosi i brzo zaboravi. Zlatna plocica od 1g je poklon koji ostaje zauvek — cuva vrednost, ne gubi na inflaciji i predstavlja pravo malo blago za dete koje odrasta. Pakovanje blister sertifikata izgleda izuzetno luksuzno i nosi utisak mnogo vrednijeg poklona nego sto je njegova cena.",
          },
          {
            title: "Ulaz u investiciono zlato za svaki budzet",
            body: "Ne morate imati visok budzet da biste poceli da stedite u zlatu. Plocica od 1g omogucava vam da kupite malo zlata danas, malo sutra, i postepeno gradite portfolio. Svaki gram koji kupite je gram koji inflacija ne moze da pojede.",
          },
          {
            title: "Oslobodjena PDV-a — ceo iznos ide u zlato",
            body: "Za razliku od zlatnog nakita iz zlatare (gde placate 20% PDV-a i visoku marzu za rad), zlatna plocica od 1g je po zakonu oslobodjena svih poreza. Svaki dinar koji date pretvara se direktno u vrednost cistog zlata u vasim rukama.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne plocice od 1g",
        description:
          "Gold Invest vam pruza apsolutnu transparentnost cena — bez skrivenih troskova. Svaka plocica od 1g ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za plocice koje su fizicki prisutne u nasem trezoru. Uplatite i preuzmite svoje zlato istog dana — bez cekanja.",
        card2Body:
          "Zelite da kupite veci broj plocica od 1g odjednom (npr. za poklon na krstenici)? Uplatite iznos unapred, zakljucajte trenutnu berzansku cenu i mi robu direktno porucujemo iz kovnice uz znacajnu ustedu.",
        card3Body:
          "Garantovani iznos po kom Gold Invest u svakom trenutku otkupljuje vase plocice — javno istaknut, bez iznenadenja. Likvidnost investicionog zlata je apsolutna.",
      },
      delivery: {
        heading: "Prodaja zlatnih plocica 1g Beograd — Gold Invest",
        description:
          "Kupovina zlatnih plocica od 1g je brza i potpuno bezbedna. Nudimo preuzimanje na vise nacina — uvek diskretno i osigurano.",
        pickupCardBody:
          "Posetite nas licno u Beogradu. Diskretno okruzenje, strucna provera i preuzimanje na licu mesta — bez cekanja.",
      },
      faq: {
        title: "Cesta pitanja o zlatnoj plocici od 1g",
        items: [
          {
            q: "Zasto je premija (marza) na plocicu od 1g veca nego na vece formate?",
            a: "Troskovi proizvodnje, pakovanja i sertifikacije su gotovo isti bez obzira da li se kuje plocica od 1g ili od 100g. Kada se ti fiksni troskovi podele na samo 1 gram zlata, premija po gramu je matematicki veca. Zato je plocica od 1g idealna kao poklon ili pocetni korak u stednji, ali ako zelite da investirate vecu sumu, isplativije je kupiti vise plocica od 5g ili 10g.",
          },
          {
            q: "Da li uz plocicu dobijam sertifikat?",
            a: "Da. Plocica dolazi fabricki zapecacena u cvrstom plasticnom blisteru velicine platne kartice. Na pakovanju su odstampani logo rafinerije, cistota, tezina i jedinstveni serijski broj koji je laserski upisan i na samu plocicu. To pakovanje je vas sertifikat. Nikada ga ne otvarajte — otvoreno pakovanje trajno smanjuje otkupnu vrednost plocice.",
          },
          {
            q: "Da li se na plocicu od 1g placa PDV?",
            a: "Ne. Sve plocice cistote iznad 995/1000 tretiraju se po zakonu kao investiciono zlato i u potpunosti su oslobodjene placanja PDV-a od 20% i poreza na kapitalnu dobit u Republici Srbiji.",
          },
          {
            q: "Kako da plocicu poklonite kao poklon za krstenje?",
            a: "Plocica od 1g vec u svom originalnom blisteru izgleda izuzetno elegantno i luksuzno. Gold Invest dodatno nudi mogucnost pakovanja u ekskluzivnu poklon kutijicu, sto dar cini potpuno gotovim za predaju. Kontaktirajte nas za detalje o pakovanju.",
          },
          {
            q: "Koji je limit za placanje u gotovini?",
            a: "Zakon o sprecavanju pranja novca dozvoljava gotovinska placanja do 1.160.000 dinara (10.000 evra). S obzirom na cenu plocice od 1g, mozete bez ikakvih problema kupiti i veci broj plocica i platiti u kesu.",
          },
          {
            q: "Koliko traje isporuka?",
            a: "Za klijente u Beogradu nudimo isporuku dan za dan — ukoliko je porudzbina evidentirana radnim danima do 12h, zlato stize na vasu adresu istog dana do 18h. Za porudzbine iz ostalih gradova Srbije, diskretna i osigurana dostava traje od 1 do 3 radna dana.",
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
      "Kupite zlatnu pločicu 2g čistoće 999,9 — Argor-Heraeus, C. Hafner. Odličan poklon i početni korak u štednji zlata. Oslobođena PDV-a. Brza dostava Beograd i Srbija.",
    intro:
      "Zlatna pločica od 2 grama je savršen balans između simboličnog poklona i ozbiljnog prvog koraka u štednji. Duplo više zlata od najmanjih pločica, uz nešto povoljniju premiju po gramu — a i dalje sadrži 99,99% čistog zlata (24 karata), dolazi u LBMA sertifikovanom blisteru i u potpunosti je oslobođena PDV-a. Poruči putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    seo: {
      brands: {
        heading: "Nasa ponuda — plocice od 2g (LBMA standard)",
        description:
          "Sve plocice od 2g u nasoj ponudi poticu od svetski priznatih LBMA rafinerija. Svaka dolazi fabricki zapecacena — pakovanje je ujedno i sertifikat cistote 999,9, sa upisanim serijskim brojem.",
        cards: [
          {
            title: "Argor-Heraeus 2g — Svajcarska",
            body: "Svajcarski Argor-Heraeus je jedan od simbola pouzdanosti na globalnom trzistu zlata. Njihova plocica od 2g nosi precizni laserski serijski broj, logo kovnice i oznaku cistote. Svedeni, klasicni dizajn garantuje maksimalnu prepoznatljivost i likvidnost na svim trzistima.",
          },
          {
            title: "C. Hafner 2g — Nemacka",
            body: "Nemacka rafinerija C. Hafner kuje plocice iskljucivo od recikliranog zlata, sto ih cini posebno privlacnim za kupce koji vode racuna o etickom poreklu metala. Plocica od 2g pakuje se u karakteristicni tamni blister sa hologramom — elegantan i upecatljiv i kao poklon.",
          },
          {
            title: "The Royal Mint 2g — Velika Britanija",
            body: "Zvanicna britanska kovnica, jedna od najstarijih na svetu, nudi plocice od 2g sa prepoznatljivim ikonografskim dizajnom. Dolaze u sigurnosnom blisteru i nose autoritet britanske drzavne institucije — idealne i za kolekcionare i za investitore.",
          },
        ],
      },
      whyBuy: {
        heading: "Zasto kupiti zlatnu plocicu od 2g?",
        description:
          "Plocica od 2g je idealan kompromis — vredna je vise od simbolicne plocice od 1g, a i dalje pristupacna kao poklon ili pocetna stednja. Evo konkretnih razloga:",
        cards: [
          {
            title: "Povoljnija premija nego plocica od 1g",
            body: "Isti fiksni troskovi proizvodnje i pakovanja sada se dele na duplo vise grama zlata. To znaci da je cena po gramu cistog zlata kod plocice od 2g niza nego kod plocice od 1g — uz isti nivo kvaliteta, pakovanja i sertifikacije. Matematicki pametniji korak ako imate budzet.",
          },
          {
            title: "Poklon koji impresionira — za svadbe, krstenja, rodjendane",
            body: "Plocica od 2g u svom blisteru izgleda impresivno i luksuzno, a apsolutna vrednost poklona je opipljivo veca od plocice od 1g. Postala je popularni izbor za kumove i blizu rodbinu na krstenjima, ali i kao godisnjicki poklon partnerima i roditeljima.",
          },
          {
            title: "Pocetna tacka sistemske stednje",
            body: "Kupovina jedne plocice od 2g mesecno je disciplinovana strategija gradnje zlatnog portfolija. Za godinu dana imate 24 grama investicionog zlata koje je u potpunosti sacuvano od inflacije — bez bankovnih provizija, bez poreza, bez rizika.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne plocice od 2g",
        description:
          "Transparentnost je osnova naseg poslovanja. Svaka plocica od 2g ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za plocice koje su fizicki u nasem trezoru. Uplatite i preuzmite istog dana — bez cekanja i skrivenih troskova.",
        card2Body:
          "Kupujete vise plocica od 2g? Unaprednom uplatom zakljucavate trenutnu berzansku cenu i robu direktno porucujemo iz rafinerije uz znacajnu ustedu po gramu.",
        card3Body:
          "Iznos po kom Gold Invest garantovano otkupljuje vase plocice od 2g u svakom trenutku — uvek javno istaknut, bez iznenadenja.",
      },
      delivery: {
        heading: "Prodaja zlatnih plocica 2g Beograd — Gold Invest",
        description:
          "Kupovina plocica od 2g je brza i potpuno bezbedna. Nudimo vise nacina preuzimanja — uvek diskretno i osigurano.",
        pickupCardBody:
          "Posetite nas licno u Beogradu. Diskretno okruzenje, strucna provera autenticnosti i preuzimanje na licu mesta — bez cekanja.",
      },
      faq: {
        title: "Cesta pitanja o zlatnoj plocici od 2g",
        items: [
          {
            q: "Koja je razlika izmedju plocice od 1g i 2g — koja se vise isplati?",
            a: "Oba formata su odlican izbor, ali plocica od 2g nudi nesto povoljniju premiju (marzu) po gramu, jer se fiksni troskovi proizvodnje i pakovanja dele na duplo vise zlata. Ako vam je cilj iskljucivo poklon sa simbolicnom vrednoscu — 1g je dovoljna. Ako zelite maksimalnu vrednost za isti budzet — 2g je pametniji izbor.",
          },
          {
            q: "Da li uz plocicu dobijam sertifikat?",
            a: "Da. Plocica dolazi fabricki zapecacena u cvrstom blisteru sa logom rafinerije, cistotom, tezinom i jedinstvenim serijskim brojem laserski upisanim i na samu plocicu. To pakovanje je vas sertifikat. Nikada ga ne otvarajte — otvoreno pakovanje smanjuje otkupnu vrednost.",
          },
          {
            q: "Da li se na plocicu od 2g placa PDV?",
            a: "Ne. Sve plocice cistote iznad 995/1000 po zakonu su investiciono zlato i potpuno su oslobodjene PDV-a od 20% i poreza na kapitalnu dobit u Srbiji.",
          },
          {
            q: "Mogu li da kupim vise plocica odjednom?",
            a: "Apsolutno. Kupovina vece kolicine plocica od 2g je cest slucaj — bilo za poklone (krstenja, svadbe), bilo za sistematsku mesecnu stednju. Za vece kolicine preporucujemo avansnu kupovinu kojom zakljucavate povoljniju cenu.",
          },
          {
            q: "Koji je limit za placanje u gotovini?",
            a: "Zakon dozvoljava gotovinska placanja do 1.160.000 dinara (10.000 evra). S obzirom na cenu plocice od 2g, bez ikakvih problema mozete kupiti veci broj i platiti u kesu.",
          },
          {
            q: "Koliko traje isporuka?",
            a: "Za klijente u Beogradu nudimo isporuku dan za dan — porudzbine evidentirane radnim danima do 12h stizu istog dana do 18h. Za ostatak Srbije, diskretna i osigurana dostava traje 1 do 3 radna dana.",
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
      "Kupite zlatnu pločicu 5g čistoće 999,9 — Argor-Heraeus, C. Hafner. Najpopularniji format za mesečnu štednju u zlatu. Oslobođena PDV-a. Brza dostava Beograd i Srbija.",
    intro:
      "Zlatna pločica od 5 grama je najpopularniji format za sistematsku mesečnu štednju u zlatu. Nudi značajno povoljniju premiju po gramu u poređenju sa manjim pločicama, dovoljno je pristupačna da je možete kupovati redovno, a dovoljno vredna da za godinu dana osetite razliku. Sadrži 99,99% čistog zlata (24 karata), potpuno je oslobođena PDV-a. Poruči putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    seo: {
      brands: {
        heading: "Nasa ponuda — plocice od 5g (LBMA standard)",
        description:
          "Sve plocice od 5g u nasoj ponudi kuju se u rafinerijama sa LBMA liste — svetskog standarda za investiciono zlato. Svaka dolazi fabricki zapecacena u sigurnosnom blisteru koji je ujedno i sertifikat cistote 999,9.",
        cards: [
          {
            title: "Argor-Heraeus 5g — Svajcarska",
            body: "Argor-Heraeus je referentna svajcarska rafinerija i jedan od najprepoznatljivijih brendova u svetu investicionog zlata. Njihova plocica od 5g je klasican, sveeden dizajn sa serijskim brojem, logom i oznakom cistote — garantovana likvidnost na svim kontinentima.",
          },
          {
            title: "C. Hafner 5g — Nemacka",
            body: "Nemacka rafinerija C. Hafner sa tradicijom od 170+ godina kuje plocice iskljucivo od recikliranog zlata. Plocica od 5g dolazi u elegantnom tamnom blisteru sa hologramom. Posebno popularna medju kupcima koji cene eticko poreklo metala uz vrhunski nemacki kvalitet.",
          },
          {
            title: "The Royal Mint 5g — Velika Britanija",
            body: "Britanska drzavna kovnica nudi plocice od 5g sa prepoznatljivim ikonografskim dizajnom i autoritetom jedne od najstarijih kovnica na svetu. Dolaze u sigurnosnom blisteru i odlican su izbor za kolekcionare koji zele da kombinuju estetiku i investicionu vrednost.",
          },
        ],
      },
      whyBuy: {
        heading: "Zasto je zlatna plocica od 5g idealna za mesecnu stednju?",
        description:
          "Format od 5 grama je tacka na kojoj premija po gramu pocinje ozbiljno da pada, a vrednost svake kupovine pocinje ozbiljno da raste. Evo zasto ga preporucujemo svima koji zele da sistematski grade portfolio:",
        cards: [
          {
            title: "Znacajno niza premija nego kod 1g i 2g",
            body: "Na plocici od 5g isti fiksni troskovi proizvodnje i sertifikacije se dele na 5 puta vise zlata nego kod plocice od 1g. Rezultat: cena po gramu cistog zlata je osetno niza. To je finansijski najvaznija razlika — za isti budzet dobijate vise stvarnog zlata.",
          },
          {
            title: "Optimalan format za mesecnu stednju",
            body: "Kupovina jedne plocice od 5g mesecno je strategija kojom za godinu dana akumulirate 60 grama investicionog zlata. Svaki gram je zastitjen od inflacije, dostupan u svakom trenutku, i moze se unovciti bez poreza. Banka ne moze to da vam ponudi.",
          },
          {
            title: "Dovoljno mala da je fleksibilna, dovoljno velika da je vredna",
            body: "Za razliku od poluga od 50g ili 100g koje morate prodati odjednom, plocice od 5g vam daju kontrolu — prodate tacno onoliko koliko vam treba. Kombinacija fleksibilnosti i povoljne premije cini je 'zlatnim standardom' u kategoriji plocica.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne plocice od 5g",
        description:
          "Transparentnost je osnova naseg poslovanja. Svaka plocica od 5g ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za plocice koje su fizicki u nasem trezoru. Uplatite i preuzmite zlato istog dana — bez cekanja.",
        card2Body:
          "Kupujete 5, 10 ili vise plocica od 5g? Avansom zakljucavate trenutnu berzansku cenu i robu direktno porucujemo iz rafinerije (Svajcarska, Nemacka). Vi dobijate najpovoljniju moguca cenu.",
        card3Body:
          "Garantovani iznos po kom Gold Invest otkupljuje vase plocice od 5g — uvek javno istaknut. Zbog visoke likvidnosti ovog formata, spread je minimalan.",
      },
      delivery: {
        heading: "Prodaja zlatnih plocica 5g Beograd — Gold Invest",
        description:
          "Kupovina plocica od 5g je brza i potpuno bezbedna. Nudimo vise nacina preuzimanja — uvek diskretno i maksimalno osigurano.",
        pickupCardBody:
          "Posetite nas licno u Beogradu. Strucna provera autenticnosti i preuzimanje na licu mesta — bez cekanja, u potpuno diskretnom okruzenju.",
      },
      faq: {
        title: "Cesta pitanja o zlatnoj plocici od 5g",
        items: [
          {
            q: "Da li je plocica od 5g bolja investicija od plocice od 1g?",
            a: "Sa cisto finansijskog stanovista — da. Premija (marza) po gramu je niza kod plocice od 5g jer se fiksni troskovi proizvodnje i sertifikacije dele na pet puta vise zlata. Medutim, plocica od 1g ima prednost kao poklon (simbolicna vrednost, pristupacna cena). Za sistematsku stednju i investiranje, 5g je osetno isplativiji format.",
          },
          {
            q: "Da li uz plocicu dobijam sertifikat?",
            a: "Da. Plocica dolazi fabricki zapecacena u cvrstom blisteru sa logom rafinerije, cistotom, tezinom i jedinstvenim serijskim brojem laserski upisanim i na samu plocicu. To pakovanje je vas sertifikat autenticnosti. Zlatno pravilo: nikada ga ne otvarajte.",
          },
          {
            q: "Da li se na plocicu od 5g placa PDV?",
            a: "Ne. Sve plocice cistote iznad 995/1000 tretiraju se po zakonu kao investiciono zlato i potpuno su oslobodjene PDV-a i poreza na kapitalnu dobit u Srbiji.",
          },
          {
            q: "Koliko plocica od 5g treba kupiti da bi stednja imala smisla?",
            a: "Ne postoji minimalni prag — cak i jedna plocica mesecno je korisna. Medutim, vecina nasih klijenata koji redovno steده odabira ritam od 2 do 4 plocice mesecno (10g do 20g), sto im godisnje da 120g do 240g zlata — ozbiljan finansijski jastuk.",
          },
          {
            q: "Koji je limit za placanje u gotovini?",
            a: "Zakon dozvoljava gotovinska placanja do 1.160.000 dinara (10.000 evra). Mozete bez problema kupiti veci broj plocica od 5g i platiti u kesu.",
          },
          {
            q: "Koliko traje isporuka?",
            a: "Za klijente u Beogradu nudimo isporuku dan za dan — porudzbine evidentirane radnim danima do 12h stizu istog dana do 18h. Za ostatak Srbije, diskretna i osigurana dostava traje 1 do 3 radna dana.",
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
      "Kupite LBMA sertifikovanu zlatnu pločicu 10g čistoće 999,9 — Argor-Heraeus, C. Hafner, The Royal Mint. Idealna za redovnu štednju i poklon. Transparentne cene, brza dostava.",
    intro:
      "Zlatna pločica 10 grama je idealan izbor za redovnu mesečnu štednju, ali i kao izuzetno vredan i prestižan poklon. U našoj ponudi se nalaze isključivo pločice čistoće 999,9 svetskih lidera: Argor-Heraeus, C. Hafner i The Royal Mint. Poruči putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    seo: {
      brands: {
        heading: "Nasa ponuda — evropski brendovi (LBMA standard)",
        description:
          "Sve pločice su investiciono zlato koje ispunjava najstrože svetske LBMA ('Good Delivery') standarde, maksimalne finoće od 99.99% (24 karata) i dolaze fabrički zapečaćene u sigurnosno blister pakovanje — vaš zvanični sertifikat.",
        cards: [
          {
            title: "Argor-Heraeus 10g — Švajcarska",
            body: "Švajcarski Argor-Heraeus je jedna od najvećih rafinerija na svetu. Njihova pločica od 10g odlikuje se svedenim, klasičnim dizajnom sa jasno istaknutim logotipom, težinom, oznakom čistoće i jedinstvenim serijskim brojem. Izuzetno je tražena i priznata na svim kontinentima.",
          },
          {
            title: "C. Hafner 10g — Nemačka",
            body: "C. Hafner je prestižna nemačka rafinerija sa tradicijom od preko 170 godina. Njihove pločice su posebno cenjene jer dolaze isključivo od recikliranog zlata — besprekorna izrada (999,9) uz nulti negativan uticaj na životnu sredinu. Pakuju se u elegantne, tamne blister sertifikate.",
          },
          {
            title: "The Royal Mint Britannia 10g — Britanija",
            body: "Zvanična državna kovnica Velike Britanije nudi pločicu koja je pravo umetničko delo. Na njoj se nalazi prepoznatljivi motiv 'Britanije' — simbola britanske pomorske moći. Dolazi u sigurnosnom blisteru i često je prvi izbor kolekcionara.",
          },
        ],
      },
      whyBuy: {
        heading: "Zašto je zlatna pločica od 10g idealna investicija?",
        description:
          "Format od 10 grama se smatra 'kraljem pametne štednje'. Ukoliko tek ulazite u svet plemenitih metala, ovo je idealna gramaža — a evo i zašto:",
        cards: [
          {
            title: "Odlična cena po gramu",
            body: "Za razliku od najmanjih pločica (1g ili 2g) gde su troškovi proizvodnje u odnosu na količinu zlata viši, pločica od 10g nudi znatno nižu premiju (maržu) — što je čini matematički veoma isplativom investicijom.",
          },
          {
            title: "Maksimalna fleksibilnost i likvidnost",
            body: "Ako uložite novac u velike zlatne poluge, a zatreba vam samo manji iznos gotovine, moraćete da prodate celu polugu. Kupovinom više pločica od 10g zadržavate potpunu kontrolu — unovčite samo onoliko grama koliko vam je u tom trenutku potrebno.",
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
          "Gold Invest vam pruža apsolutnu transparentnost cena zlata — bez skrivenih troškova. Svaka pločica od 10g ima jasno istaknute sve tri cene:",
        card1Body:
          "Važi za pločice koje su fizički prisutne u našem trezoru. Uplatite i preuzmite svoje zlato istog dana.",
        card2Body:
          "Zelite da kupite 5, 10 ili više pločica od 10g? Uplatite celokupan iznos unapred i zaključajte trenutnu berzansku cenu. Mi robu direktno poručujemo iz kovnica (Švajcarska, Nemačka, Britanija), a vi dobijate najpovoljniju moguću cenu.",
        card3Body:
          "Garantovani iznos po kojem Gold Invest u svakom trenutku otkupljuje vaše pločice. Zbog ogromne popularnosti gramaže od 10g, naš spread (razlika između prodajne i otkupne cene) je minimalan.",
      },
      delivery: {
        heading: "Prodaja zlatnih pločica 10g Beograd — Gold Invest",
        description:
          "Kupovina zlatnih pločica od 10g je brza i bezbedna. Nudimo tri načina preuzimanja — uvek diskretno i osigurano.",
        pickupCardBody:
          "Cekamo vas u sigurnoj kancelariji u Beogradu. Bez čekanja, u potpuno diskretnom okruženju.",
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
            a: "Da. Sama pločica je isporučena iz kovnice u čvrstom plastičnom pakovanju (blisteru) veličine platne bankovne kartice. Na tom pakovanju su jasno odštampani logo rafinerije, čistoća, težina i jedinstveni serijski broj koji je laserski upisan i na samu pločicu. To pakovanje predstavlja vaš neosporivi sertifikat. Zlatno pravilo: nikada ne otvarajte i ne secite pakovanje, jer time trajno narušavate vrednost svog zlata.",
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
            a: "Ne, plaćanje platnim karticama trenutno nije moguće. Razlog za to su visoke provizije banaka (često i do 2-3%) koje bi neizbežno morale da se ugrade u krajnju cenu zlata. Naš cilj je da vam obezbedimo najpovoljniju moguću cenu na tržištu bez skrivenih troškova, zbog čega prihvatamo isključivo plaćanje gotovinom, bankovnim transferom ili pouzećem.",
          },
          {
            q: "Koliko traje isporuka?",
            a: "Za klijente u Beogradu nudimo isporuku dan za dan — ukoliko je porudžbina evidentirana radnim danima do 12h, zlato stiže na vašu adresu istog dana do 18h. Za porudžbine iz ostalih gradova Srbije, diskretna i osigurana dostava traje od 1 do 3 radna dana (ovo ne važi za avansne kupovine, za koje se rok isporuke precizno definiše pri samoj kupovini).",
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
      "Kupite zlatnu pločicu 20g čistoće 999,9 — Argor-Heraeus, C. Hafner. Najbolja premija u kategoriji pločica. Oslobođena PDV-a. Transparentne cene, brza dostava.",
    intro:
      "Zlatna pločica od 20 grama je najveći format u kategoriji pločica i nudi najbolju premiju po gramu u celoj liniji — bez kompromisa po pitanju fleksibilnosti. Sadrži 99,99% čistog zlata (24 karata), dolazi u LBMA sertifikovanom blisteru i u potpunosti je oslobođena PDV-a. Idealna za ozbiljne investitore koji žele veću vrednost u kompaktnom formatu. Poruči putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    seo: {
      brands: {
        heading: "Nasa ponuda — plocice od 20g (LBMA standard)",
        description:
          "Sve plocice od 20g u nasoj ponudi kuju se iskljucivo u rafinerijama sa LBMA 'Good Delivery' liste — globalnog standarda koji garantuje cistotu od 99,99%, tacnu gramazu i legalno poreklo metala.",
        cards: [
          {
            title: "Argor-Heraeus 20g — Svajcarska",
            body: "Svajcarski Argor-Heraeus je jedan od najvecih svetskih procesora plemenitih metala i sinonim za pouzdanost. Njihova plocica od 20g odlikuje se preciznom izradom, jasno istaknutim serijskim brojem i logom — maksimalna prepoznatljivost na globalnom trzistu garantuje i maksimalnu likvidnost.",
          },
          {
            title: "C. Hafner 20g — Nemacka",
            body: "Nemacka rafinerija C. Hafner sa 170 godina tradicije kuje plocice iskljucivo od recikliranog zlata. Format od 20g je jedan od njihovih najtrazenijih — dolazi u karakteristicnom tamnom blisteru sa hologramom i kombinuje eticko poreklo sa besprekornoom izradom.",
          },
          {
            title: "The Royal Mint 20g — Velika Britanija",
            body: "Britanska drzavna kovnica nudi plocice od 20g sa prepoznatljivim dizajnom i autoritetom jedne od najstarijih i najuglednijih institucija u svetu kovanog novca. Dolaze u sigurnosnom blisteru — odlican izbor za ozbiljne investitore i kolekcionare.",
          },
        ],
      },
      whyBuy: {
        heading: "Zasto je zlatna plocica od 20g idealna za ozbiljnog investitora?",
        description:
          "Format od 20g je tacka na kojoj plocice prestaju da budu 'poklon format' i postaju prava investiciona sredstvo. Evo konkretnih razloga zasto ovaj format privlaci ozbiljne investitore:",
        cards: [
          {
            title: "Najbolja premija u celoj kategoriji plocica",
            body: "Plocica od 20g nudi najnizu premiju (marzu) po gramu od svih plocica u nasoj ponudi. Fiksni troskovi proizvodnje i sertifikacije se ovde dele na 20 grama zlata, sto rezultira cenom po gramu koja se polako priblizava onoj kod malih poluga — ali uz zadrzanu fleksibilnost plocice.",
          },
          {
            title: "Fleksibilnost kakvu poluge ne mogu da pruze",
            body: "Zlatna poluga od 50g ili 100g mora se prodati odjednom. Plocica od 20g je i dalje jedan komad koji mozete unovciti kada vam tacno ta vrednost zatreba — bez prinudne prodaje vise zlata nego sto je potrebno. Idealno za gradnju portfolija koji mozete precizno kontrolisati.",
          },
          {
            title: "Ozbiljna vrednost, kompaktan format",
            body: "Plocica od 20g ima vrednost koja ozbiljno impresionira, a fizicki je manja od bankovne kartice. To je format koji lako uskladistite, cuvate i po potrebi nosite — bez birokratije, bez troskova cuvanja, bez posrednika.",
          },
        ],
      },
      priceStructure: {
        title: "Cena zlatne plocice od 20g",
        description:
          "Transparentnost je osnova naseg poslovanja. Svaka plocica od 20g ima jasno istaknute sve tri cene:",
        card1Body:
          "Cena za plocice koje su fizicki u nasem trezoru. Uplatite i preuzmite zlato istog dana — bez cekanja i skrivenih troskova.",
        card2Body:
          "Kupujete vise plocica od 20g ili zelite sto bolju cenu po gramu? Avansnom uplatom zakljucavate trenutnu berzansku cenu i mi robu direktno porucujemo iz rafinerije. Ovo je opcija s kojom nasi klijenti najcesce ostvare najvecu ustedu.",
        card3Body:
          "Garantovani iznos po kom Gold Invest u svakom trenutku otkupljuje vase plocice od 20g — uvek javno istaknut. Zbog visoke vrednosti ovog formata, spread je medjuu najnizima u celoj ponudi.",
      },
      delivery: {
        heading: "Prodaja zlatnih plocica 20g Beograd — Gold Invest",
        description:
          "Kupovina plocica od 20g je brza i potpuno bezbedna. Nudimo vise nacina preuzimanja — uvek diskretno i maksimalno osigurano.",
        pickupCardBody:
          "Posetite nas licno u Beogradu. Strucna provera autenticnosti i preuzimanje na licu mesta — bez cekanja, u potpuno diskretnom okruzenju.",
      },
      faq: {
        title: "Cesta pitanja o zlatnoj plocici od 20g",
        items: [
          {
            q: "Koja je razlika izmedju plocice od 20g i poluge od 50g?",
            a: "Oba formata su LBMA investiciono zlato cistote 999,9 i oba su oslobodjena PDV-a. Kljucna razlika je u premiji i fleksibilnosti. Poluga od 50g nudi jos nizu premiju po gramu, ali je morate prodati odjednom. Plocica od 20g je nesto skuplja po gramu, ali je jedan komad koji mozete unovciti tacno kada vam ta specificna vrednost zatreba. Za portfolije ispod 200g ukupne tezine, 20g plocice su cesto pametniji izbor.",
          },
          {
            q: "Da li uz plocicu dobijam sertifikat?",
            a: "Da. Plocica dolazi fabricki zapecacena u cvrstom blisteru sa logom rafinerije, cistotom, tezinom i jedinstvenim serijskim brojem laserski upisanim i na samu plocicu. To pakovanje je vas sertifikat. Nikada ga ne otvarajte — otvoreno pakovanje smanjuje otkupnu vrednost.",
          },
          {
            q: "Da li se na plocicu od 20g placa PDV?",
            a: "Ne. Sve plocice cistote iznad 995/1000 tretiraju se po zakonu kao investiciono zlato i potpuno su oslobodjene PDV-a od 20% i poreza na kapitalnu dobit u Republici Srbiji.",
          },
          {
            q: "Koji je limit za placanje u gotovini?",
            a: "Zakon dozvoljava gotovinska placanja do 1.160.000 dinara (10.000 evra). U zavisnosti od trenutne cene zlata, jedna plocica od 20g se najcesce moze platiti u gotovini. Za vise plocica ili vece iznose, koristimo bankovni transfer.",
          },
          {
            q: "Mogu li da platim platnom karticom?",
            a: "Ne, placanje karticama trenutno nije moguce. Visoke bankarske provizije (2-3%) bi se neizbezno ugradile u cenu zlata — a nas cilj je da vam obezbedimo najpovoljniju cenu na trzistu. Prihvatamo gotovinu, bankovni transfer i pouzecem.",
          },
          {
            q: "Koliko traje isporuka?",
            a: "Za klijente u Beogradu nudimo isporuku dan za dan — porudzbine evidentirane radnim danima do 12h stizu istog dana do 18h. Za ostatak Srbije, diskretna i osigurana dostava traje 1 do 3 radna dana.",
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

  // Mock fallback (isti set kao na homepage-u)
  const MOCK_SNAPSHOT = { id: "mock", xau_usd: 2700, xau_eur: 4375, usd_rsd: 108, eur_rsd: 117.5, price_per_g_rsd: 16500, source: "mock", fetched_at: new Date().toISOString() };
  const MOCK_TIERS = [{ id: "t1", name: "default", category: null, min_g: 0, max_g: 99999, margin_stock_pct: 4.5, margin_advance_pct: 3.5, margin_purchase_pct: 2, created_at: "" }];
  const MOCK_VARIANTS = [
    { id: "1", product_id: "p1", slug: "zlatna-plocica-1g-pamp", weight_g: 1, weight_oz: 0.032, purity: 0.9999, fine_weight_g: 1, sku: null, stock_qty: 10, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 1, is_active: true, products: { name: "Zlatna pločica 1g", brand: "PAMP Suisse", origin: "Švajcarska", category: "plocica" }, pricing_rules: null },
    { id: "2", product_id: "p2", slug: "zlatna-plocica-2g-pamp", weight_g: 2, weight_oz: 0.064, purity: 0.9999, fine_weight_g: 2, sku: null, stock_qty: 8, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 2, is_active: true, products: { name: "Zlatna pločica 2g", brand: "PAMP Suisse", origin: "Švajcarska", category: "plocica" }, pricing_rules: null },
    { id: "3", product_id: "p3", slug: "zlatna-plocica-5g-heraeus", weight_g: 5, weight_oz: 0.161, purity: 0.9999, fine_weight_g: 5, sku: null, stock_qty: 5, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 3, is_active: true, products: { name: "Zlatna pločica 5g", brand: "Heraeus", origin: "Nemačka", category: "plocica" }, pricing_rules: null },
    { id: "4", product_id: "p4", slug: "zlatna-plocica-10g-heraeus", weight_g: 10, weight_oz: 0.321, purity: 0.9999, fine_weight_g: 10, sku: null, stock_qty: 3, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 4, is_active: true, products: { name: "Zlatna pločica 10g", brand: "Heraeus", origin: "Nemačka", category: "plocica" }, pricing_rules: null },
    { id: "5", product_id: "p5", slug: "zlatna-plocica-20g-heraeus", weight_g: 20, weight_oz: 0.643, purity: 0.9999, fine_weight_g: 20, sku: null, stock_qty: 2, availability: "in_stock", lead_time_weeks: null, images: ["/images/product-poluga.png"], sort_order: 5, is_active: true, products: { name: "Zlatna pločica 20g", brand: "Heraeus", origin: "Nemačka", category: "plocica" }, pricing_rules: null },
  ];

  let variants: any = MOCK_VARIANTS.filter((v) => Number(v.weight_g) === config.grams);
  let tiers: any = MOCK_TIERS;
  let snapshotRow: any = MOCK_SNAPSHOT;

  try {
    const supabase = createServiceClient();
    const [r1, r2, r3] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*, products!inner(name, brand, origin, category), pricing_rules(*)")
        .eq("products.category", "plocica")
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
    { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
    { label: config.label, href: `/kategorija/zlatne-plocice/${slug}` },
  ];

  const heroImg =
    variants?.[0]?.images?.[0] ?? "/images/product-poluga.png";
  const heroTitle = config.label.replace("g", " grama");

  return (
    <main className="bg-white">
      {/* Schema.org */}
      <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
      <SchemaScript
        schema={buildProductSchema({
          name: config.label,
          description: config.metaDescription,
          brand: "Argor-Heraeus / C. Hafner",
          slug: `/kategorija/zlatne-plocice/${slug}`,
          image: heroImg,
          purity: "999.9/1000",
          weightGrams: config.grams,
        })}
      />
      {config.seo && (
        <SchemaScript schema={buildFaqSchema(config.seo.faq.items)} />
      )}

      {/* ── Breadcrumb + hero (homepage style) ─────────────────────────── */}
      <section className="bg-white py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <Breadcrumb items={breadcrumbs} variant="light" />

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
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

          {/* H2: Naša ponuda — evropski brendovi (LBMA standard) */}
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
