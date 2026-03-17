import type { Metadata } from "next";
import { GoldPriceChartFull } from "@/components/home/GoldPriceChartFull";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { DarkQuoteSection } from "@/components/catalog/DarkQuoteSection";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCard } from "@/components/ui/InfoCard";

export const metadata: Metadata = {
  title: "Cena Zlata | Grafikon kretanja Cene na Berzi | Gold Invest",
  description:
    "Pratite aktuelnu cenu zlata na svetskim berzama u realnom vremenu. Grafikon kretanja cene zlata u EUR, USD i RSD — po gramu, unci i kilogramu. Edukacija o Spot ceni, premiji i Spreadu.",
  alternates: {
    canonical: "https://goldinvest.rs/cena-zlata",
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

export default function CenaZlataPage() {
  return (
    <main className="bg-white">
      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb
            items={[
              { label: "Investiciono zlato", href: "/" },
              { label: "Cena zlata", href: "/cena-zlata" },
            ]}
            variant="light"
          />
        </SectionContainer>
      </section>

      {/* Hero */}
      <CategoryHero
        title="Cena zlata na berzi (Grafikon uživo)"
        introFull="Pratite aktuelnu cenu zlata na svetskim berzama u realnom vremenu. Vrednost plemenitih metala se menja iz minuta u minut, a naš grafikon vam omogućava da transparentno analizirate trenutne trendove i istorijski rast zlata kako biste doneli najbolju odluku za investiciono zlato."
        pills={[]}
        introMaxWidth="none"
        centerOnDesktop
      />

      {/* Chart — currency + unit + period filters */}
      <GoldPriceChartFull />

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
            title="Zašto je prodajna cena viša od grafikona? — Premija"
            description="Spot cena je cena sirovog zlata na berzi. Da bi stiglo do vaše poluge u sertifikovanom pakovanju, zlato prolazi kroz skupi, visoko kontrolisani industrijski proces. Zbir tih troškova je Premija (Premium) koju plaćate za sigurnost i pravni status svog kapitala."
            className="py-1"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Rafinerijska obrada i kovanje">
              Sirovo zlato se hemijski i termički prečišćava do savršenstva (999,9/1000), a zatim laserski seče, graviramo i kuje u prestižnim evropskim rafinerijama poput švajcarskog Argor-Heraeusa ili nemačkog C. Hafnera. Radnici troše gotovo isti napor za 1g kao i za 1kg — otuda viša premija malih formata.
            </InfoCard>
            <InfoCard title="LBMA sertifikacija i osigurani transport">
              Izrada specijalnih tamper-evident blister pakovanja sa serijskim brojevima garantuje LBMA &ldquo;Good Delivery&rdquo; standard — apsolutnu garanciju čistoće i porekla. Transport iz inostrane kovnice do Srbije vrši se blindiranim vozilima pod oružanom pratnjom i najstrožim osiguranjem.
            </InfoCard>
            <InfoCard title="Operativna marža — garancija otkupa">
              Marža Gold Invest-a pokriva lagerovanje, pravnu sigurnost transakcije i — ključno — garanciju da ćemo od vas otkupiti to zlato u svakom trenutku, uz isplatu istog dana. To je cena vaše sigurnosti i likvidnosti, a ne skriveni trošak.
            </InfoCard>
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
          <SectionHeading
            title="Otkupna cena i Spread — garancija likvidnosti"
            description="Pored prodajne cene, Gold Invest uvek jasno ističe i Otkupnu cenu — iznos po kojem garantovano otkupljujemo vaše zlato, uz isplatu istog dana. Razlika između ta dva iznosa naziva se Spread."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Šta je Spread?">
              Spread je razlika između prodajne cene (po kojoj kupujete) i otkupne cene (po kojoj prodajete nazad). Manji spread znači da vaša investicija brže prelazi iz zone troška u zonu čistog profita, kako cena zlata raste na globalnom tržištu.
            </InfoCard>
            <InfoCard title="Zlato vs. nekretnine — poređenje troškova">
              Za razliku od nekretnina gde notar, porez, agencija i renoviranje iznose 10–15% vrednosti, kod zlatne poluge od 100g spread iznosi svega par procenata. Kapital možete naplatiti za 10 minuta — bez čekanja kupca, bez posrednika, bez dana odlaganja.
            </InfoCard>
            <InfoCard title="Otkup po berzanskoj ceni — transparentno">
              Naša otkupna cena formira se direktno na osnovu Spot cene sa grafikona, uz minimalan, javno istaknut odbitak. Kod visoko likvidnih artikala — poluga od 100g i Franc Jozef dukata — otkupna cena je izuzetno bliska samoj berzanskoj ceni.
            </InfoCard>
          </div>
        </SectionContainer>
      </section>

      {/* 5 faktora */}
      <section className="bg-white py-16 sm:py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            title="5 ključnih faktora koji diktiraju cenu zlata"
            description="Zlato je ultimativni 'Safe haven' — hiljadama godina provereni čuvar vrednosti. Za razliku od akcija ili kriptovaluta, zlato fizički postoji i ne može se veštački odštampati. Ovo su 5 makroekonomskih sila koje pokreću cenu sa grafikona."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoCard title="1. Inflacija i devalvacija papirnog novca">
              Najjači pokretač. Kako centralne banke štampaju novac (kao u pandemiji 2020), on gubi kupovnu moć. Količina zlata na planeti je ograničena — potrebno je sve više papirnih novčanica za istu uncu. Često ne raste cena zlata, već pada vrednost novca kojim ga kupujemo.
            </InfoCard>
            <InfoCard title="2. Politika centralnih banaka — kamatne stope">
              Cena zlata je u obrnutoj korelaciji sa kamatnim stopama FED-a i ECB-a. Kada su stope visoke, banke privlače kapital. Kada stope padnu ispod inflacije, institucionalni investitori prebacuju stotine milijardi dolara iz banaka u fizičko zlato — što snažno gura cenu nagore.
            </InfoCard>
            <InfoCard title="3. Državne rezerve — centralne banke kao kupci">
              Kina, Indija, Rusija, Poljska i Narodna banka Srbije godinama agresivno uvećavaju zlatne rezerve kako bi smanjile zavisnost od dolara. Kada ovi &ldquo;giganti&rdquo; usisavaju fizičke poluge sa tržišta, ponuda se smanjuje — a cena po zakonu ponude i potražnje raste.
            </InfoCard>
            <InfoCard title="4. Geopolitičke tenzije i krize">
              Zlato se hrani nesigurnošću. U trenucima ratnih sukoba, ekonomskih sankcija ili krahova banaka, uplašeni kapital beži u jedino utočište provereno kroz vekove. Takvi &ldquo;šokovi&rdquo; izazivaju skokove cene i do 10–15% u roku od svega nekoliko nedelja.
            </InfoCard>
            <InfoCard title="5. Zakon ponude i potražnje — Peak Gold">
              Mnogi geolozi smatraju da smo dostigli &ldquo;Peak Gold&rdquo; — vrhunac globalnog rudarenja. Vađenje zlata iz sve dubljih rudnika troši sve više energije i novca. Rastući troškovi rudarenja postavljaju čvrsti matematički minimum ispod kojeg cena na berzi ne može da padne.
            </InfoCard>
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
