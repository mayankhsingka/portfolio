"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface DesktopTeaserModalProps {
  onClose: () => void;
}

const FEATURES = [
  {
    title: "Infinite Canvas",
    blurb: "Drag a 300vw drafting board. Every node is alive.",
    glyph: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="24" height="24" />
        <circle cx="9" cy="9" r="2.5" />
        <circle cx="19" cy="14" r="2.5" />
        <circle cx="11" cy="20" r="2.5" />
        <path d="M11 10l6 3M12 18l5-3" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    title: "Command Palette",
    blurb: "Hit Ctrl + K. Bend the system with one keystroke.",
    glyph: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="6" width="22" height="16" rx="1" />
        <path d="M7 12h3M7 16h6M14 12h4M16 16h2" />
      </svg>
    ),
  },
  {
    title: "Chain Navigation",
    blurb: "Hold a link to sever it. Industrial physics-driven nav.",
    glyph: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="10" width="8" height="8" />
        <rect x="11" y="11" width="6" height="6" />
        <rect x="17" y="10" width="8" height="8" />
      </svg>
    ),
  },
  {
    title: "Easter Eggs",
    blurb: "BIOS intercept, ASCII surveillance, root breach.",
    glyph: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="14" cy="14" r="11" />
        <path d="M9 14l4 4 6-8" />
      </svg>
    ),
  },
];

export function DesktopTeaserModal({ onClose }: DesktopTeaserModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mayank Himmatsingka — System Blueprint",
          text: "Open this on your laptop for the full experience:",
          url: window.location.origin,
        });
      } catch {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-3 sm:p-6 font-sans">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ y: "100%", opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 240 }}
        className="relative w-full max-w-md bg-[var(--background)] text-[var(--foreground)] border-4 border-current shadow-[10px_10px_0px_0px_currentColor] max-h-[92vh] overflow-y-auto"
      >
        {/* Top status strip — animated scanline vibe */}
        <div className="relative h-7 border-b-2 border-current overflow-hidden bg-current text-[var(--background)] flex items-center justify-between px-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-current animate-pulse" />
            SYS_UPGRADE_AVAILABLE
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            className="font-mono text-xs font-black hover:opacity-70 transition-opacity"
          >
            [ X ]
          </button>
        </div>

        {/* Animated preview band */}
        <div className="relative h-24 border-b-2 border-current overflow-hidden bg-[var(--background)]">
          {/* Faint grid */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
          />
          {/* Floating nodes */}
          {[
            { top: 14, left: 22, delay: 0 },
            { top: 56, left: 90, delay: 0.4 },
            { top: 26, left: 160, delay: 0.8 },
            { top: 60, left: 220, delay: 1.2 },
            { top: 18, left: 290, delay: 1.6 },
          ].map((n, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: n.delay, ease: "easeInOut" }}
              className="absolute w-12 h-3.5 border-2 border-current bg-[var(--background)]"
              style={{ top: n.top, left: n.left }}
            />
          ))}
          {/* Dashed connectors */}
          <svg className="absolute inset-0 w-full h-full opacity-50" preserveAspectRatio="none">
            <line x1="34" y1="22" x2="100" y2="64" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="100" y1="64" x2="172" y2="34" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="172" y1="34" x2="232" y2="68" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
          {/* Crosshair */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-full h-px bg-current opacity-15" />
            <div className="absolute h-full w-px bg-current opacity-15" />
          </div>
          <div className="absolute bottom-1 right-2 font-mono text-[9px] uppercase tracking-widest opacity-60">
            // canvas_preview · live
          </div>
        </div>

        {/* Hero */}
        <div className="px-5 pt-5 pb-3">
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-1">
            // Mobile shows ~30% of the system
          </div>
          <h2 className="text-3xl font-black uppercase leading-[0.95] tracking-tighter">
            Switch to a<br />bigger screen.
          </h2>
          <p className="text-sm opacity-70 mt-3 border-l-2 border-current pl-3">
            The Mobile PDA is a tactical readout. The real System Blueprint — infinite canvas, command palette, easter eggs — runs on 10″+ viewports.
          </p>
        </div>

        {/* Feature grid */}
        <div className="px-5 pb-5 grid grid-cols-2 gap-2">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="border-2 border-current p-3 flex flex-col gap-1.5 bg-[var(--background)] shadow-[3px_3px_0px_0px_currentColor]"
            >
              <div className="w-7 h-7 flex items-center justify-center">{f.glyph}</div>
              <div className="font-bold text-[11px] uppercase tracking-tight leading-tight">
                {f.title}
              </div>
              <div className="text-[10px] opacity-60 leading-snug">{f.blurb}</div>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <div className="px-5 pb-5 flex flex-col gap-2">
          <button
            onClick={share}
            className="relative w-full py-4 bg-current text-[var(--background)] font-mono font-bold text-sm uppercase tracking-widest active:translate-y-0.5 transition-transform overflow-hidden"
            style={{ minHeight: 52 }}
          >
            <span className="relative z-10">
              {copied ? "✓ LINK COPIED — OPEN ON LAPTOP" : "→ SEND TO MY LAPTOP"}
            </span>
            {copied && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.6, ease: "linear" }}
                className="absolute inset-y-0 w-1/3 bg-[var(--background)] opacity-20 pointer-events-none"
              />
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 border-2 border-current text-current font-mono font-bold text-xs uppercase tracking-widest hover:bg-current hover:text-[var(--background)] transition-colors"
            style={{ minHeight: 44 }}
          >
            Stay on mobile
          </button>
        </div>

        {/* Footer signature */}
        <div className="border-t-2 border-current px-5 py-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-widest opacity-50">
          <span>SYS_BLUEPRINT_V1.0</span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 bg-current animate-pulse" />
            UPLINK_READY
          </span>
        </div>
      </motion.div>
    </div>
  );
}
