"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SystemBreachProps {
  active: boolean;
  onComplete: () => void;
}

export function SystemBreach({ active, onComplete }: SystemBreachProps) {
  const [phase, setPhase] = useState<"glitch" | "message" | "done">("glitch");

  useEffect(() => {
    if (!active) {
      setPhase("glitch");
      return;
    }

    // Phase 1: Violent glitch (1.5s)
    setPhase("glitch");
    const t1 = setTimeout(() => setPhase("message"), 1500);
    // Phase 2: Breach message (2s)
    const t2 = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && phase !== "done" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 z-[200] pointer-events-none"
        >
          {/* Glitch Phase */}
          {phase === "glitch" && (
            <div className="w-full h-full bg-black relative system-breach-glitch">
              {/* Scanlines */}
              <div className="absolute inset-0 breach-scanlines" />
              
              {/* Color channel splits */}
              <div className="absolute inset-0 flex items-center justify-center breach-text-glitch">
                <div className="font-mono text-6xl md:text-8xl font-bold text-white tracking-widest breach-text-shake">
                  ERROR
                </div>
              </div>

              {/* Random noise blocks */}
              <div className="absolute top-[20%] left-[10%] w-32 h-4 bg-red-500 opacity-80 breach-block-flash" />
              <div className="absolute top-[45%] left-[60%] w-48 h-3 bg-white opacity-60 breach-block-flash-delayed" />
              <div className="absolute top-[70%] left-[30%] w-24 h-6 bg-red-600 opacity-70 breach-block-flash" />
              <div className="absolute top-[85%] left-[75%] w-40 h-2 bg-white opacity-50 breach-block-flash-delayed" />
            </div>
          )}

          {/* Message Phase */}
          {phase === "message" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full bg-black flex items-center justify-center"
            >
              <div className="text-center flex flex-col items-center gap-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="font-mono text-red-500 text-6xl md:text-8xl font-bold tracking-widest"
                >
                  ⚠ BREACH DETECTED
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-mono text-white/60 text-sm uppercase tracking-[0.3em]"
                >
                  Security protocols engaged — Clearance elevated to ROOT
                </motion.div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 1.5 }}
                  className="w-64 h-1 bg-red-500 origin-left"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
