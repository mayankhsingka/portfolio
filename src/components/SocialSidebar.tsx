"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";

type Channel = {
  label: string;
  url: string;
  isExternal: boolean;
  icon: React.ReactNode;
};

const CHANNELS: Channel[] = [
  {
    label: "Email",
    url: `mailto:${PORTFOLIO_DATA.general.contactEmail}`,
    isExternal: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="w-[18px] h-[18px]">
        <rect width="20" height="16" x="2" y="4" rx="1" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    url: PORTFOLIO_DATA.general.linkedinUrl,
    isExternal: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="w-[18px] h-[18px]">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    url: PORTFOLIO_DATA.general.githubUrl,
    isExternal: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="w-[18px] h-[18px]">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: "Schedule",
    url: "https://calendly.com/mayankhsingka",
    isExternal: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="w-[18px] h-[18px]">
        <rect width="18" height="18" x="3" y="4" rx="1" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    label: `+91 ${PORTFOLIO_DATA.general.phone}`,
    url: `tel:+91${PORTFOLIO_DATA.general.phone}`,
    isExternal: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="w-[18px] h-[18px]">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
];

export function SocialSidebar() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className="fixed left-4 bottom-6 z-[45] pointer-events-auto"
    >
      <div className="relative flex flex-col gap-1.5">
        {/* Vertical "CONNECT" label hugging the strip */}
        <div className="absolute -top-3 left-0 right-0 flex items-center justify-center pointer-events-none">
          <span className="bg-black text-white font-mono text-[8px] font-bold uppercase tracking-[0.25em] px-1.5 py-[2px]">
            connect
          </span>
        </div>

        {CHANNELS.map((ch, i) => (
          <div key={ch.label} className="relative">
            <motion.a
              href={ch.url}
              target={ch.isExternal ? "_blank" : undefined}
              rel={ch.isExternal ? "noopener noreferrer" : undefined}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              whileTap={{ scale: 0.95 }}
              className="block w-10 h-10 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:bg-black hover:text-white transition-all flex items-center justify-center cursor-pointer text-black"
              aria-label={ch.label}
            >
              {ch.icon}
            </motion.a>

            {/* Slide-out label */}
            <AnimatePresence>
              {hoveredIdx === i && (
                <motion.div
                  initial={{ x: -8, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-black text-white font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1.5 whitespace-nowrap pointer-events-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
                >
                  {ch.label}
                  {/* Arrow */}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 border-y-[5px] border-y-transparent border-r-[6px] border-r-black" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
