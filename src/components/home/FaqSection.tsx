"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const FAQS = [
  {
    q: "Da li je zlato osigurano prilikom isporuke?",
    a: "Da, svaka pošiljka je u potpunosti osigurana tokom transporta. Sarađujemo sa renomiranim kurirskim službama koje imaju iskustvo u prevozu vrednih pošiljki. Vrednost osiguranja odgovara trenutnoj tržišnoj vrednosti zlata.",
  },
  {
    q: "Koji su uslovi za čuvanje investicionog zlata?",
    a: "Preporučujemo čuvanje u sertifikovanom sefu — kućnom ili bankarskom. Zlato ne zahteva posebne uslove temperature ili vlažnosti, ali ga treba zaštititi od fizičkih oštećenja i neovlašćenog pristupa. Originalnu ambalažu i certifikat uvek čuvajte uz polugu.",
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
    a: "Avansnom kupovinom rezervišete zlato po današnjoj ceni uz uplatu dogovorenog procenta, dok ostatak plaćate pri isporuci. Glavna prednost je zaštita od rasta cene — ako cena poraste do isporuke, vi plaćate ugovorenu nižu cenu.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      className="py-20"
      style={{
        background: "linear-gradient(180deg, #D4C5A3 0%, #E7E5D9 37%, #EFE7DA 100%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">

        {/* Header */}
        <div className="flex flex-col items-start text-left md:items-center md:text-center mb-10">
          <span
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontWeight: 400,
              fontSize: 19.01,
              lineHeight: "30.9px",
              letterSpacing: 0,
              color: "#C2B280",
            }}
          >
            Edukacija
          </span>
          <h2
            style={{
              fontFamily: "var(--font-pp-editorial), Georgia, serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: 35,
              lineHeight: "60px",
              letterSpacing: 0,
              color: "#1B1B1C",
            }}
          >
            Česta pitanja
          </h2>
        </div>

        {/* FAQ cards */}
        <div className="max-w-[760px] w-full md:mx-auto flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(190,173,135,0.68)" }}
            >
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className="text-[#1B1B1C] pr-6"
                  style={{
                    fontFamily: "var(--font-rethink), sans-serif",
                    fontWeight: 600,
                    fontSize: 18,
                    lineHeight: "28px",
                    letterSpacing: 0,
                  }}
                >
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-[#BEAD87] transition-transform shrink-0 ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-5 border-t border-[#F0EDE6]">
                  <p
                    className="text-[#6B5E3F] leading-relaxed pt-4"
                    style={{ fontSize: 15 }}
                  >
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA — sve FAQ */}
        <div className="flex justify-start md:justify-center mt-8">
          <Link
            href="/faq"
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
