"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface DockedActionBarProps {
  onOpenMenu: () => void;
}

/**
 * Sticky bottom navigation bar for mobile. Replaces Ctrl+K, 
 * ChainNav, SocialSidebar, and ThemeToggle on mobile viewports.
 * 
 * 56px height. Hard brutalist aesthetic.
 */
export function DockedActionBar({ onOpenMenu }: DockedActionBarProps) {
  const router = useRouter();

  const cycleTheme = () => {
    const themes = ["", "theme-aviation", "theme-amber", "theme-matrix", "dark-ops"];
    const currentTheme = localStorage.getItem("sys_theme") || "";
    const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
    const nextTheme = themes[nextIdx];

    themes.forEach((t) => t && document.documentElement.classList.remove(t));
    if (nextTheme) document.documentElement.classList.add(nextTheme);
    localStorage.setItem("sys_theme", nextTheme);

    document.documentElement.classList.add("dark-ops-transition");
    setTimeout(() => document.documentElement.classList.remove("dark-ops-transition"), 400);
  };

  const buttons = [
    { label: "MENU", icon: "≡", action: onOpenMenu },
    { label: "PROJECTS", icon: "◆", action: () => router.push("/shipped") },
    { label: "THEME", icon: "◉", action: cycleTheme },
    { label: "CONTACT", icon: "↗", action: () => router.push("/uplink") },
  ];

  return (
    <motion.nav
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-black"
      style={{ height: 56 }}
    >
      <div className="flex h-full">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 
                       active:bg-black active:text-white transition-colors
                       border-r border-black/10 last:border-r-0
                       font-mono"
            style={{ minHeight: 48 }}
          >
            <span className="text-lg leading-none">{btn.icon}</span>
            <span className="text-[9px] uppercase tracking-widest font-bold opacity-60">
              {btn.label}
            </span>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
