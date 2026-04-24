"use client";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";

const SOCIAL_LINKS = [
  {
    label: "EMAIL",
    url: `mailto:${PORTFOLIO_DATA.general.contactEmail}`,
    isExternal: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    )
  },
  {
    label: "LINKEDIN",
    url: PORTFOLIO_DATA.general.linkedinUrl,
    isExternal: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  },
  {
    label: "GITHUB",
    url: PORTFOLIO_DATA.general.githubUrl,
    isExternal: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-1 1.25-1.11 2.69-1 4 .09 1.4.52 2.76 1 4 0 3.5 3 5.5 6 5.5a4.8 4.8 0 0 0-1 3.5v4" />
      </svg>
    )
  },
  {
    label: "CALL",
    url: `tel:${PORTFOLIO_DATA.general.phone || ""}`,
    isExternal: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    )
  },
];

export function SocialSidebar() {
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed left-5 bottom-8 z-[45] flex flex-col gap-1 pointer-events-auto"
    >
      {/* Container */}
      <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col">
        {/* Header */}
        <div className="bg-black text-white font-mono text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 text-center">
          Channels
        </div>
        
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target={link.isExternal ? "_blank" : undefined}
            rel={link.isExternal ? "noopener noreferrer" : undefined}
            className="group flex items-center gap-3 px-3 py-2.5 text-black/50 hover:text-black hover:bg-black/5 transition-all border-b border-black/10 last:border-b-0"
            title={link.label}
          >
            <div className="shrink-0 group-hover:scale-110 transition-transform">
              {link.icon}
            </div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest group-hover:tracking-[0.3em] transition-all">
              {link.label}
            </span>
          </a>
        ))}
      </div>
    </motion.div>
  );
}
