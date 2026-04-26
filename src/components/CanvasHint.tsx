"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CanvasHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 8 seconds
    const timer = setTimeout(() => setVisible(false), 8000);
    
    // Also hide on any key press or palette open
    const hideOnAction = () => setVisible(false);
    window.addEventListener("keydown", hideOnAction);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", hideOnAction);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[44] pointer-events-none flex flex-col items-center gap-3"
        >
          {/* Shortcut hints */}
          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] px-5 py-3 flex items-center gap-6 font-mono text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <kbd className="bg-black text-white px-1.5 py-0.5 text-[9px]">CTRL+K</kbd>
              <span className="opacity-50">Commands</span>
            </div>
            <div className="w-[1px] h-4 bg-black/20" />
            <div className="flex items-center gap-2">
              <kbd className="bg-black text-white px-1.5 py-0.5 text-[9px]">SHIFT+A</kbd>
              <span className="opacity-50">About</span>
            </div>
            <div className="w-[1px] h-4 bg-black/20" />
            <div className="flex items-center gap-2">
              <kbd className="bg-black text-white px-1.5 py-0.5 text-[9px]">SHIFT+C</kbd>
              <span className="opacity-50">Contact</span>
            </div>
            <div className="w-[1px] h-4 bg-black/20" />
            <div className="flex items-center gap-2">
              <kbd className="bg-black text-white px-1.5 py-0.5 text-[9px]">SHIFT+N</kbd>
              <span className="opacity-50">Orbital</span>
            </div>
            <div className="w-[1px] h-4 bg-black/20" />
            <div className="flex items-center gap-2">
              <kbd className="bg-black text-white px-1.5 py-0.5 text-[9px]">DRAG</kbd>
              <span className="opacity-50">Explore</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
