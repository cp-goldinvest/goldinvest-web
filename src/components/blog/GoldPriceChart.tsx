export function GoldPriceChart() {
  return (
    <div className="my-8 bg-[#FAF8F2] border border-[#F0EDE6] rounded-2xl px-6 py-7 sm:px-8 sm:py-8 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <p
        className="m-0 mb-5 text-[#1B1B1C]"
        style={{
          fontFamily: "var(--font-pp-editorial), Georgia, serif",
          fontWeight: 400,
          fontSize: "clamp(20px, 2.2vw, 28px)",
          lineHeight: "1.2",
        }}
      >
        Kretanje cene zlata (2023–2025)
      </p>

      <svg viewBox="0 0 700 300" className="w-full h-auto rounded-xl bg-[#FDFCF9]" role="img" aria-label="Kretanje cene zlata 2023 do 2025">
        {/* Grid */}
        <line x1="70" y1="45" x2="660" y2="45" stroke="#F0EDE6" />
        <line x1="70" y1="95" x2="660" y2="95" stroke="#F0EDE6" />
        <line x1="70" y1="145" x2="660" y2="145" stroke="#F0EDE6" />
        <line x1="70" y1="195" x2="660" y2="195" stroke="#F0EDE6" />
        <line x1="70" y1="245" x2="660" y2="245" stroke="#E7E1D4" />

        {/* Axes labels */}
        <text x="24" y="248" fill="#9D9072" fontSize="12" fontFamily="var(--font-rethink), sans-serif">USD/oz</text>
        <text x="90" y="270" fill="#9D9072" fontSize="12" fontFamily="var(--font-rethink), sans-serif">Jan 2023</text>
        <text x="215" y="270" fill="#9D9072" fontSize="12" fontFamily="var(--font-rethink), sans-serif">Apr 2023</text>
        <text x="340" y="270" fill="#9D9072" fontSize="12" fontFamily="var(--font-rethink), sans-serif">Mar 2024</text>
        <text x="470" y="270" fill="#9D9072" fontSize="12" fontFamily="var(--font-rethink), sans-serif">Oct 2024</text>
        <text x="598" y="270" fill="#9D9072" fontSize="12" fontFamily="var(--font-rethink), sans-serif">2025*</text>

        {/* Price line + projection */}
        <polyline
          fill="none"
          stroke="#BF8E41"
          strokeWidth="4"
          strokeLinecap="round"
          points="100,210 230,190 360,170 490,120"
        />
        <line
          x1="490"
          y1="120"
          x2="620"
          y2="90"
          stroke="#BF8E41"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="8 8"
          opacity="0.8"
        />

        {/* Points */}
        <circle cx="100" cy="210" r="5" fill="#BF8E41" />
        <circle cx="230" cy="190" r="5" fill="#BF8E41" />
        <circle cx="360" cy="170" r="5" fill="#BF8E41" />
        <circle cx="490" cy="120" r="5" fill="#BF8E41" />
        <circle cx="620" cy="90" r="5" fill="#BF8E41" opacity="0.85" />
      </svg>

      <p
        className="m-0 mt-4 text-[#6B6B6B]"
        style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 13, lineHeight: "1.6em" }}
      >
        * Projekcija za kraj 2025: ~3.000 USD/oz
      </p>
    </div>
  );
}

