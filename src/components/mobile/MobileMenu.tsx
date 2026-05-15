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
  { path: "/ping", label: "Secure Uplink", desc: "Get in touch" },
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
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "LinkedIn", href: "https://linkedin.com/in/mayankhsingka", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg> },
                  { label: "GitHub", href: "https://github.com/mayankhsingka", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg> },
                  { label: "Calendly", href: "https://calendly.com/mayankhsingka", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
                  { label: "Mail", href: "mailto:mayankhsingka@gmail.com", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg> },
                ].map((qa) => (
                  <a
                    key={qa.label}
                    href={qa.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-2 border-black flex items-center justify-center gap-2 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors"
                    style={{ minHeight: 48 }}
                  >
                    {qa.icon}
                    <span>{qa.label}</span>
                  </a>
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
