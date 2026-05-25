"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";

const TOTAL_CARDS = 15;

// Synthesize 15 cards summarizing the portfolio
const CARDS = [
  { id: 1, title: "HELLO.", type: "intro", content: `I'm ${PORTFOLIO_DATA.general.name}. Welcome to my summary.` },
  { id: 2, title: "ROLE", type: "info", content: "Software Engineer & Systems Architect. Building fast, scalable, and brutalist digital experiences." },
  { id: 3, title: "PHILOSOPHY", type: "quote", content: `"${PORTFOLIO_DATA.general.philosophy}"` },
  { id: 4, title: "EXPERTISE", type: "list", content: "React, Next.js, TypeScript, PostgreSQL, Node.js, Motion Design, Systems Architecture." },
  { id: 5, title: "CURRENT MISSION", type: "info", content: "I treat code like a weapon. Precise, optimized, and built for maximum impact without unnecessary noise." },
  
  // Projects
  { id: 6, title: "CASE 01", type: "project", content: "MANASYA — A Zero-Trust, secure emotional resilience platform. Anonymous uplinks for student mental health." },
  { id: 7, title: "CASE 02", type: "project", content: "PRODUCIVE — Algorithm Warfare. A Chrome Extension that acts as a firewall for your attention span." },
  { id: 8, title: "CASE 03", type: "project", content: "THE MATRIX — This very portfolio. A brutalist, interactive terminal experience for power users." },
  
  // Principles / Memos
  { id: 9, title: "PRINCIPLE I", type: "principle", content: "The Attention Economy is hostile. You must build personal systems of constraint." },
  { id: 10, title: "PRINCIPLE II", type: "principle", content: "Influence is a protocol. Architect it by understanding the human stack." },
  { id: 11, title: "PRINCIPLE III", type: "principle", content: "A system should look like what it does. Strip the fluff. Expose the mechanics." },

  // Summary
  { id: 12, title: "TIMELINE", type: "info", content: "Coding since the early 2020s. Evolving every day. Currently focused on full-stack mastery." },
  { id: 13, title: "AVAILABILITY", type: "info", content: "Open for impactful roles. Let's build systems that matter." },
  { id: 14, title: "CONNECT", type: "link", content: "Email: mayankhsingka@gmail.com\nLocation: Rourkela, India" },
  { id: 15, title: "END OF FILE", type: "action", content: "You've read the summary. Ready to enter the raw system?" },
];

// Top card with drag + rotation physics
function SwipeableCard({ card, onDismiss }: { card: typeof CARDS[0]; onDismiss: () => void }) {
  const x = useMotionValue(0);
  // Rotate based on drag position — subtle, like a real card in hand
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      onDismiss();
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, y: 20, opacity: 0 }}
      animate={{ scale: 1, y: 0, zIndex: 100, opacity: 1 }}
      exit={{ 
        x: x.get() > 0 ? 400 : -400,
        opacity: 0, 
        scale: 0.85,
        rotate: x.get() > 0 ? 15 : -15,
        transition: { duration: 0.3 }
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity }}
      className="absolute inset-0 bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col p-8 cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-auto">
        <span className="font-mono text-[10px] uppercase font-bold bg-black text-white px-2 py-1 tracking-wider">
          {card.id} / {TOTAL_CARDS}
        </span>
        <span className="font-mono text-[10px] text-black/40 uppercase font-bold tracking-widest">
          {card.type}
        </span>
      </div>

      <div className="my-auto py-4">
        <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter leading-none mb-6">
          {card.title}
        </h2>
        <p className="text-base sm:text-lg font-medium text-[#222] whitespace-pre-wrap leading-relaxed">
          {card.content}
        </p>
      </div>

      <div className="mt-auto pt-6 border-t-2 border-black/10 flex justify-between items-center text-black/30">
        <span className="text-[10px] uppercase font-bold tracking-widest">&larr; swipe</span>
        <span className="text-[10px] uppercase font-bold tracking-widest">swipe &rarr;</span>
      </div>
    </motion.div>
  );
}

export function CardMode() {
  const [cards, setCards] = useState(CARDS);
  const [isFinished, setIsFinished] = useState(false);

  const currentIndex = TOTAL_CARDS - cards.length; // 0-indexed progress
  const progress = ((currentIndex) / TOTAL_CARDS) * 100;

  const handleDismiss = useCallback(() => {
    setCards(prev => {
      const next = prev.slice(1);
      if (next.length === 0) setIsFinished(true);
      return next;
    });
  }, []);

  const handleEnterSystem = () => {
    localStorage.setItem("user_persona", "dev");
    window.location.reload();
  };

  const handleResetPersona = () => {
    localStorage.removeItem("user_persona");
    window.location.reload();
  };

  if (isFinished) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center text-black font-sans p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="font-mono text-xs uppercase tracking-widest text-black/40 mb-6">15 / 15 — Complete</div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4">Summary Complete</h1>
          <p className="text-lg mb-10 max-w-md text-center text-[#666]">
            You&apos;ve reviewed all 15 cards. Ready to explore the full system?
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={handleEnterSystem}
              className="px-8 py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-[#222] transition-colors border-2 border-black"
            >
              Initialize Terminal
            </button>
            <button 
              onClick={handleResetPersona}
              className="px-8 py-3 bg-white text-black/50 font-mono text-xs uppercase tracking-widest hover:text-black transition-colors"
            >
              [ Reset Preference ]
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#f0f0f0] flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Subtle grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* ── Progress Bar ── */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-[420px] mx-auto px-6 pt-6 pb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold text-black/40">
              {currentIndex + 1} / {TOTAL_CARDS}
            </span>
            <button 
              onClick={() => {
                localStorage.removeItem("user_persona");
                window.location.reload();
              }}
              className="font-mono text-[10px] uppercase tracking-widest font-bold text-black/30 hover:text-black transition-colors"
            >
              [ exit ]
            </button>
          </div>
          {/* Track */}
          <div className="w-full h-[3px] bg-black/10 relative">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-black"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            />
          </div>
        </div>
      </div>

      {/* ── Card Stack ── */}
      <div className="relative w-full max-w-[320px] aspect-[3/4] sm:max-w-[380px]">
        <AnimatePresence>
          {/* Background cards (static, no drag) */}
          {cards.slice(1, 3).map((card, i) => {
            const stackIndex = i + 1; // 1 or 2
            return (
              <motion.div
                key={card.id}
                animate={{ 
                  scale: 1 - stackIndex * 0.04, 
                  y: stackIndex * 12,
                  zIndex: 50 - stackIndex,
                  opacity: 1 - stackIndex * 0.15
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute inset-0 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.6)] pointer-events-none"
              />
            );
          })}

          {/* Top card — interactive */}
          {cards.length > 0 && (
            <SwipeableCard 
              key={cards[0].id}
              card={cards[0]} 
              onDismiss={handleDismiss} 
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-6 text-center font-mono text-[10px] uppercase tracking-widest font-bold text-black/25">
        Drag card left or right to continue
      </div>
    </div>
  );
}
