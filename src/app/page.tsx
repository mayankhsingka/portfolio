"use client";

import { SystemGrid } from "@/components/SystemGrid";
import { ArchitectureNode } from "@/components/ArchitectureNode";
import { DataFlowLines } from "@/components/DataFlowLines";
import { TerminalLogs } from "@/components/TerminalLogs";
import { CommandPalette } from "@/components/CommandPalette";
import { SystemShortcuts } from "@/components/SystemShortcuts";
import { BootSequence } from "@/components/BootSequence";
import { SystemBreach } from "@/components/SystemBreach";
import { ClearanceProvider, useClearanceContext } from "@/components/ClearanceProvider";
import { SurveillanceCamera } from "@/components/SurveillanceCamera";
import { InteractiveBios } from "@/components/InteractiveBios";
import { OfflineGame } from "@/components/OfflineGame";
import { useTelemetryTab } from "@/hooks/useTelemetryTab";
import { ScrambleText } from "@/components/ScrambleText";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function HomeContent() {
  const [hasBooted, setHasBooted] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  useTelemetryTab();
  const [breachActive, setBreachActive] = useState(false);
  const [surveillanceActive, setSurveillanceActive] = useState(false);
  const [biosActive, setBiosActive] = useState(false);
  const [offlineActive, setOfflineActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);
  const delTimestamps = useRef<number[]>([]);
  const { level, notification, clearNotification, promoteToRoot } = useClearanceContext();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          setMousePos(mousePosRef.current);
          rafIdRef.current = null;
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  useEffect(() => {
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
    } catch {}

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
    
    window.addEventListener("system-breach", handleBreach);
    window.addEventListener("system-surveillance", handleSurveillance);
    window.addEventListener("system-offline", handleOffline);
    return () => {
      window.removeEventListener("system-breach", handleBreach);
      window.removeEventListener("system-surveillance", handleSurveillance);
      window.removeEventListener("system-offline", handleOffline);
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

  // Show nodes based on clearance
  const visibleNodes = PORTFOLIO_DATA.nodes.filter((n) => {
    if (!n.clearance) return true;
    if (n.clearance === "OPERATOR" && (level === "OPERATOR" || level === "ROOT")) return true;
    if (n.clearance === "ROOT" && level === "ROOT") return true;
    return false;
  });

  return (
    <main className="w-full h-full text-black">
      {!hasBooted && <BootSequence onComplete={completeBoot} />}
      
      {/* System Breach Overlay */}
      <SystemBreach active={breachActive} onComplete={handleBreachComplete} />

      {/* BIOS Overlay — triggered by spamming DEL */}
      {biosActive && <InteractiveBios onExit={() => setBiosActive(false)} />}

      {/* Offline Game Overlay — triggered by /play command */}
      {offlineActive && <OfflineGame onExit={() => setOfflineActive(false)} />}

      <div style={{ opacity: hasBooted ? 1 : 0, transition: 'opacity 0.5s ease' }} className="w-full h-full">
        <SystemGrid canvasRef={canvasRef}>
          <DataFlowLines canvasRef={canvasRef} hoveredNodeId={hoveredNodeId} />
          
          {/* Giant Personal Watermark on the Canvas Floor */}
          <div 
            className="absolute top-[150vh] left-[150vw] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col font-sans font-black uppercase text-black/20 select-none z-[-1] leading-[0.85] tracking-tighter mix-blend-multiply"
            style={{ fontSize: "clamp(6rem, 12vw, 16rem)" }}
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
              onHover={setHoveredNodeId}
            />
          ))}
        </SystemGrid>

        <TerminalLogs />
        <CommandPalette />
        <SystemShortcuts />

        <AnimatePresence>
          {surveillanceActive && (
            <SurveillanceCamera onClose={() => setSurveillanceActive(false)} />
          )}
        </AnimatePresence>
        
        {/* HUD — top-left info panel */}
        <div className="fixed top-4 left-4 font-mono text-xs font-bold pointer-events-none uppercase z-[40] bg-white/80 p-3 border-2 border-black flex flex-col gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-1 gap-8 text-[11px] tracking-tight">
            <span className="block italic">
              <ScrambleText>{PORTFOLIO_DATA.general.name.toUpperCase()}</ScrambleText> / <ScrambleText>SYS_BLUEPRINT_v1.2</ScrambleText>
            </span>
            {/* Heartbeat Indicator */}
            <div className="flex items-center gap-1.5 opacity-60">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full system-heartbeat" />
              <span className="text-[10px]">LIVE</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between gap-4">
              <span className="opacity-70">COORD_X:</span>
              <span className="text-black/80">{String(mousePos.x).padStart(4, '0')}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="opacity-70">COORD_Y:</span>
              <span className="text-black/80">{String(mousePos.y).padStart(4, '0')}</span>
            </div>
            <div className="flex justify-between gap-4 mt-2 border-t border-black/10 pt-1">
              <span className="opacity-70">DIRECTIVE:</span>
              <span className="text-black/80">CTRL+K_CMDS</span>
            </div>
          </div>

          <span className={`block border-t-2 border-black pt-2 mt-1 ${
            level === "ROOT" 
              ? "text-red-600" 
              : level === "OPERATOR" 
                ? "text-green-700" 
                : "text-black/50"
          }`}>
            [<ScrambleText>CLEARANCE_CERTIFICATE:</ScrambleText> <ScrambleText>{level}</ScrambleText>]
          </span>
        </div>

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
  return (
    <ClearanceProvider>
      <HomeContent />
    </ClearanceProvider>
  );
}
