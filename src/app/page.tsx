"use client";

import { SystemGrid } from "@/components/SystemGrid";
import { ArchitectureNode } from "@/components/ArchitectureNode";
import { DataFlowLines } from "@/components/DataFlowLines";
import { TerminalLogs } from "@/components/TerminalLogs";
import { SystemShortcuts } from "@/components/SystemShortcuts";
import { BootSequence } from "@/components/BootSequence";
import { SystemBreach } from "@/components/SystemBreach";
import { ClearanceProvider, useClearanceContext } from "@/components/ClearanceProvider";
import { SurveillanceCamera } from "@/components/SurveillanceCamera";
import { InteractiveBios } from "@/components/InteractiveBios";
import { OfflineGame } from "@/components/OfflineGame";
import { ReadingListModal } from "@/components/ReadingListModal";
import { SocialSidebar } from "@/components/SocialSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CanvasHint } from "@/components/CanvasHint";
import { ChainNav } from "@/components/ChainNav";
import { NumberPlate } from "@/components/NumberPlate";
import { MobilePDAShell } from "@/components/mobile/MobilePDAShell";
import { useTelemetryTab } from "@/hooks/useTelemetryTab";
import { useDevice } from "@/hooks/useDevice";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { isProjectNode } from "@/data/types";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { applyAutoLayout } from "@/utils/autoLayout";
import { Gatekeeper } from "@/components/Gatekeeper";
import { CardMode } from "@/components/CardMode";

