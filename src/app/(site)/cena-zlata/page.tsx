import type { Metadata } from "next";
import Link from "next/link";
import { GoldPriceChartFull } from "@/components/home/GoldPriceChartFull";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { DarkQuoteSection } from "@/components/catalog/DarkQuoteSection";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCard } from "@/components/ui/InfoCard";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from "@/lib/schema";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Cena Zlata | Grafikon kretanja Cene na Berzi | Gold Invest",
  description:
    "Pratite aktuelnu cenu zlata na svetskim berzama u realnom vremenu. Grafikon kretanja cene zlata u EUR, USD i RSD — po gramu, unci i kilogramu. Edukacija o Spot ceni, premiji i Spreadu.",
  alternates: { canonical: "https://goldinvest.rs/cena-zlata" },
  openGraph: {
    title: "Cena zlata danas — grafikon u EUR, USD i RSD | Gold Invest",
    description: "Pratite aktuelnu cenu zlata na svetskim berzama. Grafikon kretanja po gramu, unci i kilogramu u realnom vremenu — Gold Invest Beograd.",
    url: "https://goldinvest.rs/cena-zlata",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "Šta je Troj unca (Troy Ounce)?",
    a: "Troj unca (oznaka 'oz') je zvanična merna jedinica za plemenite metale na svetskoj berzi, sa korenima u srednjovekovnom francuskom gradu Troa. Jedna Troj unca iznosi tačno 31,1034768 grama. Sve referentne cene zlata na globalnom nivou — uključujući i grafikon na našem sajtu — primarno se izražavaju po jednoj Troj unci.",
  },
  {
    q: "Da li se cene na Gold Invest sajtu ažuriraju automatski?",
    a: "Apsolutno. Cena investicionog zlata ne može biti fiksna, jer bi to značilo nefer uslove za kupca ili prodavca. Cene svih proizvoda na našem sajtu direktno su uvezane sa svetskom berzom putem softvera i ažuriraju se automatski svakih nekoliko minuta. To znači da u trenutku kada kliknete 'Dodaj u korpu', dobijate najaktuelniju tržišnu cenu sa minimalnom premijom.",
  },
  {
    q: "Da li se na cenu zlata dodaje PDV i porez?",
    a: "Ne. Cena koju vidite na Gold Invest sajtu je konačna cena koju plaćate. U skladu sa Zakonom Republike Srbije, promet investicionim zlatom (polugama čistoće iznad 995/1000 i dukatima iznad 900/1000) je u potpunosti oslobođen PDV-a od 20%, kao i poreza na kapitalnu dobit prilikom kasnije prodaje.",
  },
  {
    q: "Kada je najbolje vreme za kupovinu investicionog zlata?",
    a: "Stara investiciona izreka kaže: 'Ne čekajte pravo vreme da kupite zlato — kupite zlato i čekajte.' S obzirom na to da je svrha investicionog zlata dugoročno očuvanje kapitala (štednja od 5, 10 ili 20 godina), praćenje svakodnevnih oscilacija i čekanje pada cene obično rezultira izgubljenim vremenom u kom novac gubi vrednost zbog inflacije. Najbolje vreme za kupovinu je onog trenutka kada imate višak papirnog novca koji želite trajno da zaštitite.",
  },
  {
    q: "Da li otkupljujete zlato po ceni sa grafikona?",
    a: "Otkupna cena koju garantovano isplaćujemo formira se direktno na osnovu berzanske cene sa grafikona, uz minimalan odbitak (spread) koji je jasno i transparentno istaknut na sajtu pored svakog proizvoda. Kod visoko likvidnih artikala (poput poluga od 100g ili Franc Jozef dukata), naša otkupna cena je izuzetno bliska samoj berzanskoj Spot ceni.",
  },
  {
    q: "Zašto zlato ima premiju kovanja u poređenju sa sirovim zlatom?",
    a: "Sirovo zlato iz rudnika je u obliku prašine ili nepravilnih komada, legirano sa bakrom i srebrom. Da bi dobilo status investicionog zlata, mora se hemijski prečistiti do 999,9/1000, kovati u švajcarskim ili nemačkim rafinerijama, dobiti LBMA sertifikat i biti dopremljeno u Srbiju specijalnim blindiranim transportom. Svi ti procesi koštaju — i to je premija za apsolutnu sigurnost i pravni status vašeg kapitala.",
  },
  {
    q: "Da li prodajete elektronsko (papirno) zlato?",
    a: "Ne. Gold Invest se bavi isključivo trgovinom fizičkim investicionim zlatom. Kupovina 'papirnog zlata' (ETF fondovi, deonice rudarskih kompanija, fjučers ugovori) nosi visok rizik bankrota posrednika. Naša filozofija je jasna: ako ne možete fizički da ga dodirnete i stavite u sopstveni sef, ono zapravo nije vaše. Kod nas kupujete i dobijate pravu, opipljivu zlatnu polugu ili dukat — na ruke.",
  },
];

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Cena zlata", href: "/cena-zlata" },
];

