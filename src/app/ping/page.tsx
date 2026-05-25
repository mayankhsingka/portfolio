"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { PageHeaderNav } from "@/components/PageHeaderNav";
import { NumberPlate } from "@/components/NumberPlate";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { usePageScrollable } from "@/hooks/usePageScrollable";
import { usePersona } from "@/hooks/usePersona";
import { NonDevContactForm, ContactLinks } from "@/components/non-dev/NonDevContactForm";

type Channel = {
  id: string;
  label: string;
  handle: string;
  url: string;
  blurb: string;
  cta: string;
  primary?: boolean;
  external?: boolean;
  icon: React.ReactNode;
};

const PRIMARY: Channel[] = [
  {
    id: "email",
    label: "Email",
    handle: PORTFOLIO_DATA.general.contactEmail,
    url: `mailto:${PORTFOLIO_DATA.general.contactEmail}`,
    blurb: "Best for serious inquiries, opportunities, and collaborations. I read everything.",
    cta: "Compose email",
    primary: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
      </svg>
    ),
  },
  {
    id: "calendly",
    label: "Schedule a call",
    handle: "calendly.com/mayankhsingka",
    url: "https://calendly.com/mayankhsingka",
    blurb: "Book a 30-min slot directly. Best for intros, technical deep-dives, or just to chat.",
    cta: "Pick a time",
    primary: true,
    external: true,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
        <circle cx="12" cy="15" r="2.2"></circle>
      </svg>
    ),
  },
];

const SOCIAL: Channel[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "@mayankhsingka",
    url: PORTFOLIO_DATA.general.linkedinUrl,
    blurb: "Professional network, work history, and recommendations.",
    cta: "Connect",
    external: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    handle: "@mayankhsingka",
    url: PORTFOLIO_DATA.general.githubUrl,
    blurb: "Source code, open-source contributions, and side projects.",
    cta: "Follow",
    external: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
      </svg>
    ),
  },
  {
    id: "twitter",
    label: "X / Twitter",
    handle: "@himmatsingka_m",
    url: "https://x.com/himmatsingka_m",
    blurb: "Daily thoughts on building, systems, and shipping fast.",
    cta: "Follow",
    external: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
      </svg>
    ),
  },
];

const DIRECT: Channel[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    handle: `+91 ${PORTFOLIO_DATA.general.phone}`,
    url: `https://wa.me/91${PORTFOLIO_DATA.general.phone}`,
    blurb: "Quick async messages. Best for short questions.",
    cta: "Open chat",
    external: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    ),
  },
  {
    id: "phone",
    label: "Phone",
    handle: `+91 ${PORTFOLIO_DATA.general.phone}`,
    url: `tel:+91${PORTFOLIO_DATA.general.phone}`,
    blurb: "Direct line. Available IST 10am–10pm.",
    cta: "Call now",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
      </svg>
    ),
  },
];

