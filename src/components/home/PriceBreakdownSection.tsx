import Image from "next/image";

const FACTORS = [
  {
    img: "/images/faktori-inflacija.webp",
    title: "Inflacija i štampanje novca",
    text: "Kada papirni novac (dolar, evro, dinar) gubi kupovnu moć, investitori masovno povlače kapital u zlato kako bi sačuvali vrednost, što mu automatski diže cenu.",
  },
  {
    img: "/images/faktori-krize.webp",
    title: "Geopolitičke i ekonomske krize",
    text: "Ratovi, pandemije i krahovi berzi stvaraju paniku. Zlato je istorijski 'sigurna luka' - kada vrednost akcija i nekretnina pada, potražnja za zlatom skače.",
  },
  {
    img: "/images/faktori-centralne-banke.webp",
    title: "Aktivnosti Centralnih banaka",
    text: "Kada velike svetske ekonomije počnu masovno da kupuju zlatne poluge za svoje državne rezerve, smanjuju količinu dostupnog zlata na tržištu, što direktno gura cenu na gore.",
  },
  {
    img: "/images/faktori-kamatne-stope.webp",
    title: "Kamatne stope",
    text: "Kada američka (FED) ili evropska (ECB) centralna banka snižavaju kamatne stope, novac u bankama donosi manji prinos, pa veliki investitori prebacuju sredstva u zlato.",
  },
];

export function PriceBreakdownSection() {
  return (
    <>
    <section className="bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">

        {/* Heading - centered */}
        <div className="text-left md:text-center mb-12 py-4">
          <h2
            className="text-[#1B1B1C] mb-4"
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontWeight: 500,
              fontSize: 30,
              lineHeight: "27px",
              letterSpacing: "-1px",
            }}
          >
            Koji faktori realno podižu cenu zlata?
          </h2>
          <p
            className="max-w-[520px] md:mx-auto md:text-center"
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontWeight: 400,
              fontSize: 17,
              lineHeight: "22px",
              letterSpacing: 0,
              color: "#9D9072",
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            Cena zlata na berzi raste u situacijama kada poverenje u
            tradicionalni finansijski sistem opada.
          </p>
        </div>

        {/* 4 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FACTORS.map((f) => (
            <div key={f.title} className="flex flex-col">
              {/* Image */}
              <div className="relative w-full rounded-2xl overflow-hidden mb-4" style={{ height: 280 }}>
                <Image
                  src={f.img}
                  alt={f.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <p className="text-[#1B1B1C] text-[14px] font-semibold mb-2 leading-snug">
                {f.title}
              </p>
              <p className="text-[#6B6B6B] text-[13px] leading-relaxed">
                {f.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>

    {/* Od čega se sastoji cena? */}
    <section className="bg-white py-20 border-t border-[#F0EDE6]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8">

        {/* Heading */}
        <div className="text-left md:text-center mb-12">
          <span className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-4 block">
            Investicija
          </span>
          <h2
            className="text-[#1B1B1C]"
            style={{
              fontFamily: "var(--font-rethink), sans-serif",
              fontWeight: 500,
              fontSize: 30,
              lineHeight: "27px",
              letterSpacing: "-1px",
            }}
          >
            Od čega se sastoji cena?
          </h2>
        </div>

        {/* 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[780px] mx-auto">

          {/* Spot cena */}
          <div className="bg-[#F9F9F9] rounded-2xl p-8 flex flex-col gap-3" style={{ minHeight: 285 }}>
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#BF8E41" }}
            >
              Berzanska osnova
            </span>
            <h3
              className="text-[#1B1B1C]"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontSize: "clamp(22px, 2.5vw, 32px)",
                fontWeight: 400,
              }}
            >
              Spot cena
            </h3>
            <p className="text-[#6B6B6B] text-[14px] leading-relaxed flex-1 min-h-0">
              Ovo je trenutna vrednost čistog zlata na globalnom tržištu. Menja
              se iz minuta u minut, a diktiraju je najveće svetske berze (LBMA u
              Londonu i COMEX u Njujorku).
            </p>
          </div>

          {/* Premija */}
          <div className="bg-[#F9F9F9] rounded-2xl p-8 flex flex-col gap-3" style={{ minHeight: 285 }}>
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#BF8E41" }}
            >
              Troškovi proizvodnje
            </span>
            <h3
              className="text-[#1B1B1C]"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontSize: "clamp(22px, 2.5vw, 32px)",
                fontWeight: 400,
              }}
            >
              Premija
            </h3>
            <p className="text-[#6B6B6B] text-[14px] leading-relaxed mt-auto">
              Na spot cenu se uvek dodaje premija. Ona pokriva troškove kovanja,
              sertifikacije, sigurnosnog pakovanja, transporta i marže trgovca.
              Zlatno pravilo - što je poluga teža (npr. 100g ili 1kg), premija po
              gramu je znatno manja, pa je i vaša investicija isplatljivija.
            </p>
          </div>

        </div>
      </div>
    </section>
    </>
  );
}
