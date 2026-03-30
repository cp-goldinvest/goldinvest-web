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
    <section className="relative overflow-hidden bg-[#0C0A06]">

      {/* Radial gold glow behind the bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 65% at 78% 48%, rgba(191,142,65,0.14) 0%, transparent 68%), " +
            "radial-gradient(ellipse 35% 45% at 18% 22%, rgba(191,142,65,0.05) 0%, transparent 60%)",
        }}
      />

      {/* Subtle dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.032]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-14 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center min-h-[88svh]">

          {/* ── Left: Text ── */}
          <div className="py-20 lg:py-0 max-w-[500px]">

            {/* Eyebrow */}
            <motion.p
              initial={reduced ? undefined : { opacity: 0, y: 10 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#BF8E41]"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            >
              {eyebrow ?? "LBMA Sertifikovano · Investiciono Zlato"}
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={reduced ? undefined : { opacity: 0, y: 18 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
              className="text-white leading-[1.1] mb-6"
              style={{
                fontFamily: "var(--font-pp-editorial), Georgia, serif",
                fontSize: "clamp(36px, 4.6vw, 64px)",
              }}
            >
              {title}
            </motion.h1>

            {/* Paragraphs */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 14 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.17, ease: "easeOut" }}
              className="mb-8"
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
              className="flex flex-wrap gap-2 mb-10"
            >
              {CATEGORY_QUICK_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.05] px-4 py-2 text-[12px] font-semibold text-white/80 backdrop-blur transition-all duration-200 hover:bg-white/[0.1] hover:border-white/[0.22] hover:text-white"
                  style={{ fontFamily: "var(--font-rethink), sans-serif" }}
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.34, ease: "easeOut" }}
              className="flex items-center gap-3 flex-wrap"
            >
              {buttons.map((btn, i) => {
                const isFirst = i === 0;
                const sharedStyle = { fontFamily: "var(--font-rethink), sans-serif" };
                const sharedClass = isFirst
                  ? "inline-flex items-center justify-center rounded-full bg-[#BF8E41] px-6 py-3 text-[13px] font-semibold text-[#0C0A06] transition-all duration-200 hover:bg-[#D4A04D] hover:-translate-y-0.5"
                  : "inline-flex items-center justify-center rounded-full border border-white/[0.18] bg-white/[0.04] px-6 py-3 text-[13px] font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/[0.09] hover:-translate-y-0.5";
                if (btn.href.startsWith("/")) {
                  return <Link key={btn.href} href={btn.href} className={sharedClass} style={sharedStyle}>{btn.label}</Link>;
                }
                return <a key={btn.href} href={btn.href} className={sharedClass} style={sharedStyle}>{btn.label}</a>;
              })}
            </motion.div>
          </div>

          {/* ── Right: Gold bar + floating credential cards ── */}
          <div className="relative hidden lg:flex items-center justify-center self-stretch">

            {/* Gold bar — centered in this column */}
            <div className="relative h-[500px] w-full max-w-[400px]">
              <GoldHeroBar />
            </div>

            {/* Floating card: SIGURNOST (top-left of bar) */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0, x: -22 }}
              animate={reduced ? undefined : { opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.65, ease: "easeOut" }}
              className="absolute left-0 top-[22%] rounded-2xl border border-white/[0.08] bg-[#18140C]/85 px-5 py-4 backdrop-blur-xl"
            >
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
            </motion.div>

            {/* Floating card: POREKLO (mid-right) */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0, x: 22 }}
              animate={reduced ? undefined : { opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.65, ease: "easeOut" }}
              className="absolute right-0 top-[42%] rounded-2xl border border-white/[0.08] bg-[#18140C]/85 px-5 py-4 backdrop-blur-xl"
            >
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
            </motion.div>

            {/* Floating pill: Spot cena · Live (bottom) */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0, y: 16 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.65, ease: "easeOut" }}
              className="absolute bottom-[14%] left-[8%] flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-[#18140C]/85 px-4 py-2.5 backdrop-blur-xl"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.85)]" />
              <span
                className="text-[12px] font-medium text-white/65"
                style={{ fontFamily: "var(--font-rethink), sans-serif" }}
              >
                Spot cena · Live
              </span>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