function ChannelCard({ ch }: { ch: Channel }) {
  const [copied, setCopied] = useState(false);

  const copyHandle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(ch.handle).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <a
      href={ch.url}
      target={ch.external ? "_blank" : undefined}
      rel={ch.external ? "noopener noreferrer" : undefined}
      className={`group relative border-2 border-black bg-[var(--background)] p-5 flex flex-col gap-3 transition-all hover:shadow-[6px_6px_0px_0px_currentColor] hover:-translate-x-0.5 hover:-translate-y-0.5 ${
        ch.primary ? "shadow-[4px_4px_0px_0px_currentColor]" : ""
      }`}
      style={{ minHeight: 168 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-11 h-11 border-2 border-current flex items-center justify-center shrink-0 bg-current text-[var(--background)]">
          {ch.icon}
        </div>
        {ch.primary && (
          <span className="font-mono text-[9px] font-bold uppercase tracking-widest bg-current text-[var(--background)] px-1.5 py-0.5">
            Primary
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight leading-none">
          {ch.label}
        </h3>
        <button
          onClick={copyHandle}
          className="font-mono text-xs opacity-60 hover:opacity-100 transition-opacity text-left w-fit truncate max-w-full"
          title="Click to copy"
        >
          {copied ? "✓ copied" : ch.handle}
        </button>
      </div>

      <p className="text-xs sm:text-sm opacity-70 leading-snug">{ch.blurb}</p>

      <div className="mt-auto pt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest font-bold border-t-2 border-current/20 group-hover:border-current/60 transition-colors">
        <span className="opacity-70 group-hover:opacity-100">{ch.cta}</span>
        <span className="group-hover:translate-x-1 transition-transform">→</span>
      </div>
    </a>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) return;

    // No backend wired yet — open the visitor's mail client with the
    // form contents pre-populated so the transmission still lands in
    // the inbox. We'll swap this for a real /api/contact handler later.
    const subject = encodeURIComponent(`[/ping] Transmission from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nContact: ${contact}\n\nMessage:\n${message}\n\n—\nSent from /ping`,
    );
    window.location.href = `mailto:${PORTFOLIO_DATA.general.contactEmail}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3 border-b-2 border-current pb-2">
        <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest">
          // Send a transmission
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">
          straight to my inbox
        </span>
      </div>

      <form
        onSubmit={submit}
        className="border-2 border-current bg-[var(--background)] p-5 sm:p-6 flex flex-col gap-4 shadow-[6px_6px_0px_0px_currentColor]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
              Name
            </span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="who's hailing"
              className="border-2 border-current bg-transparent px-3 py-3 font-mono text-sm focus:outline-none focus:shadow-[3px_3px_0px_0px_currentColor] focus:-translate-x-[1px] focus:-translate-y-[1px] transition-all placeholder:opacity-30"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
              Email or phone
            </span>
            <input
              type="text"
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="how to reach you back"
              className="border-2 border-current bg-transparent px-3 py-3 font-mono text-sm focus:outline-none focus:shadow-[3px_3px_0px_0px_currentColor] focus:-translate-x-[1px] focus:-translate-y-[1px] transition-all placeholder:opacity-30"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
            Message
          </span>
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder="what's the directive"
            className="border-2 border-current bg-transparent px-3 py-3 font-mono text-sm resize-y focus:outline-none focus:shadow-[3px_3px_0px_0px_currentColor] focus:-translate-x-[1px] focus:-translate-y-[1px] transition-all placeholder:opacity-30"
          />
        </label>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">
            {sent ? "✓ launched — check your mail client" : "opens your email client for now"}
          </span>
          <button
            type="submit"
            className="border-2 border-current bg-current text-[var(--background)] px-6 py-3 font-mono text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_currentColor] hover:shadow-[6px_6px_0px_0px_currentColor] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all"
          >
            Transmit →
          </button>
        </div>
      </form>
    </section>
  );
}

function PingDevView() {
  usePageScrollable();

  return (
    <main className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col">
      {/* Top status bar */}
      <div className="sticky top-0 z-30 bg-[var(--background)] border-b-2 border-current">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <NumberPlate />
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest opacity-50">
              · uplink active
            </span>
          </div>
          <PageHeaderNav theme="light" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 pb-32 flex flex-col gap-10 sm:gap-14">
        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-4"
        >
          <div className="font-mono text-[10px] sm:text-xs uppercase tracking-widest opacity-50">
            // get_in_touch
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.92]">
            Let&apos;s build<br />something.
          </h1>
          <p className="text-base sm:text-lg opacity-75 max-w-2xl leading-relaxed">
            I&apos;m {PORTFOLIO_DATA.general.name.split(" ")[0]} — a {PORTFOLIO_DATA.general.role.toLowerCase()}. Open to roles, freelance, collabs, or just a chat about systems and shipping fast.
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 font-mono text-[10px] sm:text-xs uppercase tracking-widest">
            <div className="border-2 border-current px-3 py-1.5 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-current animate-pulse" /> Avg reply &lt; 24h
            </div>
            <div className="border-2 border-current px-3 py-1.5">Based in India · IST</div>
            <div className="border-2 border-current px-3 py-1.5">Open to remote</div>
          </div>
        </motion.section>

        {/* Contact form — primary CTA, lands in inbox */}
        <ContactForm />

        {/* Primary channels */}
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-current pb-2">
            <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest">
              // Other channels
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">
              email · schedule
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {PRIMARY.map((ch) => (
              <ChannelCard key={ch.id} ch={ch} />
            ))}
          </div>
        </section>

        {/* Social */}
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-current pb-2">
            <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest">
              // Social
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">
              follow / connect
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {SOCIAL.map((ch) => (
              <ChannelCard key={ch.id} ch={ch} />
            ))}
          </div>
        </section>

        {/* Direct */}
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-current pb-2">
            <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest">
              // Direct lines
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">
              urgent only
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {DIRECT.map((ch) => (
              <ChannelCard key={ch.id} ch={ch} />
            ))}
          </div>
        </section>

        {/* Footer note */}
        <section className="border-2 border-current p-5 sm:p-6 bg-current text-[var(--background)]">
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-60 mb-2">
            // currently open to
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
            {["Full-time roles", "Freelance projects", "Founding engineer", "Technical collabs", "Speaking / panels"].map(
              (tag) => (
                <span
                  key={tag}
                  className="border-2 border-[var(--background)] px-2.5 py-1 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold"
                >
                  {tag}
                </span>
              ),
            )}
          </div>
          <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
            Looking for someone to build with? Want a second opinion on architecture? Just want to say hi? Hit any of the channels above — I&apos;ll get back.
          </p>
        </section>
      </div>
    </main>
  );
}

// ─── Non-dev editorial skin ──────────────────────────────────────────────────

const ndEaseOut = [0.16, 1, 0.3, 1] as const;

function PingNonDevView() {
  usePageScrollable();

  return (
    <MotionConfig reducedMotion="user">
    <main
      className="w-full min-h-screen flex flex-col"
      style={{
        background: "var(--color-cream)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-fraunces), Georgia, serif",
      }}
    >
      {/* Slim top bar — back to home */}
      <div
        className="sticky top-0 z-30"
        style={{
          background: "rgba(245,240,230,0.82)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(26,26,26,0.08)",
        }}
      >
        <div className="px-6 md:px-20">
          <div className="max-w-[720px] mx-auto w-full flex items-center justify-between py-3.5">
            <Link href="/" className="nd-link text-[13px] sm:text-[14px]">
              &larr; Mayank Himmatsingka
            </Link>
            <span
              className="text-[11px] tracking-[0.2em] uppercase"
              style={{ opacity: 0.5 }}
            >
              Contact
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-20 pt-16 md:pt-24 pb-24 flex-1">
        <div className="max-w-[720px] mx-auto w-full">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: ndEaseOut }}
          >
            <div
              className="text-[12px] tracking-[0.28em] uppercase mb-5"
              style={{ color: "var(--color-terracotta)" }}
            >
              Get in touch
            </div>
            <h1
              className="leading-[0.98] tracking-[-0.02em]"
              style={{
                fontSize: "clamp(44px, 9vw, 96px)",
                fontWeight: 400,
                fontVariationSettings: '"opsz" 144, "SOFT" 30',
              }}
            >
              Let&apos;s talk.
            </h1>
            <p
              className="mt-7 md:mt-8 text-[19px] md:text-[22px] leading-[1.5] max-w-[560px]"
              style={{ opacity: 0.82 }}
            >
              Roles, freelance, founding-engineer conversations, or just comparing notes
              on building well — I read every message and reply quickly.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: ndEaseOut }}
            className="mt-12 md:mt-16"
          >
            <NonDevContactForm />
          </motion.div>

          {/* Elsewhere */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: ndEaseOut }}
            className="mt-14 md:mt-16 pt-8"
            style={{ borderTop: "1px solid rgba(26,26,26,0.12)" }}
          >
            <div className="text-[12px] tracking-[0.2em] uppercase mb-4" style={{ opacity: 0.5 }}>
              Elsewhere
            </div>
            <ContactLinks />
            <p className="mt-6 text-[14px]" style={{ opacity: 0.5 }}>
              Based in India · IST · usually replies within a day.
            </p>
          </motion.div>
        </div>
      </div>

      <footer
        className="px-6 md:px-20 py-10 text-[12px] tracking-[0.16em] uppercase"
        style={{ opacity: 0.62 }}
      >
        <div className="max-w-[720px] mx-auto w-full flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>&copy; {new Date().getFullYear()} Mayank Himmatsingka</span>
          <span style={{ color: "var(--color-terracotta)" }}>·</span>
          <span>Rourkela, IN</span>
        </div>
      </footer>
    </main>
    </MotionConfig>
  );
}

export default function PingPage() {
  // Default to the editorial view so it server-renders for the primary (non-dev)
  // audience with real content — no blank flash, better SEO. A returning dev
  // visitor briefly sees this before usePersona swaps to the system view, the
  // same way the home page resolves its persona.
  const { persona } = usePersona();
  return persona === "dev" ? <PingDevView /> : <PingNonDevView />;
}
