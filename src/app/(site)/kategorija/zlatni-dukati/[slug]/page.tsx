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
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildFaqSchema, buildProductSchema } from "@/lib/schema";

export const revalidate = 60;

// ── Types ──────────────────────────────────────────────────────────────────

type FaqItem = { q: string; a: string };

type FormatCard = {
  title: string;
  specs: string;
  body: string;
};

type HistoryCard = {
  heading: string;
  body: string | string[];
};

type SlugConfig = {
  metaTitle: string;
  metaDescription: string;
  breadcrumbLabel: string;
  heroTitle: string;
  intro: string;
  heroImage: string;
  /** Purity string for schema markup, e.g. "986/1000" or "999.9/1000" */
  purity?: string;
  /** Slugs to show in the product grid (matched against variant slugs) */
  variantSlugs: string[];
  /** Mock variant weights for fallback */
  mockWeights: number[];
  formatsHeading: string;
  formatsDescription: string;
  formats: [FormatCard, FormatCard];
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
  historySection: {
    heading: string;
    intro: string;
    cards: HistoryCard[];
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
};

// ── Slug configs ───────────────────────────────────────────────────────────

const SLUG_CONFIGS: Record<string, SlugConfig> = {
  "franc-jozef-dukat": {
    metaTitle: "Dukat Franc Jozef | Mali i Veliki Zlatni Dukat - Prodaja Beograd",
    metaDescription:
      "Kupite mali ili veliki zlatni dukat Franc Jozef — oslobođen PDV-a, austrijska kovnica, garantovana autentičnost. Prodajna i otkupna cena. Brza dostava Beograd i Srbija.",
    breadcrumbLabel: "Franc Jozef dukat",
    heroTitle: "Franc Jozef dukat",
    intro:
      "Zlatni dukat Franc Jozef je najprepoznatljivija investiciona kovanica i najpopularniji tradicionalni poklon na našim prostorima. Idealan za krštenja, rođenja i svadbe, ali i kao sigurno utočište za vaš kapital. Gold Invest vam nudi male i velike dukate iz austrijske državne kovnice, uz garantovanu autentičnost, transparentne cene i oslobođenje od PDV-a. Poručite putem kontakt forme ili na broj 0612698569 — BRZA dostava!",
    heroImage: "https://ucngtcsmkxuxuubrobsc.supabase.co/storage/v1/object/public/product-images/dukati/Veliki%20dukat%20Franc%20Jozef%20cetvorostruki.webp",
    variantSlugs: ["franc-jozef-1-dukat", "franc-jozef-4-dukati"],
    mockWeights: [3.49, 13.96],
    formatsHeading: "Mali i Veliki Franc Jozef — Koja je razlika?",
    formatsDescription:
      "Franc Jozef dukati se kuju u čuvenoj austrijskoj državnoj kovnici (Münze Österreich) od zlata izuzetne čistoće 986/1000 (23,6 karata). Minimalni dodatak bakra u leguri daje im karakterističnu, prelepu crvenkasto-zlatnu nijansu i čini ih otpornijim na habanje od čistog 24-karatnog zlata.",
    formats: [
      {
        title: "Mali dukat Franc Jozef (Jednostruki)",
        specs: "3,49 g ukupno — 3,44 g čistog zlata — čistoća 986/1000 (23,6 karata)",
        body: "Najčešći poklon za krštenje i rođenje. Idealan je za darivanje povodom rođenja, krštenja i rođendana, ali i za postepeno, mesečno građenje ličnog zlatnog portfolija. Zahvaljujući manjoj gramazi, nudi odličnu fleksibilnost — lako ga je pokloniti, a još lakše unovčiti kada zatreba.",
      },
      {
        title: "Veliki dukat Franc Jozef (Četvorostruki)",
        specs: "13,96 g ukupno — 13,77 g čistog zlata — čistoća 986/1000 (23,6 karata)",
        body: "Vizuelno impresivan i značajno masivniji. Prepoznatljiv je po velikom prečniku i često predstavlja glavni poklon na venčanjima ili pametan izbor za ozbiljnije investitore koji žele povoljniju cenu po gramu u odnosu na mali dukat.",
      },
    ],
    priceStructure: {
      title: "Franc Jozef dukat cena — Prodajna / Avansna / Otkupna",
      description:
        "Kao ozbiljna i transparentna kuća, Gold Invest vam uvek nudi tri oblika cena dukata Franc Jozef:",
      card1Body:
        "Cena za dukate koje trenutno imamo u našem beogradskom trezoru. Platite i preuzimate svoj dukat odmah — bez čekanja i skrivenih troškova.",
      card2Body:
        "Planirate kupovinu veće količine dukata? Uplatite iznos unapred, 'zaključite' trenutnu, nižu berzansku cenu i sačekajte isporuku direktno iz austrijske kovnice uz značajnu uštedu.",
      card3Body:
        "Iznos po kojem u svakom trenutku i bez čekanja otkupljujemo vaše dukate. Zbog ogromne potražnje za Franc Jozefom, razlika između prodajne i otkupne cene (spread) je kod nas uvek svedena na minimum.",
    },
    delivery: {
      heading: "Gde kupiti dukat Franc Jozef — Gold Invest Beograd",
      description:
        "Prodaja dukata Franc Jozef je moguća na nekoliko načina — uvek diskretno i maksimalno osigurano.",
      pickupCardBody:
        "Posetite nas lično u Beogradu. Potpuno diskretno okruženje, stručna provera autentičnosti i preuzimanje na licu mesta bez čekanja.",
    },
    historySection: {
      heading: "Dukat Franc Jozef — Istorija najpoznatije zlatne kovanice Balkana",
      intro:
        "Nijedan komad investicionog zlata ne nosi toliku istorijsku težinu, tradiciju i poverenje na našim prostorima kao dukat sa likom austrijskog cara Franca Jozefa. Ovi dukati se već generacijama koriste kao najsigurniji način čuvanja porodičnog bogatstva.",
      cards: [
        {
          heading: "Ko je bio Franc Jozef?",
          body: "Franc Jozef I (Franz Joseph I) bio je car Austrije i kralj Ugarske, i jedan od najdugovečnijih monarha u evropskoj istoriji (vladao je punih 68 godina, od 1848. do 1916. godine). Njegova vladavina obeležila je takozvano 'zlatno doba' Austrougarske monarhije — period ogromnog ekonomskog i industrijskog uspona, stabilnosti i kulturnog procvata. Zbog te neprikosnovene stabilnosti, njegov lik je u svesti naroda (posebno na Balkanu) postao apsolutni sinonim za bogatstvo, sigurnost i trajanje.",
        },
        {
          heading: "Zašto se dukati kuju baš po njemu?",
          body: "U vreme njegove vladavine, Austrougarska je bila ekonomska super sila, a austrijski dukat je bio glavna trgovačka valuta u ovom delu Evrope. Trgovci su ga obožavali jer je garantovao nepogrešivu tačnost težine i izuzetnu čistoću zlata od 98,6% (23,6 karata) — standard koji se u industriji i danas naziva 'dukat zlato' (Ducat gold). Čak i nakon pada Austrougarske imperije, apsolutno poverenje u ovu kovanicu ostalo je duboko ukorenjeno u kulturi.",
        },
        {
          heading: "Fenomen 1915. godine (zašto svaki dukat nosi ovaj datum?)",
          body: "Mnogi kupci se iznenade kada na svom potpuno novom dukatu vide uklesanu 1915. godinu, misleći da kupuju antički novac. Istina je fascinantna: zbog izbijanja Prvog svetskog rata, redovno kovanje dukata je zvanično prekinuto. Međutim, zbog nezapamćene globalne potražnje, austrijska kovnica je nastavila proizvodnju isključivo u investicione svrhe. Svaki novi dukat zauvek nosi godinu 1915. kao odavanje počasti poslednjoj godini redovnog kovanja. Dakle — dukat koji danas kupite je potpuno nov (takozvano novo kovanje ili 'restrike'), iskovan nedavno pomoću originalnih istorijskih kalupa.",
        },
        {
          heading: "Simbolika na kovanici — Lice i Naličje",
          body: [
            "Lice (Avers): prikazuje raskošan profil cara sa lovorovim vencem na glavi (simbol vojničke slave). Uz rub je ispisan tekst na latinskom: 'FRANC IOS I D G AUSTRIAE IMPERATOR'.",
            "Naličje (Revers): krasi ga veličanstveni dvoglavi orao (grb Habsburške monarhije) koji u kandžama drži mač i kraljevsku jabuku — simboli moći i pravde. Iznad njega je kruna, a duž ivice nalaze se titule i čuvena 1915. godina.",
          ],
        },
      ],
    },
    faq: {
      title: "Česta pitanja o dukatu Franc Jozef",
      items: [
        {
          q: "Zašto na svakom dukatu piše godina 1915?",
          a: "Svi investicioni Franc Jozef dukati koji se danas legalno prodaju nose utisnatu godinu 1915. To ne znači da je dukat star preko sto godina, već da je u pitanju zvanično, moderno 'novo kovanje' (restrike) austrijske državne kovnice. Godina 1915. se koristi kao istorijski simbol, jer je to bila poslednja godina redovnog kovanja pre pauze usled Prvog svetskog rata.",
        },
        {
          q: "Da li se na dukat Franc Jozef plaća PDV?",
          a: "Ne. Prema zakonima Republike Srbije, zlatni dukati čistoće preko 900/1000 iskovani posle 1800. godine tretiraju se kao investiciono zlato. S obzirom na to da Franc Jozef ima čistoću od 986/1000 (23,6 karata), u potpunosti je oslobođen plaćanja PDV-a i poreza na kapitalnu dobit.",
        },
        {
          q: "Kako se pakuje Franc Jozef i da li ima sertifikat?",
          a: "Istorijski dukati ne dolaze u fabričkim blister pakovanjima sa papirnim sertifikatima kao moderne zlatne poluge. Sam dukat, sa svojim specifičnim mikrometarskim dimenzijama, tačnom težinom i jedinstvenim tonom prilikom kucanja, predstavlja sertifikat autentičnosti. Vaš dukat od nas dobijate bezbedno upakovan u okruglu zaštitnu kapsulu od tvrdog akrila (ili prigodnu poklon kutijicu), koja ga štiti od oštećenja.",
        },
        {
          q: "Kako ga čuvati?",
          a: "Zlatno pravilo: Nikada ne dodirujte površinu dukata golim prstima i nikada ga ne brište niti polirajte krpama! Zlato je mekan metal i svako trenje ostavlja mikro-ogrebotine, dok kiseline sa prstiju mogu ostaviti trajne mrlje. Svako fizičko oštećenje, bušenje (radi pravljenja ogrlice) ili grebanje trajno uništava njegov investicioni status. Uvek ga čuvajte u originalnoj zaštitnoj kapsuli.",
        },
        {
          q: "Da li otkupljujete dukate kupljene u inostranstvu ili drugim zlatarama?",
          a: "Da, Gold Invest vrši brz i diskretan otkup svih malih i velikih dukata Franc Jozef, bez obzira gde su prvobitno kupljeni. Naši stručnjaci na licu mesta (za par minuta) proveravaju autentičnost kovanice, nakon čega vam novac isplaćujemo istog dana.",
        },
        {
          q: "Koji je limit za plaćanje u gotovini?",
          a: "U skladu sa Zakonom o sprečavanju pranja novca, kupovinu dukata možete platiti u gotovini do zakonskog limita od 1.160.000 dinara (10.000 evra u protivvrednosti). Sve transakcije iznad ovog iznosa realizuju se bezgotovinski, preko vašeg bankovnog računa.",
        },
        {
          q: "Mogu li da plaćam platnom karticom?",
          a: "Ne, plaćanje platnim karticama trenutno nije moguće. Razlog za to su visoke provizije banaka (često i do 2–3%) koje bi neizbežno morale da se ugrade u krajnju cenu zlata. Naš cilj je da vam obezbedimo najpovoljniju moguću cenu na tržištu bez skrivenih troškova, zbog čega prihvatamo isključivo plaćanje gotovinom, bankovnim transferom ili pouzećem.",
        },
        {
          q: "Koliko traje isporuka?",
          a: "Za klijente u Beogradu nudimo isporuku 'dan za dan' — ukoliko je porudžbina evidentirana radnim danima do 12h, zlato stiže na vašu adresu istog dana do 18h. Za porudžbine iz ostalih gradova Srbije, diskretna i osigurana dostava traje od 1 do 3 radna dana (ovo ne važi za avansne kupovine, za koje se rok isporuke precizno definiše pri samoj kupovini).",
        },
      ],
    },
  },

  "becka-filharmonija-dukat": {
    metaTitle: "Dukat Bečka Filharmonija | Zlatna Kovanica 999,9 — Prodaja Beograd",
    metaDescription:
      "Kupite zlatnu kovanicu Bečka Filharmonija (Vienna Philharmonic) — čistoća 999,9/1000, na LBMA listi, oslobođena PDV-a. Formati 1/10 oz do 1 oz. Brza dostava Beograd i čitava Srbija.",
    breadcrumbLabel: "Dukat Bečka Filharmonija",
    heroTitle: "Dukat Bečka Filharmonija",
    purity: "999.9/1000",
    intro:
      "Zlatna kovanica Bečka Filharmonija (Wiener Philharmoniker) jedina je investiciona kovanica sveta iskovana u zlatu čistoće 999,9/1000 i istovremeno zakonsko sredstvo plaćanja u eurozoni. Kotirana na londonskoj LBMA berzi, potpuno oslobođena PDV-a i jedna od najprodavanijih zlatnih kovanica u istoriji. Gold Invest nudi sve formate — od pristupačnih 1/10 oz do investicionih 1 oz — direktno iz austrijske državne kovnice, uz garantovanu autentičnost i transparentnu cenu. Upit na broj 0612698569 ili putem kontakt forme — brza dostava za Beograd i čitavu Srbiju.",
    heroImage: "https://ucngtcsmkxuxuubrobsc.supabase.co/storage/v1/object/public/product-images/dukati/Becka%20filharmonija%200.5%20oz%20zlatni%20dukat_2.webp",
    variantSlugs: [
      "becka-filharmonija-1-10-oz",
      "becka-filharmonija-1-4-oz",
      "becka-filharmonija-1-2-oz",
      "becka-filharmonija-1-oz",
    ],
    mockWeights: [3.11, 7.78, 15.55, 31.10],
    formatsHeading: "Bečka Filharmonija — Koji format izabrati?",
    formatsDescription:
      "Bečka Filharmonija se kuje u austrijskoj državnoj kovnici (Münze Österreich) od zlata najviše moguće čistoće — 999,9/1000 (24 karata). Dostupna je u četiri zvanična formata: 1/10 oz, 1/4 oz, 1/2 oz i 1 oz. Svi formati nose identičan dizajn, iste garancije autentičnosti i isti LBMA status.",
    formats: [
      {
        title: "Bečka Filharmonija 1/10 oz",
        specs: "3,11 g ukupno — 3,109 g čistog zlata — čistoća 999,9/1000 (24 karata)",
        body: "Najpristupačniji ulaz u investiciono zlato. Idealan za početnike, mesečno štedenje i poklone. Manja nominalna vrednost znači manji rizik i lakše unovčavanje — savršen način da postepeno i disciplinovano gradite zlatni portfelj bez velikih jednokratnih ulaganja.",
      },
      {
        title: "Bečka Filharmonija 1 oz",
        specs: "31,10 g ukupno — 31,09 g čistog zlata — čistoća 999,9/1000 (24 karata)",
        body: "Najlikvidniji i najpopularniji investicioni format na globalnom tržištu. Prepoznatljiv svuda u svetu, sa najnižom premiom po gramu u odnosu na manje formate. Idealan za ozbiljne investitore koji traže maksimalnu vrednost i globalnu likvidnost — prodaje se po tržišnoj ceni LBMA zlata na svakom kontinentu.",
      },
    ],
    priceStructure: {
      title: "Bečka Filharmonija cena — Prodajna / Avansna / Otkupna",
      description:
        "Gold Invest vam uvek nudi tri transparentna oblika cene za zlatnu kovanicu Bečka Filharmonija:",
      card1Body:
        "Cena za kovanice koje trenutno imamo u našem beogradskom trezoru. Plaćate i preuzimate odmah — bez čekanja i skrivenih troškova.",
      card2Body:
        "Planirate kupovinu većeg broja kovanica? Uplatite iznos unapred, zaključajte trenutnu, nižu berzansku cenu i sačekajte isporuku direktno iz austrijske kovnice uz značajnu uštedu.",
      card3Body:
        "Iznos po kojem u svakom trenutku otkupljujemo vaše kovanice. Zahvaljujući globalnoj prepoznatljivosti i LBMA statusu Bečke Filharmonije, spread između prodajne i otkupne cene uvek je kod nas sveden na minimum.",
    },
    delivery: {
      heading: "Gde kupiti Bečku Filharmoniju u Srbiji — Gold Invest Beograd",
      description:
        "Prodaja zlatne kovanice Bečka Filharmonija moguća je na nekoliko načina — uvek diskretno i maksimalno osigurano.",
      pickupCardBody:
        "Posetite nas lično u Beogradu. Potpuno diskretno okruženje, stručna provera autentičnosti i preuzimanje na licu mesta bez čekanja.",
    },
    historySection: {
      heading: "Bečka Filharmonija — Istorija najcenjenije investicione kovanice Evrope",
      intro:
        "Od svog prvog kovanja 1989. godine, Bečka Filharmonija je postala globalni standard investicionog zlata — jedina evropska kovanica na listi LBMA, zakonsko sredstvo plaćanja u Austriji i najprodavanija zlatna kovanica na kontinentu decenijama.",
      cards: [
        {
          heading: "Šta je Bečka Filharmonija?",
          body: "Bečka Filharmonija (Wiener Philharmoniker) osnovan je 1842. godine u Beču i važi za jedan od najcenjenijih orkestara na svetu. Kao vrhunski simbol austrijske kulturne baštine, Münze Österreich — austrijska državna kovnica — odabrala je upravo ovaj orkestar kao inspiraciju za novu zlatnu investicionu kovanicu koja je 1989. godine trebalo da postavi evropski odgovor na američki Zlatni orao i kanadski Javorov list. Izbor se pokazao genijanim: Bečka Filharmonija je od prve serije postala hit na tržištu.",
        },
        {
          heading: "Zašto je ovo najprodavanija investiciona kovanica Evrope?",
          body: "Od 1989. do 1994. godine, Bečka Filharmonija je bila najprodavanija zlatna kovanica na svetu. Danas je konstantno na vrhu evropskog tržišta iz tri ključna razloga: čistoća 999,9/1000 je najviša moguća u industriji; status zakonskog sredstva plaćanja u Austriji (nominalna vrednost 100 €) daje joj pravnu sigurnost; i kotiranost na londonskoj LBMA berzi garantuje globalnu likvidnost kakvu nijedna druga evropska zlatna kovanica ne može da ponudi.",
        },
        {
          heading: "Dizajn kovanice — Šta prikazuje?",
          body: [
            "Lice (Avers): prikazuje veličanstvene orgulje bečke Musikverein dvorane — zlatne dvorane u kojoj svake godine peva Novogodišnji koncert. Uz ivicu su upisani 'REPUBLIK ÖSTERREICH', nominalna vrednost (100 EURO) i godina kovanja.",
            "Naličje (Revers): krase ga instrumenti Bečke Filharmonije — violina, čelo, harfa, fagot i rog. Naličje se povremeno menja, što pojedinim godišnjim serijama daje posebnu kolekcionarsku vrednost.",
          ],
        },
        {
          heading: "LBMA standard — Zašto je to važno za vas?",
          body: "Bečka Filharmonija je jedna od svega nekoliko zlatnih kovanica na svetu koje zadovoljavaju stroge standarde London Bullion Market Association (LBMA) — globalne berze plemenitih metala sa sedištem u Londonu. Praktično, to znači da ovu kovanicu možete prodati po punoj tržišnoj ceni zlata u bilo kojoj zlatarnici, banci ili berzanskoj kući — od Beograda do Tokija — bez ikakvih diskusija o autentičnosti ili umanjenja vrednosti. Ovo je ključna prednost u odnosu na nelistirane kovanice i zlatne pločice lokalnih kovnica.",
        },
      ],
    },
    faq: {
      title: "Česta pitanja o kovanici Bečka Filharmonija",
      items: [
        {
          q: "Da li se na Bečku Filharmoniju plaća PDV?",
          a: "Ne. Prema zakonima Republike Srbije, zlatne kovanice čistoće iznad 900/1000 iskovane posle 1800. godine tretiraju se kao investiciono zlato i u potpunosti su oslobođene PDV-a i poreza na kapitalnu dobit. Bečka Filharmonija, sa čistoćom od 999,9/1000, ispunjava ove uslove u potpunosti.",
        },
        {
          q: "Koja je razlika između Bečke Filharmonije i dukata Franc Jozef?",
          a: "Obe kovanice potiču iz iste austrijske državne kovnice (Münze Österreich), ali postoje tri ključne razlike: (1) Čistoća — Bečka Filharmonija je 999,9/1000 (24 karata), Franc Jozef je 986/1000 (23,6 karata); (2) LBMA — Bečka Filharmonija je kotirana na londonskoj berzi plemenitih metala, Franc Jozef nije; (3) Namena — Franc Jozef je pre svega tradicionalni poklon i istorijska kovanica, Bečka Filharmonija je savremeni globalni investicioni standard. Oba su u potpunosti oslobođena PDV-a.",
        },
        {
          q: "Zašto je važna čistoća 999,9/1000?",
          a: "Čistoća 999,9/1000 (takozvane 'četiri devetke') je najviši mogući standard čistoće zlata u investicionoj industriji. Na svakih 1000 grama kovanice ima svega 0,1 gram ostalih materija. Ova čistoća je preduslov LBMA standarda i garantuje da ćete kovanicu prodati po punoj tržišnoj ceni zlata, bez ikakvih umanjenja i bez diskusije o kvalitetu, bilo gde u svetu.",
        },
        {
          q: "Koji format Bečke Filharmonije da izaberem?",
          a: "Zavisi od vaših ciljeva: format 1/10 oz (3,11 g) je idealan za početnike i mesečno štedenje — manja vrednost znači manji rizik i lakše unovčavanje. Format 1/4 oz (7,78 g) i 1/2 oz (15,55 g) nude dobar balans između premije i vrednosti. Format 1 oz (31,10 g) nosi najnižu premiju po gramu i najpogodniji je za ozbiljne investitore. Kod svih formata, pravo na otkup po tržišnoj ceni i transparentno poslovanje ostaju isti.",
        },
        {
          q: "Da li Bečka Filharmonija dolazi sa sertifikatom autentičnosti?",
          a: "Kovanice direktno iz kovnice dolaze u zapečaćenim fabričkim blister pakovanjima — sam blister je garancija autentičnosti i nedirnutosti. Kovanice van originalnog blistera proveravamo na licu mesta preciznim merenjima dimenzija, tačne težine i tona. Od nas dobijate kovanicu zaštićenu u tvrdoj akrilnoj kapsuli, koja ga čuva od fizičkih oštećenja i gubitka investicione vrednosti.",
        },
        {
          q: "Kako čuvati Bečku Filharmoniju?",
          a: "Zlatno pravilo: nikada ne dodirujte površinu kovanice golim prstima i nikada je ne trljajte niti polirujte krpama. Zlato čistoće 999,9 je posebno mekano u poređenju sa legurama (poput Franc Jozefa) i podložno je ogrebotinama. Svako fizičko oštećenje trajno umanjuje investicionu vrednost. Čuvajte kovanicu u originalnom blisteru ili akrilnoj kapsuli, na suvom mestu zaštićenom od svetlosti.",
        },
        {
          q: "Da li otkupljujete Bečku Filharmoniju?",
          a: "Da, Gold Invest vrši brz i diskretan otkup svih formata Bečke Filharmonije (1/10 oz, 1/4 oz, 1/2 oz i 1 oz), bez obzira na godinu kovanja ili mesto kupovine. Zahvaljujući LBMA statusu ove kovanice, naša otkupna cena je uvek blizu tržišne cene zlata na londonskoj berzi. Provera autentičnosti na licu mesta traje svega nekoliko minuta, a isplata istog dana.",
        },
        {
          q: "Koji je limit za plaćanje u gotovini?",
          a: "U skladu sa Zakonom o sprečavanju pranja novca i finansiranja terorizma, kupovinu kovanica možete platiti gotovinom do zakonskog limita od 1.160.000 dinara (oko 10.000 evra u protivvrednosti). Sve transakcije iznad ovog iznosa realizuju se bezgotovinski, bankovnim transferom.",
        },
        {
          q: "Mogu li platiti platnom karticom?",
          a: "Ne, plaćanje platnim karticama trenutno nije moguće. Razlog su visoke bankarske provizije (često 2–3%) koje bi morale biti ukalkulisane u cenu i umanjile bi vašu prednost nad tržišnom cenom. Naš cilj je da vam uvek obezbedimo najpovoljniju moguću cenu — bez skrivenih troškova — zbog čega prihvatamo gotovinu, bankarski transfer i pouzećem.",
        },
        {
          q: "Koliko traje isporuka?",
          a: "Za klijente u Beogradu nudimo isporuku isti dan — ukoliko je porudžbina evidentirana radnim danima do 12h, kovanica stiže na vašu adresu istog dana do 18h. Za ostale gradove Srbije, diskretna i osigurana dostava traje 1 do 3 radna dana. Avansne kupovine imaju poseban, unapred dogovoreni rok isporuke iz kovnice.",
        },
      ],
    },
  },
};

// ── Static params ──────────────────────────────────────────────────────────
export function generateStaticParams() {
  return Object.keys(SLUG_CONFIGS).map((slug) => ({ slug }));
}

// ── Metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = SLUG_CONFIGS[slug];
  if (!config) return {};
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: `https://goldinvest.rs/kategorija/zlatni-dukati/${slug}`,
    },
  };
}

