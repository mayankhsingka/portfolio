"use client";

import { motion } from "framer-motion";

interface MobileAbortButtonProps {
  onAbort: () => void;
  label?: string;
}

/**
 * Universal escape hatch for fullscreen overlays on mobile.
 * Replaces the ESC key. Fixed position above the docked bar.
 */
export function MobileAbortButton({ onAbort, label = "Exit" }: MobileAbortButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      onClick={onAbort}
      className="fixed bottom-20 left-4 right-4 z-[9999] bg-white border-2 border-black 
                 text-black font-mono text-sm font-bold uppercase tracking-widest
                 py-4 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                 active:bg-black active:text-white transition-colors"
      style={{ minHeight: 48 }}
    >
      ✕ {label}
    </motion.button>
  );
}
