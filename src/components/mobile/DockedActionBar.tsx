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
    const themes = ["", "theme-aviation", "dark-ops"];
    const currentTheme = localStorage.getItem("sys_theme") || "";
    const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
    const nextTheme = themes[nextIdx];

    ["", "theme-aviation", "theme-amber", "theme-matrix", "dark-ops"].forEach((t) => t && document.documentElement.classList.remove(t));
    if (nextTheme) document.documentElement.classList.add(nextTheme);
    localStorage.setItem("sys_theme", nextTheme);

    document.documentElement.classList.add("dark-ops-transition");
    setTimeout(() => document.documentElement.classList.remove("dark-ops-transition"), 400);
  };

  const buttons = [
    { label: "MENU", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>, action: onOpenMenu },
    { label: "PLATFORMS", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>, action: () => router.push("/shipped") },
    { label: "THEME", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>, action: cycleTheme },
    { label: "CONTACT", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>, action: () => router.push("/ping") },
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
                       border-r border-black/30 last:border-r-0
                       font-mono"
          >
            <span className="text-lg leading-none">{btn.icon}</span>
            <span className="text-[9px] uppercase tracking-widest font-bold">
              {btn.label}
            </span>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
