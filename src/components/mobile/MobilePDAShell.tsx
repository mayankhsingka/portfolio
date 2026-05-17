"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { isProjectNode, ArchNode } from "@/data/types";
import { useClearanceContext } from "@/components/ClearanceProvider";
import { MobileNodeCard } from "./MobileNodeCard";
import { MobileAbortButton } from "./MobileAbortButton";
import { NumberPlate } from "@/components/NumberPlate";

// Lazy-load heavy overlays
import { SystemBreach } from "@/components/SystemBreach";
import { OfflineGame } from "@/components/OfflineGame";
import { ReadingListModal } from "@/components/ReadingListModal";

const TABS = [
  { id: "ident", label: "IDENT" },
  { id: "cases", label: "CASE_FILES" },
  { id: "archive", label: "ARCHIVE" },
];

export function MobilePDAShell() {
  const [breachActive, setBreachActive] = useState(false);
  const [offlineActive, setOfflineActive] = useState(false);
  const [readingListActive, setReadingListActive] = useState(false);
  const { level, notification, clearNotification, promoteToRoot } = useClearanceContext();
  const [activeTab, setActiveTab] = useState(0);

  // Section refs for scroll-jump + scroll-spy
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  // Filter nodes by clearance
  const visibleNodes = PORTFOLIO_DATA.nodes.filter((n) => {
    if (!n.clearance) return true;
    if (n.clearance === "OPERATOR" && (level === "OPERATOR" || level === "ROOT")) return true;
    if (n.clearance === "ROOT" && level === "ROOT") return true;
    return false;
  });

  const coreNode = visibleNodes.find((n) => n.id === "core");
  const projectNodes = visibleNodes.filter((n) => isProjectNode(n));
  const infoNodes = visibleNodes.filter((n) => n.id !== "core" && !isProjectNode(n));

  useEffect(() => {
    const handleBreach = () => setBreachActive(true);
    const handleOffline = () => setOfflineActive(true);
    const handleReadingList = () => setReadingListActive(true);

    window.addEventListener("system-breach", handleBreach);
    window.addEventListener("system-offline", handleOffline);
    window.addEventListener("system-open-reading-list", handleReadingList);
    return () => {
      window.removeEventListener("system-breach", handleBreach);
      window.removeEventListener("system-offline", handleOffline);
      window.removeEventListener("system-open-reading-list", handleReadingList);
    };
  }, []);

  const handleBreachComplete = useCallback(() => {
    setBreachActive(false);
    promoteToRoot();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("system-decrypt"));
    }, 100);
  }, [promoteToRoot]);

  // ─── Scroll-spy: update activeTab as user scrolls through sections ───
  useEffect(() => {
    let rafId = 0;
    const updateActive = () => {
      // Trigger 120px past the top of the viewport — just below the sticky tab strip.
      const trigger = window.scrollY + 120;
      let next = 0;
      for (let i = 0; i < sectionRefs.length; i++) {
        const el = sectionRefs[i].current;
        if (el && el.offsetTop <= trigger) next = i;
      }
      setActiveTab(next);
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        updateActive();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateActive();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToSection = (idx: number) => {
    const el = sectionRefs[idx].current;
    if (!el) return;
    // Offset by ~88px so the section heading clears the sticky tab strip.
    const y = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <main className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pb-24 overflow-x-hidden flex flex-col">
      {/* System Breach Overlay */}
      <SystemBreach active={breachActive} onComplete={handleBreachComplete} />
      {breachActive && (
        <MobileAbortButton onAbort={() => setBreachActive(false)} label="Abort Breach" />
      )}

      {/* Offline Game Overlay */}
      {offlineActive && (
        <>
          <OfflineGame onExit={() => setOfflineActive(false)} />
          <MobileAbortButton onAbort={() => setOfflineActive(false)} label="Exit Game" />
        </>
      )}

      {/* Reading List Modal */}
      <AnimatePresence>
        {readingListActive && <ReadingListModal onClose={() => setReadingListActive(false)} />}
      </AnimatePresence>

      {/* ─── HEADER ─── */}
      <header className="px-5 pt-8 pb-4 shrink-0">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-between items-start gap-4"
        >
          <div>
            <div className="mb-3">
              <NumberPlate size="md" />
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter leading-tight">
              Mayank
              <br />
              Himmatsingka
            </h1>
          </div>
          <div className="w-[4rem] h-[4rem] border-2 border-current rounded-full overflow-hidden shrink-0 shadow-[4px_4px_0px_0px_currentColor] relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,currentColor_1px,transparent_1px)] bg-[size:4px_4px]" />
            <img
              src="/profile.jpg"
              alt="Profile"
              className="w-full h-full object-cover relative z-10 preserve-color"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
        </motion.div>
      </header>

      {/* ─── STICKY TAB STRIP — taps scroll to section ─── */}
      <div className="px-5 pb-3 border-b-4 border-current sticky top-0 bg-[var(--background)] z-40 shrink-0">
        <div className="flex gap-2">
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => scrollToSection(idx)}
              className={`flex-1 py-2 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                activeTab === idx
                  ? "bg-current text-[var(--background)] border-current"
                  : "bg-transparent text-current border-current/30 opacity-60 active:opacity-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Scroll-cue: nudges first-time visitors that there's more below */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-widest opacity-40 pointer-events-none">
          scroll ↓
        </div>
      </div>

      {/* ─── VERTICAL FEED — all three sections stacked ─── */}
      <div className="flex flex-col gap-10 px-5 pt-8 pb-12 w-full max-w-[100vw]">
        {/* IDENT */}
        <section ref={sectionRefs[0]} id="ident-section" className="flex flex-col gap-5 scroll-mt-24">
          <div className="font-mono text-xs font-bold uppercase tracking-widest opacity-60 border-b border-current pb-2">
            // IDENT · who I am
          </div>
          {coreNode && <MobileNodeCard node={coreNode} index={0} />}

          {/* Comm links */}
          <div className="flex flex-col gap-3 mt-2">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-50">
              comm_links
            </div>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "LinkedIn", href: PORTFOLIO_DATA.general.linkedinUrl, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg> },
                { label: "GitHub", href: PORTFOLIO_DATA.general.githubUrl, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg> },
                { label: "Calendly", href: "https://calendly.com/mayankhsingka", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
                { label: "Call", href: `tel:+91${PORTFOLIO_DATA.general.phone}`, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg> },
                { label: "WhatsApp", href: `https://wa.me/91${PORTFOLIO_DATA.general.phone}`, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1s-.7.9-.8 1c-.1.2-.3.2-.5.1-1.6-.8-2.6-1.5-3.7-3.3-.3-.5.3-.4.8-1.4.1-.2 0-.4 0-.5s-.6-1.4-.8-1.9c-.2-.5-.5-.4-.6-.4h-.5c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 5 4.4.7.3 1.2.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.5-.3zM12 2a10 10 0 0 0-8.7 15L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.3a8.3 8.3 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3a8.3 8.3 0 1 1 6.9 3.7z" /></svg> },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.label}
                  aria-label={link.label}
                  className="w-[3.25rem] h-[3.25rem] border-2 border-current flex items-center justify-center bg-transparent text-current active:bg-current active:text-[var(--background)] transition-all shadow-[3px_3px_0px_0px_currentColor] active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CASE_FILES */}
        <section ref={sectionRefs[1]} id="cases-section" className="flex flex-col gap-3 scroll-mt-24">
          <div className="font-mono text-xs font-bold uppercase tracking-widest opacity-60 border-b border-current pb-2">
            // CASE_FILES · what I&apos;ve built ({projectNodes.length})
          </div>
          {projectNodes.map((node, i) => (
            <MobileNodeCard key={node.id} node={node} index={i + 1} />
          ))}
        </section>

        {/* ARCHIVE */}
        <section ref={sectionRefs[2]} id="archive-section" className="flex flex-col gap-3 scroll-mt-24">
          <div className="font-mono text-xs font-bold uppercase tracking-widest opacity-60 border-b border-current pb-2">
            // ARCHIVE · everything else ({infoNodes.length})
          </div>
          {infoNodes.map((node, i) => (
            <MobileNodeCard
              key={node.id}
              node={node as ArchNode}
              index={i + projectNodes.length + 1}
            />
          ))}
        </section>
      </div>

      {/* Clearance Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-4 left-4 right-4 z-[60] bg-current text-[var(--background)] font-mono text-sm font-bold uppercase tracking-widest px-6 py-3 border-2 border-current text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"
            onClick={clearNotification}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
