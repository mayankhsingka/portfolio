"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PageHeaderNav } from "@/components/PageHeaderNav";
import { NumberPlate } from "@/components/NumberPlate";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { usePageScrollable } from "@/hooks/usePageScrollable";

const RESUME_URL = process.env.NEXT_PUBLIC_RESUME_URL || "/resume.pdf";
const RESUME_FILENAME = "Mayank-Himmatsingka-CV.pdf";

const HIGHLIGHTS = PORTFOLIO_DATA.nodes
  .filter((n) => n.kind === "project")
  .slice(0, 3);

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-current p-4 flex flex-col gap-1">
      <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">
        {label}
      </span>
      <span className="font-bold uppercase tracking-tight text-sm sm:text-base">
        {value}
      </span>
    </div>
  );
}

export default function CVPage() {
  usePageScrollable();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard
      .writeText(PORTFOLIO_DATA.general.contactEmail)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      });
  };

  return (
    <main className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans flex flex-col">
      {/* Top status bar */}
      <div className="sticky top-0 z-30 bg-[var(--background)] border-b-2 border-current">
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <NumberPlate />
            <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-widest opacity-50">
              · dossier.pdf
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
            // operator_dossier.pdf
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-[0.92]">
            Curriculum<br />Vitae.
          </h1>
          <p className="text-base sm:text-lg opacity-75 max-w-2xl leading-relaxed">
            Full-fidelity print version of my work history, projects, and stack. Pull the PDF and read it offline, or hit{" "}
            <Link href="/core-identity" className="underline underline-offset-4 decoration-2 font-bold">
              /core-identity
            </Link>{" "}
            for the live, interactive version.
          </p>
        </motion.section>

        {/* Download CTA */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="border-2 border-current bg-current text-[var(--background)] p-6 sm:p-8 shadow-[6px_6px_0px_0px_currentColor] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <div className="flex flex-col gap-2">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">
              // primary_payload
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none">
              {RESUME_FILENAME}
            </h2>
            <p className="font-mono text-xs opacity-70">PDF · single page · print-ready</p>
          </div>
          <a
            href={RESUME_URL}
            download={RESUME_FILENAME}
            className="border-2 border-[var(--background)] bg-[var(--background)] text-current px-6 sm:px-8 py-4 font-mono text-xs sm:text-sm font-black uppercase tracking-widest hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_var(--background)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center gap-3 shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </a>
        </motion.section>

        {/* Quick facts */}
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-current pb-2">
            <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest">
              // at_a_glance
            </h2>
            <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">
              key fields
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <StatBlock label="Designation" value={PORTFOLIO_DATA.general.name} />
            <StatBlock label="Role" value={PORTFOLIO_DATA.general.role} />
            <StatBlock label="Age" value={PORTFOLIO_DATA.general.age} />
            <StatBlock label="Status" value="Open · IST" />
          </div>
        </section>

        {/* Highlight projects */}
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-current pb-2">
            <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest">
              // selected_work
            </h2>
            <Link
              href="/shipped"
              className="font-mono text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100 underline underline-offset-2"
            >
              view all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {HIGHLIGHTS.map((p) => (
              <Link
                key={p.id}
                href={p.kind === "project" && p.slug ? `/shipped/${p.slug}` : "/shipped"}
                className="border-2 border-current p-5 flex flex-col gap-3 hover:shadow-[6px_6px_0px_0px_currentColor] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-xl font-black uppercase tracking-tight leading-none">
                    {p.title}
                  </h3>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-widest border border-current px-1.5 py-0.5 shrink-0">
                    {p.status}
                  </span>
                </div>
                <p className="text-xs opacity-70 leading-snug line-clamp-4">
                  {p.description}
                </p>
                <div className="mt-auto pt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest font-bold border-t-2 border-current/20 group-hover:border-current/60 transition-colors">
                  <span className="opacity-70 group-hover:opacity-100">Open case</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Contact + alt links */}
        <section className="border-2 border-current p-5 sm:p-6 flex flex-col gap-4">
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">
            // direct_lines
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <button
                onClick={copyEmail}
                className="font-mono text-sm sm:text-base font-bold text-left hover:opacity-70 transition-opacity w-fit"
                title="Click to copy"
              >
                {copied ? "✓ copied" : PORTFOLIO_DATA.general.contactEmail}
              </button>
              <span className="font-mono text-[10px] uppercase tracking-widest opacity-50">
                preferred channel
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/ping"
                className="border-2 border-current px-4 py-2 font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-current hover:text-[var(--background)] transition-colors"
              >
                /ping
              </Link>
              <a
                href={PORTFOLIO_DATA.general.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-current px-4 py-2 font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-current hover:text-[var(--background)] transition-colors"
              >
                LinkedIn ↗
              </a>
              <a
                href={PORTFOLIO_DATA.general.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-current px-4 py-2 font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-current hover:text-[var(--background)] transition-colors"
              >
                GitHub ↗
              </a>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4 font-mono text-[10px] opacity-50 uppercase tracking-widest">
          <span>[ end_of_dossier ]</span>
        </div>
      </div>
    </main>
  );
}
