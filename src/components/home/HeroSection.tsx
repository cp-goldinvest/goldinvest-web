import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

type HeroButton = { label: string; href: string };

type Props = {
  eyebrow?: string;
  title?: ReactNode;
  paragraphs?: ReactNode[];
  buttons?: HeroButton[];
};

const DEFAULT_BUTTONS: HeroButton[] = [
  { label: "Zlatne poluge", href: "/kategorija/zlatne-poluge" },
  { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
  { label: "Zlatni dukati", href: "/kategorija/zlatni-dukati" },
];

const DEFAULT_TITLE = (
  <>
    <span style={{ fontWeight: 400, fontStyle: "normal", whiteSpace: "nowrap" }}>Investiciono zlato,</span>
    <br />
    <span style={{ fontWeight: 400, fontStyle: "italic", whiteSpace: "nowrap" }}>Sigurna budućnost</span>
    <br />
    <span style={{ fontWeight: 400, fontStyle: "italic", whiteSpace: "nowrap" }}>u vašim rukama</span>
  </>
);

const DEFAULT_PARAGRAPHS: ReactNode[] = [
  <p key="p1">
    U svetu prolaznih trendova, zlato ostaje. Gold Invest vam pruža priliku da sačuvate i uvećate svoju imovinu
    kroz najpouzdaniji oblik ulaganja u istoriji.
  </p>,
  <p key="p2">
    Nudimo LBMA sertifikovane zlatne poluge, pločice i prepoznatljive dukate, uz mogućnost trenutne kupovine,
    povoljnije avansne ponude i sigurnog otkupa.
  </p>,
];

export function HeroSection({ eyebrow, title = DEFAULT_TITLE, paragraphs = DEFAULT_PARAGRAPHS, buttons = DEFAULT_BUTTONS }: Props) {
  const buttonClassName =
    "inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:bg-[#1B1B1C] hover:text-white whitespace-nowrap shrink-0";

  return (
    <section
      className="overflow-hidden"
      style={{ background: "linear-gradient(138.26deg, #BAA77F 1.38%, #E7E5D9 60.02%, #EFE7DA 97.1%)" }}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-16 lg:px-24">

        {/* Desktop: grid — tekst fiksna širina, slika uzima ostatak bez guranja */}
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(380px,440px)_1fr] sm:items-center sm:gap-10 lg:gap-14 sm:h-[581px]">

          {/* ── Text block ── */}
          <div className="pt-14 pb-8 sm:py-0">
            {eyebrow && (
              <span
                className="text-[#BF8E41] text-xs font-semibold tracking-widest uppercase mb-5 block"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                {eyebrow}
              </span>
            )}
            <h1
              className="text-[#1B1B1C] leading-[1.13] mb-5"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontSize: "clamp(32px, 4.2vw, 58px)",
              }}
            >
              {title}
            </h1>

            <div
              className="text-[#3A3A3A] mb-8 leading-relaxed space-y-3"
              style={{ fontSize: "clamp(14px, 1.2vw, 17px)", maxWidth: 440 }}
            >
              {paragraphs}
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-nowrap overflow-x-auto scrollbar-hide">
              {buttons.map((btn) => {
                const sharedStyle = { border: "0.5px solid #1B1B1C", fontSize: "clamp(11px, 2.5vw, 12.1px)" };
                if (btn.href.startsWith("/")) {
                  return (
                    <Link key={btn.href} href={btn.href} className={buttonClassName} style={sharedStyle}>
                      {btn.label}
                    </Link>
                  );
                }

                return (
                  <a key={btn.href} href={btn.href} className={buttonClassName} style={sharedStyle}>
                    {btn.label}
                  </a>
                );
              })}
            </div>
          </div>

          {/* ── Gold bar image ── */}
          <div className="w-full flex justify-end sm:min-w-0">
            <Image
              src="/images/jastuk-poluga.png"
              alt="Zlatna poluga 1kg sa motivima Srbije na plavom baršunastom jastuku — investiciono zlato"
              width={772}
              height={473}
              className="w-full h-auto sm:ml-auto"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  );
}
