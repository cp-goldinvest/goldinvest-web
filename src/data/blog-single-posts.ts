import type { Post } from "@/components/blog/BlogGrid";
import type { BlogBlock } from "@/components/blog/SingleBlogPostTemplate";

export type SingleBlogPostEntry = {
  metaTitle: string;
  metaDescription: string;
  post: Post;
  blocks: BlogBlock[];
};

const DEFAULT_IMAGE = "/images/bento-gold-bar.webp";
const DEFAULT_IMAGE_ALT = "Zlatna poluga kao investicija";

export const BLOG_SINGLE_POSTS: Record<string, SingleBlogPostEntry> = {
  "zasto-ulagati-u-zlato": {
    metaTitle: "Zašto ulagati u zlato — 7 razloga | Gold Invest",
    metaDescription:
      "Zlato čuva vrednost kroz decenije, štiti od inflacije i valutnih kriza. Evo 7 konkretnih razloga zašto finansijski stručnjaci preporučuju 5–15% zlata u svakom portfelju.",
    post: {
      slug: "zasto-ulagati-u-zlato",
      title: "Zašto ulagati u zlato — 7 razloga koje svaki investitor treba da zna",
      excerpt:
        "Zlato čuva vrednost kroz decenije, štiti od inflacije i valutnih kriza. Evo 7 konkretnih razloga zašto finansijski stručnjaci preporučuju 5–15% zlata u svakom portfelju.",
      category: "Investiciono zlato",
      date: "15. mart 2025.",
      readMin: 7,
      image: DEFAULT_IMAGE,
      imageAlt: DEFAULT_IMAGE_ALT,
      featured: true,
    },
    blocks: [
      {
        type: "paragraph",
        text:
          'Pitanje "da li da kupim zlato" postavljaju sebi sve češće i oni koji nikad pre nisu razmišljali o investicijama. Razlog je jednostavan: nestabilnost valuta, rast cena i sve manje poverenje u bankarski sistem teraju ljude da traže nešto što je van domašaja inflacije i političkih odluka.',
      },
      {
        type: "paragraph",
        text:
          "Zlato nije novi trend. To je sredstvo čuvanja vrednosti staro više hiljada godina, koje je preživelo pad svake imperije, svaku hiperinflaciju i svaku globalnu krizu. U ovom tekstu ćemo razložiti sedam konkretnih razloga zašto finansijski stručnjaci preporučuju da između 5% i 15% svakog portfelja bude u fizičkom zlatu.",
      },

      { type: "heading", text: "1. Zlato štiti od inflacije — i to dokazano" },
      {
        type: "paragraph",
        text:
          "Inflacija je tihi porez koji jede vašu ušteđevinu. Novac koji ste danas stavili u ladicu biće vredan manje za godinu dana — to je matematička činjenica u svakoj ekonomiji sveta.",
      },
      {
        type: "paragraph",
        text:
          "Zlato funkcioniše obrnuto. U periodu između 1971. i 2024. godine, cena zlata u dolarima porasla je za više od 8.000%. U istom periodu, dolar je izgubio više od 85% kupovne moći. Ko je čuvao ušteđevinu u zlatu, nije samo sačuvao vrednost — povećao ju je.",
      },
      {
        type: "chart",
        title: "Zlato vs kupovna moć dolara (1971–2024)",
        legend: {
          gold: "Zlato",
          dollar: "Kupovna moć dolara",
        },
        summary: {
          goldGrowth: "Rast zlata: ~8000%",
          dollarDecline: "Pad kupovne moći USD: ~85%",
        },
      },
      {
        type: "paragraph",
        text:
          "Srpski dinar je u poslednjih 30 godina doživeo višestruke devalvacije. Fizičko zlato, denominirano u globalnoj rezervnoj valuti, nije podložno odlukama Narodne banke Srbije.",
      },

      { type: "heading", text: "2. Zlato je globalno likvidno — svuda u svetu" },
      {
        type: "paragraph",
        text:
          "Za razliku od nekretnina koje možete prodati tek za nekoliko meseci i samo na lokalnom tržištu, zlatna poluga LBMA rafinerije prihvata se odmah i po fer ceni u svakoj menjačnici zlata, svakoj banci i kod svakog dilera na planeti.",
      },
      {
        type: "paragraph",
        text:
          "Ovo je posebno važno u kriznim situacijama. Kad vam zatreba gotovina — bilo u Beogradu, Beču ili Tokiju — zlatna poluga je odmah unovčiva bez popusta.",
      },

      { type: "heading", text: "3. Nema rizika druge strane (counterparty risk)" },
      {
        type: "paragraph",
        text:
          "Kada novac čuvate u banci, vaša ušteđevina zapravo postoji samo kao zapis u bančinoj knjizi. Banka može da bankrotira, da bude zamrznuta, da uvede limite podizanja. Upravo to se desilo deponentima Agrobanka 2012. u Srbiji i klijentima desetina banaka po svetu tokom finansijske krize 2008.",
      },
      {
        type: "paragraph",
        text:
          "Fizičko zlato u vašem sefu nema ovu ranjivost. Ne postoji banka koja mora biti solventna da bi vaše zlato zadržalo vrednost. Zlato je vaše — bez posrednika, bez uslova, bez sitnih slova ugovora.",
      },

      { type: "heading", text: "4. Centralne banke sveta kupuju zlato rekordno" },
      {
        type: "paragraph",
        text:
          "Kad najmoćnije finansijske institucije na svetu — Narodna banka Kine, Rusije, Indije, Turske, Poljske — godišnje kupuju stotine tona zlata i smanjuju udeo dolara u rezervama, to nije slučajno.",
      },
      {
        type: "paragraph",
        text:
          "Centralne banke su u 2022. i 2023. godini kupile više zlata nego ikad od pada Bretton Woods sistema 1971. Privatni investitor koji prati ovu logiku ne radi ništa drugačije od onoga što rade najsofisticiraniji finansijski igrači na planeti.",
      },

      { type: "heading", text: "5. Zlato diversifikuje portfelj i smanjuje ukupni rizik" },
      {
        type: "paragraph",
        text:
          "Moderna teorija portfelja kaže da pravi cilj investiranja nije maksimizacija prinosa, već maksimizacija prinosa pri određenom nivou rizika. Zlato je, zbog negativne korelacije s akcijama i obveznicama u kriznim periodima, savršen diversifikator.",
      },
      {
        type: "paragraph",
        text:
          "Jednostavno: kad akcije padaju, zlato obično raste — ili barem ne pada. Portfelj s 10% zlata u proseku ima manji pad u krizama uz skoro isti dugoročni prinos kao portfelj bez zlata.",
      },

      { type: "heading", text: "6. Ponuda zlata je fizički ograničena" },
      {
        type: "paragraph",
        text:
          'Zlato se ne može "štampati". Na svetu postoji fiksan broj tona zlata koje je moguće iskopati — procenjuje se da je oko 80% ukupnih rezervi već izvađeno. Godišnja rudarska produkcija raste manje od 2% godišnje.',
      },
      {
        type: "paragraph",
        text:
          "S druge strane, potražnja raste — od privatnih investitora, industrije (elektronika, stomatologija) i centralnih banaka. Ograničena ponuda plus rastuća potražnja znači dugoročni pritisak na cenu.",
      },

      { type: "heading", text: "7. Zlato je van domašaja digitalne ranjivosti" },
      {
        type: "paragraph",
        text:
          "U svetu u kome se sve više vrednosti čuva u digitalnom obliku — kriptovalute, bankarski depoziti, akcije u digitalnom zapisu — fizičko zlato nudi nešto što ne može da se hakuje, obriše ili zamrzne regulatornom odlukom.",
      },
      {
        type: "paragraph",
        text:
          "Dok kriptovalute mogu da nestanu u jednom danu (FTX kolaps, Luna/Terra kolaps), a bankovni račun može biti zamrznut sudskim nalogom, zlatna poluga u vašem sefu postoji fizički i ne zavisi ni od jedne mreže, servera ili regulatora.",
      },

      { type: "heading", text: "Koliko zlata treba da imate u portfelju?" },
      {
        type: "paragraph",
        text:
          "Konzervativna preporuka finansijskih planera: između 5% i 15% ukupnih sredstava u fizičkom zlatu. Tačan procenat zavisi od vaše tolerancije na rizik, starosti i dugoročnih ciljeva.",
      },
      {
        type: "paragraph",
        text:
          "Ako nikad niste kupili zlato, dobar početak je zlatna poluga od 50g ili 100g — dovoljno fleksibilna za postepenu kupovinu, dovoljno značajne vrednosti da napravi razliku u portfelju.",
      },
      {
        type: "paragraph",
        text:
          "Za sva pitanja o kupovini zlatnih poluga u Srbiji, pozovite nas na 061/269-8569 ili posetite naš centar u Beogradu.",
      },
    ],
  },
  "centralne-banke-kupuju-zlato": {
    metaTitle: "Centralne banke rekordno kupuju zlato — šta znači za investitore | Gold Invest",
    metaDescription:
      "U 2022. i 2023. centralne banke sveta kupile su više zlata nego ikad. Otkrijte zašto ovo povećava dugoročni pritisak na cenu i kako to utiče na privatne investitore.",
    post: {
      slug: "centralne-banke-kupuju-zlato",
      title: "Centralne banke rekordno kupuju zlato — šta to znači za vas",
      excerpt:
        "Centralne banke sveta kupuju zlato u rekordnim količinama — šta to znači za cenu i vašu investiciju?",
      category: "Tržište",
      date: "5. februar 2025.",
      readMin: 6,
      image: DEFAULT_IMAGE,
      imageAlt: "Centralne banke i zlato",
    },
    blocks: [
      {
        type: "paragraph",
        text:
          "Postoji jedna vest koja prolazi gotovo nezapaženo u svakodnevnom informativnom haosu, a ima direktan uticaj na svakoga ko drži ili razmišlja o fizičkom zlatu: centralne banke sveta kupuju zlato u rekordnim količinama — i to ne usporavaju.",
      },
      { type: "heading", text: "Brojke koje govore same za sebe" },
      {
        type: "paragraph",
        text:
          "Prema podacima World Gold Council (WGC), centralne banke sveta su u 2022. godini kupile 1.136 tona zlata — više nego ikada od kada postoje pouzdani podaci, od 1950. godine.",
      },
      {
        type: "paragraph",
        text:
          "2023. godina nastavila je ovaj trend sa kupovinom od 1.037 tona. To je druga godina zaredom sa kupovinom iznad 1.000 tona.",
      },
      {
        type: "paragraph",
        text:
          "Za poređenje: u periodu 1990–2009, centralne banke su bile neto prodavci zlata.",
      },
      { type: "heading", text: "Ko najviše kupuje i zašto?" },
      {
        type: "stepItem",
        number: 1,
        title: "Kina",
        body: "Narodna banka Kine objavila je kupovinu zlata u svakom mesecu tokom 2023. godine. Kina strateški smanjuje zavisnost od dolara kao rezervne valute — proces poznat kao de-dolarizacija.",
      },
      {
        type: "stepItem",
        number: 2,
        title: "Turska",
        body: "Centralna banka Turske kupuje zlato kao odgovor na inflaciju i nestabilnost valute.",
      },
      {
        type: "stepItem",
        number: 3,
        title: "Indija, Singapur, Češka, Poljska",
        body: "Evropske centralne banke povećavaju učešće zlata u rezervama zbog geopolitičkih rizika.",
      },
      {
        type: "stepItem",
        number: 4,
        title: "Srednji Istok",
        body: "Centralne banke zemalja Zaliva diversifikuju rezerve iz dolara u zlato.",
      },
      { type: "heading", text: "Zašto je ovo bitno za privatnog investitora?" },
      {
        type: "stepItem",
        number: 1,
        title: "Strukturna potražnja koja podiže cenu",
        body: [
          "Centralne banke nisu špekulanti — ne kupuju i prodaju na osnovu kratkoročnih kretanja. Kada kupuju, drže na godinama i decenijama. Ovo znači da se godišnje iz slobodnog tržišta povlači preko 1.000 tona zlata.",
          "Rudarska produkcija iznosi oko 3.500 tona godišnje, što znači da banke apsorbuju gotovo trećinu ponude.",
        ],
      },
      {
        type: "stepItem",
        number: 2,
        title: "Signal o poverenju u globalni finansijski sistem",
        body: "Centralne banke imaju pristup informacijama koje privatni investitori nemaju, pa njihova kupovina zlata šalje snažan signal.",
      },
      {
        type: "stepItem",
        number: 3,
        title: "De-dolarizacija menja globalnu finansijsku arhitekturu",
        body: "Udeo dolara u rezervama opada, a zlato postaje ključna alternativa.",
      },
      { type: "heading", text: "Šta se dešavalo sa cenom zlata?" },
      {
        type: "list",
        items: [
          "Januar 2023: ~1.900 USD/oz",
          "April 2023: ~2.050 USD/oz",
          "Mart 2024: ~2.200 USD/oz",
          "Oktobar 2024: ~2.700 USD/oz",
        ],
      },
      { type: "goldPriceChart" },
      {
        type: "paragraph",
        text:
          "Analitičari predviđaju cenu od 3.000 USD/oz do kraja 2025.",
      },
      { type: "heading", text: "Praktičan zaključak za srpskog investitora" },
      {
        type: "paragraph",
        text:
          "Ono što centralne banke rade na makro nivou, ima smisla i na ličnom nivou: čuvati deo ušteđevine u zlatu.",
      },
      {
        type: "paragraph",
        text:
          "Zlatna poluga funkcioniše kao zaštita od sistemskih rizika.",
      },
      {
        type: "paragraph",
        text:
          "Za informacije o kupovini, pozovite 061/269-8569.",
      },
    ],
  },
  "inflacija-i-zlato": {
    metaTitle: "Inflacija i zlato — kako zlato štiti ušteđevinu | Gold Invest",
    metaDescription:
      "U periodima visoke inflacije, zlato je istorijski čuvalo kupovnu moć. Pogledajte podatke iz poslednjih 50 godina i šta to znači za vaš novac danas.",
    post: {
      slug: "inflacija-i-zlato",
      title: "Inflacija i zlato — istorijska veza koja štiti vašu ušteđevinu",
      excerpt:
        "Zlato kroz istoriju štiti kupovnu moć u inflatornim periodima — evo šta to znači za vašu ušteđevinu.",
      category: "Saveti",
      date: "22. februar 2025.",
      readMin: 8,
      image: DEFAULT_IMAGE,
      imageAlt: "Inflacija i zlato",
    },
    blocks: [
      {
        type: "paragraph",
        text:
          "Krajem 2021. godine, inflacija u Srbiji je počela da ubrzava. Do 2022. dostigla je dvocifrene vrednosti — nešto što prethodna generacija nije videla od devedesetih. Cene hrane, struje, goriva i iznajmljivanja stanova rasle su brže nego plate. Ušteđevina na bankovnom računu je gubila kupovnu moć mesec za mesec.",
      },
      {
        type: "paragraph",
        text:
          "Oni koji su u tom periodu držali deo sredstava u fizičkom zlatu gledali su drugačiji prizor: cena zlata u dinarima je rasla. Njihova ušteđevina nije samo odolela inflaciji — povećala je nominalnu vrednost.",
      },
      {
        type: "paragraph",
        text:
          "Ovo nije slučajnost. To je istorijski obrazac koji se ponavlja decenijama.",
      },
      { type: "heading", text: "Šta je inflacija i zašto jede ušteđevinu?" },
      {
        type: "paragraph",
        text:
          "Inflacija je smanjenje kupovne moći novca. Kad cene rastu 10% godišnje, 100.000 dinara koje danas možete da kupite određeni koš roba, sledeće godine kupuje samo 90.909 dinara vrednosti te iste robe.",
      },
      {
        type: "paragraph",
        text:
          "Ako je vaša ušteđevina na štednom računu i donosi 3% kamate, a inflacija je 10%, gubite 7% kupovne moći godišnje. U realnom smislu, osiromašujete — čak i dok vam raste broj na bankovnom izvodu.",
      },
      {
        type: "paragraph",
        text:
          "Dinarski depoziti posebno su ranjivi jer dinar nema globalnu referentnu vrednost i podložan je lokalnoj monetarnoj politici.",
      },
      { type: "heading", text: "Zlato kao \"store of value\" — šta podaci kažu" },
      {
        type: "paragraph",
        text:
          "Godine 1971. predsednik Nixon je prekinuo direktnu vezanost dolara za zlato (kraj Bretton Woods sistema). U tom trenutku, cena zlata bila je 35 dolara po troy unci.",
      },
      {
        type: "paragraph",
        text:
          "U januaru 2025, cena zlata iznosi oko 2.700 dolara po troy unci — povećanje od blizu 7.600% u 54 godine.",
      },
      {
        type: "paragraph",
        text:
          "U istom periodu, dolar je izgubio više od 85% kupovne moći prema indeksu potrošačkih cena SAD.",
      },
      {
        type: "paragraph",
        text:
          "Zaključak: ko je u ovom periodu čuvao ušteđevinu u zlatu umesto u dolarima, nije samo sačuvao vrednost — osetno je uvećao realno bogatstvo.",
      },
      { type: "heading", text: "Periodi visoke inflacije" },
      {
        type: "timeline",
        items: [
          {
            period: "1973–1979",
            inflation: "Inflacija (SAD): +90% ukupno",
            goldChange: "Cena zlata — promena: +750%",
          },
          {
            period: "2008–2012 (posle krize)",
            inflation: "Inflacija (SAD): umerna",
            goldChange: "Cena zlata — promena: +170%",
          },
          {
            period: "2020–2022 (Covid + rat)",
            inflation: "Inflacija (SAD): +20%+ ukupno",
            goldChange: "Cena zlata — promena: +40%",
          },
        ],
      },
      {
        type: "paragraph",
        text:
          "U svakom periodu visoke inflacije poslednjih pola veka, zlato nije samo pratilo inflaciju — nadmašilo ju je.",
      },
      { type: "heading", text: "Šta se dešavalo sa srpskim dinarom?" },
      {
        type: "paragraph",
        text:
          "Srbija ima posebno bolan odnos s inflacijom. Hiperinflacija devedesetih bila je jedna od najgorih u istoriji — za kratko vreme, štampana novčanica od \"jedne milijarde dinara\" nije mogla da kupi hleb.",
      },
      {
        type: "paragraph",
        text:
          "Ali i u mirnijim vremenima, dinar je postepeno gubio vrednost. Ko je 2005. imao 1.000 evra u dinarima na računu (oko 85.000 dinara tada), 2024. bi imao oko iste nominalne dinare, ali sa kupovnom moći vrednom daleko ispod 1.000 evra.",
      },
      {
        type: "paragraph",
        text:
          "Ko je tada kupio zlatnu polugu u ekvivalentnoj vrednosti — danas ima imovinu vrednu višestruko više.",
      },
      { type: "heading", text: "Zašto zlato \"prati\" inflaciju?" },
      {
        type: "paragraph",
        text:
          "Postoje tri mehanizma koja održavaju ovu vezu:",
      },
      { type: "heading", text: "1. Fiksna ponuda nasuprot rasta novčane mase" },
      {
        type: "paragraph",
        text:
          "Centralne banke mogu štampati novac bez ograničenja. Kada to rade u velikim količinama (kvantitativno popuštanje, finansiranje budžetskog deficita), vrednost novca pada. Zlato ne može da se \"štampa\" — godišnja rudarska produkcija iznosi oko 1–2% ukupnih svetskih zaliha. Ova asimetrija osigurava da zlato dugoročno ne gubi vrednost u odnosu na fiat novac.",
      },
      { type: "heading", text: "2. Alternativna imovina bez kreditnog rizika" },
      {
        type: "paragraph",
        text:
          "U inflatornim periodima, investitori beže iz gotovine i obveznica čiji realni prinos postaje negativan. Deo tog kapitala stiže u zlato — povećana potražnja diže cenu.",
      },
      { type: "heading", text: "3. Globalna denominacija" },
      {
        type: "paragraph",
        text:
          "Zlato se kotira u dolarima, ali njegova vrednost nije vezana za jednu državu ili ekonomiju. Ako Srbija ima 15% inflaciju, a ostatak sveta 3%, cena zlatne poluge u dinarima raste jer raste kurs evra prema dinaru — a cena zlata u evrima ostaje stabilna ili raste.",
      },
      { type: "heading", text: "Zlato vs. nekretnine kao zaštita od inflacije" },
      {
        type: "paragraph",
        text:
          "Nekretnine su dugo bile omiljeni \"hedge\" srpskih domaćinstava. Ali u poređenju sa zlatom, imaju nekoliko ograničenja:",
      },
      {
        type: "list",
        items: [
          "Nelikvidnost — nekretninu ne možete prodati za jedan dan, a u krizama cene padaju i likvidnost nestaje",
          "Troškovi — porez na imovinu, komunalije, renoviranje, agencijske provizije",
          "Nedeljivi — ne možete prodati \"20% stana\" kad vam zatreba deo gotovine",
          "Lokalni rizik — vrednost stana zavisi od lokalne tražnje, infrastrukture, urbanog razvoja",
        ],
      },
      {
        type: "paragraph",
        text:
          "Zlatna poluga od 100g može se prodati u roku od sata, bez troškova i po globalnoj referentnoj ceni.",
      },
      { type: "heading", text: "Koliko zlata treba da imate kao zaštitu od inflacije?" },
      {
        type: "paragraph",
        text:
          "Finansijski planeri obično preporučuju 10–15% ukupne imovine u fizičkom zlatu kao inflacioni hedge. Ovo nije spekulativna investicija — to je osiguranje kupovne moći.",
      },
      { type: "paragraph", text: "Praktičan primer:" },
      {
        type: "list",
        items: [
          "Imate ušteđevinu od 50.000 evra",
          "5.000–7.500 evra (10–15%) u fizičkim zlatnim polugama je razuman hedge",
          "Na trenutnoj ceni, to je otprilike 2–3 poluge od 50g ili 1 poluga od 100g",
        ],
      },
      {
        type: "paragraph",
        text:
          "Za konkretne informacije o aktuelnim cenama i dostupnim formatima, kontaktirajte nas na 061/269-8569 ili posetite našu poslovnicu u Beogradu.",
      },
    ],
  },
  "zlatne-poluge-vs-novcanice": {
    metaTitle: "Zlatne poluge ili zlatnici — šta je bolje za početnike | Gold Invest",
    metaDescription:
      "Poluge nude nižu premiju za veće iznose, zlatnici omogućavaju fleksibilnu prodaju u manjim količinama. Uporedite prednosti i mane oba formata i izaberite pravo za vas.",
    post: {
      slug: "zlatne-poluge-vs-novcanice",
      title: "Zlatne poluge ili zlatnici — šta je bolje za početnike",
      excerpt:
        "Poluge ili zlatnici? Razumite ključne razlike i izaberite format koji odgovara vašoj strategiji ulaganja.",
      category: "Vodič",
      date: "1. mart 2025.",
      readMin: 6,
      image: DEFAULT_IMAGE,
      imageAlt: "Zlatne poluge i zlatnici",
    },
    blocks: [
      {
        type: "paragraph",
        text:
          "Kada prvi put odlučite da kupite fizičko zlato, odmah nailazite na izbor koji zbunjuje mnoge početnike: da li uzeti zlatnu polugu ili zlatnik (numizmatički ili investicioni)? Oba su od čistog zlata. Oba su oslobođena PDV-a. Ali razlike su dovoljno važne da u potpunosti promene ekonomiku vaše investicije.",
      },
      { type: "heading", text: "Šta su zlatne poluge?" },
      {
        type: "paragraph",
        text:
          "Zlatne poluge su pravougaone ili trapezoidne šipke od čistog zlata čistoće 999,9/1000 (24 karata). Proizvode ih LBMA akreditovane rafinerije — Argor-Heraeus (Švajcarska), C. Hafner (Nemačka), Umicore (Belgija) i druge.",
      },
      {
        type: "paragraph",
        text:
          "Poluge dolaze u formatima od 1 grama do 1 kilograma, zapečaćene u sigurnosnom blisteru sa laserski ugravirenim serijskim brojem, gramažom i čistoćom.",
      },
      {
        type: "paragraph",
        text:
          "Ključna karakteristika poluga: minimalna premija po gramu — posebno u većim formatima.",
      },
      { type: "image", src: "/images/bento-gold-bar.webp", alt: "Zlatna poluga" },
      { type: "heading", text: "Šta su investicioni zlatnici?" },
      {
        type: "paragraph",
        text:
          "Investicioni zlatnici su kružni novčići kovani od zlata koje emituju državne kovnice.",
      },
      {
        type: "list",
        items: [
          "Bečka filharmonija (Austrija)",
          "Krügerrand (Južna Afrika)",
          "Britanija (Velika Britanija)",
          "Maple Leaf (Kanada)",
          "Franc Jozef dukati",
        ],
      },
      {
        type: "paragraph",
        text:
          "Svi investicioni zlatnici su čistoće 999,9 (ili 916,7 kod nekih starijih formata).",
      },
      { type: "image", src: "/images/bento-coins.webp", alt: "Investicioni zlatnici" },
      { type: "heading", text: "Ključne razlike: poluga vs. zlatnik" },
      {
        type: "comparison",
        leftTitle: "Zlatne poluge",
        rightTitle: "Zlatnici",
        rows: [
          {
            label: "Premija po gramu",
            left: "Poluga 100g: 2–4% · Poluga 50g: 3–5% · Poluga 1g: 15–20%",
            right: "Zlatnici imaju višu premiju (5–20%+).",
            better: "left",
          },
          {
            label: "Fleksibilnost prodaje",
            left: "Poluge zahtevaju prodaju u celini.",
            right: "Zlatnici omogućavaju lakšu prodaju u manjim količinama.",
            better: "right",
          },
          {
            label: "Likvidnost",
            left: "Globalna likvidnost.",
            right: "Globalna likvidnost.",
            better: "both",
          },
          {
            label: "Mogućnost čuvanja",
            left: "Poluge su kompaktnije.",
            right: "Zlatnici zahtevaju više prostora.",
            better: "left",
          },
          {
            label: "Estetska i kolekcionarska vrednost",
            left: "Poluge su kompaktnije.",
            right: "Zlatnici imaju dodatnu estetsku vrednost.",
            better: "right",
          },
        ],
      },
      { type: "heading", text: "Koji format je pravi za vas?" },
      {
        type: "list",
        items: [
          "Dugoročna investicija → poluge 100g+",
          "Poklon → zlatnik",
          "Mali budžet → 10g–50g poluge ili 1/4 oz",
          "Efikasnost → poluge 100g+",
        ],
      },
      { type: "heading", text: "Zaključak" },
      {
        type: "paragraph",
        text:
          "Ne postoji univerzalno bolji format — izbor zavisi od vaših ciljeva.",
      },
      {
        type: "paragraph",
        text:
          "Iskusni investitori kombinuju oba.",
      },
      {
        type: "paragraph",
        text:
          "Pozovite nas na 061/269-8569 za savet.",
      },
    ],
  },
  "lbma-sertifikacija-sta-znaci": {
    metaTitle: "LBMA sertifikacija — šta znači i zašto je važna | Gold Invest",
    metaDescription:
      "Samo zlato od LBMA akreditovanih kovnica garantuje međunarodnu prihvatljivost i lakšu preprodaju. Naučite kako da proverite poreklo pre kupovine.",
    post: {
      slug: "lbma-sertifikacija-sta-znaci",
      title: "LBMA sertifikacija — zašto je važna i kako je prepoznati",
      excerpt:
        "LBMA akreditacija je ključ likvidnosti i fer preprodaje investicionog zlata. Saznajte kako da je prepoznate pre kupovine.",
      category: "Vodič",
      date: "14. februar 2025.",
      readMin: 4,
      image: DEFAULT_IMAGE,
      imageAlt: "LBMA sertifikacija zlatne poluge",
    },
    blocks: [
      {
        type: "paragraph",
        text:
          "Kada kupujete zlatnu polugu, jedan od najvažnijih detalja nije ni cena ni izgled — to je status rafinerije koja je polugu proizvela. Poluge bez LBMA akreditacije mogu biti od potpuno čistog zlata, ali ih mnogi dileri i banke neće prihvatiti bez posebne i skupe provere.",
      },
      { type: "heading", text: "Šta je LBMA?" },
      {
        type: "paragraph",
        text:
          "London Bullion Market Association (LBMA) je međunarodna organizacija za standardizaciju tržišta plemenitih metala, osnovana 1987. sa sedištem u Londonu. LBMA nadzire globalni OTC tržišt zlata i srebra.",
      },
      { type: "paragraph", text: "LBMA vodi dve ključne liste:" },
      {
        type: "list",
        items: [
          "Good Delivery List — rafinerije koje ispunjavaju najstrožije standarde",
          "Responsible Sourcing — program praćenja etičnog porekla metala",
        ],
      },
      { type: "heading", text: "Šta znači \"Good Delivery\" standard?" },
      { type: "paragraph", text: "Good Delivery nije marketing termin — to je tačna i stroga specifikacija." },
      {
        type: "paragraph",
        text:
          "Da bi rafinerija ili njena poluga dobili ovaj status, mora da ispuni sledeće:",
      },
      {
        type: "checklist",
        items: [
          "Čistoća minimum 995/1000",
          "Tačna nominalna masa",
          "Jedinstven serijski broj",
          "Ime ili logo rafinerije",
          "Sledljivo, etično poreklo metala",
          "Regularni tehnički auditi LBMA inspekcijom",
        ],
      },
      {
        type: "paragraph",
        text:
          "Poluga koja zadovoljava sve ove uslove prihvata se bez provere i bez popusta kod profesionalnih učesnika tržišta.",
      },
      { type: "heading", text: "Zašto je to važno pri kupovini i prodaji?" },
      {
        type: "paragraph",
        text:
          "Ako kupite zlatnu polugu od neakreditovanog proizvođača, pri prodaji diler mora da:",
      },
      {
        type: "checklist",
        items: [
          "Proveri polugu hemijskim testovima (XRF analiza)",
          "Utvrdi poreklo",
          "Proceni tržišnu vrednost",
        ],
      },
      {
        type: "paragraph",
        text:
          "Ova provera košta novac i vreme. Zbog toga dileri takve poluge primaju sa diskontom od 5–15% u odnosu na spot cenu.",
      },
      {
        type: "paragraph",
        text:
          "LBMA poluga se prodaje odmah, po tržišnoj ceni, bez pitanja.",
      },
      { type: "heading", text: "Koje rafinerije su na Good Delivery listi?" },
      {
        type: "paragraph",
        text:
          "Na LBMA Good Delivery listi za zlato nalazi se oko 80 akreditovanih rafinerija. Najpoznatije dostupne na srpskom tržištu su:",
      },
      {
        type: "orderedList",
        items: [
          "Argor-Heraeus — Švajcarska — jedna od 3 najveće na svetu",
          "C. Hafner — Nemačka — 170+ godina tradicije",
          "Umicore — Belgija — lider u recikliranju",
          "Valcambi — Švajcarska — poznata po CombiBar formatima",
          "PAMP Suisse — Švajcarska — premium segment",
        ],
      },
      {
        type: "paragraph",
        text:
          "Sve poluge koje Gold Invest prodaje dolaze isključivo od rafinerija sa LBMA Good Delivery liste.",
      },
      { type: "heading", text: "Kako prepoznati LBMA polugu?" },
      {
        type: "paragraph",
        text: "Svaka autentična LBMA poluga ima sledeće elemente:",
      },
      {
        type: "checklist",
        items: [
          "Logo rafinerije",
          "Nominalna masa (npr. 100g ili 1 troy oz)",
          "Čistoća (999.9 ili 9999)",
          "Jedinstven serijski broj",
          "Fabrički blister",
        ],
      },
      {
        type: "ruleBox",
        text:
          "Zlatno pravilo: nikad ne otvarajte blister. Otvorena poluga gubi Good Delivery status i otkupljuje se po nižoj ceni.",
      },
      { type: "heading", text: "Proverite pre kupovine" },
      {
        type: "paragraph",
        text:
          "Pre nego što kupite zlatnu polugu od bilo kog dilera u Srbiji, postavite pitanje:",
      },
      {
        type: "paragraph",
        text:
          "\"Da li je poluga od LBMA akreditovane rafinerije i da li ima dostavni blister sa serijskim brojem?\"",
      },
      {
        type: "paragraph",
        text:
          "Ako odgovor nije potvrdan — razmislite dva puta. Investiciono zlato vredi onoliko koliko ga možete prodati. A za maksimalnu prodajnu vrednost, LBMA status je neophodan.",
      },
      {
        type: "paragraph",
        text: "Za sve informacije o dostupnim LBMA polugama, pozovite nas na 061/269-8569.",
      },
    ],
  },
  "kako-odrediti-cenu-zlata": {
    metaTitle: "Kako se formira cena zlata na tržištu | Gold Invest",
    metaDescription:
      "LBMA dva puta dnevno fiksira referentnu cenu zlata koja se koristi širom sveta. Saznajte koji faktori pokreću kurs, zašto cena varira i kako pratiti pravi trenutak za kupovinu.",
    post: {
      slug: "kako-odrediti-cenu-zlata",
      title: "Kako se formira cena zlata na tržištu — sve što treba da znate",
      excerpt:
        "Kako nastaje cena zlata i koji faktori je pomeraju? Razumite tržište pre nego što kupite.",
      category: "Tržište",
      date: "8. mart 2025.",
      readMin: 5,
      image: DEFAULT_IMAGE,
      imageAlt: "Formiranje cene zlata",
    },
    blocks: [
      {
        type: "paragraph",
        text: "Cena zlata nije tajna, ali nije ni jednostavna. Svaki dan, milioni investitora, rudnika, centralnih banaka i dilera trguje zlatom prema jednoj referentnoj ceni koja se formira u Londonu.",
      },
      {
        type: "paragraph",
        text: "U ovom tekstu objašnjavamo kako funkcioniše formiranje cene zlata i šta to znači za vas kao kupca.",
      },
      { type: "heading", text: "LBMA — gde počinje svaka cena zlata" },
      {
        type: "paragraph",
        text: "London Bullion Market Association (LBMA) objavljuje globalnu referentnu cenu zlata, poznatu kao LBMA Gold Price.",
      },
      {
        type: "paragraph",
        text: "Cena se objavljuje dva puta dnevno — u 10:30 i 15:00 po londonskom vremenu.",
      },
      {
        type: "paragraph",
        text: "Ova cena je globalni benchmark koji koriste svi učesnici tržišta.",
      },
      {
        type: "paragraph",
        text: "Cena na sajtu Gold Invest direktno je vezana za LBMA spot cenu, konvertovanu u lokalne valute uz premiju.",
      },
      { type: "heading", text: "Pet faktora koji pokreću cenu zlata" },
      {
        type: "stepItem",
        number: 1,
        title: "Vrednost dolara",
        body: "Kada dolar slabi, cena zlata obično raste jer je zlato jeftinije za kupce iz drugih valuta.",
      },
      {
        type: "stepItem",
        number: 2,
        title: "Realne kamatne stope",
        body: "Zlato ne nosi kamatu, pa kada su stope niske ili negativne, postaje atraktivnije.",
      },
      { type: "macroChart" },
      {
        type: "stepItem",
        number: 3,
        title: "Geopolitički rizici i krize",
        body: "U krizama kapital prelazi u zlato kao sigurnu imovinu.",
      },
      {
        type: "stepItem",
        number: 4,
        title: "Kupovine centralnih banaka",
        body: "Masovne kupovine centralnih banaka povećavaju potražnju i podržavaju cenu.",
      },
      {
        type: "stepItem",
        number: 5,
        title: "ETF fondovi i institucionalni investitori",
        body: "ETF fondovi direktno utiču na cenu jer kupuju fizičko zlato.",
      },
      { type: "heading", text: "Zašto cena u Srbiji varira u odnosu na LBMA?" },
      {
        type: "list",
        items: ["Kurs EUR/RSD", "Premija rafinerije", "Premija dilera"],
      },
      {
        type: "paragraph",
        text: "Sve cene kod Gold Invest su transparentne i ažuriraju se u realnom vremenu.",
      },
      { type: "heading", text: "Koji je pravi trenutak za kupovinu?" },
      {
        type: "paragraph",
        text: "Ne postoji savršen trenutak za kupovinu.",
      },
      {
        type: "paragraph",
        text: "Najbolja strategija je DCA — kupovina u redovnim intervalima.",
      },
      {
        type: "paragraph",
        text: "Na taj način smanjujete rizik i prosečavate ulaznu cenu.",
      },
      {
        type: "paragraph",
        text: "Za više informacija pozovite 061/269-8569.",
      },
    ],
  },
  "kako-cuvati-fizicko-zlato": {
    metaTitle: "Kako čuvati fizičko zlato — sef, banka ili kuća | Gold Invest",
    metaDescription:
      "Čuvanje zlata kod kuće, u bankarskom sefu ili kod dilera — svaka opcija ima svoje prednosti i rizike. Ovaj vodič pomaže da donesete pravu odluku.",
    post: {
      slug: "kako-cuvati-fizicko-zlato",
      title: "Kako čuvati fizičko zlato — sef, banka ili kuća",
      excerpt:
        "Gde čuvati fizičko zlato? Uporedite kućni sef, banku i profesionalne trezore.",
      category: "Saveti",
      date: "28. januar 2025.",
      readMin: 5,
      image: DEFAULT_IMAGE,
      imageAlt: "Čuvanje zlatnih poluga",
    },
    blocks: [
      {
        type: "paragraph",
        text:
          "Kupili ste zlatnu polugu. Držite je u ruci, proveravate serijski broj na blisteru. I onda dolazi pitanje: gde je čuvati?",
      },
      {
        type: "paragraph",
        text: "Fizičko zlato je vredna imovina i zaslužuje ozbiljan pristup čuvanju.",
      },
      { type: "heading", text: "Opcije čuvanja" },
      {
        type: "storageComparisonTable",
        rows: [
          {
            label: "Kućni sef",
            subtitle: "Najpopularnija opcija za početnike — maksimalna kontrola i trenutni pristup.",
            prednosti: [
              { text: "Zlato je uvek dostupno" },
              { text: "Nema godišnjih troškova" },
              { text: "Privatnost" },
            ],
            nedostaci: [],
            paznja: [
              { text: "Klasa otpornosti (EN 1143-1 Grade I)", check: true },
              { text: "Protivpožarna otpornost", check: true },
              { text: "Težina i ugradnja", check: true },
              { text: "Skrivena lokacija", check: true },
              { text: "Preporučene marke: Burg-Wächter, Format, Döttling, Senator", check: false },
            ],
          },
          {
            label: "Bankarski sef",
            subtitle: "Banke nude iznajmljivanje sefova uz godišnji trošak.",
            prednosti: [
              { text: "Visoka sigurnost" },
              { text: "Nema potrebe za kupovinom sefa" },
              { text: "Osiguranje (delimično)" },
            ],
            nedostaci: ["Ograničen pristup", "Rizik u kriznim situacijama", "Manja privatnost"],
            paznja: [{ text: "Godišnji trošak iznajmljivanja sefa.", check: false }],
          },
          {
            label: "Čuvanje kod dilera",
            subtitle: "Neke dilerske kuće nude opciju profesionalnog čuvanja zlata u licenciranim trezorima.",
            prednosti: [
              { text: "Profesionalni trezori sa visokim nivoom sigurnosti." },
              { text: "24/7 nadzor" },
              { text: "osiguranje" },
              { text: "allocated storage" },
            ],
            nedostaci: [],
            paznja: [],
          },
          {
            label: "Čuvanje u inostranstvu",
            subtitle: "Rešenje za veće investitore (50k+ EUR).",
            prednosti: [],
            nedostaci: [],
            paznja: [],
          },
        ],
      },
      { type: "heading", text: "Praktične preporuke" },
      {
        type: "list",
        items: [
          "Do 5.000 EUR → kućni sef",
          "5.000–30.000 EUR → sef ili banka",
          "30.000–100.000 EUR → kombinacija",
          "100.000+ EUR → profesionalni trezor",
        ],
      },
      { type: "heading", text: "Šta nikako ne treba raditi" },
      {
        type: "list",
        items: [
          "Ne govoriti drugima",
          "Ne držati sve na jednom mestu",
          "Ne otvarati blister",
          "Ne čuvati podatke online",
        ],
      },
      {
        type: "paragraph",
        text: "Za savete o kupovini i čuvanju zlata pozovite 061/269-8569.",
      },
    ],
  },
  "kamatne-stope-i-cena-zlata": {
    metaTitle: "Kamatne stope i cena zlata — inverzna veza | Gold Invest",
    metaDescription:
      "Kada kamatne stope rastu, cena zlata obično pada — i obrnuto. Razumevanje ove veze pomaže vam da bolje planirate trenutak ulaska u investiciju.",
    post: {
      slug: "kamatne-stope-i-cena-zlata",
      title: "Kamatne stope i cena zlata — inverzna veza koju morate razumeti",
      excerpt:
        "Razumevanje veze između kamatnih stopa i cene zlata može vam pomoći da bolje procenite trenutak kupovine.",
      category: "Tržište",
      date: "20. januar 2025.",
      readMin: 5,
      image: DEFAULT_IMAGE,
      imageAlt: "Kamatne stope i cena zlata",
    },
    blocks: [
      {
        type: "paragraph",
        text:
          "Postoji jedna veza na finansijskim tržištima koja je toliko konzistentna da ju je skoro nemoguće ignorisati: kada centralne banke podižu kamatne stope, cena zlata obično pada. Kada stope padaju — ili kada se tržište sprema za pad — zlato raste.",
      },
      {
        type: "paragraph",
        text:
          "Razumevanje ove veze nije potrebno samo ekonomistima. Za svakog ko razmišlja o kupovini zlatne poluge, ovo znanje može da znači razliku između kupovine na vrhu i kupovine na dnu.",
      },
      { type: "heading", text: "Zašto zlato i kamatne stope imaju inverznu vezu?" },
      {
        type: "stepItem",
        number: 1,
        title: "Zlato ne nosi kamatu",
        body: [
          "Ovo je ključ svega. Zlatna poluga u vašem sefu ne isplaćuje ni kamatu ni dividendu. Njen jedini \"prinos\" je potencijalni rast cene.",
          "Kada bankarski depoziti ili državne obveznice nose kamatu od 5–6% godišnje, investitori imaju razlog da izaberu ove instrumente umesto zlata. Alternativni trošak držanja zlata je visok.",
          "Kada kamatne stope padnu na 0–1% (ili ispod inflacije), depoziti i obveznice gube privlačnost. Zlato postaje konkurentno jer su ostali bezrizični instrumenti prestali da zarađuju realne prinose.",
        ],
      },
      {
        type: "stepItem",
        number: 2,
        title: "Realne kamatne stope su ključna mera",
        body: [
          "Ekonomisti prave razliku između nominalnih i realnih kamatnih stopa:",
          "Realna kamatna stopa = nominalna kamatna stopa − stopa inflacije",
          "Ako je nominalna kamatna stopa 4%, a inflacija 6%, realna kamatna stopa je negativna (−2%). U tom scenariju zlato postaje atraktivno uprkos visokim nominalnim stopama.",
          "Ovo je tačno ono što se desilo u periodu 2020–2022: realne stope su bile negativne, i cena zlata je rasla na rekordne vrednosti.",
        ],
      },
      { type: "heading", text: "Istorijski primeri" },
      {
        type: "timeline",
        items: [
          {
            period: "2004–2006: rast stopa, pad rasta zlata",
            inflation:
              "Fed je podigao kamatne stope sa 1% na 5,25%. Cena zlata je rasla, ali sporije.",
          },
          {
            period: "2008–2015: nulte stope, eksplozija cene zlata",
            inflation:
              "Fed je spustio stope na 0–0,25%. Cena zlata je porasla sa oko 800 USD na gotovo 1.900 USD po unci.",
          },
          {
            period: "2022–2023: agresivno dizanje stopa",
            inflation:
              "Fed je podigao stope sa 0,25% na 5,5%. Cena zlata nije drastično pala jer su realne stope ostale niske ili negativne.",
          },
          {
            period: "2024: naznake smanjenja stopa",
            inflation:
              "Čim je Fed počeo da signalizira kraj ciklusa dizanja stopa, cena zlata je probila istorijske rekorde.",
          },
        ],
      },
      { type: "heading", text: "Šta ovo znači za kupovinu zlatne poluge?" },
      {
        type: "stepItem",
        number: 1,
        title: "Kada su stope na vrhuncu — dobar momenat za kupovinu",
        body:
          "Kada su kamatne stope visoke, cena zlata je često pod pritiskom. Kada centralne banke počnu da ih snižavaju, kapital prelazi iz obveznica u zlato.",
      },
      {
        type: "stepItem",
        number: 2,
        title: "Dugoročno: tajming je manje važan nego vreme u tržištu",
        body: [
          "Za dugoročnog investitora kratkoročna veza između stopa i cene zlata manje je bitna od dugoročnog trenda.",
          "Ko je kupio zlato 2010, 2015. ili 2018. — svi su danas u plusu.",
        ],
      },
      { type: "heading", text: "Praktičan zaključak" },
      {
        type: "paragraph",
        text:
          "Kamatne stope su jedan od najvažnijih faktora kratkoročnog kretanja cene zlata — ali nisu jedini.",
      },
      {
        type: "paragraph",
        text: "Geopolitički rizici, kupovine centralnih banaka i kretanje dolara jednako utiču.",
      },
      {
        type: "paragraph",
        text:
          "Za dugoročnog investitora pouka je jednostavna: pokušaj savršenog tajminga obično košta više nego što donese.",
      },
      {
        type: "paragraph",
        text: "Redovna kupovina u manjim iznosima (DCA strategija) eliminiše rizik od pogrešnog ulaska.",
      },
      {
        type: "paragraph",
        text: "Za aktuelne cene i dostupnost zlatnih poluga, pozovite nas na 061/269-8569.",
      },
    ],
  },
};

