import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  MapPin,
  Truck,
  ShieldCheck,
  BadgeCheck,
  Landmark,
  CreditCard,
  Banknote,
  CalendarClock,
  CheckCircle2,
} from "lucide-react";
import { CategoryHero } from "@/components/catalog/CategoryHero";
import { CategoryFaq } from "@/components/catalog/CategoryFaq";
import { WhatIsGoldSection } from "@/components/home/WhatIsGoldSection";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SchemaScript } from "@/components/ui/SchemaScript";
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from "@/lib/schema";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Kako kupiti investiciono zlato | Gold Invest",
  description:
    "Korak po korak vodič za kupovinu investicionog zlata u Srbiji — odabir formata, cena, način plaćanja, isporuka i sertifikati. Bez komplikacija, bez kase.",
  alternates: { canonical: "https://goldinvest.rs/kako-kupiti" },
  openGraph: {
    title: "Kako kupiti investiciono zlato | Gold Invest",
    description:
      "Pet jednostavnih koraka do vašeg prvog investicionog zlata. Savet, cena, plaćanje, isporuka.",
    url: "https://goldinvest.rs/kako-kupiti",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Kako kupiti", href: "/kako-kupiti" },
];

const STEPS = [
  {
    title: "Izaberite format i težinu",
    body: "Poluge, pločice ili dukati — svaki format ima razlog. Pločice od 1–10 g su idealne za početnike i poklone. Poluge od 50 g naviše nude niži premijum po gramu i pogodne su za dugoročno štedenje. Zlatni dukati su kolekcionarska i kulturna vrednost. Ako niste sigurni, pozovite nas — savetujemo bez obaveze.",
    note: "Zlatne poluge (999,9) imaju najniži premijum po gramu od svih formata.",
  },
  {
    title: "Kontaktirajte nas za aktuelnu cenu",
    body: "Cena zlata se menja svakog dana prema London Bullion Market kotaciji. Iz tog razloga ne prikazujemo fiksirane cene na sajtu — svaki upit dobija aktuelnu cenu važeću na dan kupovine. Pozovite nas ili pošaljite upit putem kontakt forme. Odgovaramo u roku od nekoliko sati.",
    note: "Svaka cena je transparentna: spot cena + premijum za izradu i distribuciju.",
  },
  {
    title: "Potvrdite porudžbinu i uplatite",
    body: "Kada se dogovorimo o ceni, potvrđujete porudžbinu — telefonom ili pisanom porukom. Prihvatamo gotovinu (do zakonskog limita), platnu karticu i bankarski transfer. Moguća je i avansna rezervacija po današnjoj ceni, sa isporukom u dogovorenom roku.",
    note: "Gotovina do 10.000 EUR ekvivalenta po transakciji (AML propis).",
  },
  {
    title: "Preuzmite zlato sa originalnim sertifikatom",
    body: "Svaki proizvod dolazi u originalnom, zapečaćenom pakovanju sa sertifikatom proizvođača. Poluge dolaze u assay kartici koja fizički sprečava otvaranje bez oštećenja. Pločice imaju individualni serijski broj. Sertifikat je garantija autentičnosti prihvaćena na svim svetskim tržištima.",
    note: "Pakovanje je diskretno — bez vidnog označavanja sadržaja.",
  },
  {
    title: "Dostava na adresu ili lično preuzimanje",
    body: "Biramo najsigurniji način za vas. Isporuka kurirskom službom je osigurana i diskretna — dolazi kao standardna pošiljka. Lično preuzimanje je dostupno u našoj poslovnici u Beogradu. Za poluge od 500 g i više, preporučujemo lični dolazak ili organizovani transport.",
    note: "Isporuka po celoj Srbiji, 1–3 radna dana.",
  },
];

