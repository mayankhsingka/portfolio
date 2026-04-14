"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], action: "Open Command Palette" },
  { keys: ["Shift", "A"], action: "Toggle Identity Manifest (About)" },
  { keys: ["Shift", "C"], action: "Toggle Core Ping (Contact)" },
  { keys: ["Shift", "?"], action: "Toggle this shortcuts overlay" },
  { keys: ["DEL ×5"], action: "Enter BIOS Setup Utility" },
  { keys: ["ESC"], action: "Close any active overlay" },
];

const COMMANDS = [
  { cmd: "/play", desc: "Boot offline game protocol" },
  { cmd: "/theme", desc: "Cycle hardware phosphor filters" },
  { cmd: "/engage_surveillance", desc: "Activate ASCII camera feed" },
  { cmd: "/shipped", desc: "Deployment registry" },
  { cmd: "/internal-memos", desc: "Classified Intelligence Archive" },
  { cmd: "/breach", desc: "[REDACTED]" },
];

export function ShortcutOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "?") {
        e.preventDefault();
        setVisible((v) => !v);
      }
      if (e.key === "Escape" && visible) {
        setVisible(false);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setVisible(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-black border-4 border-white max-w-lg w-full p-8 font-mono text-white shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b-2 border-white/30 pb-4 mb-6">
              <h2 className="text-xl font-bold uppercase tracking-widest">System Controls</h2>
              <button
                onClick={() => setVisible(false)}
                className="text-xs border border-white/30 px-2 py-1 hover:bg-white hover:text-black transition-colors"
              >
                [ESC]
              </button>
            </div>

            {/* Keyboard Shortcuts */}
            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-3">Keyboard Shortcuts</h3>
            <div className="flex flex-col gap-2 mb-8">
              {SHORTCUTS.map((s, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <div className="flex gap-1">
                    {s.keys.map((k, ki) => (
                      <span key={ki}>
                        <kbd className="bg-white/10 border border-white/20 px-2 py-0.5 text-xs rounded-sm">{k}</kbd>
                        {ki < s.keys.length - 1 && <span className="mx-1 text-white/30">+</span>}
                      </span>
                    ))}
                  </div>
                  <span className="text-white/60 text-xs">{s.action}</span>
                </div>
              ))}
            </div>

            {/* Commands */}
            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-3">Command Palette (Ctrl+K)</h3>
            <div className="flex flex-col gap-2">
              {COMMANDS.map((c, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-[#00ff41] font-bold">{c.cmd}</span>
                  <span className="text-white/40 text-xs">{c.desc}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 mt-6 pt-4 text-[10px] text-white/20 uppercase tracking-widest text-center">
              Press Shift+? to toggle · ESC to close
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
