"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* The actual page content, expanding like a CRT monitor turning on */}
      <motion.div
        initial={{ scaleY: 0.005, opacity: 0, filter: "brightness(2) contrast(1.5)" }}
        animate={{ scaleY: 1, opacity: 1, filter: "brightness(1) contrast(1)" }}
        transition={{ 
          duration: 0.4, 
          ease: "circOut",
          filter: { duration: 0.5 }
        }}
        className="h-full w-full origin-center"
      >
        {children}
      </motion.div>
      
      {/* CRT Scanline pass on mount */}
      <motion.div 
        initial={{ top: "-20%" }}
        animate={{ top: "120%" }}
        transition={{ duration: 0.6, ease: "linear" }}
        className="pointer-events-none fixed left-0 right-0 h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent z-[100] mix-blend-overlay"
      />
    </div>
  );
}
