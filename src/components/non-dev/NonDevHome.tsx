"use client";

import { motion, MotionConfig } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { isProjectNode } from "@/data/types";
import { useEffect, useState, type ReactNode, type CSSProperties } from "react";
import { NonDevContactForm, ContactLinks } from "@/components/non-dev/NonDevContactForm";

// ─────────────────────────────────────────────────────────────────
// Copy lives here so it's easy to edit in one place. These read in a
// neutral, honest voice based on real data — swap for your own voice
// whenever you like; nothing here is fabricated beyond phrasing.
// ─────────────────────────────────────────────────────────────────

const HERO_BODY = [
  "I build software, and I study buildings.",
  "I grew up between the two, and I'm still figuring out how they teach each other.",
];

const BIO_BODY = `Twenty, based in Rourkela, India. I'm a software engineer building production systems — Manasya, a counseling platform for students across India, and Producive, a browser tool for reclaiming focus. I think a lot about how the discipline of architecture, which I've been a student of since I could walk, shapes how I write code.`;

const CURRENTLY = `Building production systems as a software engineer, and drawn to companies where craft is non-negotiable. Based in Rourkela and open to working with teams anywhere — always up for talking to founders and operators making things that last.`;

// Punchy metrics surfaced under each project name in Selected Work.
const PROJECT_HIGHLIGHTS: Record<string, string> = {
  manasya: "50+ students  ·  20+ counselors  ·  0 incidents since launch",
  producive: "1,208 focus hours reclaimed  ·  4,821 intercepts  ·  Manifest V3",
};

const easeOut = [0.16, 1, 0.3, 1] as const;

