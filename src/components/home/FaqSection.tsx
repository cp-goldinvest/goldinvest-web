import Link from "next/link";
import { FaqAccordion } from "@/components/ui/FaqAccordion";

const FAQS = [
  {
    q: "Da li je zlato osigurano prilikom isporuke?",
    a: "Da, svaka pošiljka je u potpunosti osigurana tokom transporta. Sarađujemo sa renomiranim kurirskim službama koje imaju iskustvo u prevozu vrednih pošiljki. Vrednost osiguranja odgovara trenutnoj tržišnoj vrednosti zlata.",
  },
  {
    q: "Koji su uslovi za čuvanje investicionog zlata?",
    a: "Preporučujemo čuvanje u sertifikovanom sefu - kućnom ili bankarskom. Zlato ne zahteva posebne uslove temperature ili vlažnosti, ali ga treba zaštititi od fizičkih oštećenja i neovlašćenog pristupa. Originalnu ambalažu i certifikat uvek čuvajte uz polugu.",
  },
  {
    q: "Da li mogu prodati zlato koje nije kupljeno kod vas?",
    a: "Da, vršimo otkup investicionog zlata bez obzira na poreklo kupovine, pod uslovom da su poluge ili kovanice od priznatih rafinerija (LBMA standard) i da posedujete originalnu dokumentaciju. Cena otkupa zavisi od trenutne spot cene i stanja proizvoda.",
  },
  {
    q: "Koliko se čeka na isporuku za avansno plaćanje?",
    a: "Isporuka za avansno plaćanje obično traje 7 do 14 radnih dana, u zavisnosti od dostupnosti željene težine i rafinerije. O tačnom roku ćete biti obavešteni pri sklapanju ugovora, a cena je zagarantovana od trenutka uplate avansa.",
  },
  {
    q: "Da li je kupovina investicionog zlata oslobođena PDV-a?",
    a: "Da, investiciono zlato (poluge i kovanice čistoće ≥ 995/1000) je u potpunosti oslobođeno PDV-a u Srbiji i svim zemljama EU. Ovo je jedna od ključnih prednosti zlata kao investicije u poređenju sa srebrom, platinom ili nakitom.",
  },
  {
    q: "Kako funkcioniše avansna kupovina i koja je prednost?",
    a: "Avansnom kupovinom rezervišete zlato po današnjoj ceni uz uplatu dogovorenog procenta, dok ostatak plaćate pri isporuci. Glavna prednost je zaštita od rasta cene - ako cena poraste do isporuke, vi plaćate ugovorenu nižu cenu.",
  },
];

export function FaqSection() {
  return (
    <section
      className="py-20"
      style={{ background: "linear-gradient(180deg, #D4C5A3 0%, #E7E5D9 37%, #EFE7DA 100%)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col items-start text-left md:items-center md:text-center mb-10">
          <span
            className="text-white"
            style={{ fontFamily: "var(--font-rethink), sans-serif", fontWeight: 400, fontSize: 19.01, lineHeight: "30.9px", textShadow: "0 1px 2px rgba(0,0,0,0.12)" }}
          >
            Edukacija
          </span>
          <h2
            style={{ fontFamily: "var(--font-pp-editorial), Georgia, serif", fontWeight: 400, fontStyle: "italic", fontSize: 35, lineHeight: "60px", color: "#1B1B1C" }}
          >
            Česta pitanja
          </h2>
        </div>

        <FaqAccordion items={FAQS} />

        <div className="flex justify-start md:justify-center mt-8">
          <Link
            href="/cesta-pitanja"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "#BEAD87", fontSize: "12.1px", boxShadow: "0px 2.7px 4px rgba(0,0,0,0.1), 0px 6.7px 10px rgba(0,0,0,0.1)" }}
          >
            Pogledaj sva pitanja
          </Link>
        </div>
      </div>
    </section>
  );
}
