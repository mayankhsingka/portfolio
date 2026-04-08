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
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function HomeContent() {
  const [hasBooted, setHasBooted] = useState(true);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [breachActive, setBreachActive] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { level, notification, clearNotification, promoteToRoot } = useClearanceContext();

  useEffect(() => {
    const booted = sessionStorage.getItem("system_booted");
    if (!booted) {
      setHasBooted(false);
    }
  }, []);

  // Listen for breach events from CommandPalette
  useEffect(() => {
    const handleBreach = () => setBreachActive(true);
    window.addEventListener("system-breach", handleBreach);
    return () => window.removeEventListener("system-breach", handleBreach);
  }, []);

  const completeBoot = () => {
    sessionStorage.setItem("system_booted", "true");
    setHasBooted(true);
  };

  const handleBreachComplete = useCallback(() => {
    setBreachActive(false);
    promoteToRoot();
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
        
        {/* HUD — top-left info panel */}
        <div className="fixed top-4 left-4 font-mono text-xs font-bold pointer-events-none uppercase z-[40] bg-white/80 p-2 border-2 border-black flex flex-col gap-1">
          <span className="block border-b-2 border-black pb-1 mb-1">{PORTFOLIO_DATA.general.name} - System Blueprint v1.0</span>
          [Press Ctrl+K for commands]<br />
          [Shift+A: About | Shift+C: Ping]<br />
          [Drag grid or nodes to navigate]
          <span className={`block border-t border-black/30 pt-1 mt-1 ${
            level === "ROOT" 
              ? "text-red-600" 
              : level === "OPERATOR" 
                ? "text-green-700" 
                : "text-black/50"
          }`}>
            [CLEARANCE: {level}]
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
