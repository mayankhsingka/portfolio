"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("sys_theme");
    if (theme === "dark-ops") {
      setIsDark(true);
    } else if (localStorage.getItem("night_ops_engaged") === "true") {
      setIsDark(true);
    }
  }, []);

  const toggle = () => {
    const goingDark = !isDark;
    
    if (goingDark) {
      document.documentElement.classList.add("dark-ops");
      localStorage.setItem("sys_theme", "dark-ops");
    } else {
      document.documentElement.classList.remove("dark-ops");
      localStorage.setItem("sys_theme", "");
    }
    
    // Glitch transition
    document.documentElement.classList.add("dark-ops-transition");
    setTimeout(() => document.documentElement.classList.remove("dark-ops-transition"), 400);
    
    setIsDark(goingDark);

    window.dispatchEvent(new CustomEvent("system-log", {
      detail: goingDark ? "[OPS] Night Ops Engaged." : "[OPS] Light Ops Restored."
    }));
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.4 }}
      onClick={toggle}
      className="fixed top-4 right-4 z-[45] bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all font-mono text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 px-3 py-2 hover:bg-black hover:text-white group cursor-pointer"
      title={isDark ? "Switch to Light Ops" : "Switch to Night Ops"}
    >
      {/* Sun/Moon icon */}
      <div className="w-4 h-4 relative">
        {isDark ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </div>
      <span>{isDark ? "LIGHT_OPS" : "NIGHT_OPS"}</span>
    </motion.button>
  );
}
