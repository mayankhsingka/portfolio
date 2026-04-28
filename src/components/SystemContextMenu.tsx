"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSystemAudio } from "@/hooks/useSystemAudio";

export function SystemContextMenu() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(false);
  const { playSnap, playKeystroke } = useSystemAudio();

  useEffect(() => {
    // Check initial dark mode state
    setIsDark(document.documentElement.classList.contains("dark-ops"));

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setPos({ x: e.clientX, y: e.clientY });
      setOpen(true);
      playSnap();
    };

    const handleClick = () => {
      if (open) setOpen(false);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
    };
  }, [open, playSnap]);

  const handleAction = (action: string) => {
    playKeystroke();
    setOpen(false);

    switch(action) {
      case "copy_coord":
        navigator.clipboard.writeText(`X:${pos.x} Y:${pos.y}`);
        break;
      case "toggle_dark":
        const dark = document.documentElement.classList.contains("dark-ops");
        if (dark) {
          document.documentElement.classList.remove("dark-ops");
          localStorage.setItem("sys_theme", "");
          setIsDark(false);
        } else {
          document.documentElement.classList.add("dark-ops");
          localStorage.setItem("sys_theme", "dark-ops");
          setIsDark(true);
        }
        document.documentElement.classList.add("dark-ops-transition");
        setTimeout(() => document.documentElement.classList.remove("dark-ops-transition"), 400);
        break;
      case "breach":
        window.dispatchEvent(new CustomEvent("system-breach"));
        break;
      case "source":
        window.open("https://github.com/mankuu-10", "_blank");
        break;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.1 }}
          style={{ top: pos.y, left: pos.x }}
          className="fixed z-[100] bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black font-mono text-sm w-48 flex flex-col"
        >
          <div className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest flex justify-between">
            <span>SYS_MENU</span>
            <span>[{pos.x},{pos.y}]</span>
          </div>
          
          <button 
            onClick={() => handleAction("copy_coord")}
            className="text-left px-3 py-2 hover:bg-black hover:text-white transition-colors border-b border-black/10 uppercase font-bold text-xs"
          >
            Copy Coordinates
          </button>
          
          <button 
            onClick={() => handleAction("toggle_dark")}
            className="text-left px-3 py-2 hover:bg-black hover:text-white transition-colors border-b border-black/10 uppercase font-bold text-xs"
          >
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          
          <button 
            onClick={() => handleAction("breach")}
            className="text-left px-3 py-2 hover:bg-black hover:text-white transition-colors border-b border-black/10 uppercase font-bold text-xs"
          >
            Breach System
          </button>
          
          <button 
            onClick={() => handleAction("source")}
            className="text-left px-3 py-2 hover:bg-black hover:text-white transition-colors uppercase font-bold text-xs"
          >
            Source Code
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
