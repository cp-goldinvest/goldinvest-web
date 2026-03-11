import Image from "next/image";
import Link from "next/link";

const BUTTONS = [
  { label: "Zlatne poluge",  href: "/kategorija/zlatne-poluge"  },
  { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
  { label: "Zlatni dukati",  href: "/kategorija/zlatni-dukati"  },
];

export function HeroSection() {
  return (
    <section className="bg-[#0D0D0D] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-16 lg:px-24">

        {/* Desktop: side by side | Mobile: stacked */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:gap-20 lg:gap-28 sm:h-[581px]">

          {/* ── Text block ── */}
          <div className="flex-1 max-w-[620px] pt-14 pb-8 sm:py-0">
            <h1
              className="text-[#BEAD87] leading-[1.13] mb-5"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "clamp(32px, 4.2vw, 58px)",
                fontWeight: 400,
              }}
            >
              Investiciono zlato,
              <br />
              <em>Sigurna budućnost</em>
              <br />
              <em>u vašim rukama</em>
            </h1>

            <p
              className="text-[#BEAD87] mb-8 leading-relaxed"
              style={{ fontSize: "clamp(14px, 1.2vw, 17px)", maxWidth: 440 }}
            >
              U svetu prolaznih trendova, zlato ostaje. Gold Invest vam pruža
              priiliku da sačuvate i uvećate svoju imovinu kroz najpouzdaniji
              oblik ulaganja u istoriji.
            </p>

            <div className="flex items-center gap-3 flex-wrap">
              {BUTTONS.map((btn) => (
                <Link
                  key={btn.label}
                  href={btn.href}
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-[#BEAD87] font-semibold transition-all duration-200 hover:bg-[#BEAD87] hover:text-[#1B1B1C]"
                  style={{ border: "0.5px solid #BEAD87", fontSize: "12.1px" }}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ── Gold bar image ── */}
          {/* Desktop: fixed size right column */}
          {/* Mobile: full-width, shorter, image bottom-aligned */}
          <div className="relative shrink-0 sm:w-[360px] sm:h-[520px] w-full h-[260px]">
            <Image
              src="/images/hero-gold.png"
              alt="Zlatna poluga — investiciono zlato"
              fill
              className="object-cover object-top sm:object-center"
              priority
            />
            {/* Mobile: fade top edge into background */}
            <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0D0D0D] to-transparent sm:hidden" />
          </div>

        </div>
      </div>
    </section>
  );
}
