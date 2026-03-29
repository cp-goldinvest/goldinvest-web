"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

type Props = {
  src?: string;
  backSrc?: string;
  alt: string;
  className?: string;
  /** degrees; keep small because this is a 2D SVG asset */
  rotateYDeg?: number;
  /** seconds per full loop */
  durationSec?: number;
};

export function GoldBarAnimation({
  src = "/images/Image.svg",
  alt,
  className = "w-full h-auto",
  rotateYDeg = 12,
  durationSec = 8,
}: Props) {
  const reduceMotion = useReducedMotion();

  const shineStyle: CSSProperties = {
    background:
      "linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 44%, rgba(255,255,255,0.40) 50%, rgba(255,255,255,0) 56%, rgba(255,255,255,0) 100%)",
    opacity: 0.30,
    maskImage: "url('/images/Image.svg')",
    WebkitMaskImage: "url('/images/Image.svg')",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskPosition: "center",
    WebkitMaskPosition: "center",
    pointerEvents: "none",
  };

  return (
    <div className={className} style={{ perspective: 1800, position: "relative" }}>
      <motion.div
        style={{ transformStyle: "preserve-3d", width: "100%" }}
        initial={{ rotateY: 0 }}
        animate={
          reduceMotion
            ? { rotateY: 0 }
            : {
                rotateY: [0, -rotateYDeg, 0],
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: durationSec,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        {/* Samo front face: rotacija mala (da ostaje "ova strana sa zgradom" vidljiva) */}
        <div className="relative w-full">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto object-contain object-bottom block"
            style={{ maxHeight: "min(480px, 78vh)", maxWidth: "100%" }}
            draggable={false}
          />

          {!reduceMotion && (
            <motion.div
              aria-hidden
              className="absolute inset-0"
              style={shineStyle}
              animate={{ x: ["-35%", "35%"] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