export default function CenaZlataPage() {
  return (
    <main className="bg-white">
      {/* Schema.org */}
      <SchemaScript schema={buildBreadcrumbSchema(BREADCRUMBS)} />
      <SchemaScript schema={buildFaqSchema(FAQ_ITEMS)} />
      <SchemaScript
        schema={buildWebPageSchema({
          name: "Cena Zlata | Grafikon kretanja Cene na Berzi",
          description:
            "Pratite aktuelnu cenu zlata na svetskim berzama u realnom vremenu. Grafikon kretanja cene zlata u EUR, USD i RSD.",
          slug: "/cena-zlata",
        })}
      />

      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={BREADCRUMBS} variant="light" />
        </SectionContainer>
      </section>

      {/* Hero */}
      <CategoryHero
        title="Cena zlata na berzi"
        introFull={
          <>
            Pratite aktuelnu cenu zlata na svetskim berzama u realnom vremenu. Vrednost plemenitih metala se menja iz
            minuta u minut, a naš grafikon vam omogućava da transparentno analizirate trenutne trendove i istorijski rast
            zlata kako biste doneli najbolju odluku za{" "}
            <Link href="/" className="underline decoration-[#BF8E41]/60 underline-offset-4 hover:text-[#BF8E41]">
              investiciono zlato
            </Link>
            .
          </>
        }
        pills={[]}
        introMaxWidth="none"
        centerOnDesktop
      />

      {/* Chart — currency + unit + period filters */}
      <div className="bg-[#F9F9F9]">
        <SectionContainer className="pt-3 sm:pt-4 pb-0">
          <SectionHeading
            title="Grafikon uživo"
            description="Uvid u aktuelnu cenu zlata i tržišne trendove kroz dinamički prikaz u realnom vremenu."
          />
        </SectionContainer>
        <GoldPriceChartFull />
      </div>

      {/* Spot cena */}
      <section className="bg-white py-16 sm:py-20">
        <SectionContainer>
          <SectionHeading
            title="Šta je 'Spot cena' zlata i kako se formira na berzi?"
            description="Vrednost na grafikonu je takozvana Spot cena — trenutna berzanska cena sirovog zlata. Cenu ne određuje nijedna pojedinačna država niti lokalni trgovac, već neprekidna globalna trgovina 24 sata dnevno."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Spot cena — elektronsko zlato u realnom vremenu">
              Spot cena je cena po kojoj se u ovom trenutku trguje &ldquo;papirnim&rdquo; zlatom na svetskim berzama. To je referentna tačka od koje polaze sve cene investicionih proizvoda — poluga, pločica i kovanica — uz dodatak premije za fizičku proizvodnju.
            </InfoCard>
            <InfoCard title="LBMA u Londonu — globalni centar fizičke trgovine">
              London Bullion Market Association (LBMA) je srce globalnog tržišta fizičkim zlatom. U Londonu se cena referentno &ldquo;fiksira&rdquo; dva puta dnevno (London AM Fix i PM Fix) — te vrednosti koriste sve centralne banke, rudarske kompanije i rafinerije sveta.
            </InfoCard>
            <InfoCard title="COMEX u Njujorku i globalni USD standard">
              COMEX (Commodity Exchange) u Njujorku dominira kratkoročnim oscilacijama kroz ugovore o budućoj isporuci zlata. Sve cene se globalno izražavaju u USD za Troj uncu (31,1034768 g) — naš grafikon automatski preračunava u EUR, RSD i merne jedinice po vašem izboru.
            </InfoCard>
          </div>
        </SectionContainer>
      </section>

      {/* Premija */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            eyebrow="Premija (Premium)"
            title="Koja je razlika između berzanske cene (Spot) i prodajne cene zlata?"
            description="Spot je berzanska cena “sirovog” zlata na grafikonu. Prodajna cena uključuje premiju koja pretvara to zlato u standardizovanu, sertifikovanu polugu — sa bezbednim pakovanjem, transportom i garancijom otkupa."
            className="py-1"
          />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-8 items-start">
            {/* Left: concept */}
            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-8">
              <div className="mb-4">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#BF8E41] mb-3">
                  Spot i premija
                </p>
                <h3
                  className="text-[#1B1B1C] mb-4"
                  style={{
                    fontFamily: "var(--font-pp-editorial), Georgia, serif",
                    fontSize: "clamp(22px, 2.3vw, 30px)",
                    fontWeight: 400,
                    lineHeight: "1.15",
                  }}
                >
                  Spot je početna tačka.
                  <br />
                  Premija je “trošak stvaranja”.
                </h3>
                <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                  Spot cena je referentna cena sirovog zlata na berzi. Da biste to zlato dobili u rukama
                  kao <span className="font-semibold text-[#1B1B1C]">99,99% polugu u sertifikovanom blisteru</span>,
                  ono prolazi kroz proces koji mora da bude precizan, skup i pravno obezbeđen.
                </p>
              </div>

              <div className="mt-6 bg-white border border-[#F0EDE6] rounded-2xl p-5 sm:p-6">
                <p className="text-[#1B1B1C] text-[14px] font-semibold leading-snug mb-2">
                  Jedna rečenica koju zapamtite:
                </p>
                <p className="text-[#4C4C4C] text-[13.5px] leading-relaxed mb-0">
                  Premija je zbir realnih troškova koji Spot cenu pretvaraju u proizvod koji može da se kupi
                  danas i otkupi sutra — bez “nevidljivih” razlika.
                </p>
              </div>
            </div>

            {/* Right: breakdown list */}
            <div className="bg-white border border-[#F0EDE6] rounded-2xl overflow-hidden">
              <div className="px-5 sm:px-6 py-4 sm:py-5 bg-[#FAF8F2] border-b border-[#F0EDE6]">
                <p className="text-[#1B1B1C] text-[14px] sm:text-[15px] font-semibold leading-snug mb-0">
                  Premija (Premium) se sastoji od:
                </p>
              </div>

              <div className="divide-y divide-[#F0EDE6]">
                {[
                  {
                    n: 1,
                    title: "Rafinerijska obrada i standardizacija",
                    body: "Sirovo zlato se dovodi do maksimalne čistoće (999,9) i priprema za proizvodnju.",
                  },
                  {
                    n: 2,
                    title: "Kovanje, dizajn i kontrola kvaliteta",
                    body: "Pločice i poluge dobijaju oblik, gravure i fabričku kontrolu u kovnici.",
                  },
                  {
                    n: 3,
                    title: "Sertifikacija i sigurnosno pakovanje",
                    body: "Blister sa serijskim brojevima i standardizovanim dokazima porekla (LBMA).",
                  },
                  {
                    n: 4,
                    title: "Logistika, transport i osiguranje",
                    body: "Specijalizovan transport i najviši nivo osiguranja da roba stigne bez rizika.",
                  },
                  {
                    n: 5,
                    title: "Operativna marža i garancija otkupa",
                    body: "Lagerovanje, pravna sigurnost transakcije i garancija otkupa u dogovorenom roku.",
                  },
                ].map((item) => (
                  <div key={item.n} className="p-5 sm:p-6 flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#1B1B1C] text-white text-sm font-semibold shrink-0">
                      {item.n}
                    </span>
                    <div>
                      <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-1">
                        {item.title}
                      </p>
                      <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-5 sm:px-6 py-4 sm:py-5 border-t border-[#F0EDE6]">
                <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                  Zato prodajna cena nije “skok” u odnosu na grafikon — ona je potpuna cena proizvoda koji fizički dobijate.
                </p>
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Zlatno pravilo matematike */}
      <DarkQuoteSection
        eyebrow="Zlatno pravilo matematike"
        normalText="Što veći format zlata kupujete,"
        italicText="to dobijate nižu cenu po gramu i bliže ste berzanskoj Spot ceni sa grafikona."
        ctaHref="/kategorija/zlatne-poluge"
        ctaLabel="Pogledaj zlatne poluge"
      />

      {/* Otkupna cena i Spread */}
      <section className="bg-white py-16 sm:py-20">
        <SectionContainer>
          <SectionHeading title="Otkupna cena i Spread — garancija likvidnosti" />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-5 lg:gap-8 lg:items-stretch">
            {/* 1) Top-left light card */}
            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-8 lg:col-start-1 lg:row-start-1 flex flex-col items-start justify-center text-left">
              <h3 className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-1">
                Spread je razlika između onoga što plaćate i onoga što dobijate nazad.
              </h3>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                Kada je spread mali, lakše prelazite iz “troška kupovine” u zonu čistog profita — jer rast Spot cene brže
                stiže do vaše realne vrednosti.
              </p>
            </div>

            {/* 2) Gold card (below top-left) */}
            <div className="bg-[#E9E6D9] rounded-2xl p-7 flex flex-col items-start justify-center text-left lg:col-start-1 lg:row-start-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center mb-5"
                style={{ background: "rgba(194,178,128,0.22)" }}
              >
                <svg width="17" height="13" viewBox="0 0 17 13" fill="none" aria-hidden="true">
                  <path
                    d="M1.5 6.5L6 11L15.5 1.5"
                    stroke="#BF8E41"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-[#1B1B1C] font-semibold text-[15px] leading-snug mb-1">Naša logika otkupa</p>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                Otkupna cena se formira na osnovu Spot cene — uz jasno prikazan odbitak, tako da znate šta tačno dobijate.
              </p>
            </div>

            {/* 3) Center light card (spans 2 rows) */}
            <div className="bg-[#E9E6D9] rounded-2xl p-7 flex flex-col items-start justify-center text-left lg:col-start-3 lg:row-start-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center mb-5"
                style={{ background: "rgba(194,178,128,0.22)" }}
              >
                <svg width="17" height="13" viewBox="0 0 17 13" fill="none" aria-hidden="true">
                  <path
                    d="M10 0.5L6 7H9.5L7.4 12.5L12.8 5.8H9.2L10 0.5Z"
                    stroke="#BF8E41"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-1">
                Zašto mali spread znači bržu likvidnost
              </h3>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                Manji spread pomaže da vrednost vaše investicije brže pređe iz zone troška u zonu čistog profita.
              </p>
            </div>

            {/* 4) Right black card (spans 2 rows) */}
            <div className="bg-[#0D0D0D] border border-[#232324] rounded-2xl p-6 sm:p-8 lg:col-start-2 lg:row-start-1 lg:row-span-2 flex flex-col items-start justify-center text-left">
              <h3 className="text-[#BEAD87] text-[15px] font-semibold leading-snug mb-1">Šta je Spread?</h3>
              <p className="text-[#D7D0C3] text-[13.5px] leading-relaxed mb-0">
                Spread je razlika između prodajne cene (po kojoj kupujete) i otkupne cene (po kojoj prodajete nazad).
              </p>
            </div>

            {/* 5) Bottom-right light card */}
            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-8 lg:col-start-3 lg:row-start-2 flex flex-col items-start justify-center text-left">
              <h3 className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-1">
                Otkup po Spot osnovi — transparentno
              </h3>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                Otkupna cena se formira na osnovu Spot cene sa grafikona, uz minimalan i javno istaknut odbitak.
              </p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* 5 faktora */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title="Ključni faktori koji diktiraju cenu zlata na globalnom nivou"
            description="Zlato je dokazani “Safe haven” — fizički postoji i ne može se veštački odštampati. Ali šta pomera liniju na grafikonu? Ovo je 5 makroekonomskih pokretača."
          />
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-8 items-start">
            {/* Left panel (concept) */}
            <div className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-8">
              <div className="mb-4">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#BF8E41] mb-3">
                  Kako čitati grafikon
                </p>
                <h3
                  className="text-[#1B1B1C] mb-4"
                  style={{
                    fontFamily: "var(--font-pp-editorial), Georgia, serif",
                    fontSize: "clamp(22px, 2.3vw, 30px)",
                    fontWeight: 400,
                    lineHeight: "1.15",
                  }}
                >
                  Linija na grafikonu je posledica potražnje za “sigurnim” zlatom
                </h3>
                <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                  Zlato nije samo “trend” — ono se najčešće kreće kada svet menja odnos prema riziku:
                  kada fiat gubi kupovnu moć, kada kamate postanu manje atraktivne, kada centralne banke
                  povećavaju rezerve i kada izbije geopolitička nesigurnost.
                </p>
              </div>

              <div className="mt-6 bg-white border border-[#F0EDE6] rounded-2xl p-5">
                <p className="text-[#1B1B1C] font-semibold text-[14px] mb-2 leading-snug">
                  Jedna stvar koju uvek proverite
                </p>
                <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                  Ne gledajte samo “koliko je danas” — posmatrajte i “zašto je danas”: inflacija, kamate,
                  potražnja državnih institucija i ponuda.
                </p>
              </div>
            </div>

            {/* Right: one grouped list (no 5 cards) */}
            <div className="bg-white border border-[#F0EDE6] rounded-2xl overflow-hidden">
              <div className="px-5 sm:px-6 py-4 sm:py-5 bg-[#FAF8F2] border-b border-[#F0EDE6]">
                <p className="text-[#1B1B1C] text-[14px] sm:text-[15px] font-semibold leading-snug mb-0">
                  5 globalnih pokretača cene
                </p>
              </div>

              <ol className="divide-y divide-[#F0EDE6]">
                <li className="p-5 sm:p-6 flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#1B1B1C] text-white text-sm font-semibold shrink-0">
                    1
                  </span>
                  <div>
                    <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-1">
                      Inflacija i pad kupovne moći fiat valute
                    </p>
                    <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                      Kada novac gubi vrednost, ljudi traže zaštitu u ograničenom resursu: zlatu.
                    </p>
                  </div>
                </li>

                <li className="p-5 sm:p-6 flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#1B1B1C] text-white text-sm font-semibold shrink-0">
                    2
                  </span>
                  <div>
                    <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-1">
                      Politika centralnih banaka i kamatne stope
                    </p>
                    <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                      Niže realne kamate čine fizičko zlato atraktivnijim, jer gotovina donosi manje.
                    </p>
                  </div>
                </li>

                <li className="p-5 sm:p-6 flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#1B1B1C] text-white text-sm font-semibold shrink-0">
                    3
                  </span>
                  <div>
                    <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-1">
                      Masovna kupovina od strane državnih institucija
                    </p>
                    <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                      Kada centralne banke povećaju rezerve, dostupna ponuda se smanjuje — i cena raste.
                    </p>
                  </div>
                </li>

                <li className="p-5 sm:p-6 flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#1B1B1C] text-white text-sm font-semibold shrink-0">
                    4
                  </span>
                  <div>
                    <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-1">
                      Geopolitičke tenzije i krize
                    </p>
                    <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                      Nesigurnost podiže potražnju za “safe haven” imovinom — pa zlato često reaguje jače.
                    </p>
                  </div>
                </li>

                <li className="p-5 sm:p-6 flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#1B1B1C] text-white text-sm font-semibold shrink-0">
                    5
                  </span>
                  <div>
                    <p className="text-[#1B1B1C] text-[15px] font-semibold leading-snug mb-1">
                      Ponuda i potražnja (Peak Gold fenomen)
                    </p>
                    <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-0">
                      Kako rudarenje postaje skuplje, realni “trošak dna” raste — što podržava cenu.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* Valute + Istorijski rast */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title="Valute, istorijski rast i pravo vreme za kupovinu"
            description="Tri koncepta koja zaokružuju razumevanje tržišta zlata — za svakog ko ozbiljno razmišlja o investiciji."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Uticaj dolara — zašto pratiti EUR grafikon">
              Pošto se zlatom trguje u USD, dolar i zlato su na &ldquo;klackalici&rdquo;. Jak dolar = niža cena zlata u USD; slab dolar = viša cena. Ponekad vidite vest da je &ldquo;zlato skočilo&rdquo;, ali u EUR cena ostaje ista — jer je skočio samo dolar. Preporuka: uvek pratite cenu u EUR.
            </InfoCard>
            <InfoCard title="Istorijski rast — 'All-Time High' nije razlog za strah">
              Pre 20 godina unca je vredela ~$400. Pre 10 godina ~$1.300. Danas višestruko više. Grafikon zlata unazad 50 godina neprestano probija &ldquo;istorijske maksimume&rdquo;. Svrha zlata nije brza zarada, već dugoročna zaštita kapitala koji se inače topi od inflacije.
            </InfoCard>
            <InfoCard title="Nikada nije kasno — kupite zlato i čekajte">
              Stara izreka najbogatijih investitora: &ldquo;Ne čekajte pravo vreme da kupite zlato — kupite zlato i čekajte.&rdquo; Svakodnevno praćenje oscilacija i čekanje pada obično rezultira izgubljenim vremenom u kom papirni novac gubi vrednost. Pravo vreme je kada imate višak koji želite da zaštitite.
            </InfoCard>
          </div>
        </SectionContainer>
      </section>

      {/* FAQ */}
      <CategoryFaq
        title="Česta pitanja o ceni zlata"
        items={FAQ_ITEMS}
        ctaHref="/#faq"
        ctaLabel="Pogledaj sva pitanja"
      />

      {/* CTA */}
      <WhatIsGoldSection />
    </main>
  );
}
