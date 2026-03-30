"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { HeroExpandableParagraphs } from "@/components/home/HeroExpandableParagraphs";
import { GoldHeroBar } from "@/components/home/goldinvest_hero_animation";

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

export function HeroSection({
  eyebrow,
  title = DEFAULT_TITLE,
  paragraphs = DEFAULT_PARAGRAPHS,
  buttons = DEFAULT_BUTTONS,
  collapseExtraParagraphs = false,
}: Props) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section className="relative overflow-hidden bg-[#0D0D0D]">

      <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch min-h-[74svh]">

          {/* ── Left: Text ── */}
          <div className="py-10 lg:py-0 max-w-[560px]">

            {/* Eyebrow */}
            <motion.p
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#BF8E41]"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              {eyebrow ?? "LBMA Sertifikovano · Investiciono Zlato"}
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={reduced ? undefined : { opacity: 0, y: 18 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
              className="text-white leading-[1.1] mb-4"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontSize: "clamp(34px, 4.1vw, 58px)",
              }}
            >
              {title}
            </motion.h1>

            {/* Paragraphs */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 14 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.17, ease: "easeOut" }}
              className="mb-6"
            >
              {collapseExtraParagraphs ? (
                <HeroExpandableParagraphs
                  paragraphs={paragraphs}
                  className="text-white/50 leading-relaxed"
                  style={{ fontSize: "clamp(14px, 1.15vw, 16px)" }}
                />
              ) : (
                <div
                  className="text-white/50 leading-relaxed space-y-3"
                  style={{ fontSize: "clamp(14px, 1.15vw, 16px)" }}
                >
                  {paragraphs}
                </div>
              )}
            </motion.div>

            {/* Brzi linkovi ka kategorijama */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.26, ease: "easeOut" }}
              className="flex flex-wrap gap-3 mb-2"
            >
              {CATEGORY_QUICK_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.04] px-7 py-3.5 text-[14px] font-semibold text-white/90 backdrop-blur transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.26] hover:text-white whitespace-nowrap"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Cube with bar + aligned content ── */}
          <div className="relative hidden lg:flex items-stretch justify-start self-stretch">
            <div
              className="relative flex flex-col w-full max-w-[560px] h-full rounded-[28px] border border-white/[0.10] bg-[#18140C]/55 backdrop-blur-xl overflow-hidden"
            >
              {/* Subtle static “fensi” highlight, no motion */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(191,142,65,0.10) 0%, rgba(255,255,255,0.03) 40%, rgba(0,0,0,0) 70%)",
                }}
              />

              <div className="relative z-10 flex-1 px-6 pt-8 pb-4 grid grid-cols-[1fr_1fr] gap-6">
                {/* Left side: cards + buttons */}
                <div className="flex flex-col">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-2xl border border-white/[0.08] bg-[#0D0D0D]/55 px-5 py-4">
                      <p
                        className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30"
                        style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                      >
                        Sigurnost
                      </p>
                      <p
                        className="text-[13px] font-medium text-white/78"
                        style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                      >
                        Fizičko zlato · Sertifikovano · Otkupljivo
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/[0.08] bg-[#0D0D0D]/55 px-5 py-4">
                      <p
                        className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30"
                        style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                      >
                        Poreklo
                      </p>
                      <p
                        className="text-[13px] font-medium text-white/78"
                        style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                      >
                        LBMA rafinerije · Bez PDV-a
                      </p>
                    </div>
                  </div>

                  {buttons.length >= 2 ? (
                    <div className="mt-4 grid grid-cols-1 gap-3">
                      {/* Pogledaj proizvode */}
                      <Link
                        href={buttons[0].href}
                        className="inline-flex items-center justify-center rounded-full bg-[#BF8E41] px-4 py-3 text-[13px] font-semibold text-[#0C0A06] transition-colors hover:bg-[#D4A04D]"
                        style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                      >
                        {buttons[0].label}
                      </Link>

                      {/* Prati cenu zlata + Spot cena · Live */}
                      <Link
                        href={buttons[1].href}
                        className="inline-flex flex-col items-center justify-center gap-1 rounded-full border border-white/[0.18] bg-white/[0.04] px-4 py-3 text-[13px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/[0.09]"
                        style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.85)]" />
                          <span className="text-[12px] font-medium text-white/65">Spot cena · Live</span>
                        </span>
                        <span className="text-[13px] font-semibold text-white/90">{buttons[1].label}</span>
                      </Link>
                    </div>
                  ) : null}
                </div>

                {/* Right side: poluga */}
                <div className="flex items-start justify-center pt-2">
                  <div className="w-full max-w-[340px] h-[320px]">
                    <GoldHeroBar staticBar />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
