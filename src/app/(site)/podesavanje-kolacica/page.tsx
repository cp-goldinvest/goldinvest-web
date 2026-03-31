import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { SectionContainer } from "@/components/ui/SectionContainer";

export const metadata: Metadata = {
  title: "Podešavanje kolačića | Gold Invest",
  description:
    "Informacije o kolačićima koje koristi Gold Invest sajt — koje vrste kolačića koristimo i kako možete upravljati vašim podešavanjima.",
  alternates: { canonical: "https://goldinvest.rs/podesavanje-kolacica" },
  openGraph: {
    title: "Podešavanje kolačića | Gold Invest",
    description: "Informacije o kolačićima koje koristi Gold Invest sajt — koje vrste kolačića koristimo i kako možete upravljati vašim podešavanjima.",
    url: "https://goldinvest.rs/podesavanje-kolacica",
    siteName: "Gold Invest",
    locale: "sr_RS",
    type: "website",
  },
};

const BREADCRUMBS = [
  { label: "Investiciono zlato", href: "/" },
  { label: "Podešavanje kolačića", href: "/podesavanje-kolacica" },
];

const COOKIE_TYPES = [
  {
    name: "Neophodni kolačići",
    required: true,
    description:
      "Ovi kolačići su neophodni za osnovno funkcionisanje sajta i ne mogu se isključiti. Ne prikupljaju lične podatke i ne prate vaše aktivnosti u marketinške svrhe. Bez ovih kolačića sajt ne može ispravno raditi.",
    examples: "Sesijski kolačić, CSRF zaštita, podešavanja kolačića",
  },
  {
    name: "Analitički kolačići",
    required: false,
    description:
      "Pomažu nam da razumemo kako posetioci koriste sajt — koje stranice su najpopularnije, odakle dolaze korisnici i kako se kreću kroz sajt. Sve informacije su anonimne i koriste se isključivo za poboljšanje korisničkog iskustva.",
    examples: "Google Analytics (anonimizovano)",
  },
  {
    name: "Funkcionalni kolačići",
    required: false,
    description:
      "Omogućavaju sajtu da pamti vaše izbore (npr. jezička podešavanja) i pruža poboljšano, personalizovanije iskustvo. Ne prate aktivnosti na drugim sajtovima.",
    examples: "Pamćenje podešavanja prikaza",
  },
];

const SECTIONS = [
  {
    title: "Šta su kolačići?",
    content: `Kolačići (eng. cookies) su mali tekstualni fajlovi koje veb sajt čuva na vašem uređaju kada ga posetite. Koriste se za pamćenje vaših podešavanja, analizu saobraćaja i poboljšanje korisničkog iskustva.

Kolačići ne mogu pokrenuti programe niti preneti viruse. Jedina informacija koju mogu sadržati je ona koju vi direktno date ili koja je generisana vašim pregledanjem.`,
  },
  {
    title: "Kako upravljati kolačićima",
    content: `Možete kontrolisati i brisati kolačiće kroz podešavanja vašeg pretraživača. Imajte u vidu da onemogućavanje određenih kolačića može uticati na funkcionalnost sajta.

Uputstva za upravljanje kolačićima u popularnim pretraživačima:

— Google Chrome: Podešavanja → Privatnost i bezbednost → Kolačići
— Mozilla Firefox: Podešavanja → Privatnost i bezbednost → Kolačići
— Safari: Podešavanja → Privatnost → Upravljanje podacima veb sajta
— Microsoft Edge: Podešavanja → Kolačići i dozvole sajta`,
  },
  {
    title: "Kolačići trećih strana",
    content: `Naš sajt može koristiti usluge trećih strana (npr. Google Analytics) koje postavljaju sopstvene kolačiće. Ove kompanije imaju sopstvene politike privatnosti na koje nemamo uticaj.

Za više informacija o Google Analytics kolačićima posetite: policies.google.com/privacy`,
  },
  {
    title: "Izmene politike kolačića",
    content: `Zadržavamo pravo izmene ove politike. Svaka izmena biće objavljena na ovoj stranici uz navođenje datuma poslednje izmene.`,
  },
];

export default function PodesavanjeKolacicaPage() {
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
              Podešavanje kolačića
            </h1>
            <p
              className="text-[#9D9072] mb-12"
              style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 15 }}
            >
              Poslednja izmena: mart 2025.
            </p>

            {/* Cookie types */}
            <div className="mb-12 space-y-4">
              <h2
                className="text-[#1B1B1C] font-semibold mb-6"
                style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 18 }}
              >
                Vrste kolačića koje koristimo
              </h2>
              {COOKIE_TYPES.map((ct) => (
                <div
                  key={ct.name}
                  className="border border-[#F0EDE6] rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3
                      className="text-[#1B1B1C] font-semibold"
                      style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 16 }}
                    >
                      {ct.name}
                    </h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        ct.required
                          ? "bg-[#F0EDE6] text-[#9D9072]"
                          : "bg-[#F9F6EF] text-[#BF8E41]"
                      }`}
                      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                    >
                      {ct.required ? "Uvek aktivni" : "Opciono"}
                    </span>
                  </div>
                  <p
                    className="text-[#4B4B4B] leading-relaxed mb-3"
                    style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 14 }}
                  >
                    {ct.description}
                  </p>
                  <p
                    className="text-[#9D9072]"
                    style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 13 }}
                  >
                    Primeri: {ct.examples}
                  </p>
                </div>
              ))}
            </div>

            {/* Additional sections */}
            <div className="space-y-10">
              {SECTIONS.map((s) => (
                <div key={s.title}>
                  <h2
                    className="text-[#1B1B1C] font-semibold mb-3"
                    style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 18 }}
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
              <Link href="/politika-privatnosti" className="hover:text-[#BF8E41] transition-colors">
                Politika privatnosti →
              </Link>
            </div>
          </div>
        </SectionContainer>
      </section>
    </main>
  );
}
