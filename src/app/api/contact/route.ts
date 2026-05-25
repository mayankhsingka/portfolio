import { PORTFOLIO_DATA } from "@/data/portfolio";

// Contact endpoint. Sends via Resend when RESEND_API_KEY is configured;
// otherwise responds with { fallback: true } so the client can degrade to a
// pre-filled mailto. No external SDK — just the Resend REST API over fetch.

export const dynamic = "force-dynamic";

const MAX = { name: 120, email: 160, message: 4000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  company?: unknown; // honeypot — humans never fill this
};

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't learn anything.
  if (clean(body.company, 200)) {
    return Response.json({ ok: true });
  }

  const name = clean(body.name, MAX.name);
  const email = clean(body.email, MAX.email);
  const message = clean(body.message, MAX.message);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please tell me your name.";
  if (!email) errors.email = "An email so I can reply.";
  else if (!EMAIL_RE.test(email)) errors.email = "That email doesn't look right.";
  if (!message) errors.message = "Add a short message.";
  else if (message.length < 10) errors.message = "A little more detail, please.";

  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = PORTFOLIO_DATA.general.contactEmail;
  // Resend's shared sender works without domain setup; override once a domain is verified.
  const from = process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>";

  // Not configured yet — let the client fall back to the visitor's mail app.
  if (!apiKey) {
    return Response.json({ ok: false, fallback: true }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `New message from ${name} — himmatsingka.com`,
        text: `From: ${name} <${email}>\n\n${message}\n\n— sent from the contact form`,
      }),
    });

    if (!res.ok) {
      return Response.json({ ok: false, fallback: true }, { status: 502 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, fallback: true }, { status: 502 });
  }
}
