import type { ReactNode } from "react";
import Link from "next/link";
import { HeroExpandableParagraphs } from "@/components/home/HeroExpandableParagraphs";

type HeroButton = { label: string; href: string };

type Props = {
  eyebrow?: string;
  title?: ReactNode;
  paragraphs?: ReactNode[];
  buttons?: HeroButton[];
  /** Početna: prvi pasus uvek vidljiv, ostatak iza „…" */
  collapseExtraParagraphs?: boolean;
};

const DEFAULT_BUTTONS: HeroButton[] = [
  { label: "Pogledaj proizvode", href: "/kategorija/zlatne-poluge" },
  { label: "Prati cenu zlata", href: "/cena-zlata" },
];

const DEFAULT_TITLE = (
  <>
    <span style={{ fontWeight: 400, fontStyle: "normal", whiteSpace: "nowrap" }}>Investiciono zlato,</span>
    <br />
    <span style={{ fontWeight: 400, fontStyle: "normal", whiteSpace: "nowrap" }}>Sigurna budućnost</span>
    <br />
    <span style={{ fontWeight: 400, fontStyle: "normal", whiteSpace: "nowrap" }}>u vašim rukama</span>
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

const CATEGORY_QUICK_LINKS: { label: string; href: string }[] = [
  { label: "Zlatne pločice", href: "/kategorija/zlatne-plocice" },
  { label: "Zlatne poluge", href: "/kategorija/zlatne-poluge" },
  { label: "Dukati", href: "/kategorija/zlatni-dukati" },
];

const HERO_IMAGE = "/images/ispravljena.webp";

export function HeroSection({
  eyebrow,
  title = DEFAULT_TITLE,
  paragraphs = DEFAULT_PARAGRAPHS,
  buttons = DEFAULT_BUTTONS,
  collapseExtraParagraphs = false,
}: Props) {
  return (
    <>
      {/* Preload hint — browser fetches the LCP image at highest priority
          before even parsing the component body */}
      <link rel="preload" href={HERO_IMAGE} as="image" type="image/webp" />

      <section className="relative overflow-hidden bg-[#0D0D0D] pt-6 pb-6">

        {/* LCP background — <img> instead of CSS background-image so the
            preload scanner discovers it in HTML, not after CSS parsing */}
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          decoding="sync"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ pointerEvents: "none", userSelect: "none" }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0D0D0D]/65" aria-hidden="true" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-8">
          <div>

            {/* ── Text ── */}
            <div className="py-8 lg:py-6 flex flex-col lg:h-full">

              {/* Top: eyebrow + title */}
              <div className="max-w-[520px]">
                <p
                  className="hero-anim mb-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#BF8E41]"
                  style={{ fontFamily: "var(--font-rethink), sans-serif", animationDelay: "0s" }}
                >
                  {eyebrow ?? "LBMA Sertifikovano · Investiciono Zlato"}
                </p>

                <h1
                  className="hero-anim text-white leading-[1.1]"
                  style={{
                    fontFamily: "var(--font-pp-editorial), Georgia, serif",
                    fontSize: "clamp(34px, 4.1vw, 58px)",
                    animationDelay: "0.08s",
                  }}
                >
                  {title}
                </h1>
              </div>

              {/* Bottom: paragraph + buttons */}
              <div className="mt-auto max-w-[520px]">
                <div
                  className="hero-anim mb-5 pt-6"
                  style={{ animationDelay: "0.17s" }}
                >
                  {collapseExtraParagraphs ? (
                    <HeroExpandableParagraphs
                      paragraphs={paragraphs}
                      className="text-white leading-relaxed"
                      style={{ fontSize: "clamp(14px, 1.15vw, 16px)" }}
                    />
                  ) : (
                    <div
                      className="text-white leading-relaxed space-y-3"
                      style={{ fontSize: "clamp(14px, 1.15vw, 16px)" }}
                    >
                      {paragraphs}
                    </div>
                  )}
                </div>

                <div
                  className="hero-anim flex gap-2.5"
                  style={{ animationDelay: "0.26s" }}
                >
                  {CATEGORY_QUICK_LINKS.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex-1 inline-flex items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.04] py-3 text-[13px] font-semibold text-white/90 transition-colors duration-200 hover:bg-white/[0.08] hover:border-white/[0.26] hover:text-white"
                      style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
