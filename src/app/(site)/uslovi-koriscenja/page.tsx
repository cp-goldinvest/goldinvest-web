import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";

export const metadata: Metadata = {
  title: "Uslovi korišćenja | Gold Invest",
  description:
    "Uslovi korišćenja veb sajta Gold Invest. Pročitajte pravila korišćenja, ograničenja odgovornosti i uslove kupovine investicionog zlata.",
  alternates: { canonical: "https://goldinvest.rs/uslovi-koriscenja" },
  openGraph: {
    title: "Uslovi korišćenja | Gold Invest",
    description: "Uslovi korišćenja veb sajta Gold Invest. Pročitajte pravila korišćenja, ograničenja odgovornosti i uslove kupovine investicionog zlata.",
    url: "https://goldinvest.rs/uslovi-koriscenja",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Uslovi korišćenja", href: "/uslovi-koriscenja" },
];

const SECTIONS = [
  {
    title: "1. Opšte odredbe",
    content: `Korišćenjem veb sajta goldinvest.rs (u daljem tekstu: „Sajt") prihvatate ove Uslove korišćenja u celosti. Ukoliko se ne slažete sa bilo kojim delom ovih uslova, molimo vas da prestanete sa korišćenjem Sajta.

Sajt je vlasništvo i u upravljanju kompanije Gold Invest, registrovane u Republici Srbiji. Zadržavamo pravo izmene ovih Uslova u bilo kom trenutku, bez prethodnog obaveštenja. Izmenjeni uslovi stupaju na snagu objavljivanjem na Sajtu.`,
  },
  {
    title: "2. Svrha Sajta",
    content: `Sajt pruža informacije o investicionom zlatu — zlatnim polugama, pločicama i dukatima — koje Gold Invest nudi u prodaji. Sadržaj Sajta ima isključivo informativni karakter i ne predstavlja finansijski savet, investicionu preporuku niti poziv na ulaganje.

Cene prikazane na Sajtu su orijentacione i ažuriraju se prema kretanju cene zlata na svetskim berzama. Konačna cena se dogovara u trenutku realizacije kupovine.`,
  },
  {
    title: "3. Kupovina i plaćanje",
    content: `Kupovina zlatnih proizvoda vrši se putem direktnog kontakta sa Gold Invest timom — telefonom, e-mailom ili posredstvom kontakt forme na Sajtu. Sajt ne vrši automatsku obradu porudžbina niti naplaćivanje putem interneta.

Prihvatamo sledeće načine plaćanja: gotovina, bankarski transfer i pouzećem. Plaćanje platnim karticama trenutno nije dostupno. Za transakcije iznad zakonskog limita za gotovinsko plaćanje (10.000 EUR), kupovina se realizuje isključivo bankovnim transferom u skladu sa Zakonom o sprečavanju pranja novca.`,
  },
  {
    title: "4. Tačnost informacija",
    content: `Nastojimo da sve informacije na Sajtu budu tačne i ažurne, ali ne garantujemo njihovu potpunost ni preciznost. Cene zlata su podložne tržišnim fluktuacijama i mogu se promeniti između pregleda Sajta i realizacije kupovine.

Gold Invest ne snosi odgovornost za eventualne greške u prikazanim cenama, gramažama ili opisima proizvoda. Sve informacije trebate potvrditi direktno sa našim timom pre donošenja investicione odluke.`,
  },
  {
    title: "5. Intelektualna svojina",
    content: `Sav sadržaj Sajta — tekstovi, fotografije, grafički elementi, logotipi i dizajn — zaštićeni su autorskim pravima i vlasništvo su Gold Invest. Zabranjena je reprodukcija, distribucija ili komercijalna upotreba sadržaja bez pisane saglasnosti.

Dozvoljeno je deljenje linkova ka Sajtu uz navođenje izvora.`,
  },
  {
    title: "6. Ograničenje odgovornosti",
    content: `Gold Invest ne snosi odgovornost za bilo kakvu direktnu, indirektnu ili posledičnu štetu nastalu korišćenjem Sajta ili informacija sa njega. Ulaganje u fizičko zlato nosi tržišni rizik — vrednost zlata može rasti i padati.

Veze ka spoljnim sajtovima ne podrazumevaju našu preporuku ili odgovornost za njihov sadržaj.`,
  },
  {
    title: "7. Merodavno pravo",
    content: `Ovi Uslovi tumače se i primenjuju u skladu sa zakonima Republike Srbije. Za sve sporove nadležan je stvarno nadležni sud u Beogradu.`,
  },
  {
    title: "8. Kontakt",
    content: `Za pitanja u vezi sa ovim Uslovima možete nas kontaktirati:

E-mail: info@goldinvest.rs
Telefon: 061/269-8569`,
  },
];

export default function UsloviKoriscenjaPage() {
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
              Uslovi korišćenja
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
              <Link href="/politika-privatnosti" className="hover:text-[#BF8E41] transition-colors">
                Politika privatnosti →
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