const PAYMENT_METHODS = [
  {
    icon: Banknote,
    title: "Gotovinska uplata",
    body: "Najbrži način. Dođete, preuzmete, odete. Gotovinski prijem je moguć do 10.000 EUR ekvivalenta u dinarima po transakciji, u skladu sa srpskim AML zakonom. Nema naknada, nema čekanja.",
    highlight: false,
  },
  {
    icon: CreditCard,
    title: "Platna kartica",
    body: "Prihvatamo Visa, Mastercard i Dina kartice. Transakcija mora biti vidljiva na vašem izvodu — to je zakonski uslov. Obrada je trenutna, bez dodatnih naknada za kupca.",
    highlight: false,
  },
  {
    icon: Landmark,
    title: "Bankarski transfer",
    body: "Pogodno za veće iznose. Pošaljete nalog, čekamo uplatu, isporučujemo odmah nakon evidentiranja. Bez limita na iznos, sa računom i fiskalnim isečkom za sve.",
    highlight: false,
  },
  {
    icon: CalendarClock,
    title: "Avansna kupovina",
    body: "Rezervišete količinu zlata po današnjoj ceni, a isporuku primate za 7–30 dana. Idealno ako očekujete rast cene ili želite da rasporedite troškove. Avansna cena je uvek niža od cene robe na stanju.",
    highlight: true,
  },
];

