import Link from "next/link";
import type { ReactNode } from "react";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InfoCard } from "@/components/ui/InfoCard";

const SPEC_ROWS = [
  { label: "Ukupna težina", small: "3,49 g", large: "13,96 g" },
  { label: "Čisto zlato", small: "3,44 g", large: "13,77 g" },
  { label: "Finoća", small: "986/1000 (23,6 karata)", large: "986/1000 (23,6 karata)" },
  { label: "Prečnik", small: "19,75 mm", large: "39,5 mm" },
  { label: "Godina na kovanici", small: "1915", large: "1915" },
  { label: "Kovnica", small: "Münze Österreich", large: "Münze Österreich" },
  { label: "PDV", small: "Oslobođen", large: "Oslobođen" },
];

const inlineLink = "text-[#BF8E41] underline underline-offset-2 hover:opacity-80";

function CardSection({
  title,
  description,
  background,
  cards,
}: {
  title: string;
  description: string;
  background: "white" | "muted";
  cards: { title: string; body: ReactNode }[];
}) {
  return (
    <section
      className={`${background === "muted" ? "bg-[#F9F9F9]" : "bg-white"} py-16 sm:py-20 border-t border-[#F0EDE6]`}
    >
      <SectionContainer>
        <SectionHeading title={title} description={description} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card) => (
            <InfoCard
              key={card.title}
              title={card.title}
              className={background === "muted" ? "!bg-white" : undefined}
            >
              {card.body}
            </InfoCard>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}

export function FrancJozefSpecs() {
  const cell = "px-3 sm:px-6 py-3.5 text-[13px] sm:text-[13.5px] leading-snug";

  return (
    <section className="bg-[#F9F9F9] py-16 sm:py-20 border-t border-[#F0EDE6]">
      <SectionContainer>
        <SectionHeading
          title="Dukat Franc Jozef - tehničke karakteristike"
          description="Osnovni podaci za mali i veliki dukat na jednom mestu. Veliki dukat sadrži četiri puta više zlata od malog, uz istu finoću."
        />
        <div className="overflow-x-auto rounded-2xl border border-[#F0EDE6] bg-white">
          <table className="w-full text-left">
            <thead className="bg-[#1B1B1C] text-white">
              <tr>
                <th scope="col" className={`${cell} font-semibold`}>Karakteristika</th>
                <th scope="col" className={`${cell} font-semibold`}>Mali dukat</th>
                <th scope="col" className={`${cell} font-semibold`}>Veliki dukat</th>
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((row) => (
                <tr key={row.label} className="border-t border-[#F0EDE6]">
                  <th scope="row" className={`${cell} font-semibold text-[#1B1B1C]`}>{row.label}</th>
                  <td className={`${cell} text-[#6B6B6B]`}>{row.small}</td>
                  <td className={`${cell} text-[#6B6B6B]`}>{row.large}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionContainer>
    </section>
  );
}

export function FrancJozefPriceAndBuyback() {
  return (
    <>
      <CardSection
        background="muted"
        title="Kako se formira cena dukata Franc Jozef"
        description="Cena dukata nije fiksna. Menja se zajedno sa cenom zlata, pa su iznosi u ponudi na vrhu stranice uvek polazna tačka za kupovinu."
        cards={[
          {
            title: "Cena zlata na svetskom tržištu",
            body: "Osnova je aktuelna cena zlata u evrima po unci, preračunata u dinare po gramu. Kada se cena zlata ili kurs promene, menja se i cena dukata.",
          },
          {
            title: "Količina zlata u dukatu",
            body: "Mali dukat sadrži 3,44 g, a veliki 13,77 g čistog zlata. Cena zato pre svega zavisi od toga koliko zlata zaista kupujete.",
          },
          {
            title: "Razlika u odnosu na vrednost zlata",
            body: "Prodajna cena je viša od same vrednosti zlata jer uključuje troškove kovanja, nabavke i prodaje. Po gramu je ta razlika veća kod malog dukata, pa je veliki dukat povoljniji po gramu.",
          },
          {
            title: "Kako da uporedite cene",
            body: "Podelite prodajnu cenu sa količinom čistog zlata i dobićete stvarnu cenu po gramu. Pre kupovine pogledajte i otkupnu cenu, jer ona pokazuje koliko možete dobiti kada dukat budete prodavali.",
          },
        ]}
      />

      <CardSection
        background="white"
        title="Otkup dukata Franc Jozef - koliko vredi vaš dukat"
        description="Aktuelna otkupna cena malog i velikog dukata prikazana je u ponudi na vrhu stranice. Otkupljujemo dukate bez obzira na to gde su kupljeni."
        cards={[
          {
            title: "Kako se određuje otkupna cena",
            body: "Otkupna cena zavisi od cene zlata na dan otkupa, kursa i količine zlata u dukatu, umanjeno za razliku između tržišne i otkupne cene. Zato se menja zajedno sa tržištem.",
          },
          {
            title: "Kako da prodate dukat",
            body: (
              <>
                Pozovite nas ili pošaljite upit sa brojem dukata, podatkom da li su mali ili veliki i
                fotografijom. Prvu procenu radimo na osnovu fotografije i opisa. Ceo postupak je
                opisan na stranici{" "}
                <Link href="/otkup-zlata" className={inlineLink}>otkup zlata</Link>.
              </>
            ),
          },
          {
            title: "Provera i isplata",
            body: "Autentičnost dukata proveravamo na licu mesta, za nekoliko minuta. Isplata je istog dana, gotovinom do zakonskog limita, a veći iznosi se isplaćuju bankarskim transferom.",
          },
          {
            title: "Oštećeni i stari dukati",
            body: "Stanje dukata utiče na procenu. Izbušeni ili oštećeni dukati gube investicioni status, pa se procenjuju pojedinačno. Originalni primerci iz vremena Austrougarske, koji imaju numizmatičku vrednost, takođe se posebno procenjuju.",
          },
        ]}
      />
    </>
  );
}

export function FrancJozefComparisonAndAuthenticity() {
  return (
    <>
      <CardSection
        background="white"
        title="Dukat Franc Jozef ili zlatna poluga?"
        description="Oba oblika su investiciono zlato oslobođeno PDV-a. Izbor zavisi od iznosa koji ulažete i od toga da li kupujete za poklon ili za dugoročnu štednju."
        cards={[
          {
            title: "Kada je bolji izbor dukat",
            body: "Dukat je najbolji izbor za poklon i tradicionalnu porodičnu štednju, jer je prepoznatljiv generacijama. Ako kupite više malih dukata, kasnije možete da prodate samo deo, a ostatak zadržite.",
          },
          {
            title: "Kada je bolji izbor poluga",
            body: (
              <>
                Za veće iznose isplativije su{" "}
                <Link href="/kategorija/zlatne-poluge" className={inlineLink}>zlatne poluge</Link>, koje
                imaju finoću 999,9/1000, nižu cenu po gramu i manju razliku između prodajne i otkupne
                cene. Za manje iznose pogledajte i{" "}
                <Link href="/kategorija/zlatne-plocice" className={inlineLink}>zlatne pločice</Link>.
              </>
            ),
          },
        ]}
      />

      <CardSection
        background="muted"
        title="Kako prepoznati pravi dukat Franc Jozef"
        description="Franc Jozef je toliko popularan da se često i falsifikuje. Nekoliko osnovnih provera može da otkrije sumnjiv dukat, ali nijedna kućna provera ne može sa sigurnošću da potvrdi autentičnost."
        cards={[
          {
            title: "Težina i veličina",
            body: "Mali dukat ima 3,49 g i prečnik 19,75 mm, a veliki 13,96 g i prečnik 39,5 mm. Za proveru je potrebna vaga tačnosti 0,01 g. Veće odstupanje je razlog za oprez.",
          },
          {
            title: "Natpis i godina",
            body: "Na investicionim dukatima koji se danas kuju nalazi se godina 1915. Proverite da li su lik cara, dvoglavi orao i natpisi oštri i pravilni.",
          },
          {
            title: "Magnet",
            body: "Zlato nije magnetno, pa dukat koji privlači magnet nije pravi. Obrnuto ne važi: to što magnet ne privlači dukat ne dokazuje da je on od zlata.",
          },
          {
            title: "Gde da proverite",
            body: (
              <>
                Najsigurnije je kupovati od proverenog prodavca i čuvati račun. Koje provere možete
                sami da uradite i gde su njihove granice, objašnjava tekst{" "}
                <Link href="/blog/kako-prepoznati-lazno-zlato" className={inlineLink}>
                  kako proveriti zlato kod kuće
                </Link>.
              </>
            ),
          },
        ]}
      />
    </>
  );
}
