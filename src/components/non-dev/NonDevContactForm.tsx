"use client";

import { useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";

const easeOut = [0.16, 1, 0.3, 1] as const;

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "submitting" | "success" | "fallback" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildMailto(name: string, email: string, message: string) {
  const subject = encodeURIComponent(`Hello from ${name || "your site"}`);
  const body = encodeURIComponent(`${message}\n\n— ${name}${email ? ` (${email})` : ""}`);
  return `mailto:${PORTFOLIO_DATA.general.contactEmail}?subject=${subject}&body=${body}`;
}

/**
 * Editorial contact form. Posts to /api/contact and, if the backend isn't
 * configured (or fails), gracefully opens the visitor's mail client so the
 * message still gets through. Cream/serif styling for the non-dev surface.
 */
export function NonDevContactForm() {
  const uid = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const validate = (): FieldErrors => {
    const e: FieldErrors = {};
    if (!name.trim()) e.name = "Your name, please.";
    if (!email.trim()) e.email = "An email so I can reply.";
    else if (!EMAIL_RE.test(email.trim())) e.email = "That email doesn't look right.";
    if (!message.trim()) e.message = "Add a short message.";
    else if (message.trim().length < 10) e.message = "A little more detail, please.";
    return e;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, company }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }
      if (data.errors) {
        setErrors(data.errors as FieldErrors);
        setStatus("idle");
        return;
      }
      // Backend not configured or upstream failed — hand off to the mail client.
      window.location.href = buildMailto(name, email, message);
      setStatus("fallback");
    } catch {
      window.location.href = buildMailto(name, email, message);
      setStatus("fallback");
    }
  };

  const fieldStyle: React.CSSProperties = {
    fontFamily: "var(--font-fraunces), Georgia, serif",
    color: "var(--color-ink)",
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="py-10"
        aria-live="polite"
      >
        <div
          className="text-[11px] tracking-[0.28em] uppercase mb-4"
          style={{ color: "var(--color-terracotta)" }}
        >
          Message sent
        </div>
        <p className="text-[22px] md:text-[26px] leading-[1.4]" style={{ opacity: 0.85 }}>
          Thank you — it&apos;s on its way. I&apos;ll reply to{" "}
          <span style={{ color: "var(--color-terracotta)" }}>{email}</span> soon.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-7">
      {status === "fallback" && (
        <p
          className="text-[14px] leading-relaxed"
          style={{ opacity: 0.7 }}
          aria-live="polite"
        >
          Opening your email app with the message ready to send. If nothing happens,
          write to{" "}
          <a className="nd-link" href={`mailto:${PORTFOLIO_DATA.general.contactEmail}`}>
            {PORTFOLIO_DATA.general.contactEmail}
          </a>
          .
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
        <Field
          id={`${uid}-name`}
          label="Name"
          value={name}
          onChange={(v) => setName(v)}
          placeholder="Your name"
          autoComplete="name"
          error={errors.name}
          style={fieldStyle}
        />
        <Field
          id={`${uid}-email`}
          label="Email"
          type="email"
          inputMode="email"
          value={email}
          onChange={(v) => setEmail(v)}
          placeholder="you@company.com"
          autoComplete="email"
          error={errors.email}
          style={fieldStyle}
        />
      </div>

      {/* Honeypot — visually hidden, ignored by humans */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input
          id={`${uid}-company`}
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor={`${uid}-message`}
          className="text-[12px] tracking-[0.18em] uppercase"
          style={{ opacity: 0.6 }}
        >
          Message
        </label>
        <textarea
          id={`${uid}-message`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder="What would you like to build, ask, or talk about?"
          aria-invalid={!!errors.message}
          className="nd-input resize-y bg-transparent text-[18px] md:text-[20px] leading-[1.5] pb-2"
          style={fieldStyle}
        />
        {errors.message && <FieldError>{errors.message}</FieldError>}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="group inline-flex items-center gap-3 px-7 py-3.5 text-[15px] tracking-wide transition-colors disabled:opacity-60"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            background: "var(--color-ink)",
            color: "var(--color-cream)",
          }}
        >
          <span>{status === "submitting" ? "Sending…" : "Send message"}</span>
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </button>
        <span className="text-[13px]" style={{ opacity: 0.5 }}>
          or email{" "}
          <a className="nd-link" href={`mailto:${PORTFOLIO_DATA.general.contactEmail}`}>
            {PORTFOLIO_DATA.general.contactEmail}
          </a>
        </span>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  error,
  style,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "email" | "text" | "tel";
  autoComplete?: string;
  error?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[12px] tracking-[0.18em] uppercase"
        style={{ opacity: 0.6 }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        aria-invalid={!!error}
        onChange={(e) => onChange(e.target.value)}
        className="nd-input bg-transparent text-[18px] md:text-[20px] pb-2"
        style={style}
      />
      <AnimatePresence>{error && <FieldError>{error}</FieldError>}</AnimatePresence>
    </div>
  );
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="text-[13px]"
      style={{ color: "var(--color-terracotta)" }}
    >
      {children}
    </motion.span>
  );
}

// ─── Quick links, shared between the home contact section and /ping ──────────

type Link = { label: string; href: string; external?: boolean };

// Only surface the résumé when an URL is explicitly configured. resume.pdf is
// gitignored, so linking "/resume.pdf" blindly would 404 in production.
const RESUME_URL = process.env.NEXT_PUBLIC_RESUME_URL;

export const CONTACT_LINKS: Link[] = [
  { label: "Email", href: `mailto:${PORTFOLIO_DATA.general.contactEmail}` },
  { label: "Book a call", href: "https://calendly.com/mayankhsingka", external: true },
  { label: "LinkedIn", href: PORTFOLIO_DATA.general.linkedinUrl, external: true },
  { label: "X / Twitter", href: "https://x.com/himmatsingka_m", external: true },
  { label: "GitHub", href: PORTFOLIO_DATA.general.githubUrl, external: true },
  ...(RESUME_URL ? [{ label: "Résumé", href: RESUME_URL, external: true }] : []),
];

export function ContactLinks() {
  return (
    <div className="flex flex-wrap gap-x-7 gap-y-3 text-[16px] md:text-[17px]">
      {CONTACT_LINKS.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.external ? "_blank" : undefined}
          rel={l.external ? "noopener noreferrer" : undefined}
          className="nd-link py-1"
        >
          {l.label}
        </a>
      ))}
    </div>
  );
}