const TRUST_ITEMS = [
  {
    icon: BadgeCheck,
    title: "LBMA akreditovane livnice",
    body: "Svi proizvodi potiču isključivo od međunarodno priznatih livnica: Argor-Heraeus, C. Hafner, Umicore i Heraeus. LBMA akreditacija garantuje tačnost težine i čistoću 999,9 — prihvaćeno na svim svetskim berzama.",
  },
  {
    icon: ShieldCheck,
    title: "Originalna pakovanja i sertifikati",
    body: "Svaka poluga i pločica isporučuje se u originalnoj, fabrički zapečaćenoj ambalaži sa serijskim brojem. Sertifikat je garancija autentičnosti koja prati proizvod tokom celokupnog životnog ciklusa.",
  },
  {
    icon: CheckCircle2,
    title: "PDV oslobođen po zakonu",
    body: "Investiciono zlato čistoće 999,9 je oslobođeno PDV-a prema Zakonu o porezu na dodatu vrednost (čl. 25). To znači da plaćate samo cenu metala i premijum livnice — bez poreza na kupovinu.",
  },
  {
    icon: Landmark,
    title: "Registrovani diler sa fiskalnim računom",
    body: "Gold Invest posluje kao registrovano privredno društvo sa poreskim identifikacionim brojem. Za svaku kupovinu dobijate fiskalni isečak. Sve transakcije iznad zakonskog limita prijavljuju se Upravi za sprečavanje pranja novca.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Da li mogu da kupim zlato bez prethodnog zakazivanja?",
    a: "Da, za manje količine (pločice i poluge do 100 g koje imamo na stanju) možete doći bez zakazivanja tokom radnog vremena. Za veće količine i poluge od 500 g naviše preporučujemo da nas unapred kontaktirate, jer čuvamo zalihe u sefu i potrebna je priprema.",
  },
  {
    q: "Kako znati koliko zlata da kupim?",
    a: "To zavisi od vašeg cilja. Za kratkoročnu zaštitu štednje — pločice od 5–10 g su fleksibilne i lako se prodaju. Za dugoročno čuvanje vrednosti — poluge od 100 g i više imaju najniži premijum po gramu. Za poklone — pločice od 1–2 g su najpopularnije. Pozovite nas i dobićete personalizovani savet bez obaveze.",
  },
  {
    q: "Da li mogu da platim pouzećem?",
    a: "Da, pouzeće je moguće za standardne porudžbine. Kurir naplaćuje iznos pri isporuci gotovinom ili karticom. Pouzeće nije dostupno za poluge od 500 g i više — za te formate obavezno je avansno plaćanje zbog vrednosti pošiljke.",
  },
  {
    q: "Kako se formira cena koju ću platiti?",
    a: "Cena se formira kao: spot cena zlata (London Fix, USD/troj unca) x težina u gramima x kurs USD/RSD, uvećana za premijum livnice i našu prodajnu maržu. Sve stavke su transparentne — na zahtev vam objašnjavamo svaki deo cene.",
  },
  {
    q: "Da li mogu da prodam zlato koje sam kupio kod vas?",
    a: "Da. Otkupljujemo svo investiciono zlato od LBMA akreditovanih livnica — kupljeno kod nas ili kod drugog dilera — po tekućoj berzanskoj ceni. Otkupna cena se ažurira svakodnevno i uvek je transparentna.",
  },
  {
    q: "Koliko dugo traje ceo proces kupovine?",
    a: "Ako imate robu na stanju i dolazite lično u Beograd — za 30 minuta ste završili. Upit putem forme ili telefona dobija odgovor u roku od nekoliko sati. Isporuka kurirskom službom traje 1–3 radna dana. Avansne porudžbine se isporučuju u roku dogovorenom pri kupovini (obično 7–30 dana).",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KakoKupitiPage() {
  return (
    <main className="bg-white">
      <SchemaScript schema={buildBreadcrumbSchema(BREADCRUMBS)} />
      <SchemaScript schema={buildFaqSchema(FAQ_ITEMS)} />
      <SchemaScript
        schema={buildWebPageSchema({
          name: "Kako kupiti investiciono zlato | Gold Invest",
          description:
            "Korak po korak vodič za kupovinu investicionog zlata — odabir formata, cena, plaćanje i dostava.",
          slug: "/kako-kupiti",
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
        title="Kako kupiti investiciono zlato"
        introFull="Bez kase i bez komplikacija. Kupovina investicionog zlata kod nas funkcioniše kao savetodavni razgovor — prilagođen vašim ciljevima i budžetu. Na ovoj stranici objašnjavamo svaki korak, od odabira formata do isporuke sa sertifikatom."
        pills={[
          { label: "Zlatne poluge", href: "/kategorija/zlatne-poluge" },
          { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
          { label: "Zlatni dukati", href: "/kategorija/zlatni-dukati" },
          { label: "Kontaktirajte nas", href: "/kontakt" },
        ]}
        expandableIntro={false}
        introMaxWidth={680}
        centerOnDesktop
      />

      {/* ── 5 Steps ───────────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <SectionContainer>
          <SectionHeading
            eyebrow="Proces kupovine"
            title="Pet koraka do vašeg zlata"
            description="Jednostavan, transparentan i personalizovan — svaka kupovina je prilagođena vašim potrebama."
          />

          <div className="relative max-w-[860px] md:mx-auto">
            {/* Vertical connector line — višible only on md+ */}
            <div
              className="hidden md:block absolute left-[19px] top-6 bottom-6 w-px"
              style={{ background: "linear-gradient(180deg, #BEAD87 0%, #E6DFC9 100%)" }}
              aria-hidden
            />

            <div className="flex flex-col gap-0">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="relative flex gap-6 sm:gap-8 pb-10 last:pb-0"
                >
                  {/* Step number circle */}
                  <div className="flex flex-col items-center shrink-0">
                    <span
                      className="relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-semibold shrink-0"
                      style={{
                        background: "#1B1B1C",
                        fontFamily: "var(--font-rethink), sans-serif",
                        boxShadow: "0 0 0 4px #fff, 0 0 0 5px #E6DFC9",
                      }}
                    >
                      {i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1.5">
                    <h3
                      className="text-[#1B1B1C] mb-3"
                      style={{
                        fontFamily: "var(--font-pp-editorial), Georgia, serif",
                        fontWeight: 400,
                        fontSize: "clamp(20px, 2vw, 26px)",
                        lineHeight: "1.2",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-[#4C4C4C] leading-relaxed mb-3"
                      style={{
                        fontFamily: "var(--font-rethink), sans-serif",
                        fontSize: 15,
                        lineHeight: "1.65em",
                      }}
                    >
                      {step.body}
                    </p>
                    <p
                      className="inline-flex items-center gap-2 text-[#BF8E41] font-semibold"
                      style={{
                        fontFamily: "var(--font-rethink), sans-serif",
                        fontSize: 12.5,
                        letterSpacing: "0.02em",
                      }}
                    >
                      <span className="inline-block w-4 h-px bg-[#BEAD87]" aria-hidden />
                      {step.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA below steps */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-center mt-16">
            <a
              href="tel:+381614264129"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: "#1B1B1C",
                fontFamily: "var(--font-rethink), sans-serif",
                fontSize: 14,
                boxShadow: "0px 4px 14px rgba(0,0,0,0.18)",
              }}
            >
              <Phone size={15} />
              POZOVITE: 061/426-4129
            </a>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: "#BEAD87",
                color: "#1B1B1C",
                fontFamily: "var(--font-rethink), sans-serif",
                fontSize: 14,
                boxShadow: "0px 4px 14px rgba(190,173,135,0.35)",
              }}
            >
              POSALJITE UPIT
            </Link>
          </div>
        </SectionContainer>
      </section>

      {/* ── Payment Methods ───────────────────────────────────────────────────── */}
      <section className="bg-[#F9F9F9] py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            eyebrow="Plaćanje"
            title="Načini plaćanja i rezervacije"
            description="Prilagođavamo se vašim mogućnostima — od gotovine do avansne kupovine po današnjoj ceni."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PAYMENT_METHODS.map((pm) => {
              const Icon = pm.icon;
              return (
                <div
                  key={pm.title}
                  className={`rounded-2xl p-6 sm:p-7 flex flex-col ${
                    pm.highlight
                      ? "bg-[#1B1B1C] border border-[#1B1B1C]"
                      : "bg-white border border-[#F0EDE6]"
                  }`}
                  style={
                    pm.highlight
                      ? { boxShadow: "0 8px 30px rgba(27,27,28,0.18)" }
                      : { boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }
                  }
                >
                  <span
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${
                      pm.highlight ? "bg-[#BEAD87]" : "bg-[#1B1B1C]"
                    }`}
                  >
                    <Icon size={18} color={pm.highlight ? "#1B1B1C" : "#fff"} />
                  </span>
                  {pm.highlight && (
                    <span
                      className="text-[#BEAD87] text-[10.5px] font-semibold tracking-widest uppercase mb-2"
                      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                    >
                      Preporučeno
                    </span>
                  )}
                  <h3
                    className={`mb-3 font-semibold ${pm.highlight ? "text-white" : "text-[#1B1B1C]"}`}
                    style={{
                      fontFamily: "var(--font-rethink), sans-serif",
                      fontSize: 15,
                      lineHeight: "1.3",
                    }}
                  >
                    {pm.title}
                  </h3>
                  <p
                    className={`text-[13.5px] leading-relaxed ${
                      pm.highlight ? "text-[#B8B8B8]" : "text-[#6B6B6B]"
                    }`}
                    style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                  >
                    {pm.body}
                  </p>
                </div>
              );
            })}
          </div>
        </SectionContainer>
      </section>

      {/* ── Delivery ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-10 items-start">

            {/* Left — highlight card */}
            <div
              className="rounded-2xl border border-[#F0EDE6] p-7 sm:p-10"
              style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.06)" }}
            >
              <span
                className="text-[#BF8E41] text-[10.5px] font-semibold tracking-widest uppercase mb-3 block"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                Isporuka i preuzimanje
              </span>
              <h2
                className="text-[#1B1B1C] mb-5"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(22px, 2.5vw, 32px)",
                  lineHeight: "1.2",
                }}
              >
                Zlato stiže do vas — sigurno i diskretno
              </h2>
              <p
                className="text-[#4C4C4C] text-sm leading-relaxed mb-5"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                Svaka pošiljka je maksimalno osigurana i pakuje se u neutralnu ambalažu bez ikakvih oznaka koje bi ukazivale na sadržaj. Dostava je organizovana putem proverenih kurirskih službi sa praćenjem pošiljke u realnom vremenu.
              </p>
              <p className="text-[#6B6B6B] text-[13.5px] leading-relaxed mb-8">
                Za poluge od 500 g i više, preporučujemo lično preuzimanje ili individualno organizovani transport — kontaktirajte nas za detalje.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/kontakt"
                  className="inline-flex items-center justify-center px-7 py-3 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
                  style={{
                    backgroundColor: "#BEAD87",
                    fontSize: "12.1px",
                    fontFamily: "var(--font-rethink), sans-serif",
                    boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  Kontakt forma
                </Link>
                <a
                  href="tel:+381614264129"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full font-semibold transition-all duration-200"
                  style={{
                    border: "0.5px solid #1B1B1C",
                    color: "#1B1B1C",
                    fontSize: "12.1px",
                    fontFamily: "var(--font-rethink), sans-serif",
                  }}
                >
                  <Phone size={13} />
                  061/426-4129
                </a>
              </div>
            </div>

            {/* Right — delivery options list */}
            <div className="flex flex-col gap-6">
              {[
                {
                  Icon: MapPin,
                  label: "Lično preuzimanje — Beograd",
                  body: "Dođete u našu poslovnicu, pregledate robu, potpisite dokumentaciju i odnesete zlato sa sobom. Bez čekanja, bez posrednika.",
                },
                {
                  Icon: Truck,
                  label: "Beograd — isti dan",
                  body: "Porudžbine evidentirane radnim danom do 12h isporučujemo na vašoj adresi u Beogradu istog dana do 18h. Uz praćenje pošiljke.",
                },
                {
                  Icon: ShieldCheck,
                  label: "Cela Srbija — 1 do 3 radna dana",
                  body: "Osigurana, diskretna kurirska pošiljka. Rok isporuke zavisi od vašeg mesta — obično sledeći radni dan za veće gradove.",
                },
                {
                  Icon: CalendarClock,
                  label: "Avansne porudžbine — po dogovoru",
                  body: "Ako kupujete unapred po današnjoj ceni, isporuka se usklađuje prema vašim potrebama — 7 do 30 dana.",
                },
              ].map(({ Icon, label, body }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="w-9 h-9 rounded-xl bg-[#1B1B1C] text-white flex items-center justify-center shrink-0">
                    <Icon size={16} />
                  </span>
                  <div>
                    <p
                      className="text-[#1B1B1C] text-sm font-semibold mb-1 leading-snug"
                      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-[#6B6B6B] text-[13px] leading-relaxed"
                      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                    >
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ── Trust & Certificates ─────────────────────────────────────────────── */}
      <section className="bg-[#F9F9F9] py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            eyebrow="Sigurnost i autentičnost"
            title="Zašto možete da nam verujete"
            description="Svaki aspekt kupovine — od izvora zlata do načina isporuke — projektovan je oko vaših interesa."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TRUST_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border border-[#F0EDE6] rounded-2xl p-6 sm:p-7 flex gap-5 items-start"
                  style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                >
                  <span className="w-10 h-10 rounded-xl bg-[#1B1B1C] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={18} />
                  </span>
                  <div>
                    <h3
                      className="text-[#1B1B1C] mb-2 font-semibold"
                      style={{
                        fontFamily: "var(--font-rethink), sans-serif",
                        fontSize: 15,
                        lineHeight: "1.3",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-[#6B6B6B] text-[13.5px] leading-relaxed"
                      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionContainer>
      </section>

      {/* ── Dark quote ───────────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-20 sm:py-24">
        <SectionContainer className="flex flex-col items-start text-left md:items-center md:text-center">
          <span
            className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-6 block"
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          >
            Filozofija
          </span>
          <h2
            className="text-white leading-[1.15] mb-10 max-w-[820px]"
            style={{
              fontFamily: "var(--font-pp-editorial), Georgia, serif",
              fontSize: "clamp(22px, 3.2vw, 42px)",
              fontWeight: 400,
            }}
          >
            <span style={{ fontStyle: "normal" }}>
              Zlato ne kupujete — vi ga sačuvate.{" "}
            </span>
            <span style={{ fontStyle: "italic" }}>
              Mi samo brinemo o tome da stigne do vas bezbedno, pravo i po pravoj ceni.
            </span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <a
              href="tel:+381614264129"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: "#BEAD87",
                fontFamily: "var(--font-rethink), sans-serif",
                fontSize: 13,
                boxShadow: "0 0 20px rgba(190,173,135,0.3)",
              }}
            >
              <Phone size={14} />
              POZOVITE: 061/426-4129
            </a>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold transition-colors hover:bg-white/5"
              style={{
                border: "1.5px solid #BEAD87",
                color: "#BEAD87",
                fontFamily: "var(--font-rethink), sans-serif",
                fontSize: 13,
              }}
            >
              KONTAKT FORMA
            </Link>
          </div>
        </SectionContainer>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <CategoryFaq
        title="Česta pitanja o kupovini"
        items={FAQ_ITEMS}
        ctaHref="/faq"
        ctaLabel="SVA PITANJA I ODGOVORI"
      />

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <WhatIsGoldSection />
    </main>
  );
}
