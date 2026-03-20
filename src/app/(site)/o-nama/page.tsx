import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildWebPageSchema, buildOrganizationSchema } from "@/lib/schema";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "O nama | Gold Invest — Investiciono zlato Beograd",
  description:
    "Gold Invest je specijalizovani diler investicionog zlata u Beogradu. LBMA proizvodi, transparentna cena prema London Fix, licni savetodavni pristup i otkup isti dan.",
  alternates: { canonical: "https://goldinvest.rs/o-nama" },
  openGraph: {
    title: "O nama | Gold Invest",
    description:
      "Specijalizovani diler investicionog zlata u Srbiji. Transparentno, direktno, bez posrednika.",
    url: "https://goldinvest.rs/o-nama",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "O nama", href: "/o-nama" },
];

const VALUES = [
  {
    eyebrow: "01 — Transparentnost",
    title: "Nasu cenu možete proveriti sami.",
    body: "Polazimo od London Fix kotacije — javne, svetske berzanske cene zlata koja se objavljuje dvaput dnevno. Sve što radimo je da primenimo kurs i fiksni spread. Otvorite Kitco.com ili LBMA.org i proverite nas. To je jedini način na koji želimo da radimo.",
  },
  {
    eyebrow: "02 — Licni pristup",
    title: "Uvek razgovarate sa savetnicima, ne sa botom.",
    body: "Nema call centra, nema automatskog odgovaranja, nema standardnih paketa. Kada nas pozovete, razgovarate direktno sa osobom koja razume vaše potrebe — bez obzira da li kupujete 1 gram ili 1 kilogram. Svaki klijent dobija isti nivo paznje.",
  },
  {
    eyebrow: "03 — Samo provereno",
    title: "Nema kompromisa po pitanju autentičnosti.",
    body: "Radimo isključivo sa LBMA akreditovanim livarnicama: Argor-Heraeus, C. Hafner, Umicore i Heraeus. Svaki proizvod dolazi u originalnom pakovanju sa serijskim brojem i sertifikatom. Ne postoji niža klasa proizvoda u našoj ponudi.",
  },
];

const COMPARE_US = [
  "Cena prema London Fix — proverite je sami",
  "Puna ponuda 1g do 1kg u jednom mestu",
  "Personalizovani savet bez obaveze",
  "Otkup po berzanskoj ceni — isti dan isplata",
  "Originalna LBMA pakovanja sa serijskim brojem",
  "PDV oslobodjen za investiciono zlato (Zakon o PDV, cl. 25)",
  "Fiskalni racun i dokumentacija za svaku transakciju",
];

const COMPARE_BANK = [
  "Premijum 5–15% iznad tržišne cene",
  "Ogranjena ponuda (obično 1g–50g, jedan brand)",
  "Bez savetnika — standardni bankarski prozor",
  "Otkup po netransparentnoj internoj ceni banke",
  "Originalna pakovanja — ali bez mogucnosti pregovora",
  "PDV isti status, ali bankarske naknade se dodaju",
  "Racun da, ali fleksibilnost ne",
];

