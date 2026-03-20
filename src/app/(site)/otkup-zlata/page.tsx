import type { Metadata } from "next";
import Link from "next/link";
import {
  Phone,
  TrendingUp,
  Banknote,
  Landmark,
  ShieldCheck,
  BadgeCheck,
  Scale,
  Eye,
  ArrowRightLeft,
  CheckCircle2,
  Coins,
  Package,
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
  title: "Otkup investicionog zlata | Gold Invest",
  description:
    "Prodajte investiciono zlato po transparentnoj berzanskoj ceni. Otkupljujemo poluge, pločice i dukate — kupljene kod nas ili drugde. Isplata isti dan, bez skrivenih naknada.",
  alternates: { canonical: "https://goldinvest.rs/otkup-zlata" },
  openGraph: {
    title: "Otkup investicionog zlata | Gold Invest",
    description:
      "Transparentna otkupna cena prema London Fix kotaciji. Isplata odmah, bez posrednika.",
    url: "https://goldinvest.rs/otkup-zlata",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

// ─── Static data ──────────────────────────────────────────────────────────────

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Otkup zlata", href: "/otkup-zlata" },
];

const STEPS = [
  {
    title: "Kontaktirajte nas sa opisom proizvoda",
    body: "Pozovite nas ili pošaljite fotografiju vase poluge, pločice ili dukata zajedno sa serijskim brojem. Nije potrebno da nas posjećujete — prvu procenu radimo na osnovu fotografije i opisa. Odgovaramo u toku istog radnog dana.",
    note: "Serijski broj se nalazi na sertifikatu i na assay kartici poluge.",
  },
  {
    title: "Dobijete aktuelnu otkupnu cenu",
    body: "Na osnovu vašeg opisa, šaljem vam konkretnu otkupnu cenu u dinarima. Cena se formira prema danasnjoj London Bullion Market kotaciji (London Fix, popodnevni fiksing) umanjenu za standardni spread. Nema skrivenih odbitaka niti naknada.",
    note: "Otkupna cena vazi na dan transakcije — ažurira se svaki radni dan.",
  },
  {
    title: "Dogovorite način predaje",
    body: "Ako ste u Beogradu ili blizini, dođete licno u našu poslovnicu. Ako ste u drugom gradu, zlato možete poslati preporučenom poštom ili kurirskom službom — organizujemo preuzimanje i snosimo rizik od gubitka u tranzitu.",
    note: "Licna predaja je uvek brza i najpouzdanija opcija.",
  },
  {
    title: "Provera autentičnosti na licu mesta",
    body: "Pri preuzimanju proveravamo originalnost pakovanjа, vizuelno stanje i serijski broj. Ceo postupak traje nekoliko minuta. Koristimo profesionalne uredjaje za proveru — ista oprema kao i kod kupovine. Nema subjektivnih procena.",
    note: "Proverena roba se ne može naknadno osporiti ni s jedne strane.",
  },
  {
    title: "Isplata odmah — gotovinom ili na racun",
    body: "Cim prodjemo proveru, isplaćujemo vas odmah. Gotovinom do zakonskog limita (10.000 EUR ekvivalent), a veće iznose šaljemo bankarskim transferom na vas racun isti radni dan. Dobijate fiskalni isecak i potvrdu transakcije.",
    note: "Nema cekanja na odobrenje, nema kasnjenja.",
  },
];

const WHAT_WE_BUY = [
  {
    Icon: Package,
    title: "Zlatne poluge",
    body: "Sve težine od 1 g do 1 kg od LBMA akreditovanih livarnica: Argor-Heraeus, C. Hafner, Umicore, Heraeus, PAMP Suisse. Poluga mora biti u originalnoj, neotvornoj assay kartici sa sertifikatom.",
  },
  {
    Icon: ArrowRightLeft,
    title: "Zlatne pločice (kreditne kartice)",
    body: "Plocice od 1 g, 2 g, 5 g, 10 g i 20 g u originalnom zapečaćenom pakovanju. Prihvatamo sve renomirane livarnice. Plocice sa oštećenim ili otvorenim pakovanjem prihvatamo uz individualnu procenu.",
  },
  {
    Icon: Coins,
    title: "Zlatni dukati i kovani novac",
    body: "Franc Jozef dukat, Becka Filharmonija, Krugerrand, Maple Leaf, American Eagle i drugi investicioni kovani novci. Prihvatamo i numizmatičke primjerke uz posebnu procenu.",
  },
  {
    Icon: BadgeCheck,
    title: "Kupljeno kod nas ili drugde",
    body: "Nije uslov da ste zlato kupili kod nas. Otkupljujemo sve što je od LBMA akreditovanog proizvodjaca u originalnom pakovanju — bez obzira na to gde i kada je kupljeno, uključujuci i inostranstvo.",
  },
];

const TRUST_ITEMS = [
  {
    Icon: TrendingUp,
    title: "Cena prema berzi — bez pogadjanja",
    body: "Otkupna cena nije stvar pregovaranja — ona je izvedena direktno iz London Fix kotacije na dan otkupa, umanjena za fiksni industrijski spread. Isti princip primenjuju sve akreditovane zlatarne u Evropi.",
  },
  {
    Icon: Eye,
    title: "Transparentna kalkulacija",
    body: "Na zahtev vam u pisanoj formi dostavljamo punu kalkulaciju: spot cena (USD/troj unca), težina (g), kurs (USD/RSD) i spread. Možete je proveriti na bilo kom finansijskom portalu koji prikazuje Live Gold Price.",
  },
  {
    Icon: Scale,
    title: "Bez pritiska, bez obaveze",
    body: "Prijava za otkup ne obavezuje vas na prodaju. Cena je samo informativna dok ne potpitate ugovor. Možete slobodno odbiti ponudu u bilo kom trenutku bez ikakvih posledica ili naknada.",
  },
  {
    Icon: ShieldCheck,
    title: "Registrovano privredno društvo",
    body: "Gold Invest posluje kao registrovano privredno društvo u Srbiji. Svaka transakcija je evidentirana, dokumentovana fiskalnim racunom i, gde je primenljivo, prijavljena Upravi za sprečavanje pranja novca.",
  },
];

const FAQ_ITEMS = [
  {
    q: "Da li moram da kupim zlato kod vas da biste ga otkupili?",
    a: "Ne. Otkupljujemo investiciono zlato bez obzira gde je kupljeno — kod nas, kod drugog dilera, u banci, u inostranstvu. Jedini uslov je da je roba od LBMA akreditovanog proizvodjaca i da je u originalnom, neoštećenom pakovanju sa serijskim brojem.",
  },
  {
    q: "Kako se formira otkupna cena i koliki je spread?",
    a: "Otkupna cena = spot cena zlata (London Fix popodnevni fiksing) x težina x kurs USD/RSD, umanjena za spread. Spread je između 1% i 3% zavisno od formata i količine — manji za veće poluge, veći za pločice i kovanice. Tacnu cifru dobijate pri kontaktu.",
  },
  {
    q: "Koliko traje ceo proces od kontakta do isplate?",
    a: "Za licno preuzimanje u Beogradu: ceo proces od dolaska do isplate traje 20–40 minuta. Za slanje pošiljke iz drugog grada: proveravamo robu istog dana kad stigne i isplaćujemo odmah. Celokupan proces retko traje duže od 2–3 radna dana.",
  },
  {
    q: "Šta se desava ako je pakovanje osteceno ili otvoreno?",
    a: "Poluge sa otvorenom ili oštećenom assay karticom prihvatamo, ali ih saljecemo na dodatnu verifikaciju kod ovlascenog tester. Ovo produžava proces za 1–3 radna dana. Otkupna cena za ostecene komade se određuje naknado, na osnovu nalaza.",
  },
  {
    q: "Da li mogu da prodam deo svojih poluga a deo zadrzim?",
    a: "Naravno. Nema minimalne količine za otkup. Možete prodati jednu polugu od 1 g ili celu zbirku — odluka je potpuno vasa. Cak i ako imate samo jedan gram zlata, prihvatamo ga pod istim uslovima.",
  },
  {
    q: "Da li se otkupna cena menja između kontakta i isplate?",
    a: "Cena je fikširana na trenutak kada je potvrdjujete telefonom ili pisanom porukom. Ako do predaje prodje vise dana, cenu ažuriramo na dan fizickog preuzimanja — što je standardna praksa. Preporucujemo da isporuku organizujete što brže nakon dogovora o ceni.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OtkupZlataPage() {
  return (
    <main className="bg-white">
      <SchemaScript schema={buildBreadcrumbSchema(BREADCRUMBS)} />
      <SchemaScript schema={buildFaqSchema(FAQ_ITEMS)} />
      <SchemaScript
        schema={buildWebPageSchema({
          name: "Otkup investicionog zlata | Gold Invest",
          description:
            "Prodajte investiciono zlato po transparentnoj berzanskoj ceni. Isplata isti dan, bez posrednika.",
          slug: "/otkup-zlata",
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
        title="Otkup investicionog zlata"
        introFull="Prodajte svoje investiciono zlato po transparentnoj berzanskoj ceni — bez posrednika, bez cekanja. Otkupljujemo poluge, pločice i dukate od svih LBMA akreditovanih livarnica, bez obzira gde ste ih kupili. Isplata gotovinom ili na racun istog dana."
        pills={[
          { label: "Zlatne poluge", href: "/kategorija/zlatne-poluge" },
          { label: "Zlatne pločice", href: "/kategorija/zlatne-pločice" },
          { label: "Zlatni dukati", href: "/kategorija/zlatni-dukati" },
          { label: "Kontaktirajte nas", href: "/kontakt" },
        ]}
        expandableIntro={false}
        introMaxWidth={700}
        centerOnDesktop
      />

      {/* ── Proof bar ───────────────────────────────────────────────────────── */}
      <section className="bg-[#1B1B1C] py-5">
        <SectionContainer>
          <div className="flex flex-wrap items-center justify-start md:justify-center gap-x-8 gap-y-3">
            {[
              { label: "Isplata isti dan" },
              { label: "Cena prema London Fix" },
              { label: "Bez skrivenih naknada" },
              { label: "Kupljeno bilo gde — prihvatamo" },
              { label: "Fiskalni racun za svaku transakciju" },
            ].map(({ label }) => (
              <span
                key={label}
                className="flex items-center gap-2 text-[#E9E6D9] whitespace-nowrap"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 12.5,
                  fontWeight: 500,
                }}
              >
                <CheckCircle2 size={13} className="text-[#BEAD87] shrink-0" />
                {label}
              </span>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ── How it works — 5 steps ───────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-28">
        <SectionContainer>
          <SectionHeading
            eyebrow="Proces otkupa"
            title="Kako funkcioniše prodaja zlata"
            description="Pet koraka od prvog kontakta do isplate — jednostavno, brzo i bez iznenadjenja."
          />

          <div className="relative max-w-[860px] md:mx-auto">
            {/* Vertical connector */}
            <div
              className="hidden md:block absolute left-[19px] top-6 bottom-6 w-px"
              style={{ background: "linear-gradient(180deg, #BEAD87 0%, #E6DFC9 100%)" }}
              aria-hidden
            />

            <div className="flex flex-col gap-0">
              {STEPS.map((step, i) => (
                <div key={i} className="relative flex gap-6 sm:gap-8 pb-10 last:pb-0">
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

          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-center mt-16">
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
              POZOVITE: 061/269-8569
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

      {/* ── Price formation ──────────────────────────────────────────────────── */}
      <section className="bg-[#1B1B1C] py-20 sm:py-24">
        <SectionContainer>
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 items-center">

            {/* Left — copy */}
            <div>
              <span
                className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-5 block"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                Formiranje cene
              </span>
              <h2
                className="text-white mb-6"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontWeight: 400,
                  fontStyle: "italic",
                  fontSize: "clamp(26px, 3vw, 42px)",
                  lineHeight: "1.15",
                }}
              >
                Kako znate da dobijate fer cenu?
              </h2>
              <p
                className="text-[#B0A88A] leading-relaxed mb-5"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 15,
                  lineHeight: "1.65em",
                }}
              >
                Otkupna cena nije arbitrarna — ona je matematicka. Polaziste je uvek{" "}
                <strong className="text-[#E9E6D9] font-semibold">
                  London Fix (LBMA)
                </strong>
                , zvanicna berzanska kotacija plemenitih metala koja se objavljuje dva puta dnevno. Sve što radimo je da primenimo fiksni spread i kurs.
              </p>
              <p
                className="text-[#B0A88A] leading-relaxed mb-8"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 15,
                  lineHeight: "1.65em",
                }}
              >
                Isto možete proveriti u realnom vremenu na portalima kao što su Kitco, Gold Price ili LBMA.org — cena zlata je javna informacija. Naša jedina uloga je da vas povežemo sa tom cenom direktno, bez posrednika koji uzima deo vrednosti.
              </p>
              <div
                className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-2xl px-6 py-5"
              >
                <p
                  className="text-[#9D9072] text-xs font-semibold tracking-widest uppercase mb-3"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  Formula
                </p>
                <p
                  className="text-[#E9E6D9] font-semibold"
                  style={{
                    fontFamily: "var(--font-rethink), sans-serif",
                    fontSize: 15,
                    lineHeight: "1.6",
                  }}
                >
                  Otkupna cena = (Spot cena USD/troj unca ÷ 31,1035) × težina (g) × kurs USD/RSD × (1 − spread%)
                </p>
              </div>
            </div>

            {/* Right — breakdown cards */}
            <div className="flex flex-col gap-4">
              {[
                {
                  label: "London Fix (spot cena)",
                  body: "Medjunarodna cena zlata u USD po troj unci, određena dvaput dnevno na LBMA aukciji. Ovo je polaziste koje niko ne kontrolise jednostrano.",
                },
                {
                  label: "Kurs USD/RSD",
                  body: "Primenjujemo medijalni kurs Narodne banke Srbije na dan transakcije. Nema skrivenih kursnih razlika.",
                },
                {
                  label: "Tezina i čistoća",
                  body: "Merimo na kalibrovanoj vagi sa tačnoscu 0,01 g. Cistoca 999,9 je garantovana sertifikatom livarnice i ne odbitava se u kalkulaciji.",
                },
                {
                  label: "Spread (nas margin)",
                  body: "Standardni industrijski spread od 1–3%, zavisno od formata i količine. Veci komadi imaju manji spread. Uvek ga prikazujemo unapred.",
                },
              ].map(({ label, body }) => (
                <div
                  key={label}
                  className="bg-[#242424] border border-[#333] rounded-xl px-5 py-4 flex gap-4 items-start"
                >
                  <span
                    className="w-2 h-2 rounded-full bg-[#BEAD87] shrink-0 mt-[7px]"
                    aria-hidden
                  />
                  <div>
                    <p
                      className="text-[#E9E6D9] font-semibold text-sm mb-1"
                      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                    >
                      {label}
                    </p>
                    <p
                      className="text-[#888] text-[13px] leading-relaxed"
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

      {/* ── What we buy ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 sm:py-24 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            eyebrow="Šta otkupljujemo"
            title="Prihvatamo sve formate investicionog zlata"
            description="Nije bitno gde ste ga kupili — bitno je da je autentično i od poznate livarnice."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHAT_WE_BUY.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7 flex gap-5 items-start"
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
                    {title}
                  </h3>
                  <p
                    className="text-[#6B6B6B] text-[13.5px] leading-relaxed"
                    style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-8 max-w-[860px] md:mx-auto bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-5 flex gap-4 items-start">
            <span className="w-9 h-9 rounded-xl bg-[#1B1B1C] text-white flex items-center justify-center shrink-0 mt-0.5">
              <BadgeCheck size={16} />
            </span>
            <p
              className="text-[#3A3A3A] text-sm leading-relaxed"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              <strong className="text-[#1B1B1C]">Šta ne otkupljujemo:</strong> zlatan nakit, zlatne zubne proteze, zlatne medalje i druge predmete koji nisu u formi investicionog zlata. Za ove predmete vasiti drukcija pravila procene i ne ulaze u standardni otkup investicionog zlata.
            </p>
          </div>
        </SectionContainer>
      </section>

      {/* ── Payout methods ───────────────────────────────────────────────────── */}
      <section className="bg-[#F9F9F9] py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            eyebrow="Isplata"
            title="Brza i sigurna isplata"
            description="Isplacujemo odmah po verifikaciji — bez odlaganja, bez cekanja na odobrenje."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[760px] md:mx-auto">
            <div
              className="bg-[#1B1B1C] rounded-2xl p-7 flex flex-col"
              style={{ boxShadow: "0 8px 30px rgba(27,27,28,0.18)" }}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#BEAD87] mb-5">
                <Banknote size={18} color="#1B1B1C" />
              </span>
              <span
                className="text-[#BEAD87] text-[10.5px] font-semibold tracking-widest uppercase mb-2"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                Najbrza opcija
              </span>
              <h3
                className="text-white mb-3 font-semibold"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 16,
                  lineHeight: "1.3",
                }}
              >
                Gotovinska isplata
              </h3>
              <p
                className="text-[#B8B8B8] text-[13.5px] leading-relaxed"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                Primite gotovinu odmah na licu mesta, cim zavrshimo proveru. Moguce do 10.000 EUR ekvivalenta u dinarima po transakciji, u skladu sa AML propisima. Nema naknada.
              </p>
            </div>

            <div
              className="bg-white border border-[#F0EDE6] rounded-2xl p-7 flex flex-col"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#1B1B1C] mb-5">
                <Landmark size={18} color="#fff" />
              </span>
              <h3
                className="text-[#1B1B1C] mb-3 font-semibold"
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontSize: 16,
                  lineHeight: "1.3",
                }}
              >
                Bankarski transfer
              </h3>
              <p
                className="text-[#6B6B6B] text-[13.5px] leading-relaxed"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                Za iznose iznad gotovnog limita — šaljemo nalog za prenos istog radnog dana. Uplata na vas racun obično stize u roku od nekoliko sati. Bez naknada za prenos sa naše strane.
              </p>
            </div>
          </div>
        </SectionContainer>
      </section>

      {/* ── Trust ────────────────────────────────────────────────────────────── */}
      <section className="bg-white py-20 border-t border-[#F0EDE6]">
        <SectionContainer>
          <SectionHeading
            eyebrow="Transparentnost"
            title="Zasto nam klijenti veruju"
            description="Svaki aspekt otkupa projektovan je da zaštitimo vas interes — ne samo nas."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TRUST_ITEMS.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="bg-[#F9F9F9] border border-[#F0EDE6] rounded-2xl p-6 sm:p-7 flex gap-5 items-start"
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
                    {title}
                  </h3>
                  <p
                    className="text-[#6B6B6B] text-[13.5px] leading-relaxed"
                    style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                  >
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
      </section>

      {/* ── Dark CTA ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#0D0D0D] py-20 sm:py-24">
        <SectionContainer className="flex flex-col items-start text-left md:items-center md:text-center">
          <span
            className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-6 block"
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          >
            Kontakt
          </span>
          <h2
            className="text-white leading-[1.15] mb-5 max-w-[740px]"
            style={{
              fontFamily: "var(--font-pp-editorial), Georgia, serif",
              fontSize: "clamp(22px, 3.2vw, 42px)",
              fontWeight: 400,
            }}
          >
            <span style={{ fontStyle: "normal" }}>
              Imate zlato koje želite da prodate?{" "}
            </span>
            <span style={{ fontStyle: "italic" }}>
              Pozovite nas — cenu imate za pet minuta.
            </span>
          </h2>
          <p
            className="text-[#9D9072] mb-10 max-w-[560px] text-center"
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontSize: 15,
              lineHeight: "1.6",
            }}
          >
            Bez obaveze, bez pritiska. Samo konkretna cifra u dinarima, bazirana na danasnjoj berzanskoj ceni.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <a
              href="tel:+381612698569"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: "#BEAD87",
                fontFamily: "var(--font-rethink), sans-serif",
                fontSize: 14,
                boxShadow: "0 0 20px rgba(190,173,135,0.3)",
              }}
            >
              <Phone size={15} />
              POZOVITE: 061/269-8569
            </a>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full font-semibold transition-colors hover:bg-white/5"
              style={{
                border: "1.5px solid #BEAD87",
                color: "#BEAD87",
                fontFamily: "var(--font-rethink), sans-serif",
                fontSize: 14,
              }}
            >
              POSALJITE FOTOGRAFIJU
            </Link>
          </div>
        </SectionContainer>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <CategoryFaq
        title="Česta pitanja o otkupu"
        items={FAQ_ITEMS}
        ctaHref="/faq"
        ctaLabel="SVA PITANJA I ODGOVORI"
      />

      {/* ── Final CTA ────────────────────────────────────────────────────────── */}
      <WhatIsGoldSection />
    </main>
  );
}
