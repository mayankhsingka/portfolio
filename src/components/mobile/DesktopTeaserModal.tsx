"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

interface DesktopTeaserModalProps {
  onClose: () => void;
}

export function DesktopTeaserModal({ onClose }: DesktopTeaserModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-[var(--background)] text-[var(--foreground)] border-4 border-current shadow-[8px_8px_0px_0px_currentColor] p-6 max-h-[85vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 opacity-50 hover:opacity-100"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="font-mono text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
          // SYSTEM UPGRADE REQUIRED
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight mb-6 leading-none">
          Unlock The Architecture
        </h2>

        <p className="text-sm opacity-80 mb-8 border-l-2 border-current pl-4">
          You are currently viewing the restricted Mobile PDA interface. The true System Blueprint requires a minimum 10-inch viewport.
        </p>

        <div className="flex flex-col gap-6 mb-8">
          {/* Feature 1 */}
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 border-2 border-current shrink-0 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
            <div>
              <h3 className="font-bold uppercase text-sm">Infinite Canvas</h3>
              <p className="text-xs opacity-70 mt-1">Free-roam draggable workspace mapping out the entire system architecture organically.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 border-2 border-current shrink-0 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
            </div>
            <div>
              <h3 className="font-bold uppercase text-sm">Terminal Sandbox</h3>
              <p className="text-xs opacity-70 mt-1">Full keyboard-driven command line interface to execute local operations and clear directories.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 border-2 border-current shrink-0 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
            </div>
            <div>
              <h3 className="font-bold uppercase text-sm">Orbital Navigation</h3>
              <p className="text-xs opacity-70 mt-1">Physics-based chain nav and radial dial to hyper-jump across the blueprint.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-4 bg-current text-[var(--background)] font-mono font-bold text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
        >
          Acknowledge
        </button>
      </motion.div>
    </div>
  );
}
