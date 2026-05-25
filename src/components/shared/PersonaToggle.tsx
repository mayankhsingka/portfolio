"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePersona } from "@/hooks/usePersona";

export function PersonaToggle() {
  const { persona, setPersona, mounted } = usePersona();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!mounted) return null;

  const targetPersona = persona === "dev" ? "non-dev" : "dev";

  const handleConfirm = () => {
    // Clean up dev-mode classes if leaving dev
    if (targetPersona === "non-dev" && typeof document !== "undefined") {
      document.documentElement.classList.remove(
        "dark-ops",
        "theme-aviation",
        "theme-amber",
        "theme-matrix",
      );
    }
    setPersona(targetPersona);
    setConfirmOpen(false);
    // Full reload ensures the init script and global state reset cleanly
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const isOnDev = persona === "dev";

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        aria-label={isOnDev ? "Switch to standard view" : "Switch to developer view"}
        title={isOnDev ? "Standard view" : "Developer view"}
        className={[
          "fixed z-[80] flex items-center justify-center",
          "transition-all duration-200",
          isOnDev
            ? // Dev side: top-right, subtle phosphor square
              "top-4 right-4 w-9 h-9 bg-transparent border border-black/30 text-black hover:border-black hover:bg-black hover:text-white"
            : // Non-dev side: top-right desktop, bottom-right mobile, 44px touch target on mobile
              "md:top-6 md:right-6 bottom-6 right-6 md:bottom-auto w-11 h-11 md:w-10 md:h-10 rounded-full bg-[color:var(--color-cream-deep)] text-[color:var(--color-ink)] shadow-[0_2px_12px_rgba(26,26,26,0.08)] hover:bg-[color:var(--color-terracotta)] hover:text-[color:var(--color-cream)] hover:shadow-[0_4px_16px_rgba(184,83,58,0.25)]",
        ].join(" ")}
      >
        {isOnDev ? (
          // Standard / "exit to clean view" glyph — circle outline
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="8" />
          </svg>
        ) : (
          // Dev mode glyph — </> brackets
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 7L3 12L8 17" />
            <path d="M16 7L21 12L16 17" />
            <path d="M14 5L10 19" />
          </svg>
        )}
      </button>

      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
            onClick={() => setConfirmOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className={[
                "max-w-md w-full p-7 md:p-8",
                isOnDev
                  ? "bg-white text-black border-2 border-black font-mono"
                  : "bg-[color:var(--color-cream)] text-[color:var(--color-ink)] border border-[color:var(--color-ink)]/15 shadow-[0_24px_60px_rgba(26,26,26,0.18)]",
              ].join(" ")}
              style={!isOnDev ? { fontFamily: "var(--font-fraunces), Georgia, serif" } : undefined}
            >
              {isOnDev ? (
                <>
                  <div className="text-xs uppercase tracking-widest opacity-60 mb-2">SYSTEM</div>
                  <h2 className="text-2xl font-bold uppercase mb-3">Exit developer view?</h2>
                  <p className="text-sm leading-relaxed opacity-80 mb-6">
                    You&apos;ll see the standard portfolio &mdash; minimal, professional, no system chrome.
                    Your dev-side state stays saved.
                  </p>
                </>
              ) : (
                <>
                  <div
                    className="text-[10px] uppercase tracking-[0.3em] mb-3"
                    style={{ color: "var(--color-terracotta)" }}
                  >
                    Switch view
                  </div>
                  <h2 className="text-[28px] md:text-[32px] leading-tight mb-4" style={{ fontWeight: 500 }}>
                    Open the developer view?
                  </h2>
                  <p className="text-[17px] leading-[1.55] opacity-75 mb-7">
                    You&apos;ll see the full system view &mdash; an interactive canvas, terminal,
                    command palette, and the rest. Built for developers who want to poke around.
                  </p>
                </>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className={
                    isOnDev
                      ? "px-4 py-2 text-sm font-bold uppercase tracking-wider border-2 border-black/40 hover:border-black"
                      : "px-5 py-2.5 text-[15px] tracking-wide border border-[color:var(--color-ink)]/25 hover:border-[color:var(--color-ink)]/60"
                  }
                  style={!isOnDev ? { fontFamily: "var(--font-fraunces), Georgia, serif" } : undefined}
                >
                  {isOnDev ? "STAY" : "Stay here"}
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className={
                    isOnDev
                      ? "px-4 py-2 text-sm font-bold uppercase tracking-wider bg-black text-white hover:bg-white hover:text-black border-2 border-black"
                      : "px-5 py-2.5 text-[15px] tracking-wide bg-[color:var(--color-ink)] text-[color:var(--color-cream)] hover:bg-[color:var(--color-terracotta)]"
                  }
                  style={!isOnDev ? { fontFamily: "var(--font-fraunces), Georgia, serif" } : undefined}
                >
                  {isOnDev ? "EXIT →" : "Switch →"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
