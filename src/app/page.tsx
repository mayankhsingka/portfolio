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
import { ScrambleText } from "@/components/ScrambleText";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function HomeContent() {
  const [hasBooted, setHasBooted] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [breachActive, setBreachActive] = useState(false);
  const [surveillanceActive, setSurveillanceActive] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const { level, notification, clearNotification, promoteToRoot } = useClearanceContext();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const booted = sessionStorage.getItem("system_booted");
    if (!booted) {
      setHasBooted(false);
    }
  }, []);

  // Listen for global events from CommandPalette
  useEffect(() => {
    const handleBreach = () => setBreachActive(true);
    const handleSurveillance = (e: any) => setSurveillanceActive(e.detail);
    
    window.addEventListener("system-breach", handleBreach);
    window.addEventListener("system-surveillance", handleSurveillance as any);
    return () => {
      window.removeEventListener("system-breach", handleBreach);
      window.removeEventListener("system-surveillance", handleSurveillance as any);
    };
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
    const clearance = (n as any).clearance;
    if (!clearance) return true;
    if (clearance === "OPERATOR" && (level === "OPERATOR" || level === "ROOT")) return true;
    if (clearance === "ROOT" && level === "ROOT") return true;
    return false;
  });

  return (
    <main className="w-full h-full text-black">
      {!hasBooted && <BootSequence onComplete={completeBoot} />}
      
      {/* System Breach Overlay */}
      <SystemBreach active={breachActive} onComplete={handleBreachComplete} />

      <div style={{ opacity: hasBooted ? 1 : 0, transition: 'opacity 0.5s ease' }} className="w-full h-full">
        <SystemGrid canvasRef={canvasRef}>
          <DataFlowLines canvasRef={canvasRef} hoveredNodeId={hoveredNodeId} />
          
          {visibleNodes.map((node) => (
            <ArchitectureNode
              key={node.id}
              id={node.id}
              title={node.title}
              status={node.status as any}
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
