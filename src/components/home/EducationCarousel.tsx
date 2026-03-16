"use client";

import { useState, useRef } from "react";
import Image from "next/image";

const SLIDES = [
  {
    img: "/images/faktori-3.png",
    title: "Struktura cena (prodajna, avansna, otkupna)",
    text: "Prodajna cena važi za kupovinu sa trenutnim preuzimanjem. Avansna cena je česta riza za određen rok isporuke. Otkupna cena predstavlja garantovani iznos za koji trgovac otkupljuje zlato natrag.",
  },
  {
    img: "/images/bento-gold-bar.png",
    title: "Šta je LBMA sertifikat i zašto je važan?",
    text: "London Bullion Market Association (LBMA) je globalni standard kvaliteta za plemenite metale. Poluge i kovanice sa LBMA sertifikatom garantuju čistoću od minimum 999,9/1000 i prihvaćene su na svim svetskim tržištima.",
  },
  {
    img: "/images/bento-coins.png",
    title: "Zlatnici vs poluge — šta je isplativije?",
    text: "Zlatnici imaju nešto višu premiju zbog troškova kovanja i numizmatičke vrednosti, ali su lakši za preprodaju u manjim iznosima. Poluge su isplativije za veće investicije jer premija po gramu opada sa povećanjem težine.",
  },
  {
    img: "/images/faktori-1.png",
    title: "PDV i poreske olakšice na investiciono zlato",
    text: "Investiciono zlato (poluge i kovanice čistoće ≥ 995/1000) oslobođeno je PDV-a u Srbiji i celoj EU. Ovo ga čini znatno isplativijom investicijom u odnosu na nakit ili industrijske metale koji se oporezuju.",
  },
  {
    img: "/images/faktori-2.png",
    title: "Kako bezbedno čuvati investiciono zlato?",
    text: "Zlato možete čuvati u kućnom sefu, bankarskom sefu ili kod ovlašćenog čuvara vrednosti. Preporučujemo osiguran sef sa certifikatom — fizička posedovost zlata je jedna od ključnih prednosti ove investicije.",
  },
  {
    img: "/images/bento-center-gold.png",
    title: "Kada je pravo vreme za kupovinu zlata?",
    text: "Za dugoročne investitore, vreme kupovine je manje važno od redovnosti ulaganja. Strategija prosečenja troška (DCA) — kupovati redovno manje količine — pokazala se efikasnom u volatilnim tržišnim uslovima.",
  },
  {
    img: "/images/bento-dollars.png",
    title: "Zlato kao zaštita od inflacije",
    text: "Istorijski gledano, zlato čuva kupovnu moć tokom inflatornih perioda. Dok papirni novac gubi vrednost štampanjem, ukupna količina zlata na svetu raste manje od 2% godišnje, što mu čuva vrednost.",
  },
  {
    img: "/images/gold-bar-edu.png",
    title: "Kako funkcioniše otkup zlata?",
    text: "Pri otkupu, cena se određuje na osnovu trenutne spot cene sa odbitkom otkupne marže. LBMA sertifikovane poluge i kovanice uvek postižu bolju otkupnu cenu. Preporučujemo čuvanje originalnog certifikata i ambalaže.",
  },
];

export function EducationCarousel() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const prev = () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setCurrent((c) => (c + 1) % SLIDES.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const slide = SLIDES[current];

  return (
    <section className="bg-[#111111] py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">

        {/* Card + arrows wrapper */}
        <div className="flex items-center gap-4 md:gap-6 md:px-16 lg:px-24">

          {/* Left arrow */}
          <button
            onClick={prev}
            className="hidden md:flex shrink-0 w-11 h-11 items-center justify-center rounded-full text-[#BF8E41] text-2xl border border-[#BF8E41]/40 hover:bg-[#BF8E41]/10 transition-colors"
            aria-label="Prethodni"
          >
            ‹
          </button>

          {/* Single card */}
          <div
            className="bg-[#1A1A1A] rounded-2xl overflow-hidden flex flex-col md:flex-row flex-1 max-w-[900px] mx-auto"
            style={{ minHeight: 440 }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Image */}
            <div className="relative w-full md:w-[380px] shrink-0" style={{ minHeight: 280 }}>
              <Image
                src={slide.img}
                alt={slide.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center flex-1 p-8 md:p-12">
              <span className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-5">
                Edukacija
              </span>
              <h3
                className="mb-6"
                style={{
                  fontFamily: "var(--font-pp-editorial), Georgia, serif",
                  fontSize: 34.22,
                  fontWeight: 400,
                  fontStyle: "italic",
                  lineHeight: "42.78px",
                  letterSpacing: 0,
                  color: "#F7E7CE",
                }}
              >
                {slide.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-rethink), sans-serif",
                  fontWeight: 400,
                  fontSize: 17,
                  lineHeight: "27px",
                  letterSpacing: 0,
                  color: "#C2B280",
                }}
              >
                {slide.text}
              </p>
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            className="hidden md:flex shrink-0 w-11 h-11 items-center justify-center rounded-full text-[#BF8E41] text-2xl border border-[#BF8E41]/40 hover:bg-[#BF8E41]/10 transition-colors"
            aria-label="Sledeći"
          >
            ›
          </button>

        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-[#BF8E41] w-6 h-2"
                  : "bg-white/25 w-2 h-2 hover:bg-white/50"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
