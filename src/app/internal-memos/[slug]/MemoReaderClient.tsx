"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MEMOS_DATA } from "@/data/memos";
import { TypewriterHeading } from "@/components/TypewriterHeading";
import { CommandPalette } from "@/components/CommandPalette";
import { usePageScrollable } from "@/hooks/usePageScrollable";

export default function MemoReader({ params }: { params: Promise<{ slug: string }> }) {
  usePageScrollable();
  const resolvedParams = use(params);
  const memo = MEMOS_DATA.find(m => m.slug === resolvedParams.slug);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);

  if (!memo) {
    notFound();
  }

  useEffect(() => {
    const saved = localStorage.getItem("saved_memos");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIsSaved(parsed.includes(memo.slug));
      } catch (e) {
        console.error(e);
      }
    }
  }, [memo.slug]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isReadingMode) {
        setIsReadingMode(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReadingMode]);

  const toggleBookmark = () => {
    let currentSaved: string[] = [];
    const saved = localStorage.getItem("saved_memos");
    if (saved) {
      try { currentSaved = JSON.parse(saved); } catch (e) {}
    }

    if (isSaved) {
      currentSaved = currentSaved.filter(s => s !== memo.slug);
      setIsSaved(false);
    } else {
      currentSaved.push(memo.slug);
      setIsSaved(true);
    }
    
    localStorage.setItem("saved_memos", JSON.stringify(currentSaved));
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="w-full min-h-screen text-black flex flex-col p-4 md:p-8 lg:p-24 overflow-visible md:pl-[19rem]">
      <div className="max-w-3xl mx-auto w-full z-10 flex flex-col gap-12 bg-white/90 p-4 md:p-8 lg:p-16 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        
        <header className="flex flex-col gap-6">
          <Link href="/internal-memos" className="font-mono text-sm hover:underline uppercase block w-fit">
            &lt; Back to Log Index
          </Link>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <TypewriterHeading 
              text={memo.title} 
              className="text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-tight"
            />
            <div className="flex flex-wrap gap-2 shrink-0 font-mono text-xs font-bold mt-2 md:mt-0">
              <button 
                onClick={() => setIsReadingMode(true)}
                className="border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-colors"
              >
                [READ_MODE]
              </button>
              <button 
                onClick={copyUrl}
                className="border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-colors"
              >
                {copied ? "[COPIED]" : "[COPY_LINK]"}
              </button>
              <button 
                onClick={toggleBookmark}
                className={`border-2 border-black px-2 py-1 transition-colors ${
                  isSaved ? "bg-black text-white" : "hover:bg-black hover:text-white"
                }`}
              >
                {isSaved ? "[BOOKMARKED]" : "[BOOKMARK]"}
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center font-mono text-xs">
            <time className="cursor-crosshair">FILE_DATE: {memo.date}</time>
            <div className="flex gap-2">
              {memo.tags.map(tag => <span key={tag} className="cursor-crosshair">#{tag}</span>)}
            </div>
          </div>
          <div className="w-full text-center font-mono text-[10px] md:text-xs opacity-50 select-none overflow-hidden whitespace-nowrap mt-4">
             ╠════════════════[ DECRYPTED_LOG_FILE ]════════════════╣
          </div>
        </header>

        <article className="flex flex-col gap-6 font-sans text-lg md:text-xl leading-relaxed">
          {memo.content.map((paragraph, idx) => {
            const isTerminal = paragraph.startsWith("[");
            return (
              <p 
                key={idx} 
                className={`${isTerminal ? "font-mono text-sm bg-black text-white p-4 uppercase tracking-widest border border-black" : ""}`}
              >
                {paragraph}
              </p>
            );
          })}
        </article>

        <div className="w-full text-center font-mono text-[10px] md:text-xs opacity-50 select-none overflow-hidden whitespace-nowrap mb-8">
           ╠════════════════[ END_OF_TRANSMISSION ]════════════════╣
        </div>
        <footer className="flex justify-between items-center font-mono text-xs uppercase opacity-70">
          <span>// SYS_CONNECTION_TERMINATED</span>
          <span className="cursor-crosshair">MAYANK_HIMMATSINGKA</span>
        </footer>
      </div>
      <CommandPalette />

      {/* READING MODE OVERLAY */}
      <AnimatePresence>
        {isReadingMode && (
          <motion.div 
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[99999] bg-[#fdfbf7] overflow-y-auto text-[#2b2b2b] selection:bg-[#2b2b2b] selection:text-[#fdfbf7]"
          >
            <div className="max-w-2xl mx-auto py-16 px-6 md:py-24 md:px-8 relative min-h-screen">
              <button 
                onClick={() => setIsReadingMode(false)}
                className="fixed top-6 right-6 md:top-10 md:right-10 font-mono text-[10px] md:text-xs opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2 uppercase tracking-widest border border-transparent hover:border-[#2b2b2b] px-3 py-1.5 rounded-full"
              >
                <span>[ESC] TO EXIT</span>
                <span className="text-lg leading-none">×</span>
              </button>

              <div className="flex flex-col gap-6 font-serif">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 tracking-tight">{memo.title}</h1>
                <div className="flex gap-4 font-mono text-[10px] md:text-xs opacity-40 uppercase tracking-widest mb-12 border-b border-[#2b2b2b]/10 pb-8">
                  <span>{memo.date}</span>
                  <span>•</span>
                  <span>{memo.content.join(" ").split(" ").length} WORDS</span>
                  <span>•</span>
                  <span>{Math.ceil(memo.content.join(" ").split(" ").length / 200)} MIN READ</span>
                </div>

                {memo.content.map((paragraph, idx) => {
                  const isTerminal = paragraph.startsWith("[");
                  return (
                    <p 
                      key={idx} 
                      className={`${isTerminal ? "font-mono text-sm bg-[#2b2b2b] text-[#fdfbf7] p-6 rounded-md shadow-inner mt-8 mb-8 leading-relaxed" : "text-xl md:text-2xl leading-[1.8] md:leading-[1.9] mb-8 opacity-90 text-[#333333]"}`}
                    >
                      {paragraph}
                    </p>
                  );
                })}
              </div>
              
              <div className="mt-24 pt-8 border-t border-[#2b2b2b]/10 flex justify-center opacity-30">
                <div className="w-2 h-2 rounded-full bg-[#2b2b2b]" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
