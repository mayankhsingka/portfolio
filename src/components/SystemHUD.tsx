"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function SystemHUD() {
  const [isVisible, setIsVisible] = useState(true);
  const pathname = usePathname();

  // Load visibility preference
  useEffect(() => {
    const saved = localStorage.getItem("system_hud_visible");
    if (saved === "false") setIsVisible(false);
  }, []);

  const toggleHUD = () => {
    const next = !isVisible;
    setIsVisible(next);
    localStorage.setItem("system_hud_visible", String(next));
  };

  const navItems = [
    { label: "[SYSTEM_ROOT]", path: "/" },
    { label: "[SHIPPED]", path: "/shipped" },
    { label: "[MEMOS]", path: "/internal-memos" },
  ];

  return (
    <>
      {/* Reactivate HUD Trigger (Visible when HUD is hidden) */}
      {!isVisible && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          whileHover={{ opacity: 1 }}
          onClick={toggleHUD}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] font-mono text-[10px] text-black bg-white/80 border border-black px-3 py-1 uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
        >
          [ACTIVATE_HUD_OVERLAY]
        </motion.button>
      )}

      <AnimatePresence>
        {isVisible && (
          <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="fixed top-0 left-0 w-full z-[100] flex justify-center p-4 pointer-events-none"
          >
            <div className="bg-white/95 border-2 border-black p-1 flex items-center gap-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pointer-events-auto">
              {/* Logo / Status */}
              <div className="bg-black text-white px-3 py-1.5 flex items-center gap-2 mr-2">
                <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse" />
                <span className="font-mono text-[10px] font-bold tracking-tighter">SYS_HUD_v1.2</span>
              </div>

              {/* Navigation Links */}
              {navItems.map((item) => {
                const isActive = pathname === item.path || (item.path !== "/" && pathname?.startsWith(item.path));
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`font-mono text-[11px] px-4 py-1.5 transition-all uppercase tracking-tight ${
                      isActive 
                        ? "bg-black text-white font-bold" 
                        : "text-black hover:bg-black/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              {/* Close Button */}
              <button
                onClick={toggleHUD}
                className="ml-4 border-l border-black/20 pl-4 pr-2 text-[10px] font-mono text-black/40 hover:text-red-600 transition-colors uppercase tracking-widest"
                title="Terminate HUD Overlay"
              >
                [X]
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