// ── Page ───────────────────────────────────────────────────────────────────
export default async function DukatSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = SLUG_CONFIGS[slug];
  if (!config) notFound();

  const matchesConfigVariant = (v: any) =>
    config.variantSlugs.includes(v.slug) ||
    config.mockWeights.some((w) => Math.abs(Number(v.weight_g) - Number(w)) < 0.02);

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
        .order("sort_order"),
      supabase.from("pricing_tiers").select("*"),
      supabase
        .from("gold_price_snapshots")
        .select("*")
        .order("fetched_at", { ascending: false })
        .limit(1)
        .single(),
    ]);
    variants = (r1.data ?? []).filter(matchesConfigVariant);
      tiers = r2.data ?? [];
      snapshotRow = r3.data ?? null;
  } catch {
    // DB nedostupna
  }

  const breadcrumbs = [
    { label: "Investiciono zlato", href: "/" },
    { label: "Zlatni dukati", href: "/kategorija/zlatni-dukati" },
    { label: config.breadcrumbLabel, href: `/kategorija/zlatni-dukati/${slug}` },
  ];

  return (
    <main className="bg-white">
      {/* Schema.org */}
      <SchemaScript schema={buildBreadcrumbSchema(breadcrumbs)} />
      <SchemaScript
        schema={buildProductSchema({
          name: config.heroTitle,
          description: config.metaDescription,
          brand: "Münze Österreich",
          slug: `/kategorija/zlatni-dukati/${slug}`,
          image: config.heroImage,
          purity: config.purity ?? "986/1000",
        })}
      />
      <SchemaScript schema={buildFaqSchema(config.faq.items)} />

      {/* ── Breadcrumb ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={breadcrumbs} variant="light" />
        </SectionContainer>
      </section>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        className="overflow-hidden py-6"
        style={{
          background: "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-10 items-center">
            {/* Left: product image */}
            <div
              className="relative rounded-2xl overflow-hidden bg-[#F9F9F9]"
              style={{ height: 320 }}
            >
              <Image
                src={config.heroImage}
                alt={config.heroTitle}
                fill
                className="object-contain p-8"
              />
            </div>

            {/* Right: title + intro + CTAs */}
            <div>
              <h1
                className="text-[#1B1B1C] leading-[1.05]"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontSize: "clamp(28px, 3.8vw, 54px)",
                  fontWeight: 400,
                }}
              >
                {config.heroTitle}
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
                  style={{
                    fontSize: 12.1,
                    boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
                  }}
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

      {/* ── Product grid ─────────────────────────────────────────────────── */}
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
            gridClassName="grid grid-cols-1 sm:grid-cols-2 gap-6"
            maxItems={4}
          />
        </div>
      </section>

      {/* ── H2: Mali i Veliki FJ — format comparison ───────────────────── */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title={config.formatsHeading}
            description={config.formatsDescription}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.formats.map((fmt) => (
              <div
                key={fmt.title}
                className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-8"
              >
                <h3
                  className="text-[#1B1B1C] mb-2"
                  style={{
                    fontFamily: "var(--font-pp-editorial), Georgia, serif",
                    fontSize: "clamp(18px, 2vw, 24px)",
                    fontWeight: 400,
                  }}
                >
                  {fmt.title}
                </h3>
                <p
                  className="text-xs font-semibold tracking-widest uppercase text-[#BF8E41] mb-4"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  {fmt.specs}
                </p>
                <p
                  className="text-[#6B6B6B] leading-relaxed"
                  style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14.5 }}
                >
                  {fmt.body}
                </p>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ── H2: Cena ─────────────────────────────────────────────────────── */}
      <PriceStructureSection
        title={config.priceStructure.title}
        description={config.priceStructure.description}
        card1Body={config.priceStructure.card1Body}
        card2Body={config.priceStructure.card2Body}
        card3Body={config.priceStructure.card3Body}
      />

      {/* ── H2: Gde kupiti / Dostava ──────────────────────────────────────── */}
      <DeliverySection
        heading={config.delivery.heading}
        description={config.delivery.description}
        pickupCardBody={config.delivery.pickupCardBody}
      />

      {/* ── H2: Istorija Franc Jozefa ─────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title={config.historySection.heading}
            description={config.historySection.intro}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {config.historySection.cards.map((card) => (
              <InfoCard key={card.heading} title={card.heading}>
                {Array.isArray(card.body) ? (
                  <ul className="space-y-2">
                    {card.body.map((line, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#BEAD87] shrink-0" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  card.body
                )}
              </InfoCard>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <CategoryFaq
        title={config.faq.title}
        items={config.faq.items}
        ctaHref="/kontakt"
        ctaLabel="Kontaktirajte nas"
      />

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <WhatIsGoldSection />
    </main>
  );
}
