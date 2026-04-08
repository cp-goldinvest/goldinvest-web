"use client";

import { useState, FormEvent } from "react";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    // Placeholder - wire to your email service
    await new Promise((r) => setTimeout(r, 800));
    setStatus("sent");
  }

  return (
    <section
      className="py-16 sm:py-20 border-t border-[#F0EDE6]"
      style={{
        background: "linear-gradient(180deg, #D4C5A3 0%, #E7E5D9 37%, #EFE7DA 100%)",
      }}
    >
      <div className="max-w-[640px] mx-auto px-6 text-center">

        {/* Eyebrow */}
        <span
          className="text-[#BF8E41] text-[11px] font-semibold tracking-widest uppercase mb-5 block"
          style={{ fontFamily: "var(--font-rethink), sans-serif" }}
        >
          Ostanite informisani
        </span>

        {/* Headline */}
        <h2
          className="text-[#1B1B1C] leading-[1.15] mb-4"
          style={{
            fontFamily: "var(--font-pp-editorial), Georgia, serif",
            fontWeight: 400,
            fontSize: "clamp(26px, 3vw, 40px)",
          }}
        >
          <span style={{ fontStyle: "normal" }}>Novi članci -</span>{" "}
          <span style={{ fontStyle: "italic" }}>direktno u inbox.</span>
        </h2>

        {/* Subtext */}
        <p
          className="text-[#6B6B6B] leading-relaxed mb-8"
          style={{
            fontFamily: "var(--font-rethink), sans-serif",
            fontSize: 15,
            lineHeight: "1.65em",
          }}
        >
          Jednom mesečno šaljemo pregled novih tekstova, kretanje cene zlata i
          praktične savete. Bez spama - samo sadržaj koji vredi pročitati.
        </p>

        {/* Form / Success */}
        {status === "sent" ? (
          <div className="inline-flex flex-col items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-[#F0EDE6] flex items-center justify-center">
              <CheckCircle2 size={24} className="text-[#BF8E41]" />
            </span>
            <p
              className="text-[#1B1B1C] font-semibold"
              style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 15 }}
            >
              Prijavljeni ste. Vidimo se u inboxu.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto"
          >
            <input
              type="email"
              required
              placeholder="vas@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-[#F9F9F9] border border-[#E8E3D8] rounded-full px-5 py-3.5 text-[#1B1B1C] text-[14px] outline-none transition-all duration-150 placeholder:text-[#BDBDBD] focus:border-[#BEAD87] focus:ring-2 focus:ring-[#BEAD87]/20"
              style={{ fontFamily: "var(--font-rethink), sans-serif" }}
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-[#1B1B1C] font-semibold text-[13.5px] transition-all duration-200 hover:opacity-90 disabled:opacity-60 shrink-0"
              style={{
                backgroundColor: "#BEAD87",
                fontFamily: "var(--font-rethink), sans-serif",
                boxShadow: "0px 4px 14px rgba(190,173,135,0.35)",
              }}
            >
              {status === "sending" ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <>
                  Pretplatite se
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        )}

        {/* Fine print */}
        {status !== "sent" && (
          <p
            className="mt-4 text-[11.5px] text-[#BDBDBD]"
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          >
            Bez spama. Odjava jednim klikom u svakom trenutku.
          </p>
        )}
      </div>
    </section>
  );
}
