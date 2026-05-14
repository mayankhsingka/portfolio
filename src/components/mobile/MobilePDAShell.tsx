"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { isProjectNode } from "@/data/types";
import { useClearanceContext } from "@/components/ClearanceProvider";
import { MobileNodeCard } from "./MobileNodeCard";
import { DockedActionBar } from "./DockedActionBar";
import { MobileMenu } from "./MobileMenu";
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
  const [menuOpen, setMenuOpen] = useState(false);
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
      <header className="p-5 pt-8 pb-6 border-b-4 border-black">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-40 mb-2">
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
      </header>

      {/* ─── CONTENT FEED ─── */}
      <div className="flex flex-col gap-0">
        {/* Identity Section */}
        {coreNode && (
          <section className="p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-30 mb-3 border-b border-black/10 pb-2">
              // Identity
            </div>
            <MobileNodeCard node={coreNode} index={0} />
          </section>
        )}

        {/* Projects Section */}
        {projectNodes.length > 0 && (
          <section className="p-5 pt-2">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-30 mb-3 border-b border-black/10 pb-2">
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
          <section className="p-5 pt-2">
            <div className="font-mono text-[10px] uppercase tracking-widest opacity-30 mb-3 border-b border-black/10 pb-2">
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

        {/* Quick Links Footer */}
        <section className="p-5 pt-2 mb-4">
          <div className="font-mono text-[10px] uppercase tracking-widest opacity-30 mb-3 border-b border-black/10 pb-2">
            // Quick Access
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Memos", href: "/internal-memos" },
              { label: "Terminal", href: "/commands" },
              { label: "Skill Matrix", href: "/matrix" },
              { label: "About", href: "/core-identity" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="border-2 border-black py-3 text-center font-mono text-xs font-bold uppercase
                           active:bg-black active:text-white transition-colors"
                style={{ minHeight: 48 }}
              >
                {link.label}
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

      {/* Mobile Navigation */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <DockedActionBar onOpenMenu={() => setMenuOpen(true)} />
    </main>
  );
}
