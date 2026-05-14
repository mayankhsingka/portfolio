"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DOMAINS = [
  {
    id: "frontend",
    title: "FRONTEND_ARCH",
    cmd: "analyze --domain frontend",
    radar: [95, 85, 60, 70, 90], // UI/UX, Logic, Data, Scale, Speed
    skills: ["Next.js 15", "React 19", "Tailwind v4", "Framer Motion", "DOM Mapping"],
  },
  {
    id: "backend",
    title: "SYSTEMS_BACKEND",
    cmd: "analyze --domain systems",
    radar: [60, 95, 90, 85, 75],
    skills: ["Node.js", "PostgreSQL", "Supabase", "Redis", "Edge Fns"],
  },
  {
    id: "ops",
    title: "DATA_OPERATIONS",
    cmd: "analyze --domain operations",
    radar: [50, 85, 80, 95, 80],
    skills: ["WebSockets", "Vercel Infra", "CI/CD", "Chrome Ext", "Manifest V3"],
  }
];

const RADIUS = 40;
const CENTER = 50;

function calculateRadarPoints(values: number[]) {
  return values.map((val, i) => {
    const angle = (Math.PI * 2 * i) / values.length - Math.PI / 2;
    const distance = (val / 100) * RADIUS;
    return `${CENTER + Math.cos(angle) * distance},${CENTER + Math.sin(angle) * distance}`;
  }).join(" ");
}

const AXIS_LABELS = ["UI", "LOGIC", "DATA", "SCALE", "SPEED"];
const AXIS_POINTS = calculateRadarPoints([100, 100, 100, 100, 100]).split(" ");

export function SkillConsole() {
  const [domainIdx, setDomainIdx] = useState(0);
  const [typedCmd, setTypedCmd] = useState("");
  const [terminalPhase, setTerminalPhase] = useState<"typing" | "analyzing" | "done">("typing");
  const [logs, setLogs] = useState<string[]>([]);
  const sandboxRef = useRef<HTMLDivElement>(null);

  const currentDomain = DOMAINS[domainIdx];

  // Typewriter effect loop
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (terminalPhase === "typing") {
      setLogs([]);
      let charIdx = 0;
      const typeChar = () => {
        if (charIdx <= currentDomain.cmd.length) {
          setTypedCmd(currentDomain.cmd.substring(0, charIdx));
          charIdx++;
          timeout = setTimeout(typeChar, 50);
        } else {
          timeout = setTimeout(() => setTerminalPhase("analyzing"), 400);
        }
      };
      typeChar();
    } 
    else if (terminalPhase === "analyzing") {
      timeout = setTimeout(() => {
        setLogs([`[INFO] Target: ${currentDomain.title}`, "[OK] Extracting operational nodes..."]);
        setTimeout(() => {
          setLogs(prev => [...prev, `[SUCCESS] ${currentDomain.skills.length} core dependencies found.`]);
          setTerminalPhase("done");
        }, 600);
      }, 300);
    }
    else if (terminalPhase === "done") {
      timeout = setTimeout(() => {
        setTerminalPhase("typing");
        setDomainIdx((prev) => (prev + 1) % DOMAINS.length);
      }, 8000); // 8 seconds to play with the specific nodes before cycling
    }

    return () => clearTimeout(timeout);
  }, [domainIdx, terminalPhase, currentDomain]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-0 border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-[500px] overflow-hidden">
      
      {/* LEFT PANE: Radar & Terminal */}
      <div className="w-full md:w-1/3 border-b-4 md:border-b-0 md:border-r-4 border-black flex flex-col bg-zinc-50 relative">
        {/* Radar Chart Section */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 relative border-b-2 border-black/10">
          <div className="absolute top-2 left-2 text-[10px] font-mono font-bold opacity-50">
            RADAR_TELEMETRY
          </div>
          
          <svg viewBox="0 0 100 100" className="w-[80%] max-w-[200px] overflow-visible mt-4">
            {/* Background Web */}
            <polygon points={AXIS_POINTS.join(" ")} fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
            <polygon points={calculateRadarPoints([75, 75, 75, 75, 75])} fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
            <polygon points={calculateRadarPoints([50, 50, 50, 50, 50])} fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
            <polygon points={calculateRadarPoints([25, 25, 25, 25, 25])} fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-10" />
            
            {/* Axes */}
            {AXIS_POINTS.map((pt, i) => (
              <g key={i}>
                <line x1="50" y1="50" x2={pt.split(",")[0]} y2={pt.split(",")[1]} stroke="currentColor" strokeWidth="0.5" className="opacity-20" />
                <text 
                  x={pt.split(",")[0]} 
                  y={pt.split(",")[1]} 
                  fontSize="4" 
                  className="font-mono font-bold uppercase"
                  textAnchor="middle"
                  dy={Number(pt.split(",")[1]) < 50 ? "-2" : "5"}
                  dx={Number(pt.split(",")[0]) < 50 ? "-2" : "2"}
                >
                  {AXIS_LABELS[i]}
                </text>
              </g>
            ))}

            {/* Dynamic Polygon */}
            {terminalPhase === "done" && (
              <motion.polygon
                key={currentDomain.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 10 }}
                points={calculateRadarPoints(currentDomain.radar)}
                fill="rgba(0, 0, 0, 0.1)"
                stroke="black"
                strokeWidth="1.5"
                className="transform-origin-center"
              />
            )}
          </svg>
        </div>

        {/* Terminal Section */}
        <div className="h-[200px] bg-black text-white p-4 font-mono text-xs flex flex-col justify-end overflow-hidden">
          <div className="flex flex-col gap-1">
            <div className="text-[#00ff41]">{">"} {typedCmd}<span className="inline-block w-2.5 h-3.5 bg-[#00ff41] ml-1 animate-pulse align-middle" /></div>
            {logs.map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className={log.includes("SUCCESS") ? "text-[#00ff41]" : "opacity-70"}
              >
                {log}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANE: Physics Sandbox */}
      <div 
        ref={sandboxRef} 
        className="w-full md:w-2/3 h-full relative bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:32px_32px] overflow-hidden"
      >
        <div className="absolute top-4 right-4 text-[10px] font-mono font-bold opacity-30 text-right uppercase">
          [INTERACTIVE_PHYSICS_HUB]<br/>
          DRAG TO INTERACT
        </div>

        <AnimatePresence mode="popLayout">
          {terminalPhase === "done" && currentDomain.skills.map((skill, idx) => {
            // Distribute somewhat randomly around the center
            const angle = (idx / currentDomain.skills.length) * Math.PI * 2;
            const dist = 60 + Math.random() * 40;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;

            return (
              <motion.div
                key={`${currentDomain.id}-${skill}`}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, x, y }}
                exit={{ opacity: 0, scale: 0, filter: "blur(4px)" }}
                transition={{ 
                  type: "spring", 
                  stiffness: 150 + Math.random() * 100, 
                  damping: 10 + Math.random() * 5,
                  delay: idx * 0.05
                }}
                drag
                dragConstraints={sandboxRef}
                dragElastic={0.5}
                whileDrag={{ scale: 1.1, cursor: "grabbing" }}
                whileHover={{ scale: 1.05 }}
                className="absolute top-1/2 left-1/2 -mt-6 -ml-12 cursor-grab border-2 border-black bg-white px-3 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-bold text-xs uppercase tracking-widest text-center min-w-[100px] z-10 hover:z-20 select-none"
              >
                {skill}
                <div className="absolute -top-1.5 -left-1.5 w-2 h-2 bg-black" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
