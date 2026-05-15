"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { isProjectNode } from "@/data/types";
import { useClearanceContext } from "@/components/ClearanceProvider";
import { MobileNodeCard } from "./MobileNodeCard";
import { MobileAbortButton } from "./MobileAbortButton";

// Lazy-load heavy overlays
import { SystemBreach } from "@/components/SystemBreach";
import { OfflineGame } from "@/components/OfflineGame";
import { ReadingListModal } from "@/components/ReadingListModal";

/**
 * The mobile-only shell for Power Users.
 * Renders a vertical scrollable feed of node cards
 * with a docked bottom bar for navigation.
 * 
 * This component is the ENTIRE mobile homepage.
 * It never touches desktop components.
 */
export function MobilePDAShell() {
  const [breachActive, setBreachActive] = useState(false);
  const [offlineActive, setOfflineActive] = useState(false);
  const [readingListActive, setReadingListActive] = useState(false);
  const { level, notification, clearNotification, promoteToRoot } = useClearanceContext();

  // Filter nodes by clearance (same logic as desktop)
  const visibleNodes = PORTFOLIO_DATA.nodes.filter((n) => {
    if (!n.clearance) return true;
    if (n.clearance === "OPERATOR" && (level === "OPERATOR" || level === "ROOT")) return true;
    if (n.clearance === "ROOT" && level === "ROOT") return true;
    return false;
  });

  // Separate projects from info nodes for structured layout
  const coreNode = visibleNodes.find((n) => n.id === "core");
  const projectNodes = visibleNodes.filter((n) => isProjectNode(n));
  const infoNodes = visibleNodes.filter((n) => n.id !== "core" && !isProjectNode(n));

  // Listen for global events (same as desktop page.tsx)
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

  return (
    <main className="w-full min-h-screen bg-white text-black font-sans pb-16">
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
      <header className="p-5 pt-8 pb-6 border-b-4 border-black flex justify-between items-end gap-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-2">
            // System Blueprint v1.0
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-tighter leading-tight">
            Mayank
            <br />
            Himmatsingka
          </h1>
          <p className="font-mono text-xs mt-2 opacity-60 uppercase">
            {PORTFOLIO_DATA.general.role}
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-[4.5rem] h-[4.5rem] md:w-24 md:h-24 border-2 border-black rounded-full overflow-hidden shrink-0 bg-[#e0e0e0] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative"
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#000_1px,transparent_1px)] bg-[size:4px_4px]" />
          <img 
            src="/profile.jpg" 
            alt="Mayank Himmatsingka" 
            className="w-full h-full object-cover relative z-10 preserve-color"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </motion.div>
      </header>

      {/* ─── CONTENT FEED ─── */}
      <div className="flex flex-col gap-0">
        {/* Identity Section */}
        {coreNode && (
          <section className="px-5 py-6">
            <div className="font-mono text-sm font-bold uppercase tracking-widest text-black mb-3 border-b border-black pb-2">
              // Identity
            </div>
            <MobileNodeCard node={coreNode} index={0} />
          </section>
        )}

        {/* Projects Section */}
        {projectNodes.length > 0 && (
          <section className="px-5 py-6">
            <div className="font-mono text-sm font-bold uppercase tracking-widest text-black mb-3 border-b border-black pb-2">
              // Shipped ({projectNodes.length})
            </div>
            <div className="flex flex-col gap-3">
              {projectNodes.map((node, i) => (
                <MobileNodeCard key={node.id} node={node} index={i + 1} />
              ))}
            </div>
          </section>
        )}

        {/* System Nodes Section */}
        {infoNodes.length > 0 && (
          <section className="px-5 py-6">
            <div className="font-mono text-sm font-bold uppercase tracking-widest text-black mb-3 border-b border-black pb-2">
              // System Modules
            </div>
            <div className="flex flex-col gap-3">
              {infoNodes.map((node, i) => (
                <MobileNodeCard
                  key={node.id}
                  node={node}
                  index={i + projectNodes.length + 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* External Links */}
        <section className="px-5 py-6 mb-4">
          <div className="font-mono text-sm font-bold uppercase tracking-widest text-black mb-3 border-b border-black pb-2">
            // External
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {[
              { label: "LinkedIn", href: PORTFOLIO_DATA.general.linkedinUrl, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> },
              { label: "GitHub", href: PORTFOLIO_DATA.general.githubUrl, icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> },
              { label: "Twitter", href: "https://twitter.com/mayankhsingka", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M4 4l11.733 16h4.267l-11.733 -16z"></path><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path></svg> },
              { label: "Calendly", href: "https://calendly.com/mayankhsingka", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
              { label: "Call", href: "tel:7326037045", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg> },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.label}
                className="w-[3.5rem] h-[3.5rem] border-2 border-black flex items-center justify-center 
                           bg-white text-black active:bg-black active:text-white transition-all
                           shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* Clearance Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-4 left-4 right-4 z-[60] bg-black text-white font-mono text-sm font-bold uppercase tracking-widest px-6 py-3 border-2 border-white text-center"
            onClick={clearNotification}
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
