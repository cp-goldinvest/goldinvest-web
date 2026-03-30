import type { ReactNode } from "react";
import Link from "next/link";
import { HeroExpandableParagraphs } from "@/components/home/HeroExpandableParagraphs";
import { GoldHeroBar } from "@/components/home/goldinvest_hero_animation";

type HeroButton = { label: string; href: string };

type Props = {
  eyebrow?: string;
  title?: ReactNode;
  paragraphs?: ReactNode[];
  buttons?: HeroButton[];
  /** Početna: prvi pasus uvek vidljiv, ostatak iza „…“ */
  collapseExtraParagraphs?: boolean;
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

export function HeroSection({
  eyebrow,
  title = DEFAULT_TITLE,
  paragraphs = DEFAULT_PARAGRAPHS,
  buttons = DEFAULT_BUTTONS,
  collapseExtraParagraphs = false,
}: Props) {
  const buttonClassName =
    "inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:bg-[#1B1B1C] hover:text-white whitespace-nowrap shrink-0";

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "#E0DCCC" }}
    >
      {/* Hero illustration (SVG) — samo desna „kolona“, centrirano u tom prostoru (ne uz ivicu) */}
      <div className="pointer-events-none absolute left-0 right-0 bottom-0 top-[52%] sm:inset-y-0 sm:left-[30%] lg:left-[32%] flex items-center sm:items-center justify-center px-6 sm:px-10 lg:px-14">
        <div className="h-full w-full max-h-full max-w-[62%] sm:max-w-none translate-x-3 sm:translate-x-4 lg:translate-x-5">
          <GoldHeroBar imageSrc={`/images/${encodeURIComponent("image 62.svg")}`} />
        </div>
      </div>

      {/* Text readability (left-only), keeps gold bar side clean */}
      <div
        aria-hidden="true"
        className="hidden sm:block absolute inset-y-0 left-0 w-[68%] max-w-[840px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(224,220,204,0.72) 0%, rgba(224,220,204,0.58) 42%, rgba(224,220,204,0.22) 72%, rgba(224,220,204,0) 100%)",
        }}
      />

      {/* (Removed) top seam overlay – caused visible cut lines */}

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-16 lg:px-24">

        {/* Desktop: tekst levo, animacija desno */}
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(380px,440px)_1fr] sm:items-center sm:gap-10 lg:gap-14 min-h-[820px] sm:min-h-0 sm:h-[581px]">

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
                textShadow: "0 2px 18px rgba(255,255,255,0.42), 0 1px 2px rgba(0,0,0,0.10)",
              }}
            >
              {title}
            </h1>

            {collapseExtraParagraphs ? (
              <HeroExpandableParagraphs
                paragraphs={paragraphs}
                className="text-[#3A3A3A] mb-8 leading-relaxed max-w-[26ch] lg:max-w-[440px]"
                style={{
                  fontSize: "clamp(14px, 1.2vw, 17px)",
                  textShadow: "0 1px 12px rgba(255,255,255,0.34), 0 1px 2px rgba(0,0,0,0.08)",
                }}
              />
            ) : (
              <div
                className="text-[#3A3A3A] mb-8 leading-relaxed space-y-3 max-w-[26ch] lg:max-w-[440px]"
                style={{
                  fontSize: "clamp(14px, 1.2vw, 17px)",
                  textShadow: "0 1px 12px rgba(255,255,255,0.34), 0 1px 2px rgba(0,0,0,0.08)",
                }}
              >
                {paragraphs}
              </div>
            )}

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

          {/* Spacer column to preserve layout */}
          <div className="hidden sm:block" aria-hidden="true" />

        </div>
      </div>
    </section>
  );
}
