import Image from "next/image";
import Link from "next/link";

export function WhatIsGoldSection() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: 578, background: "#1B1B1C" }}>

      {/* Background image — 20% opacity */}
      <div className="absolute inset-0" style={{ opacity: 0.2 }}>
        <Image
          src="/images/cta-background.png"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "50% 35%" }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32">

        <h2
          className="mb-6"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(36px, 5vw, 60px)",
            lineHeight: "1em",
            color: "#BEAD87",
            textAlign: "center",
          }}
        >
          Vrednost koja traje.
        </h2>

        <p
          className="mb-10"
          style={{
            fontFamily: "var(--font-rethink), sans-serif",
            fontWeight: 400,
            fontSize: 20,
            lineHeight: "1.4em",
            color: "#E9E6D9",
            textAlign: "center",
            maxWidth: 614,
          }}
        >
          U svetu prolaznih trendova, zlato ostaje. Započnite svoju investiciju
          danas i osigurajte svoju finansijsku budućnost.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* Filled button */}
          <Link
            href="/kategorija/zlatne-poluge"
            className="inline-flex items-center justify-center rounded-full transition-opacity hover:opacity-90"
            style={{
              backgroundColor: "#BEAD87",
              color: "#1B1B1C",
              fontFamily: "var(--font-rethink), sans-serif",
              fontWeight: 700,
              fontSize: 18,
              lineHeight: "1.556em",
              height: 64,
              padding: "0 32px",
              boxShadow: "0px 0px 20px 0px rgba(190, 173, 135, 0.3)",
            }}
          >
            Pogledajte ponudu poluga
          </Link>

          {/* Outline button */}
          <a
            href="tel:+381112345678"
            className="inline-flex items-center justify-center rounded-full transition-colors hover:bg-white/5"
            style={{
              border: "2px solid #BEAD87",
              color: "#BEAD87",
              fontFamily: "var(--font-rethink), sans-serif",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: "1.076em",
              height: 64,
              padding: "0 52px",
            }}
          >
            011/234 5678
          </a>
        </div>
      </div>

    </section>
  );
}
