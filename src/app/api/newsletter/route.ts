import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendAdminNotification(email: string, source: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const mailFrom = process.env.MAIL_FROM || "Gold Invest <onboarding@resend.dev>";
  const mailTo = process.env.MAIL_TO || "info@goldinvest.rs";

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: mailFrom,
      to: mailTo,
      subject: `[Newsletter] Nova pretplata — ${email}`,
      html: `
        <h2 style="font-family:sans-serif;margin:0 0 12px">Nova newsletter pretplata</h2>
        <table style="font-family:sans-serif;border-collapse:collapse">
          <tr><td style="padding:4px 12px 4px 0;color:#666">Email:</td><td><strong>${escapeHtml(email)}</strong></td></tr>
          <tr><td style="padding:4px 12px 4px 0;color:#666">Izvor:</td><td>${escapeHtml(source)}</td></tr>
        </table>
      `,
    });
  } catch (err) {
    console.error("[newsletter] Resend mail failed:", err);
  }
}

export async function POST(request: Request) {
  let body: { email?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Neispravan zahtev" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const source = body.source?.trim() || "blog";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Unesite ispravnu email adresu" }, { status: 400 });
  }
  if (email.length > 254) {
    return NextResponse.json({ error: "Email je predugačak" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("id, is_active")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    if (!existing.is_active) {
      await supabase
        .from("newsletter_subscribers")
        .update({ is_active: true, unsubscribed_at: null })
        .eq("id", existing.id);
    }
    return NextResponse.json({ ok: true, alreadySubscribed: true }, { status: 200 });
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, source });

  if (error) {
    return NextResponse.json({ error: "Greška pri prijavi. Pokušajte ponovo." }, { status: 500 });
  }

  await sendAdminNotification(email, source);

  return NextResponse.json({ ok: true }, { status: 201 });
}
