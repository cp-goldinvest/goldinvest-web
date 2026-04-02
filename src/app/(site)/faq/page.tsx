import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from "@/lib/schema";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Česta pitanja o investicionom zlatu | Gold Invest",
  description:
    "Odgovori na najčešća pitanja o kupovini investicionog zlata: LBMA standard, sertifikati, načini plaćanja, dostava, otkup i formiranje cene. Jasno i bez žargona.",
  alternates: { canonical: "https://goldinvest.rs/faq" },
  openGraph: {
    title: "Česta pitanja | Gold Invest — Investiciono zlato",
    description:
      "Sve što trebate znati pre prve kupovine investicionog zlata — 13 jasnih odgovora na ključna pitanja.",
    url: "https://goldinvest.rs/faq",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Česta pitanja", href: "/faq" },
];

const FAQ_ITEMS = [
  {
    q: "Šta znači LBMA oznaka proizvođača?",
    a: "LBMA (London Bullion Market Association) je međunarodni standard za investiciono plemenito zlato. Proizvođači sa LBMA sertifikatom prolaze stroge godišnje revizije koje garantuju tačnost težine, čistoću i autentičnost svakog proizvoda. Svi proizvodi u našoj ponudi potiču od LBMA akreditovanih livnica — Argor-Heraeus, C. Hafner, Umicore i Heraeus — što znači da ih možete preprodati na bilo kom tržištu plemenitih metala u svetu bez ikakvih pitanja.",
  },
  {
    q: "Šta predstavlja oznaka 999,9?",
    a: "Oznaka 999,9 (ili .9999) znači da je proizvod od čistog zlata sa 99,99% finoće — poznato i kao 'četiri devetke'. Ovo je najviši komercijalni standard čistoće za investiciono zlato. Ostatak od 0,01% su tragovi mineralnih primesa koje su fizički neodvojive od zlata u standardnom industrijskom procesu. Zlato sa oznakom 999,9 prihvata se na svim svetskim berzama i garantuje maksimalnu preprodajnu vrednost.",
  },
  {
    q: "Da li je zlato sertifikovano?",
    a: "Da. Svaki proizvod dolazi sa originalnim sertifikatom proizvođača koji sadrži serijski broj, težinu, čistoću i naziv livnice. Poluge veće od 1 g su pakovane u zapečaćenoj assay kartici (format kreditne kartice) koja fizički sprečava otvaranje bez oštećenja — što je direktan dokaz autentičnosti. Sertifikati su važeći na svim međunarodnim tržištima bez potrebe za dodatnim overama.",
  },
  {
    q: "Mogu li da plaćam platnom karticom?",
    a: "Da, prihvatamo plaćanje svim vrstama platnih kartica — Visa, Mastercard i Dina kartica. Imajte na umu da se kod kartičnog plaćanja primenjuje načelo sprečavanja pranja novca (AML), što znači da transakcija mora biti vidljiva u vašem bankovnom izveštaju. Za veće iznose preporučujemo bankarski transfer ili gotovinu (u zakonskim okvirima), jer je obrada brža i bez dodatnih troškova.",
  },
  {
    q: "Da li postoje ograničenja za plaćanje gotovinom?",
    a: "Prema srpskom zakonu, plaćanje gotovinom između pravnih lica ograničeno je na 150.000 RSD po transakciji. Za fizička lica (građane) ograničenje iznosi 10.000 evra u dinarskoj protivvrednosti po transakciji. Iznosi iznad ovog limita moraju se plaćati bankarskim transferom ili karticom. Svi gotovinski prijemi se prijavljivaju Upravi za sprečavanje pranja novca.",
  },
  {
    q: "Šta je avansna kupovina?",
    a: "Avansna kupovina znači da rezervišete određenu količinu zlata po današnjoj ceni, a isporuku primite u dogovorenom roku — obično 7 do 30 dana. Ovo je korisno ako očekujete rast cene ili želite da rasporedite troškove u više rata pre preuzimanja. Kontaktirajte nas na 061/426-4129 za detalje i uslove.",
  },
  {
    q: "Da li fizička lica mogu kupovati investiciono zlato bez ograničenja?",
    a: "Da. U Srbiji ne postoje zakonska ograničenja za količinu investicionog zlata koje fizičko lice može posedovati. Kupovina je slobodna bez prijave bilo kom organu, a investiciono zlato je oslobođeno PDV-a prema Zakonu o PDV-u, član 25. Jedino ograničenje je način plaćanja — gotovinom do 10.000 EUR ekvivalenta po transakciji. Svaka transakcija iznad 15.000 EUR evidentira se u skladu sa AML propisima.",
  },
  {
    q: "Koliko traje isporuka?",
    a: "Standardna isporuka kurirskom službom traje 1–2 radna dana na teritoriji Srbije. Za porudžbine u toku radnog dana do 12h, isporuka je obično sledećeg radnog dana. Preuzimanje lično u našoj poslovnici dostupno je odmah po potvrdi plaćanja. Za porudžbine veće od 500g dogovaramo individualne uslove isporuke i preuzimanja.",
  },
  {
    q: "Koliko košta dostava?",
    a: "Za tačne troškove dostave kontaktirajte nas na 061/426-4129 ili pošaljite upit putem sajta. Isporuka je besplatna za porudžbine iznad određene vrednosti — uslove proverite direktno sa našim savetnicima.",
  },
  {
    q: "Mogu li platiti pouzećem?",
    a: "Da, moguće je plaćanje pouzećem za standardne porudžbine. Kurir naplaćuje iznos pri isporuci — gotovinom ili karticom, zavisno od kurirske službe. Pouzeće nije dostupno za sve kombinacije lokacija i iznosa — proverite pri porudžbini. Za veće iznose preporučujemo avansno plaćanje zbog sigurnosti.",
  },
  {
    q: "Kako funkcioniše otkup zlata?",
    a: "Otkupljujemo investiciono zlato od LBMA akreditovanih livnica po tekućoj berzanskoj ceni umanjenoj za spread. Postupak: (1) pošaljite nam fotografiju i serijski broj proizvoda, (2) dogovorimo cenu i način predaje, (3) isplaćujemo odmah po preuzimanju. Cena otkupa se ažurira svakodnevno prema London Fix kotaciji.",
  },
  {
    q: "Da li otkupljujete proizvode koji nisu kupljeni kod vas?",
    a: "Da, otkupljujemo investiciono zlato bez obzira gde je kupljeno — pod uslovom da je od LBMA akreditovanog proizvođača i u originalnom, neoštećenom pakovanju sa sertifikatom. Zlato kupljeno kod drugih dilera, u bankama ili inostranstvu prihvatamo pod istim uslovima. Kontaktirajte nas unapred kako biste proverili podobnost konkretnog proizvoda.",
  },
  {
    q: "Kako se formira cena zlata i šta je troj unca?",
    a: "Cena zlata formira se na London Bullion Marketu (LBMA) dva puta dnevno kroz tzv. London Fix — referentna svetska cena. Troj unca (troy ounce) je merna jedinica za plemenite metale i iznosi 31,1035 grama. Prodajna cena proizvoda dobija se iz: (spot cena × težina u uncama × kurs USD/RSD) + premija za izradu i distribuciju. Na stranici /cena-zlata možete pratiti cenu zlata uživo u dinarima.",
  },
];

