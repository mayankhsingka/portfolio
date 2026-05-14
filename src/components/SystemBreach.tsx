"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SystemBreachProps {
  active: boolean;
  onComplete: () => void;
}

export function SystemBreach({ active, onComplete }: SystemBreachProps) {
  const [stars, setStars] = useState<any[]>([]);
  const [escapePhase, setEscapePhase] = useState<0 | 1 | 2>(0);

  // Generate the "Galaxy" once active
  useEffect(() => {
    if (active && stars.length === 0) {
      const newStars = Array.from({ length: 300 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 5 + 3,
        delay: Math.random() * -10,
        color: Math.random() > 0.9 ? '#ff003c' : Math.random() > 0.7 ? '#00e5ff' : '#ffffff',
        // Some stars are deeply blurred for a 3D parallax feel
        blur: Math.random() > 0.5 ? Math.random() * 4 : 0
      }));
      setStars(newStars);
      setEscapePhase(0);
    }
  }, [active]);

  // Handle the psychological ESC key sequence
  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleAttemptEscape();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, escapePhase]);

  const handleAttemptEscape = () => {
    if (escapePhase === 0) {
      setEscapePhase(1);
      // Reset back to 0 if they hesitate
      setTimeout(() => {
        setEscapePhase(prev => prev === 1 ? 0 : prev);
      }, 3000);
    } else if (escapePhase === 1) {
      setEscapePhase(2);
      setTimeout(() => {
        onComplete();
        setEscapePhase(0);
        setStars([]); // Reset for next time
      }, 1000); // Dramatic zoom exit
    }
  };

  if (!active) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, filter: "brightness(5) blur(10px)", scale: 1.5 }}
        transition={{ duration: escapePhase === 2 ? 0.8 : 2 }}
        className="fixed inset-0 z-[9999] bg-black overflow-hidden flex items-center justify-center pointer-events-auto"
      >
        {/* Psychological Escape Button - Top Left */}
        <div className="absolute top-8 left-8 z-[10000]">
          <button
            onClick={handleAttemptEscape}
            className={`font-mono text-xs md:text-sm font-bold tracking-widest border-2 px-6 py-3 transition-all duration-300 ${escapePhase === 0
                ? "border-white/20 text-white/50 hover:border-white hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : escapePhase === 1
                  ? "border-red-500 text-red-500 bg-red-500/10 animate-pulse shadow-[0_0_20px_rgba(255,0,0,0.6)]"
                  : "border-white bg-white text-black scale-110"
              }`}
          >
            {escapePhase === 0 ? "[ ESCAPE ]" : escapePhase === 1 ? "ARE YOU SURE?" : "TERMINATING..."}
          </button>
        </div>

        {/* The Galaxy / Random Starfield */}
        <div className="absolute inset-0 perspective-[1000px] overflow-hidden mix-blend-screen">
          <motion.div
            animate={{
              rotateZ: [0, 360],
              scale: escapePhase === 1 ? 1.2 : escapePhase === 2 ? 8 : 1
            }}
            transition={{
              rotateZ: { duration: 300, repeat: Infinity, ease: "linear" },
              scale: { duration: escapePhase === 2 ? 1 : 2, ease: "easeInOut" }
            }}
            className="absolute inset-[-50%] w-[200%] h-[200%]"
          >
            {stars.map(star => (
              <motion.div
                key={star.id}
                className="absolute rounded-full"
                style={{
                  top: star.top,
                  left: star.left,
                  width: star.size,
                  height: star.size,
                  backgroundColor: star.color,
                  boxShadow: `0 0 ${star.size * 3}px ${star.color}`,
                  filter: `blur(${star.blur}px)`
                }}
                animate={{
                  opacity: [0.1, 1, 0.1],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* Central Data Core / Black Hole */}
        <motion.div
          animate={{
            scale: escapePhase === 1 ? 0.9 : escapePhase === 2 ? 0 : [1, 1.05, 1],
            boxShadow: escapePhase === 1
              ? "0 0 100px rgba(255,0,0,0.4), inset 0 0 50px rgba(255,0,0,0.5)"
              : "0 0 80px rgba(255,255,255,0.05), inset 0 0 40px rgba(255,255,255,0.05)"
          }}
          transition={{
            scale: { duration: escapePhase > 0 ? 0.5 : 4, repeat: escapePhase === 0 ? Infinity : 0, ease: "easeInOut" }
          }}
          className={`relative w-64 h-64 md:w-96 md:h-96 rounded-full flex items-center justify-center z-10 backdrop-blur-sm transition-colors duration-1000 ${escapePhase === 1 ? "bg-red-500/5 border border-red-500/30" : "bg-white/5 border border-white/10"
            }`}
        >
          {/* Orbital Rings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-0 rounded-full border-t-2 border-b-2 ${escapePhase === 1 ? 'border-red-500/50' : 'border-white/30'}`}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-6 rounded-full border-l-2 border-r-2 ${escapePhase === 1 ? 'border-red-500/40' : 'border-white/20'}`}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className={`absolute inset-12 rounded-full border-t border-b border-dashed ${escapePhase === 1 ? 'border-red-500/30' : 'border-white/10'}`}
          />

          <div className={`font-mono text-center tracking-[0.5em] font-bold ${escapePhase === 1 ? 'text-red-500' : 'text-white/80'}`}>
            <motion.div
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[10px] md:text-xs mb-2"
            >
              SEC_CLEARANCE: ROOT
            </motion.div>
            <div className="text-xl md:text-3xl uppercase tracking-widest">
              {escapePhase === 0 ? "BREACH_ACTIVE" : escapePhase === 1 ? "FATAL_ERROR" : "CRITICAL"}
            </div>
          </div>
        </motion.div>

        {/* Global CRT Scanlines */}
        <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] mix-blend-overlay opacity-60" />
      </motion.div>
    </AnimatePresence>
  );
}
