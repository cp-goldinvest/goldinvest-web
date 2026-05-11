import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const phone = body.phone?.trim() || null;
  const subject = body.subject?.trim() || null;
  const message = body.message?.trim();

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Unesite ime" }, { status: 400 });
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Unesite ispravnu email adresu" }, { status: 400 });
  }
  if (!message || message.length < 5) {
    return NextResponse.json({ error: "Poruka mora imati bar 5 karaktera" }, { status: 400 });
  }
  if (name.length > 200 || email.length > 254 || message.length > 5000) {
    return NextResponse.json({ error: "Polja su predugačka" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: inserted, error } = await supabase
    .from("contact_messages")
    .insert({ name, email, phone, subject, message })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: "Greška pri slanju poruke. Pokušajte ponovo." }, { status: 500 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const mailFrom = process.env.MAIL_FROM || "Gold Invest <onboarding@resend.dev>";
  const mailTo = process.env.MAIL_TO || "info@goldinvest.rs";

  if (apiKey) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: mailFrom,
        to: mailTo,
        replyTo: email,
        subject: `[Kontakt forma] ${subject || "Novi upit"} — ${name}`,
        html: `
          <h2 style="font-family:sans-serif;margin:0 0 12px">Novi upit sa sajta</h2>
          <table style="font-family:sans-serif;border-collapse:collapse">
            <tr><td style="padding:4px 12px 4px 0;color:#666">Ime:</td><td><strong>${escapeHtml(name)}</strong></td></tr>
            <tr><td style="padding:4px 12px 4px 0;color:#666">Email:</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            ${phone ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Telefon:</td><td><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>` : ""}
            ${subject ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Tema:</td><td>${escapeHtml(subject)}</td></tr>` : ""}
          </table>
          <h3 style="font-family:sans-serif;margin:20px 0 6px">Poruka</h3>
          <div style="font-family:sans-serif;white-space:pre-wrap;border-left:3px solid #BEAD87;padding:8px 14px;color:#222">${escapeHtml(message)}</div>
          <p style="font-family:sans-serif;color:#999;font-size:12px;margin-top:24px">ID: ${inserted.id}</p>
        `,
      });
    } catch (err) {
      console.error("[contact] Resend mail failed:", err);
    }
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
