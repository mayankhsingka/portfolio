"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "/" && !open) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] backdrop-blur-md bg-white/70"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col gap-4 font-mono"
          >
            <div className="flex items-center gap-4 border-b-2 border-black pb-4 text-xl">
              <span className="text-black font-bold">{">"}</span>
              <input
                autoFocus
                className="w-full bg-transparent outline-none placeholder:text-black/50"
                placeholder="Enter command or path (e.g. scale_operations)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col gap-2 min-h-[300px]">
              <div className="text-sm font-bold uppercase tracking-widest border-b border-black/20 pb-1 mb-2">Available Nodes</div>
              {PORTFOLIO_DATA.commands.map((cmd) => (
                <button
                  key={cmd.path}
                  className="flex items-center justify-between p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black text-left"
                >
                  <span>{cmd.path}</span>
                  <span className="text-xs opacity-50 block uppercase">{cmd.description}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
