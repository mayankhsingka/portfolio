"use client";

import Link from "next/link";
import { MEMOS_DATA } from "@/data/memos";
import { PageHeaderNav } from "@/components/PageHeaderNav";
import { useEffect, useState } from "react";
import { usePageScrollable } from "@/hooks/usePageScrollable";

export default function InternalMemosIndex() {
  usePageScrollable();
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("saved_memos");
    if (saved) {
      try {
        setSavedSlugs(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <main className="w-full min-h-full text-black flex flex-col p-4 sm:p-8 lg:p-24 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full z-10 flex flex-col gap-8 sm:gap-12 bg-white/90 p-4 sm:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        
        <header className="border-b-4 border-black pb-6 sm:pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="break-all sm:break-normal">
            <h1 className="text-3xl sm:text-5xl font-bold uppercase tracking-tighter">/internal-memos</h1>
            <p className="font-mono mt-4 text-sm max-w-xl">
              [SYSTEM_LOGS]: Operational thoughts, architecture philosophies, and deep focus transmissions. Read-only.
            </p>
          </div>
          <PageHeaderNav theme="light" />
        </header>

        <div className="flex flex-col gap-8">
          {MEMOS_DATA.map((memo) => {
            const isSaved = savedSlugs.includes(memo.slug);
            return (
              <article key={memo.slug} className="border-2 border-black p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-white relative">
                {isSaved && (
                  <div className="absolute top-0 right-0 bg-black text-white font-mono text-xs px-2 py-1 uppercase font-bold">
                    [BOOKMARKED]
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline border-b-2 border-black pb-2 mb-4 gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight">
                    <Link href={`/internal-memos/${memo.slug}`} className="hover:underline">
                      {memo.title}
                    </Link>
                  </h2>
                  <time className="font-mono text-[10px] sm:text-xs cursor-crosshair shrink-0">{memo.date}</time>
                </div>
                
                <p className="mb-6 font-mono text-sm">{memo.excerpt}</p>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {memo.tags.map(tag => (
                      <span key={tag} className="text-xs border border-black px-1 font-mono uppercase bg-black/5 cursor-crosshair">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link 
                    href={`/internal-memos/${memo.slug}`}
                    className="font-bold text-sm bg-black text-white hover:bg-white hover:text-black border-2 border-black px-4 py-2 transition-colors uppercase tracking-widest"
                  >
                    Read Transmission
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
