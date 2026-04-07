"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { CommandPalette } from "@/components/CommandPalette";

export default function ShippedCaseFile({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const node = PORTFOLIO_DATA.nodes.find(n => "slug" in n && n.slug === resolvedParams.slug);

  if (!node) {
    notFound();
  }

  return (
    <main className="w-full min-h-full text-black flex flex-col p-8 lg:p-24 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full z-10 flex flex-col gap-12 bg-white/90 p-8 lg:p-16 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        
        <header className="border-b-4 border-black pb-8 flex flex-col gap-6">
          <Link href="/" className="font-mono text-sm hover:underline uppercase block w-fit">
            &lt; Return to System Diagram
          </Link>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h4 className="font-mono text-sm uppercase tracking-widest opacity-50 mb-2">// ARCHITECTURE CASE FILE</h4>
              <h1 className="text-5xl font-bold uppercase tracking-tighter leading-tight">
                {node.title}
              </h1>
            </div>
            <div className="flex gap-2 shrink-0 font-mono text-xs font-bold">
              {/* Placeholders for external links */}
              <button className="border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
                [SOURCE_CODE]
              </button>
              <button className="bg-black text-white px-4 py-2 hover:bg-white hover:text-black border-2 border-black transition-colors">
                [LIVE_DEPLOYMENT]
              </button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b-2 border-black pb-12">
          <div className="md:col-span-2 flex flex-col gap-4 font-sans text-xl leading-relaxed">
            <h3 className="font-bold text-2xl uppercase tracking-tighter">System Overview</h3>
            <p>
              {node.description}
            </p>
            <p className="opacity-60 italic text-sm mt-4">[This section is reserved for your detailed architectural breakdown, challenges faced, and the solutions engineered.]</p>
          </div>
          <div className="border-l-2 border-black pl-8 flex flex-col gap-6">
            <h3 className="font-bold uppercase tracking-widest text-sm">Target Metrics</h3>
            <ul className="flex flex-col gap-4 font-mono text-sm">
              {node.metrics.map((m, i) => (
                <li key={i} className="flex flex-col">
                  <span className="opacity-50 blur-[0.5px] uppercase">{m.label}</span>
                  <span className="font-bold">{m.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
        
        <section className="flex flex-col gap-6">
          <h3 className="font-bold text-2xl uppercase tracking-tighter">Tech Stack Implementation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
            {/* Placeholder Stack - User will update this later in depth */}
            <div className="border border-black p-4">[FWD] Next.js 15</div>
            <div className="border border-black p-4">[STY] Tailwind CSS</div>
            <div className="border border-black p-4">[DB] Placeholder</div>
            <div className="border border-black p-4">[INFRA] Placeholder</div>
          </div>
        </section>

        <footer className="border-t-4 border-black pt-8 mt-12 flex justify-between items-center font-mono text-xs uppercase opacity-70">
          <span>// DEPLOYMENT SPECS END</span>
          <span>MAYANK_HIMMATSINGKA</span>
        </footer>
      </div>
      <CommandPalette />
    </main>
  );
}
