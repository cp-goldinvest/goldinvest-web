"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck, BadgeEuro, Clock3 } from "lucide-react";

/**
 * GoldInvest Hero Animation
 *
 * How to use:
 * 1) Save this file as something like: src/components/home/GoldHeroAnimated.tsx
 * 2) Replace imageSrc with your exported gold bar image path
 * 3) Render <GoldHeroAnimated imageSrc="/images/hero/beograd-bar.png" />
 * 4) Optional: tweak title/subtitle and badges below
 */

export default function GoldHeroAnimated({
  imageSrc = "/images/Image 62.svg",
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#07111B] text-white">
      <AnimatedBackground reduced={!!prefersReducedMotion} />

      <div className="relative mx-auto grid min-h-[88svh] w-full max-w-7xl items-center gap-12 px-6 py-20 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium tracking-[0.18em] text-white/75 uppercase backdrop-blur"
          >
            Spot cena zlata u realnom vremenu
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.75)]" />
          </motion.div>

          <motion.h1
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: "easeOut" }}
            className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Investiciono zlato.
            <span className="block bg-gradient-to-r from-[#F6E27A] via-[#D7B650] to-[#FFF3B0] bg-clip-text text-transparent">
              Sigurnost koja ima težinu.
            </span>
          </motion.h1>

          <motion.p
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: "easeOut" }}
            className="mt-6 max-w-xl text-base leading-7 text-white/70 sm:text-lg"
          >
            Kupovina investicionog zlata uz jasno prikazane prodajne, avansne i otkupne cene.
            Pouzdani proizvođači, profesionalan pristup i iskustvo lokalnog tržišta.
          </motion.p>

          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a
              href="/kategorija/zlatne-poluge"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#D7B650] px-5 py-3 text-sm font-semibold text-[#07111B] transition hover:-translate-y-0.5"
            >
              Istraži proizvode
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="/cena-zlata"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/8"
            >
              Pogledaj cenu zlata
            </a>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease: "easeOut" }}
            className="mt-10 grid gap-3 sm:grid-cols-3"
          >
            <TrustCard icon={<ShieldCheck className="h-4 w-4" />} label="LBMA rafinerije" />
            <TrustCard icon={<BadgeEuro className="h-4 w-4" />} label="Bez PDV-a" />
            <TrustCard icon={<Clock3 className="h-4 w-4" />} label="Brza isporuka" />
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center justify-center lg:justify-end">
          <AnimatedBar imageSrc={imageSrc} reduced={!!prefersReducedMotion} />
        </div>
      </div>
    </section>
  );
}

// Named export used inside existing HeroSection layout.
// Renders only the animated bar (no headings/text), so it can replace the static SVG.
export function GoldHeroBar({ imageSrc = "/images/Image 62.svg" }) {
  const prefersReducedMotion = useReducedMotion();
  return <AnimatedBar imageSrc={imageSrc} reduced={!!prefersReducedMotion} />;
}

function TrustCard({ icon, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2 text-sm font-medium text-white/90">
        <span className="text-[#E5C86E]">{icon}</span>
        <span>{label}</span>
      </div>
    </div>
  );
}

function AnimatedBar({ imageSrc, reduced }) {
  return (
    <div className="relative h-full w-full">
      {/* Pozadinski glow – vezan za ceo frame, ne menja centriranje poluge */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C8A93C]/18 blur-3xl"
          animate={reduced ? undefined : { scale: [1, 1.035, 1], opacity: [0.75, 1, 0.75] }}
          transition={reduced ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[10%] top-[18%] h-32 w-32 rounded-full bg-white/8 blur-3xl"
          animate={reduced ? undefined : { scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
          transition={reduced ? undefined : { duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Unutrašnji okvir koji se centrira kao i statična slika */}
      <motion.div
        initial={reduced ? undefined : { opacity: 0, scale: 0.97, y: 18 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.12 }}
        className="relative h-full w-full max-h-full max-w-full"
        style={{ perspective: 1600 }}
      >
        <motion.div
          animate={
            reduced
              ? undefined
              : {
                  y: [0, -10, 0],
                  rotateZ: [0, -1.1, 0.6, 0],
                  rotateY: [0, -7, 7, 0],
                  rotateX: [1, -1.8, 1],
                }
          }
          transition={
            reduced
              ? undefined
              : {
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
          className="relative h-full w-full will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            src={imageSrc}
            alt="GoldInvest investiciona poluga"
            className="pointer-events-none absolute inset-0 m-auto max-h-full max-w-full object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.55)] select-none"
          />

          <motion.div
            animate={
              reduced
                ? undefined
                : {
                    x: ["-25%", "130%"],
                  }
            }
            transition={
              reduced
                ? undefined
                : {
                    duration: 2.3,
                    repeat: Infinity,
                    repeatDelay: 1.4,
                    ease: "easeInOut",
                  }
            }
            className="pointer-events-none absolute inset-y-[18%] left-[10%] w-[22%] skew-x-[-22deg] rounded-full bg-gradient-to-r from-transparent via-white/60 to-transparent blur-[14px] mix-blend-screen"
          />

          {/* Drugi, sporiji sweep (subtilnije) za “bogatiji” sjaj */}
          <motion.div
            animate={
              reduced
                ? undefined
                : {
                    x: ["-35%", "140%"],
                    opacity: [0.12, 0.22, 0.12],
                  }
            }
            transition={
              reduced
                ? undefined
                : {
                    duration: 4.2,
                    repeat: Infinity,
                    repeatDelay: 0.9,
                    ease: "easeInOut",
                  }
            }
            className="pointer-events-none absolute inset-y-[28%] left-[8%] w-[16%] skew-x-[-22deg] rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[10px] mix-blend-screen"
          />
        </motion.div>

        <motion.div
          animate={reduced ? undefined : { opacity: [0.14, 0.5, 0.14], scale: [0.97, 1.04, 0.97] }}
          transition={reduced ? undefined : { duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[10%] left-1/2 -z-10 h-11 w-[48%] -translate-x-1/2 rounded-full bg-black/75 blur-2xl"
        />
      </motion.div>
    </div>
  );
}

function AnimatedBackground({ reduced }) {
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(215,182,80,0.14),transparent_20%),radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.06),transparent_18%),linear-gradient(180deg,#07111B_0%,#091623_50%,#07111B_100%)]" />

      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:72px_72px]" />

      <motion.div
        animate={reduced ? undefined : { opacity: [0.16, 0.26, 0.16] }}
        transition={reduced ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_75%_40%,rgba(255,230,160,0.10),transparent_24%)]"
      />
    </>
  );
}
