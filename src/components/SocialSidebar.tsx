"use client";

import { useState, useRef } from "react";

import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";

const SOCIAL_LINKS = [
  {
    label: "GITHUB",
    url: PORTFOLIO_DATA.general.githubUrl,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-1 1.25-1.11 2.69-1 4 .09 1.4.52 2.76 1 4 0 3.5 3 5.5 6 5.5a4.8 4.8 0 0 0-1 3.5v4" />
      </svg>
    )
  },
  {
    label: "LINKEDIN",
    url: PORTFOLIO_DATA.general.linkedinUrl,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    )
  },
  {
    label: "X_ARCHIVE",
    url: "https://x.com/mayankhsingka", // Assuming standard handle
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </svg>
    )
  }
];

function SidebarLink({ link }: { link: typeof SOCIAL_LINKS[0] }) {
  const [coords, setCoords] = useState("X: --.-- | Y: --.--");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCycling = () => {
    intervalRef.current = setInterval(() => {
      const x = (Math.random() * 100).toFixed(2).padStart(5, '0');
      const y = (Math.random() * 100).toFixed(2).padStart(5, '0');
      setCoords(`X: ${x} | Y: ${y}`);
    }, 50);
  };

  const stopCycling = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCoords("X: --.-- | Y: --.--");
  };

  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ x: 4, color: "#000" }}
      className="group flex items-center gap-4 text-black/30 hover:text-black transition-colors"
      title={link.label}
      onMouseEnter={startCycling}
      onMouseLeave={stopCycling}
    >
      <div className="relative">
        {link.icon}
        {/* Hover ripple */}
        <motion.div 
          className="absolute inset-0 bg-black/5 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300" 
        />
      </div>
      <span className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap w-24">
        {coords}
      </span>
    </motion.a>
  );
}

export function SocialSidebar() {
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="fixed left-6 bottom-12 z-[100] flex flex-col gap-8"
    >
      {/* Connector line */}
      <div className="absolute left-1/2 -top-12 w-[1px] h-full bg-black/10 -z-10" />
      
      {SOCIAL_LINKS.map((link) => (
        <SidebarLink key={link.label} link={link} />
      ))}

      {/* Origin indicator */}
      <div className="pt-4 border-t border-black/10 flex flex-col items-center">
        <div className="w-1.5 h-1.5 bg-black rounded-full" />
        <span className="font-mono text-[8px] text-black/20 uppercase tracking-tighter mt-1 rotate-90 origin-left translate-x-[4px] translate-y-[15px] whitespace-nowrap">
          Connectivity_Fixed
        </span>
      </div>
    </motion.div>
  );
}
