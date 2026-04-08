"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MEMOS_DATA } from "@/data/memos";
import { CommandPalette } from "@/components/CommandPalette";
import { useEffect, useState } from "react";
import { usePageScrollable } from "@/hooks/usePageScrollable";

export default function MemoReader({ params }: { params: Promise<{ slug: string }> }) {
  usePageScrollable();
  const resolvedParams = use(params);
  const memo = MEMOS_DATA.find(m => m.slug === resolvedParams.slug);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

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
    <main className="w-full min-h-full text-black flex flex-col p-8 lg:p-24 overflow-y-auto">
      <div className="max-w-3xl mx-auto w-full z-10 flex flex-col gap-12 bg-white/90 p-8 lg:p-16 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        
        <header className="border-b-4 border-black pb-8 flex flex-col gap-6">
          <Link href="/internal-memos" className="font-mono text-sm hover:underline uppercase block w-fit">
            &lt; Back to Log Index
          </Link>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter leading-tight">
              {memo.title}
            </h1>
            <div className="flex gap-2 shrink-0 font-mono text-xs font-bold">
              <button 
                onClick={copyUrl}
                className="border-2 border-black px-2 py-1 hover:bg-black hover:text-white transition-colors"
              >
                {copied ? "[COPIED]" : "[COPY LINK]"}
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
          <div className="flex justify-between items-center font-mono text-sm">
            <time>FILE_DATE: {memo.date}</time>
            <div className="flex gap-2">
              {memo.tags.map(tag => <span key={tag}>#{tag}</span>)}
            </div>
          </div>
        </header>

        <article className="flex flex-col gap-6 font-sans text-lg md:text-xl leading-relaxed">
          {memo.content.map((paragraph, idx) => {
            // Apply brutalist terminal font mapping if paragraph starts with [
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

        <footer className="border-t-4 border-black pt-8 mt-12 flex justify-between items-center font-mono text-xs uppercase opacity-70">
          <span>// END OF TRANSMISSION</span>
          <span>MAYANK_HIMMATSINGKA</span>
        </footer>
      </div>
      <CommandPalette />
    </main>
  );
}