// Reveal-on-scroll wrapper — once, gentle, respects reduced motion via framer.
function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: easeOut }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// Project preview image. Stays invisible until the file actually loads, so an
// unset/missing image never shows a broken icon or reserves an empty box.
function ProjectMedia({ src, alt }: { src?: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (!src || failed) return null;

  return (
    <div
      className="mt-5 md:mt-6 overflow-hidden"
      style={{
        display: loaded ? "block" : "none",
        border: "1px solid rgba(26,26,26,0.1)",
        background: "var(--color-cream-deep)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- user-supplied preview, self-hides on error */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className="block w-full transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        style={{ aspectRatio: "16 / 10", objectFit: "cover" }}
      />
    </div>
  );
}

// Section eyebrow — a real <h2> for a11y/SEO, styled as a quiet label.
function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-baseline gap-4 mb-9 md:mb-10">
      <h2
        className="text-[13px] tracking-[0.2em] uppercase m-0"
        style={{ opacity: 0.6, fontWeight: 400 }}
      >
        {children}
      </h2>
      <span className="flex-1 h-px" style={{ background: "rgba(26,26,26,0.18)" }} />
    </div>
  );
}

export default function NonDevHome() {
  const { nodes } = PORTFOLIO_DATA;
  const projects = nodes.filter(isProjectNode).slice(0, 3);

  // Sticky top bar appears once you scroll past the hero.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 220);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
    <main
      className="min-h-screen w-full"
      style={{
        background: "var(--color-cream)",
        color: "var(--color-ink)",
        fontFamily: "var(--font-fraunces), Georgia, serif",
      }}
    >
      {/* ─────────────────────── STICKY BAR ─────────────────────── */}
      <motion.header
        initial={false}
        animate={{ opacity: scrolled ? 1 : 0, y: scrolled ? 0 : -10 }}
        transition={{ duration: 0.3, ease: easeOut }}
        className="fixed top-0 inset-x-0 z-[60]"
        style={{
          pointerEvents: scrolled ? "auto" : "none",
          background: scrolled ? "rgba(245,240,230,0.82)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(26,26,26,0.08)" : "1px solid transparent",
        }}
      >
        <div className="px-6 md:px-20">
          <div className="max-w-[720px] mx-auto w-full flex items-center justify-between py-3.5">
            <a href="#top" className="flex items-center gap-2 text-[13px] sm:text-[14px] tracking-tight">
              Mayank Himmatsingka
              <span
                className="inline-block w-[6px] h-[6px] rounded-full"
                style={{ background: "var(--color-terracotta)" }}
              />
            </a>
            <a href="#contact" className="nd-link text-[13px] sm:text-[14px]">
              Get in touch
            </a>
          </div>
        </div>
      </motion.header>

      {/* ─────────────────────── HERO ─────────────────────── */}
      <section
        id="top"
        className="min-h-[92vh] flex flex-col justify-center px-6 md:px-20"
        style={{ paddingTop: "12vh", paddingBottom: "8vh" }}
      >
        <div className="max-w-[720px] mx-auto w-full">
          {/* Art-directed portrait — real headshot inside an editorial frame. */}
          <motion.div
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: easeOut }}
            className="mb-10 md:mb-16"
          >
            <div
              className="relative overflow-hidden"
              style={{
                width: "min(300px, 62vw)",
                aspectRatio: "4/5",
                background: "var(--color-cream-deep)",
                border: "1px solid rgba(26,26,26,0.12)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- single hero asset, sized via fixed-aspect frame; next/image fill adds no value here */}
              <img
                src="/profile.jpg"
                alt="Portrait of Mayank Himmatsingka"
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-center"
                style={{ filter: "grayscale(0.12) contrast(1.02)" }}
              />

              {/* Readability scrim so the corner labels stay legible over the photo */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(26,26,26,0.28) 0%, transparent 28%, transparent 72%, rgba(26,26,26,0.34) 100%)",
                }}
              />

              <div
                className="absolute top-5 left-5 right-5 flex items-center justify-between"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "10px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "var(--color-cream)",
                }}
              >
                <span style={{ color: "var(--color-terracotta-soft)" }}>Portrait</span>
                <span style={{ opacity: 0.7 }}>No. 01</span>
              </div>

              <div
                className="absolute bottom-5 left-5 right-5 flex items-center justify-between"
                style={{
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--color-cream)",
                  opacity: 0.85,
                }}
              >
                <span>M.H · MMXXVI</span>
                <span
                  style={{
                    display: "inline-block",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "var(--color-terracotta-soft)",
                  }}
                />
              </div>

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, transparent 55%, rgba(184,83,58,0.06) 100%)",
                  mixBlendMode: "multiply",
                }}
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: easeOut }}
            className="leading-[0.95] tracking-[-0.03em]"
            style={{
              fontSize: "clamp(40px, 10.5vw, 128px)",
              fontWeight: 400,
              fontVariationSettings: '"opsz" 144, "SOFT" 30',
            }}
          >
            Mayank
            <br />
            Himmatsingka
            <span
              className="inline-block ml-3 align-top"
              style={{
                width: "clamp(8px, 1.4vw, 10px)",
                height: "clamp(8px, 1.4vw, 10px)",
                borderRadius: "50%",
                background: "var(--color-terracotta)",
                marginTop: "clamp(16px, 4vw, 50px)",
              }}
            />
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: easeOut }}
            className="mt-9 md:mt-12 max-w-[560px]"
          >
            {HERO_BODY.map((line, i) => (
              <p
                key={i}
                className="text-[18px] md:text-[22px] leading-[1.55]"
                style={{ opacity: 0.82, marginTop: i === 0 ? 0 : "0.4em" }}
              >
                {line}
              </p>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-9 md:mt-11 flex flex-wrap items-center gap-x-7 gap-y-3"
          >
            <a href="#contact" className="nd-link text-[16px] md:text-[17px]">
              Get in touch &darr;
            </a>
            <span
              className="text-[13px] tracking-[0.18em] uppercase"
              style={{ color: "var(--color-terracotta)" }}
            >
              Rourkela, India &nbsp;·&nbsp; 2026
            </span>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────── ABOUT / BIO ─────────────────────── */}
      <section className="px-6 md:px-20 py-16 md:py-28">
        <div className="max-w-[720px] mx-auto w-full">
          <Reveal>
            <SectionHeading>About</SectionHeading>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-[19px] md:text-[22px] leading-[1.55]" style={{ opacity: 0.85 }}>
              {BIO_BODY}
            </p>
            <div
              className="mt-6 text-[12px] tabular-nums tracking-[0.18em] uppercase"
              style={{ opacity: 0.62 }}
            >
              <span>Twenty</span>
              <span style={{ color: "var(--color-terracotta)", margin: "0 12px" }}>·</span>
              <span>Rourkela, India</span>
              <span style={{ color: "var(--color-terracotta)", margin: "0 12px" }}>·</span>
              <span>Building since 2006</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────── SELECTED WORK ─────────────────────── */}
      <section className="px-6 md:px-20 py-16 md:py-28">
        <div className="max-w-[720px] mx-auto w-full">
          <Reveal>
            <SectionHeading>Selected work</SectionHeading>
          </Reveal>

          <ul className="space-y-1">
            {projects.map((p, i) => {
              const liveOk = p.liveUrl && p.liveUrl !== "#";
              const sourceOk = p.sourceUrl && p.sourceUrl !== "#";
              const href = liveOk ? p.liveUrl : sourceOk ? p.sourceUrl : `/shipped/${p.slug}`;
              const external = !!(liveOk || sourceOk);
              const highlight = PROJECT_HIGHLIGHTS[p.slug];
              const year = p.modified?.slice(0, 4) || p.created?.slice(0, 4) || "";
              return (
                <motion.li
                  key={p.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: easeOut }}
                >
                  <a
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="group block py-6 md:py-7 border-b"
                    style={{ borderColor: "rgba(26,26,26,0.1)" }}
                  >
                    <div className="flex items-baseline gap-4 md:gap-8">
                        <span
                          className="text-[13px] tabular-nums tracking-wider shrink-0"
                          style={{ opacity: 0.6 }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-3 md:gap-4 flex-wrap">
                            <span
                              className="text-[24px] md:text-[32px] leading-tight transition-colors duration-200 group-hover:text-[color:var(--color-terracotta)]"
                              style={{ fontWeight: 500 }}
                            >
                              {p.title}
                            </span>
                            <span className="hidden md:inline-block text-[16px] leading-snug" style={{ opacity: 0.6 }}>
                              — {p.description.split(".")[0]}
                            </span>
                          </div>
                          {highlight && (
                            <div
                              className="mt-2 md:mt-3 text-[12px] md:text-[13px] tabular-nums tracking-wider"
                              style={{ color: "var(--color-terracotta)", opacity: 0.85 }}
                            >
                              {highlight}
                            </div>
                          )}
                        </div>
                        <span
                          className="text-[13px] tabular-nums tracking-wider shrink-0 hidden sm:inline"
                          style={{ opacity: 0.6 }}
                        >
                          {year}
                        </span>
                        <span
                          className="text-[15px] transition-transform group-hover:translate-x-1 shrink-0"
                          style={{ color: "var(--color-terracotta)" }}
                        >
                          &nearr;
                        </span>
                      </div>
                      <ProjectMedia src={p.image} alt={`${p.title} — preview`} />
                    </a>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ─────────────────────── CURRENTLY ─────────────────────── */}
      <section className="px-6 md:px-20 py-16 md:py-28">
        <div className="max-w-[720px] mx-auto w-full">
          <Reveal>
            <SectionHeading>Currently</SectionHeading>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-[20px] md:text-[24px] leading-[1.55]" style={{ opacity: 0.85 }}>
              {CURRENTLY}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────── CONTACT ─────────────────────── */}
      <section id="contact" className="px-6 md:px-20 py-16 md:py-32">
        <div className="max-w-[720px] mx-auto w-full">
          <Reveal>
            <SectionHeading>Contact</SectionHeading>
          </Reveal>
          <Reveal delay={0.05}>
            <p
              className="text-[24px] md:text-[30px] leading-[1.38] mb-10 md:mb-12 max-w-[600px]"
              style={{ opacity: 0.9 }}
            >
              Building something, hiring, or just want to compare notes on systems and
              craft? Send a note — I read every message.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <NonDevContactForm />
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className="mt-12 md:mt-14 pt-8"
              style={{ borderTop: "1px solid rgba(26,26,26,0.12)" }}
            >
              <div
                className="text-[12px] tracking-[0.2em] uppercase mb-4"
                style={{ opacity: 0.62 }}
              >
                Elsewhere
              </div>
              <ContactLinks />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────── FOOTER ─────────────────────── */}
      <footer
        className="px-6 md:px-20 py-10 text-[12px] tracking-[0.16em] uppercase"
        style={{ opacity: 0.62 }}
      >
        <div className="max-w-[720px] mx-auto w-full flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>&copy; {new Date().getFullYear()} Mayank Himmatsingka</span>
          <span style={{ color: "var(--color-terracotta)" }}>·</span>
          <span>Rourkela, IN</span>
          <a href="#top" className="nd-link ml-auto">
            Back to top &uarr;
          </a>
        </div>
      </footer>
    </main>
    </MotionConfig>
  );
}