function HomeContent() {
  const { isMobile } = useDevice();
  const [hasBooted, setHasBooted] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  useTelemetryTab();
  const [breachActive, setBreachActive] = useState(false);
  const [surveillanceActive, setSurveillanceActive] = useState(false);
  const [biosActive, setBiosActive] = useState(false);
  const [offlineActive, setOfflineActive] = useState(false);
  const [readingListActive, setReadingListActive] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const delTimestamps = useRef<number[]>([]);
  const { level, notification, clearNotification, promoteToRoot } = useClearanceContext();
  const [userPersona, setUserPersona] = useState<string | null>(null);

  useEffect(() => {
    // Check for persona on mount
    const persona = localStorage.getItem("user_persona");
    if (persona) {
      setUserPersona(persona);
    } else {
      setUserPersona("unknown");
    }

    const sessionBooted = sessionStorage.getItem("system_booted");

    let hasHighClearance = false;
    try {
      const raw = localStorage.getItem("clearance_data");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.level === "OPERATOR" || parsed.level === "ROOT") {
          hasHighClearance = true;
        }
      }
    } catch { }

    if (!sessionBooted && !hasHighClearance) {
      setHasBooted(false);
    }
  }, []);

  // DEL key spam opens BIOS — like real hardware POST
  useEffect(() => {
    const handleDelKey = (e: KeyboardEvent) => {
      if (e.key !== "Delete" || document.activeElement?.tagName === "INPUT") return;
      const now = Date.now();
      delTimestamps.current.push(now);
      // Keep only presses within the last 2 seconds
      delTimestamps.current = delTimestamps.current.filter(t => now - t < 2000);
      if (delTimestamps.current.length >= 5) {
        delTimestamps.current = [];
        setBiosActive(true);
        window.dispatchEvent(new CustomEvent("system-log", {
          detail: "[BIOS] Intercepted POST sequence — entering BIOS Setup Utility"
        }));
      }
    };
    window.addEventListener("keydown", handleDelKey);
    return () => window.removeEventListener("keydown", handleDelKey);
  }, []);

  // Listen for global events from CommandPalette
  useEffect(() => {
    const handleBreach = () => setBreachActive(true);
    const handleSurveillance = (e: Event) => setSurveillanceActive((e as CustomEvent).detail);
    const handleOffline = () => setOfflineActive(true);
    const handleReadingList = () => setReadingListActive(true);

    window.addEventListener("system-breach", handleBreach);
    window.addEventListener("system-surveillance", handleSurveillance);
    window.addEventListener("system-offline", handleOffline);
    window.addEventListener("system-open-reading-list", handleReadingList);
    return () => {
      window.removeEventListener("system-breach", handleBreach);
      window.removeEventListener("system-surveillance", handleSurveillance);
      window.removeEventListener("system-offline", handleOffline);
      window.removeEventListener("system-open-reading-list", handleReadingList);
    };
  }, []);

  // Method C: Dev-Tools Trap
  useEffect(() => {
    const css = `
      background: #000;
      color: #0f0;
      font-size: 14px;
      padding: 20px;
      font-family: monospace;
      border: 2px solid #0f0;
      line-height: 1.5;
    `;
    setTimeout(() => {
      console.log(
        "%c[SYS_ARCHITECT_WARNING] ⚠️ \n\nUNSANCTIONED OPERATOR DETECTED.\n\nIF YOU ARE A RECRUITER OR DEVELOPER READING THIS:\nDO NOT EXECUTE '/breach' IN THE COMMAND PALETTE.\nDO NOT EXECUTE '/engage_surveillance'.\nDO NOT EXECUTE '/play'.\n\nTHESE ARE CLASSIFIED DIRECTIVES.",
        css
      );
    }, 2000);
  }, []);

  const completeBoot = () => {
    sessionStorage.setItem("system_booted", "true");
    setHasBooted(true);
  };

  const handleBreachComplete = useCallback(() => {
    setBreachActive(false);
    promoteToRoot();
    // Slight delay to allow new root-level React nodes to mount and attach their listeners
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("system-decrypt"));
    }, 100);
  }, [promoteToRoot]);

  const visibleNodes = useMemo(() => {
    const filtered = PORTFOLIO_DATA.nodes.filter((n) => {
      if (!n.clearance) return true;
      if (n.clearance === "OPERATOR" && (level === "OPERATOR" || level === "ROOT")) return true;
      if (n.clearance === "ROOT" && level === "ROOT") return true;
      return false;
    });
    return applyAutoLayout(filtered);
  }, [level]);

  // ─── MOBILE SHELL ───────────────────────────────────────────────
  // Mobile always gets the PDA shell — the persona gate (Gatekeeper /
  // CardMode) is a desktop-only flow. Keeping mobile out of it avoids
  // recruiter-persona visitors landing on the sparse card stack instead
  // of the rich PDA with their name, photo, and tabs.
  if (isMobile) {
    return (
      <>
        {!hasBooted && <BootSequence onComplete={completeBoot} />}
        <div style={{ opacity: hasBooted ? 1 : 0, transition: "opacity 0.5s ease" }}>
          <MobilePDAShell />
        </div>
      </>
    );
  }

  if (userPersona === "unknown") {
    return (
      <Gatekeeper
        onComplete={(persona) => {
          setUserPersona(persona);
        }}
      />
    );
  }

  // If recruiter, render the cool swipeable 15-card summary mode
  if (userPersona === "recruiter") {
    return <CardMode />;
  }

  // ─── DESKTOP SHELL ──────────────────────────────────────────────
  return (
    <main className="w-full h-full text-black">
      {!hasBooted && <BootSequence onComplete={completeBoot} />}

      {/* System Breach Overlay */}
      <SystemBreach active={breachActive} onComplete={handleBreachComplete} />

      {/* BIOS Overlay — triggered by spamming DEL */}
      {biosActive && <InteractiveBios onExit={() => setBiosActive(false)} />}

      {/* Offline Game Overlay — triggered by /play command */}
      {offlineActive && <OfflineGame onExit={() => setOfflineActive(false)} />}

      {/* Classified Reading List Modal */}
      <AnimatePresence>
        {readingListActive && <ReadingListModal onClose={() => setReadingListActive(false)} />}
      </AnimatePresence>

      <div style={{ opacity: hasBooted ? 1 : 0, transition: 'opacity 0.5s ease' }} className="w-full h-full">
        <SystemGrid canvasRef={canvasRef}>
          <DataFlowLines canvasRef={canvasRef} hoveredNodeId={hoveredNodeId} />

          {/* Watermark on the Canvas Floor — text only, pushed below the core node so it doesn't compete */}
          <div
            className="absolute top-[178vh] left-[150vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none font-sans font-black uppercase text-black/15 select-none z-[-1] leading-[0.85] tracking-tighter mix-blend-multiply flex flex-col items-center"
            style={{ fontSize: "clamp(4rem, 9vw, 12rem)" }}
          >
            <span>MAYANK</span>
            <span>HIMMATSINGKA</span>
          </div>

          {visibleNodes.map((node) => (
            <ArchitectureNode
              key={node.id}
              id={node.id}
              title={node.title}
              status={node.status}
              description={node.description}
              metrics={node.metrics}
              top={node.top}
              left={node.left}
              slug={isProjectNode(node) ? node.slug : undefined}
              onHover={setHoveredNodeId}
            />
          ))}
        </SystemGrid>

        <TerminalLogs />
        <SystemShortcuts />
        <SocialSidebar />
        <ThemeToggle />
        <CanvasHint />
        <ChainNav />

        {/* Identity number plate — top-left corner brand mark */}
        <div className="fixed top-4 left-4 z-[45] pointer-events-auto">
          <NumberPlate size="md" />
        </div>

        <AnimatePresence>
          {surveillanceActive && (
            <SurveillanceCamera onClose={() => setSurveillanceActive(false)} />
          )}
        </AnimatePresence>


        {/* Clearance Promotion Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-black text-white font-mono text-sm font-bold uppercase tracking-widest px-6 py-3 border-2 border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]"
              onClick={clearNotification}
            >
              {notification}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

export default function Home() {
  return <HomeContent />;
}
