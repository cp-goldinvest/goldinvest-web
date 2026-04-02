import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";

export const metadata: Metadata = {
  title: "Politika privatnosti | Gold Invest",
  description:
    "Politika privatnosti Gold Invest. Saznajte koje podatke prikupljamo, kako ih koristimo i kako štitimo vašu privatnost.",
  alternates: { canonical: "https://goldinvest.rs/politika-privatnosti" },
  openGraph: {
    title: "Politika privatnosti | Gold Invest",
    description: "Politika privatnosti Gold Invest. Saznajte koje podatke prikupljamo, kako ih koristimo i kako štitimo vašu privatnost.",
    url: "https://goldinvest.rs/politika-privatnosti",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Politika privatnosti", href: "/politika-privatnosti" },
];

const SECTIONS = [
  {
    title: "1. Ko smo mi",
    content: `Gold Invest je specijalizovani diler investicionog zlata registrovan u Republici Srbiji. Ova Politika privatnosti opisuje na koji način prikupljamo, koristimo i čuvamo vaše lične podatke prilikom korišćenja veb sajta goldinvest.rs.

Za sva pitanja u vezi sa zaštitom ličnih podataka možete nas kontaktirati na: info@goldinvest.rs`,
  },
  {
    title: "2. Koji podaci se prikupljaju",
    content: `Prikupljamo isključivo podatke koje nam dobrovoljno dostavite:

— Ime i prezime
— Broj telefona
— E-mail adresa
— Sadržaj poruke (putem kontakt forme)

Ne prikupljamo podatke o platnim karticama niti druge finansijske informacije putem sajta.`,
  },
  {
    title: "3. Svrha obrade podataka",
    content: `Vaše podatke koristimo isključivo za:

— Odgovaranje na vaše upite i realizaciju kupovine
— Dostavu informacija o ceni zlata koje ste zatražili
— Ispunjavanje zakonskih obaveza u skladu sa propisima Republike Srbije (npr. Zakon o sprečavanju pranja novca)

Ne koristimo vaše podatke u marketinške svrhe bez vaše izričite saglasnosti.`,
  },
  {
    title: "4. Pravni osnov obrade",
    content: `Obrada vaših podataka zasniva se na:

— Vašem pristanku (slanje upita putem kontakt forme)
— Izvršenju ugovora (realizacija kupovine)
— Zakonskoj obavezi (anti-pranje novca propisi za transakcije iznad propisanog limita)`,
  },
  {
    title: "5. Čuvanje podataka",
    content: `Vaše podatke čuvamo samo onoliko dugo koliko je neophodno za svrhu zbog koje su prikupljeni, ili koliko zahteva zakon. Podaci vezani za poslovne transakcije čuvaju se 10 godina u skladu sa Zakonom o računovodstvu.

Podatke ne prodajemo, ne iznajmljujemo niti delimo sa trećim stranama, osim u slučajevima kada to zahteva zakon (npr. zahtev nadležnih organa).`,
  },
  {
    title: "6. Vaša prava",
    content: `U skladu sa Zakonom o zaštiti podataka o ličnosti (ZZPL), imate pravo da:

— Zatražite uvid u podatke koje čuvamo o vama
— Zatražite ispravku netačnih podataka
— Zatražite brisanje podataka ("pravo na zaborav")
— Povučete pristanak u bilo kom trenutku
— Podnesete pritužbu Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti

Za ostvarivanje ovih prava pišite nam na: info@goldinvest.rs`,
  },
  {
    title: "7. Kolačići (Cookies)",
    content: `Naš sajt koristi kolačiće radi boljeg korisničkog iskustva i analize poseta. Detaljne informacije o kolačićima koje koristimo i mogućnostima podešavanja nalaze se na stranici Podešavanje kolačića.`,
  },
  {
    title: "8. Bezbednost podataka",
    content: `Primenjujemo tehničke i organizacione mere zaštite kako bismo sprečili neovlašćeni pristup, gubitak ili zloupotrebu vaših podataka. Sajt koristi HTTPS protokol za šifrovanu komunikaciju.`,
  },
  {
    title: "9. Izmene politike",
    content: `Zadržavamo pravo izmene ove Politike privatnosti. O značajnim izmenama obavešćavaćemo vas objavljivanjem ažurirane verzije na Sajtu uz navođenje datuma izmene.`,
  },
  {
    title: "10. Kontakt",
    content: `Gold Invest
E-mail: info@goldinvest.rs
Telefon: 061/426-4129`,
  },
];

export default function PolitikaPrivatnostiPage() {
  return (
    <main className="bg-white">
      <section className="bg-white py-4 border-b border-[#F0EDE6]">
        <SectionContainer>
          <Breadcrumb items={BREADCRUMBS} variant="light" />
        </SectionContainer>
      </section>

      <section className="py-16 sm:py-20">
        <SectionContainer>
          <div className="max-w-[760px] mx-auto">
            <p
              className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              Pravni dokumenti
            </p>
            <h1
              className="text-[#1B1B1C] mb-3"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "clamp(32px, 4vw, 48px)",
                lineHeight: 1.15,
              }}
            >
              Politika privatnosti
            </h1>
            <p
              className="text-[#9D9072] mb-12"
              style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 15 }}
            >
              Poslednja izmena: mart 2025.
            </p>

            <div className="space-y-10">
              {SECTIONS.map((s) => (
                <div key={s.title}>
                  <h2
                    className="text-[#1B1B1C] font-semibold mb-3"
                    style={{
                      fontFamily: "var(--font-rethink), sans-serif",
                      fontSize: 18,
                    }}
                  >
                    {s.title}
                  </h2>
                  <div className="space-y-3">
                    {s.content.split("\n\n").map((para, i) => (
                      <p
                        key={i}
                        className="text-[#4B4B4B] leading-relaxed"
                        style={{
                          fontFamily: "var(--font-rethink), sans-serif",
                          fontSize: 15,
                          whiteSpace: "pre-line",
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-14 pt-8 border-t border-[#F0EDE6] flex flex-col sm:flex-row gap-3 text-sm text-[#9D9072]" style={{ fontFamily: "var(--font-rethink), sans-serif" }}>
              <Link href="/uslovi-koriscenja" className="hover:text-[#BF8E41] transition-colors">
                Uslovi korišćenja →
              </Link>
              <Link href="/podesavanje-kolacica" className="hover:text-[#BF8E41] transition-colors">
                Podešavanje kolačića →
              </Link>
            </div>
          </div>
        </SectionContainer>
      </section>
    </main>
  );
}
