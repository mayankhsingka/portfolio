"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { InteractiveBios } from "@/components/InteractiveBios";

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isBooting, setIsBooting] = useState(true);
  const [inBios, setInBios] = useState(false);

  // Parse accurate system data for the boot sequence
  const bootScript = [
    `[INIT] Booting System Architecture...`,
    `[SYS] Operator identified: ${PORTFOLIO_DATA.general.name}`,
    `[SYS] Mapping core directives: Velocity, Scale, UX.`,
    `[MEM] Injecting node dependencies...`,
    `[OK] Node <${PORTFOLIO_DATA.nodes.find(n => n.id === "exp_1")?.title}> loaded into memory.`,
    `[OK] Node <${PORTFOLIO_DATA.nodes.find(n => n.id === "exp_2")?.title}> loaded into memory.`,
    `[SEC] Root access confirmed.`,
    `[OK] Launching UI.`
  ];

  useEffect(() => {
    if (inBios) return;
    let currentIndex = 0;
    
    // Incrementally show logs
    const interval = setInterval(() => {
      if (currentIndex < bootScript.length) {
        setLogs(prev => [...prev, bootScript[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsBooting(false);
          setTimeout(onComplete, 500); // Wait for fade out animation
        }, 500); // Hold final log for half a second
      }
    }, 150); // Fast 150ms per line print

    const handleKey = (e: KeyboardEvent) => {
       if (e.key === "Delete" || e.key === "Backspace") {
          setInBios(true);
       }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
        clearInterval(interval);
        window.removeEventListener("keydown", handleKey);
    };
  }, [inBios, onComplete]);

  return (
    <AnimatePresence>
      {inBios && <InteractiveBios onExit={() => {
         setInBios(false);
         setIsBooting(false);
         onComplete(); 
      }} />}

      {!inBios && isBooting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] bg-black text-white flex flex-col justify-end p-8 font-mono text-sm uppercase tracking-widest pointer-events-none"
        >
          <div 
             className="absolute top-8 left-8 text-white font-bold cursor-pointer hover:text-red-500 transition-colors z-[200]"
             onClick={() => setInBios(true)}
          >
             Press <span className="text-red-500">[DEL]</span> to enter SETUP
          </div>

          <div className="flex flex-col gap-2 max-w-4xl">
            {logs.map((log, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1 }}
              >
                {log}
              </motion.div>
            ))}
            {/* Blinking cursor */}
            <motion.div 
              animate={{ opacity: [1, 0, 1] }} 
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-3 h-5 bg-white mt-1"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