const FAQ_CTA_PHONE_HREF = "tel:+381614264129";

function FaqContactCtaCard({
  href,
  title,
  body,
  Icon,
  external,
}: {
  href: string;
  title: string;
  body: string;
  Icon: LucideIcon;
  external?: boolean;
}) {
  const cardClass =
    "group block bg-[#F9F9F9] rounded-2xl overflow-hidden border border-[#F0EDE6] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BEAD87]";

  const visual = (
    <div className="relative min-h-[200px] overflow-hidden bg-[#1B1B1C] sm:min-h-[220px]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[#BEAD87] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
      <div className="relative z-[1] flex min-h-[200px] items-center justify-center sm:min-h-[220px]">
        <Icon
          className="h-10 w-10 text-[#BEAD87] transition-colors duration-300 group-hover:text-[#1B1B1C]"
          strokeWidth={1.5}
          aria-hidden
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-4 right-4 z-[2] flex h-10 w-10 translate-y-1 items-center justify-center rounded-full border border-[#BEAD87] bg-[#1B1B1C] opacity-0 shadow-sm transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
      >
        <ArrowRight className="h-4 w-4 text-[#BEAD87]" strokeWidth={2} />
      </div>
    </div>
  );

  const textBlock = (
    <div className="p-6 sm:p-7">
      <h3
        className="mb-2 font-semibold text-[#1B1B1C]"
        style={{
          fontFamily: "var(--font-rethink), sans-serif",
          fontSize: 17,
          lineHeight: "1.3",
        }}
      >
        {title}
      </h3>
      <p
        className="text-[14px] leading-relaxed text-[#6B6B6B]"
        style={{ fontFamily: "var(--font-rethink), sans-serif" }}
      >
        {body}
      </p>
    </div>
  );

  const label = `${title} — ${body}`;

  if (external) {
    return (
      <a href={href} className={cardClass} aria-label={label}>
        {visual}
        {textBlock}
      </a>
    );
  }

  return (
    <Link href={href} className={cardClass} aria-label={label}>
      {visual}
      {textBlock}
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FaqPage() {
  return (
    <main>
      <SchemaScript schema={buildBreadcrumbSchema(BREADCRUMBS)} />
      <SchemaScript schema={buildFaqSchema(FAQ_ITEMS)} />
      <SchemaScript
        schema={buildWebPageSchema({
          name: "Česta pitanja o investicionom zlatu | Gold Invest",
          description:
            "Odgovori na najčešća pitanja o kupovini investicionog zlata: LBMA standard, sertifikati, plaćanje, dostava i otkup.",
          slug: "/faq",
        })}
      />

      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={BREADCRUMBS} variant="light" />
        </SectionContainer>
      </section>

      <CategoryHero
        title="Česta pitanja o investicionom zlatu"
        introFull="Sve što trebate znati pre prve kupovine — od toga šta znači oznaka 999,9 i kako funkcioniše LBMA standard, do načina plaćanja, dostave i otkupa. Odgovori su kratki, tačni i bez marketing-žargona."
        pills={[
          { label: "Zlatne poluge", href: "/kategorija/zlatne-poluge" },
          { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
          { label: "Zlatni dukati", href: "/kategorija/zlatni-dukati" },
          { label: "Cena zlata", href: "/cena-zlata" },
        ]}
        expandableIntro={false}
        centerOnDesktop
      />

      {/* ── Contact CTA (between hero and FAQ) ─────────────────────────────── */}
      <section className="border-b border-[#F0EDE6] bg-white py-16 sm:py-20">
        <SectionContainer>
          <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
            <span
              className="mb-4 block text-xs font-semibold uppercase tracking-widest text-[#BF8E41]"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              Kontakt
            </span>
            <h2
              className="mb-4 max-w-[640px] leading-tight text-[#1B1B1C]"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontWeight: 500,
                fontSize: 30,
                lineHeight: "1.1",
                letterSpacing: "-1px",
              }}
            >
              Imate dodatno pitanje?
            </h2>
            <p
              className="max-w-[520px] text-[15px] leading-relaxed text-[#6B6B6B]"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              Pišite nam ili pozovite — tu smo da vam pomognemo oko investicionog zlata.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
            <FaqContactCtaCard
              href="/kontakt"
              title="Pišite nam"
              body="Pitajte šta vas interesuje i odgovorićemo vam što pre."
              Icon={Mail}
            />
            <FaqContactCtaCard
              href={FAQ_CTA_PHONE_HREF}
              title="Pozovite nas"
              body="Najbrži način da nas kontaktirate."
              Icon={Phone}
              external
            />
          </div>
        </SectionContainer>
      </section>

      <CategoryFaq
        title="Česta pitanja"
        items={FAQ_ITEMS}
        ctaHref="/kategorija/zlatne-poluge"
        ctaLabel="POGLEDAJTE PONUDU POLUGA"
      />

      <WhatIsGoldSection />
    </main>
  );
}
