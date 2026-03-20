"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

type Field = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const SUBJECTS = [
  "Kupovina zlata — upit za cenu",
  "Otkup zlata — procena",
  "Avansna kupovina / rezervacija",
  "Poklon pakovanje",
  "Opste pitanje",
];

const inputClass =
  "w-full bg-white border border-[#E8E3D8] rounded-xl px-4 py-3.5 text-[#1B1B1C] text-[14px] leading-snug outline-none transition-all duration-150 placeholder:text-[#BDBDBD] focus:border-[#BEAD87] focus:ring-2 focus:ring-[#BEAD87]/20";

const labelClass =
  "block text-[#1B1B1C] text-[13px] font-semibold mb-1.5";

export function ContactForm() {
  const [fields, setFields] = useState<Field>({
    name: "",
    email: "",
    phone: "",
    subject: SUBJECTS[0],
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function set(key: keyof Field, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // Placeholder: replace with your API route or email service
    await new Promise((r) => setTimeout(r, 900));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 py-12">
        <span className="w-14 h-14 rounded-2xl bg-[#F0EDE6] flex items-center justify-center">
          <CheckCircle2 size={28} className="text-[#BF8E41]" />
        </span>
        <h3
          className="text-[#1B1B1C]"
          style={{
            fontFamily: "var(--font-pp-editorial), Georgia, serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(22px, 2.5vw, 30px)",
          }}
        >
          Primili smo vašu poruku.
        </h3>
        <p
          className="text-[#6B6B6B] leading-relaxed max-w-[420px]"
          style={{ fontFamily: "var(--font-rethink), sans-serif", fontSize: 15 }}
        >
          Javicemo vam se u toku istog radnog dana. Ako imate hitno pitanje, slobodno nas pozovite direktno na{" "}
          <a
            href="tel:+381612698569"
            className="text-[#BF8E41] font-semibold hover:underline"
          >
            061/269-8569
          </a>
          .
        </p>
        <button
          onClick={() => { setStatus("idle"); setFields({ name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" }); }}
          className="mt-2 text-[13px] text-[#9D9072] hover:text-[#1B1B1C] transition-colors font-medium underline underline-offset-2"
          style={{ fontFamily: "var(--font-rethink), sans-serif" }}
        >
          Posalji novu poruku
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className={labelClass}
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}>
            Ime i prezime <span className="text-[#BF8E41]">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            required
            autoComplete="name"
            placeholder="Marko Markovic"
            value={fields.name}
            onChange={(e) => set("name", e.target.value)}
            className={inputClass}
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className={labelClass}
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}>
            Telefon
          </label>
          <input
            id="cf-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+381 6X XXX XXXX"
            value={fields.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputClass}
            style={{ fontFamily: "var(--font-rethink), sans-serif" }}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-email" className={labelClass}
          style={{ fontFamily: "var(--font-rethink), sans-serif" }}>
          E-mail adresa <span className="text-[#BF8E41]">*</span>
        </label>
        <input
          id="cf-email"
          type="email"
          required
          autoComplete="email"
          placeholder="vas@email.com"
          value={fields.email}
          onChange={(e) => set("email", e.target.value)}
          className={inputClass}
          style={{ fontFamily: "var(--font-rethink), sans-serif" }}
        />
      </div>

      <div>
        <label htmlFor="cf-subject" className={labelClass}
          style={{ fontFamily: "var(--font-rethink), sans-serif" }}>
          Tema upita
        </label>
        <select
          id="cf-subject"
          value={fields.subject}
          onChange={(e) => set("subject", e.target.value)}
          className={inputClass}
          style={{ fontFamily: "var(--font-rethink), sans-serif", cursor: "pointer" }}
        >
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className={labelClass}
          style={{ fontFamily: "var(--font-rethink), sans-serif" }}>
          Poruka <span className="text-[#BF8E41]">*</span>
        </label>
        <textarea
          id="cf-message"
          required
          rows={5}
          placeholder="Opišite šta vas zanima — format, količina, način preuzimanja..."
          value={fields.message}
          onChange={(e) => set("message", e.target.value)}
          className={inputClass}
          style={{ fontFamily: "var(--font-rethink), sans-serif", resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center justify-center gap-2 w-full py-4 rounded-full text-[#1B1B1C] font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-60"
        style={{
          backgroundColor: "#BEAD87",
          fontFamily: "var(--font-rethink), sans-serif",
          fontSize: 14,
          boxShadow: "0px 4px 14px rgba(190,173,135,0.35)",
        }}
      >
        {status === "sending" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Šaljem...
          </>
        ) : (
          "POSALJI PORUKU"
        )}
      </button>

      <p
        className="text-center text-[12px] text-[#BDBDBD] leading-relaxed"
        style={{ fontFamily: "var(--font-rethink), sans-serif" }}
      >
        Odgovaramo u toku istog radnog dana. Podaci se koriste isključivo za odgovor na vas upit.
      </p>
    </form>
  );
}
