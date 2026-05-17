"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("sys_theme");
    if (theme === "dark-ops" || localStorage.getItem("night_ops_engaged") === "true") {
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
    document.documentElement.classList.add("dark-ops-transition");
    setTimeout(() => document.documentElement.classList.remove("dark-ops-transition"), 400);
    setIsDark(goingDark);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Light theme" : "Dark theme"}
      className="fixed top-4 right-4 z-[45] w-10 h-10 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center cursor-pointer hover:bg-black hover:text-white text-black"
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </motion.button>
  );
}
