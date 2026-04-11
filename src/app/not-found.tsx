"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SystemGrid } from "@/components/SystemGrid";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (!isRedirecting) return;
    
    if (countdown === 0) {
      router.push("/");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isRedirecting, router]);

  return (
    <main className="w-full h-full bg-black text-white font-mono overflow-hidden flex items-center justify-center relative">
      {/* 
        We use a modified version of the grid directly here to avoid 
        triggering global state or provider issues.
      */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <SystemGrid>
          <div />
        </SystemGrid>
      </div>

      {/* Glitch Overlay Effect */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0, 0.2, 0.1, 0.3, 0.2],
          x: [0, -2, 2, -1, 0],
        }}
        transition={{ 
          duration: 0.2, 
          repeat: Infinity,
          repeatType: "mirror" 
        }}
        className="absolute inset-0 bg-red-500/5 mix-blend-screen pointer-events-none"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="z-10 w-full max-w-lg bg-white p-8 border-4 border-black shadow-[16px_16px_0px_0px_rgba(255,0,0,0.5)] text-black"
      >
        <div className="flex flex-col gap-6">
          <header className="border-b-4 border-black pb-4">
            <h1 className="text-6xl font-black italic tracking-tighter text-red-600">0x404</h1>
            <p className="text-xs font-bold uppercase tracking-widest mt-2">[SYSTEM_INTEGRITY_VIOLATION]</p>
          </header>

          <section className="flex flex-col gap-4 text-sm leading-relaxed">
            <div className="bg-black text-white p-3 border-l-4 border-red-600">
              <span className="text-red-400">CRITICAL:</span> The requested resource/sector is unmapped or has been decommissioned.
            </div>
            
            <div className="opacity-70 italic">
              // Potential memory leak or invalid pointer access.
              <br />
              // Initializing recovery protocols...
            </div>
          </section>

          <footer className="mt-4 flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-bold bg-black/5 p-3 border border-black/20">
              <span>AUTO_RECOVERY: HOME_BASE</span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={countdown}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-600"
                >
                  {countdown}s
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex gap-4">
              <Link 
                href="/"
                className="flex-1 bg-black text-white text-center py-3 font-bold hover:bg-red-600 transition-colors uppercase tracking-widest text-xs"
              >
                [REBOOT_NOW]
              </Link>
              <button 
                onClick={() => setIsRedirecting(false)}
                className={`flex-1 border-2 border-black py-3 font-bold transition-all uppercase tracking-widest text-xs ${
                  !isRedirecting ? 'bg-black text-white' : 'hover:bg-black/5'
                }`}
              >
                {isRedirecting ? '[ABORT_RECOVERY]' : '[RECOVERY_ABORTED]'}
              </button>
            </div>
          </footer>
        </div>
      </motion.div>

      {/* Terminal background noise */}
      <div className="absolute bottom-4 left-4 text-[10px] opacity-20 pointer-events-none select-none">
        SEGMENTATION_FAULT. RESOURCE_NOT_FOUND. 0x404. BUFFER_OVERFLOW_SHIELD_ACTIVE.
      </div>
    </main>
  );
}
