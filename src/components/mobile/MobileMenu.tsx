"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useClearanceContext } from "@/components/ClearanceProvider";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { path: "/shipped", label: "Deployment Registry", desc: "Shipped projects & case files" },
  { path: "/internal-memos", label: "Intelligence Archive", desc: "Technical memos & blog" },
  { path: "/matrix", label: "Skill Matrix", desc: "Interactive competency map" },
  { path: "/commands", label: "Terminal Sandbox", desc: "Execute system commands" },
  { path: "/core-identity", label: "Operator Profile", desc: "Identity & background" },
  { path: "/uplink", label: "Secure Uplink", desc: "Get in touch" },
];

/**
 * Full-screen mobile navigation menu. Slides up from bottom.
 * Clean, professional, and large touch targets.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const router = useRouter();
  const { level } = useClearanceContext();

  const navigate = (path: string) => {
    onClose();
    setTimeout(() => router.push(path), 150);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={onClose}
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 35 }}
            className="fixed bottom-0 left-0 right-0 z-[61] bg-white border-t-2 border-black max-h-[85vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-black">
              <div>
                <h2 className="font-bold text-xl uppercase tracking-tight">System Directory</h2>
                <span className="font-mono text-[10px] opacity-50 uppercase">
                  Clearance: {level}
                </span>
              </div>
              <button
                onClick={onClose}
                className="border-2 border-black px-3 py-2 font-mono text-sm font-bold uppercase 
                           active:bg-black active:text-white transition-colors"
                style={{ minHeight: 44 }}
              >
                Close
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex flex-col">
              {MENU_ITEMS.map((item, i) => (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-start p-4 border-b border-black/30
                             active:bg-black active:text-white transition-colors text-left"
                  style={{ minHeight: 56 }}
                >
                  <span className="font-bold text-base uppercase tracking-tight">
                    {item.label}
                  </span>
                  <span className="text-xs opacity-50 font-mono mt-0.5">
                    {item.desc}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="p-4 border-t-2 border-black">
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-50 mb-3">
                Quick Actions
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Resume", action: () => window.open("/resume.pdf", "_blank") },
                  { label: "GitHub", action: () => window.open("https://github.com/mayankhsingka", "_blank") },
                  { label: "LinkedIn", action: () => window.open("https://linkedin.com/in/mayankhsingka", "_blank") },
                ].map((qa) => (
                  <button
                    key={qa.label}
                    onClick={qa.action}
                    className="border-2 border-black py-3 font-mono text-xs font-bold uppercase
                               active:bg-black active:text-white transition-colors"
                    style={{ minHeight: 48 }}
                  >
                    {qa.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom padding for safe area */}
            <div className="h-6" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