const FAQ_ITEMS = [
  {
    q: "Da li je Gold Invest registrovano privredno društvo?",
    a: "Da. Gold Invest posluje kao registrovano privredno društvo u Srbiji, sa poreskim identifikacionim brojem. Svaka transakcija je dokumentovana fiskalnim racunom. Sve transakcije iznad zakonskog limita se prijavljuju Upravi za sprečavanje pranja novca (UNODC), u skladu sa srpskim zakonodavstvom.",
  },
  {
    q: "Odakle potiče zlato koje prodajete?",
    a: "Iskljucivo od LBMA akreditovanih livarnica — Argor-Heraeus (Svajcarska), C. Hafner (Nemacka), Umicore (Belgija) i Heraeus (Nemacka). LBMA akreditacija podrazumeva godišnje nezavisne revizije koje garantuju tačnost težine i čistoću 999,9. Nema uvoza iz neakreditovanih izvora, nema kompromisa.",
  },
  {
    q: "Zasto da kupim kod vas umesto u banci?",
    a: "Banke prodaju zlato sa premijumom od 5 do 15% iznad berzanske cene, bez transparentne kalkulacije i bez mogucnosti pregovora. Mi primenjujemo fiksni spread koji možete proveriti prema aktuelnoj London Fix kotaciji — i uvek ga prikazujemo unapred. Uz to, nudimo licni savetodavni razgovor, širu ponudu formata i otkup po istoj principijelnoj ceni.",
  },
  {
    q: "Da li možete da garantujete autentičnost?",
    a: "Da — garancija je u sistemu, ne samo našoj reci. LBMA akreditovane livarnice na svakom proizvodu utiskuju serijski broj koji se može pratiti. Assay kartica (zapečaćena plastična ambalaža poluge) fizički sprečava zamenu sadržaja bez vidljivog oštećenja. Sertifikat je međunarodno priznat i prihvaćen na svim berzama plemenitih metala.",
  },
  {
    q: "Gde se nalazite i da li je potrebno zakazivanje?",
    a: "Nalazimo se u Beogradu. Za manje količine (pločice i poluge koje imamo na stanju) možete doci bez zakazivanja tokom radnog vremena. Za veće količine i poluge od 500g naviše, kao i za otkup, preporučujemo da nas unapred kontaktirate — da bismo pripremili robu i optimizovali vas posetu.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ONamaPage() {
  return (
    <main className="bg-white">
      <SchemaScript schema={buildBreadcrumbSchema(BREADCRUMBS)} />
      <SchemaScript schema={buildOrganizationSchema()} />
      <SchemaScript
        schema={buildWebPageSchema({
          name: "O nama | Gold Invest — Investiciono zlato Beograd",
          description:
            "Specijalizovani diler investicionog zlata u Srbiji. Transparentno, direktno, bez posrednika.",
          slug: "/o-nama",
        })}
      />

      {/* Breadcrumb */}
      <div className="relative">
        {/* Breadcrumb overlay on top of hero (no layout push) */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur border-b border-[#F0EDE6]">
          <SectionContainer className="py-3 sm:py-4">
            <Breadcrumb items={BREADCRUMBS} variant="light" />
          </SectionContainer>
        </div>

        <HeroSection
          title={
            <>
              <span style={{ fontStyle: "normal" }}>Direktno zlato.</span>
              <br />
              <span style={{ fontStyle: "italic" }}>Bez posrednika.</span>
            </>
          }
          paragraphs={[
            <p key="p1">
              Specijalizovani smo diler investicionog zlata iz Beograda. Prodajemo isključivo LBMA sertifikovane poluge, pločice i
              dukate — direktno, transparentno i bez posrednika. Svaki klijent dobija konkretnu cenu, jasnu kalkulaciju i licni savet.
            </p>,
            <p key="p2">
              Nismo call centar. Nema automatizovanih odgovora. Kada nas pozovete, razgovarate sa osobom koja zna zlato — i koja ce vas
              saslušati pre nego što predloži bilo šta.
            </p>,
          ]}
          buttons={[
            { label: "POZOVITE NAS", href: "tel:+381612698569" },
            { label: "POSALJITE UPIT", href: "/kontakt" },
          ]}
        />
      </div>

      {/* ── Stats strip ──────────────────────────────────────────────────────── */}
      <section className="bg-[#1B1B1C] py-6">
        <SectionContainer>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-[#2E2E2E]">
            {[
              { value: "4", label: "LBMA akreditovane livarnice" },
              { value: "999,9", label: "Jedina čistoća u ponudi" },
              { value: "Isti dan", label: "Isplata pri otkupu" },
              { value: "1 savetnik", label: "Za svakog klijenta" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-start md:items-center md:text-center px-0 md:px-8 gap-1"
              >
                <span
                  className="text-[#BEAD87]"
                  style={{
                    fontFamily: "var(--font-pp-editorial), Georgia, serif",
                    fontSize: "clamp(24px, 2.5vw, 32px)",
                    fontWeight: 400,
                    fontStyle: "italic",
                    lineHeight: "1.1",
                  }}
                >
                  {value}
                </span>
                <span
                  className="text-[#7A7060] text-[12.5px] leading-snug"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ── Story / pull quote ───────────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-12 md:gap-20 items-center">

            {/* Left — large pull quote */}
            <div>
              <blockquote>
                <p
                  className="text-[#1B1B1C] leading-[1.15]"
                  style={{
                    fontFamily: "var(--font-pp-editorial), Georgia, serif",
                    fontSize: "clamp(28px, 3.5vw, 46px)",
                    fontWeight: 400,
                    fontStyle: "italic",
                  }}
                >
                  "Zlato je jednostavno. Mi to samo ne komplikujemo."
                </p>
                <div
                  className="mt-8 pt-6 border-t border-[#F0EDE6] flex items-center gap-4"
                >
                  <div
                    className="w-10 h-px"
                    style={{ background: "#BEAD87" }}
                    aria-hidden
                  />
                  <span
                    className="text-[#9D9072] text-sm"
                    style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                  >
                    Gold Invest, Beograd
                  </span>
                </div>
              </blockquote>
            </div>

            {/* Right — story body */}
            <div className="flex flex-col gap-5">
              <p
                className="text-[#3A3A3A] leading-relaxed"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 16,
                  lineHeight: "1.7em",
                }}
              >
                Gold Invest je nastao iz jedne jednostavne observacije: ljudi u Srbiji žele da kupe investiciono zlato, ali im nedostaje pouzdan, domaći partner koji ce im objasniti kako to funkcioniše — bez prebukiranog marketinga i bez skrivenih troškova.
              </p>
              <p
                className="text-[#3A3A3A] leading-relaxed"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 16,
                  lineHeight: "1.7em",
                }}
              >
                Banke prodaju zlato sa visokim premijumom i bez saveta. Strani e-commerce sajtovi imaju problem sa carinjenjem i ne poznaju srpsko tržište. Nepoznati dileri ne nude garanciju autentičnosti.
              </p>
              <p
                className="text-[#3A3A3A] leading-relaxed"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 16,
                  lineHeight: "1.7em",
                }}
              >
                Mi smo popunili tu prazninu. Direktni uvoz od LBMA livarnica. Cena transparentno izvedena iz London Fix-a. Savetodavni razgovor bez obaveze. Otkup isti dan. I uvek — ista osoba kada nas pozovete.
              </p>
              <Link
                href="/kako-kupiti"
                className="inline-flex items-center gap-2 text-[#BF8E41] font-semibold transition-colors hover:gap-3"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 14,
                }}
              >
                Kako funkcioniše kupovina
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#F9F9F9] py-20 sm:py-24 border-t border-[#F0EDE6]">
        <SectionContainer>
          <div className="text-left md:text-center mb-14">
            <span
              className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-4 block"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              Nase vrednosti
            </span>
            <h2
              className="text-[#1B1B1C]"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontWeight: 500,
                fontSize: 30,
                lineHeight: "1.1",
                letterSpacing: "-1px",
              }}
            >
              Tri principa kojih se nikada ne odricemo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v) => (
              <div
                key={v.eyebrow}
                className="bg-white border border-[#F0EDE6] rounded-2xl p-7 sm:p-8 flex flex-col"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
              >
                <span
                  className="text-[#BEAD87] text-[11px] font-semibold tracking-widest uppercase mb-4 block"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  {v.eyebrow}
                </span>
                <h3
                  className="text-[#1B1B1C] mb-4"
                  style={{
                    fontFamily: "var(--font-pp-editorial), Georgia, serif",
                    fontWeight: 400,
                    fontStyle: "italic",
                    fontSize: "clamp(19px, 1.8vw, 24px)",
                    lineHeight: "1.25",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-[#6B6B6B] text-[13.5px] leading-relaxed mt-auto"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ── Comparison: Gold Invest vs. banka ────────────────────────────────── */}
      <section className="bg-[#1B1B1C] py-20 sm:py-24">
        <SectionContainer>
          <div className="text-left md:text-center mb-14">
            <span
              className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-4 block"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              Zasto Gold Invest
            </span>
            <h2
              className="text-white"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "clamp(26px, 3vw, 42px)",
                lineHeight: "1.15",
              }}
            >
              Gold Invest vs. kupovina u banci
            </h2>
            <p
              className="text-[#7A7060] mt-4 max-w-[560px] md:mx-auto text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              Banka je sigurna asocijacija, ali nije uvek optimalna opcija za investiciono zlato. Evo zašto.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[900px] md:mx-auto">
            {/* Gold Invest */}
            <div
              className="rounded-2xl p-7 flex flex-col gap-4"
              style={{
                background: "linear-gradient(145deg, #242424 0%, #1E1E1E 100%)",
                border: "1px solid #2E2E2E",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-3 py-1 rounded-full text-[#1B1B1C] text-[11px] font-bold tracking-wide uppercase"
                  style={{
                    backgroundColor: "#BEAD87",
                    fontFamily: "var(--font-rethink), sans-serif",
                  }}
                >
                  Gold Invest
                </span>
              </div>
              {COMPARE_US.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-[#BEAD87] shrink-0 mt-0.5" />
                  <span
                    className="text-[#E9E6D9] text-[13.5px] leading-snug"
                    style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* Banka */}
            <div
              className="rounded-2xl p-7 flex flex-col gap-4"
              style={{
                background: "#161616",
                border: "1px solid #252525",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-3 py-1 rounded-full text-[#888] text-[11px] font-bold tracking-wide uppercase"
                  style={{
                    border: "1px solid #333",
                    fontFamily: "var(--font-rethink), sans-serif",
                  }}
                >
                  Banka
                </span>
              </div>
              {COMPARE_BANK.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <XCircle size={16} className="text-[#4A4A4A] shrink-0 mt-0.5" />
                  <span
                    className="text-[#555] text-[13.5px] leading-snug"
                    style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ── Expertise / livarnice ────────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 md:gap-20 items-center">

            {/* Left — image */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{ height: 460, background: "#F9F9F9" }}
            >
              <Image
                src="/images/edu-sertifikati-lbma.png"
                alt="LBMA sertifikat i zlatna poluga — autentičnost investicionog zlata"
                fill
                className="object-cover"
                style={{ objectPosition: "50% 40%" }}
              />
            </div>

            {/* Right — copy */}
            <div>
              <span
                className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-5 block"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                Nase livarnice
              </span>
              <h2
                className="text-[#1B1B1C] mb-6"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(24px, 2.8vw, 38px)",
                  lineHeight: "1.15",
                }}
              >
                Cetiri livarnice. Jedan standard. Bez izuzetka.
              </h2>
              <p
                className="text-[#4C4C4C] leading-relaxed mb-5"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 15,
                  lineHeight: "1.7em",
                }}
              >
                Svaki proizvod u našoj ponudi potiče od jedne od četiri LBMA akreditovane livarnice — Argor-Heraeus (Svajcarska), C. Hafner (Nemacka), Umicore (Belgija) i Heraeus (Nemacka). Ove livarnice svake godine prolaze nezavisne revizije koje verificiraju tačnost težine, čistoću 999,9 i ispravnost serijskih brojeva.
              </p>
              <p
                className="text-[#4C4C4C] leading-relaxed mb-8"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 15,
                  lineHeight: "1.7em",
                }}
              >
                LBMA akreditacija nije marketing oznaka — to je međunarodna garancija da vas proizvod može biti prodat na bilo kojoj berzi plemenitih metala u svetu bez ikakve dodatne verifikacije. Zlato koje kupite kod nas sutra možete prodati u Londonu, Cirihu ili Njujorku.
              </p>

              {/* Brand name strip */}
              <div className="flex flex-wrap gap-3">
                {[
                  "Argor-Heraeus — CH",
                  "C. Hafner — DE",
                  "Umicore — BE",
                  "Heraeus — DE",
                ].map((brand) => (
                  <span
                    key={brand}
                    className="inline-flex items-center px-4 py-2 rounded-full text-[#1B1B1C] text-[12px] font-semibold"
                    style={{
                      border: "0.5px solid #D4C9A8",
                      backgroundColor: "#FAF8F2",
                      fontFamily: "var(--font-rethink), sans-serif",
                    }}
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ── Contact CTA ──────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden py-20 sm:py-28"
        style={{
          background: "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)",
        }}
      >
        <SectionContainer>
          <div className="max-w-[620px]">
            <span
              className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-5 block"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              Razgovarajmo
            </span>
            <h2
              className="text-[#1B1B1C] mb-6 leading-[1.12]"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(28px, 3.5vw, 48px)",
              }}
            >
              <span style={{ fontStyle: "normal" }}>Imate pitanje?</span>
              <br />
              <span style={{ fontStyle: "italic" }}>Pitajte nas direktno.</span>
            </h2>
            <p
              className="text-[#3A3A3A] leading-relaxed mb-8"
              style={{
                fontFamily: "var(--font-rethink), sans-serif",
                fontSize: 16,
                lineHeight: "1.65em",
                maxWidth: 520,
              }}
            >
              Nema glupih pitanja kada je u pitanju vas novac. Pozovite nas ili pošaljite poruku — bez obaveze, bez prodajnog pritiska. Samo konkretan odgovor na vase konkretno pitanje.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+381612698569"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: "#1B1B1C",
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 14,
                  boxShadow: "0px 4px 14px rgba(0,0,0,0.18)",
                }}
              >
                <Phone size={15} />
                061/269-8569
              </a>
              <Link
                href="/kontakt"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-200"
                style={{
                  border: "1.5px solid #1B1B1C",
                  color: "#1B1B1C",
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 14,
                }}
              >
                KONTAKT FORMA
              </Link>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <CategoryFaq
        title="Česta pitanja o nama"
        items={FAQ_ITEMS}
        ctaHref="/faq"
        ctaLabel="SVA PITANJA I ODGOVORI"
      />

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <WhatIsGoldSection />
    </main>
  );
}
