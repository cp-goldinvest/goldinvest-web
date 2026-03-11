import Image from "next/image";

export function GoldTypesSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">

        {/* Section heading */}
        <h2
          className="text-[#1B1B1C] mb-8 leading-tight"
          style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700 }}
        >
          Šta je investiciono zlato?
        </h2>

        {/*
          Desktop bento grid — 3 cols × 4 rows:
          ┌──────────────┬──────────────────┬────────────────────┐
          │  text-forms  │  center-gold     │  kovanice-text     │
          ├──────────────┤  (spans 3 rows)  ├────────────────────┤
          │  pdv-card    │                  │  gold-bar-img      │
          ├──────────────┤                  ├────────────────────┤
          │  poluge-text │                  │  coins-img         │
          ├──────────────┴──────────────────┼────────────────────┤
          │  dollars-img (2 cols)           │  svrha-text        │
          └─────────────────────────────────┴────────────────────┘
        */}
        <div
          className="hidden md:grid gap-6"
          style={{
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateAreas: `
              "text-forms   center-gold   kovanice"
              "pdv          center-gold   kovanice"
              "pdv          center-gold   kovanice"
              "dollars      dollars       dollars"
            `,
          }}
        >

          {/* ── text-forms + group image ───────────────── */}
          <div
            className="bg-[#F9F9F9] rounded-2xl overflow-hidden flex flex-col"
            style={{ gridArea: "text-forms", minHeight: 180 }}
          >
            <div className="p-7 pb-4">
              <p className="text-[#3A3A3A] text-[15px] leading-relaxed">
                Investiciono zlato se najčešće javlja u dva osnovna oblika: kao
                zlatne poluge (manje zlatne pločice) i kao zlatni dukati
                (kovanice).
              </p>
            </div>
            <div className="flex-1 relative min-h-[200px] overflow-hidden">
              <Image
                src="/images/bento-center-gold.png"
                alt="Zlatna poluga, pločica i dukat"
                fill
                className="object-cover scale-[1.1]"
                style={{ objectPosition: "40% 34%" }}
              />
            </div>
          </div>

          {/* ── center-gold (spans 3 rows) — slika + tekst ── */}
          <div
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ gridArea: "center-gold" }}
          >
            {/* Slika — gornja polovina */}
            <div className="relative bg-[#F9F9F9]" style={{ minHeight: 340, flex: "1 1 auto" }}>
              <Image
                src="/images/bento-gold-bar.png"
                alt="1g Switzerland Fine Gold poluga"
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Tekst — donja polovina */}
            <div className="bg-[#F9F9F9] p-7">
              <p className="text-[#3A3A3A] text-[14px] leading-relaxed">
                Pravilo za poluge i pločice — moraju imati ekstremnu čistoću od minimum{" "}
                <span className="font-semibold text-[#1B1B1C]">995/1000 (23,88 karata)</span>. Na svakoj mora biti jasno utisnut naziv proizvođača, tačna težina i jedinstveni serijski broj.
              </p>
            </div>
          </div>

          {/* ── kovanice (tekst + slika novčica, 3 reda) ──── */}
          <div
            className="bg-[#0D0D0D] rounded-2xl p-7 flex flex-col gap-5"
            style={{ gridArea: "kovanice" }}
          >
            <p className="text-[#E8E4D9] text-[15px] leading-relaxed">
              Pravilo za kovanice (dukate) — minimalna čistoća mora biti
              900/1000 (21,6 karata). Uz to, moraju biti iskovani nakon
              1800. godine, a njihova prodajna cena ne sme da prelazi
              vrednost samog zlata za više od 80%.
            </p>
            {/* Slika cela vidljiva, naslonjena na dno (kompenzujemo p-7 padding) */}
            <div className="flex-1 flex items-end justify-center -mb-7">
              <Image
                src="/images/bento-coins.png"
                alt="Zlatni dukat — Franc Jozef"
                width={280}
                height={280}
                className="object-contain w-full max-w-[85%]"
              />
            </div>
          </div>

          {/* ── pdv card ───────────────────────────────── */}
          <div
            className="bg-[#E9E6D9] rounded-2xl p-7 flex flex-col justify-end"
            style={{ gridArea: "pdv", minHeight: 180 }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center mb-5"
              style={{ background: "rgba(194,178,128,0.22)" }}
            >
              <svg width="17" height="13" viewBox="0 0 17 13" fill="none">
                <path d="M1.5 6.5L6 11L15.5 1.5" stroke="#BF8E41" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[#1B1B1C] text-[17px] font-semibold leading-snug">
              U potpunosti je oslobođen plaćanja PDV-a.
            </p>
          </div>

          {/* ── bottom card: slika levo + tekst desno ──── */}
          <div
            className="bg-[#F9F9F9] rounded-2xl flex overflow-hidden"
            style={{ gridArea: "dollars", minHeight: 260 }}
          >
            {/* Levo — slika sa marginama */}
            <div className="relative w-1/2 shrink-0 p-5">
              <div className="relative w-full h-full rounded-xl overflow-hidden min-h-[220px]">
                <Image
                  src="/images/bento-dollars.png"
                  alt="Papirni novac vs zlatna vrednost"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Desno — tekst */}
            <div className="flex-1 flex items-end p-7 pl-4">
              <p className="text-[#3A3A3A] text-[15px] leading-relaxed">
                Osnovna svrha investicionog zlata je{" "}
                <span className="font-bold text-[#1B1B1C]">ZAŠTITA</span>{" "}
                kupovne moći vašeg novca. Kroz istoriju, papirni novac (fiat
                valute) je kontinuirano gubio na vrednosti usled inflacije,
                štampanja novca i ekonomskih kriza, dok je zlato dokazalo svoju
                sposobnost da zadrži, a često i drastično uveća, svoju realnu
                vrednost.
              </p>
            </div>
          </div>

        </div>

        {/* ── Mobile stacked ──────────────────────────────────── */}
        <div className="flex md:hidden flex-col gap-4">

          {/* Uvod + slika */}
          <div className="bg-[#F9F9F9] rounded-2xl overflow-hidden flex flex-col">
            <div className="p-6 pb-3">
              <p className="text-[#3A3A3A] text-[15px] leading-relaxed">
                Investiciono zlato se najčešće javlja u dva osnovna oblika: kao zlatne poluge (manje zlatne pločice) i kao zlatni dukati (kovanice).
              </p>
            </div>
            <div className="relative w-full h-[200px] overflow-hidden">
              <Image src="/images/bento-center-gold.png" alt="Zlatne poluge i dukati" fill className="object-cover scale-[1.1]" style={{ objectPosition: "50% 28%" }} />
            </div>
          </div>

          {/* PDV */}
          <div className="bg-[#E9E6D9] rounded-2xl p-6 flex flex-col justify-end min-h-[120px]">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mb-3" style={{ background: "rgba(194,178,128,0.22)" }}>
              <svg width="15" height="11" viewBox="0 0 17 13" fill="none">
                <path d="M1.5 6.5L6 11L15.5 1.5" stroke="#BF8E41" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-[#1B1B1C] text-[17px] font-semibold leading-snug">U potpunosti je oslobođen plaćanja PDV-a.</p>
          </div>

          {/* Poluge — slika + tekst */}
          <div className="bg-[#F9F9F9] rounded-2xl overflow-hidden flex flex-col">
            <div className="relative" style={{ height: 160 }}>
              <Image src="/images/bento-gold-bar.png" alt="1g Switzerland Fine Gold" fill className="object-cover object-top" />
            </div>
            <div className="bg-[#F9F9F9] p-6">
              <p className="text-[#3A3A3A] text-[14px] leading-relaxed">
                Pravilo za poluge i pločice — moraju imati ekstremnu čistoću od minimum{" "}
                <span className="font-semibold text-[#1B1B1C]">995/1000 (23,88 karata)</span>. Na svakoj mora biti jasno utisnut naziv proizvođača, tačna težina i jedinstveni serijski broj.
              </p>
            </div>
          </div>

          {/* Kovanice — tekst + slika */}
          <div className="bg-[#0D0D0D] rounded-2xl overflow-hidden flex flex-col" style={{ paddingTop: 24, paddingLeft: 24, paddingRight: 24 }}>
            <p className="text-[#E8E4D9] text-[15px] leading-relaxed mb-4">
              Pravilo za kovanice (dukate) — minimalna čistoća mora biti 900/1000 (21,6 karata). Uz to, moraju biti iskovani nakon 1800. godine, a njihova prodajna cena ne sme da prelazi vrednost samog zlata za više od 80%.
            </p>
            <div className="flex justify-center items-end -mx-6">
              <Image src="/images/bento-coins.png" alt="Zlatni dukat" width={260} height={180} className="object-contain object-bottom" />
            </div>
          </div>

          {/* Svrha — slika + tekst */}
          <div className="bg-[#F9F9F9] rounded-2xl overflow-hidden flex flex-col">
            <div className="relative w-full h-[200px]">
              <Image src="/images/bento-dollars.png" alt="Papirni novac vs zlato" fill className="object-cover" />
            </div>
            <div className="p-6">
              <p className="text-[#3A3A3A] text-[14px] leading-relaxed">
                Osnovna svrha investicionog zlata je{" "}
                <span className="font-bold text-[#1B1B1C]">ZAŠTITA</span> kupovne moći vašeg novca. Kroz istoriju, papirni novac je kontinuirano gubio na vrednosti, dok je zlato dokazalo svoju sposobnost da zadrži, a često i uveća, svoju realnu vrednost.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
