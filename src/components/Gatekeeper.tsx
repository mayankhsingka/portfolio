"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrambleText } from "./ScrambleText";

interface GatekeeperProps {
  onComplete: (persona: "dev" | "recruiter") => void;
}

export function Gatekeeper({ onComplete }: GatekeeperProps) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (isDev: boolean) => {
    const newScore = score + (isDev ? 1 : 0);
    setScore(newScore);
    
    if (step === 0) {
      setStep(1);
    } else {
      // Determine persona
      const finalPersona = newScore >= 1 ? "dev" : "recruiter";
      localStorage.setItem("user_persona", finalPersona);
      onComplete(finalPersona);
    }
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black text-[#00ff41] font-mono flex flex-col items-center justify-center p-6 selection:bg-[#00ff41] selection:text-black">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_right,#00ff4112_1px,transparent_1px),linear-gradient(to_bottom,#00ff4112_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="max-w-2xl w-full flex flex-col gap-8 relative z-10">
        <div className="border border-[#00ff41]/30 p-2 text-xs uppercase tracking-widest text-center opacity-70">
          [ SYSTEM INITIALIZATION :: IDENTIFY USER INTENT ]
        </div>

        <div className="h-40 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="q1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-8">
                  <ScrambleText>Identify your primary objective:</ScrambleText>
                </h2>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => handleAnswer(true)}
                    className="border border-[#00ff41] p-4 hover:bg-[#00ff41] hover:text-black transition-colors uppercase tracking-widest text-sm text-left"
                  >
                    [ A ] Evaluate technical architecture & raw source
                  </button>
                  <button 
                    onClick={() => handleAnswer(false)}
                    className="border border-[#00ff41] p-4 hover:bg-[#00ff41] hover:text-black transition-colors uppercase tracking-widest text-sm text-left"
                  >
                    [ B ] Review professional background & experience
                  </button>
                </div>
              </motion.div>
            )}
            
            {step === 1 && (
              <motion.div
                key="q2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-8">
                  <ScrambleText>Select interface preference:</ScrambleText>
                </h2>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => handleAnswer(true)}
                    className="border border-[#00ff41] p-4 hover:bg-[#00ff41] hover:text-black transition-colors uppercase tracking-widest text-sm text-left"
                  >
                    [ A ] Raw system access / Brutalist terminal
                  </button>
                  <button 
                    onClick={() => handleAnswer(false)}
                    className="border border-[#00ff41] p-4 hover:bg-[#00ff41] hover:text-black transition-colors uppercase tracking-widest text-sm text-left"
                  >
                    [ B ] Start Card Mode (15-Card Summary)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
