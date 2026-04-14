"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { isProjectNode } from "@/data/types";
import { CommandPalette } from "@/components/CommandPalette";
import { usePageScrollable } from "@/hooks/usePageScrollable";

export default function ShippedIndex() {
  usePageScrollable();

  const shippedProjects = PORTFOLIO_DATA.nodes.filter(isProjectNode);

  // Build ticker string from project telemetry
  const tickerText = shippedProjects
    .map((p) => `▸ ${p.title.toUpperCase()}: ${p.telemetry}`)
    .join("   ");
  const doubledTicker = `${tickerText}   ${tickerText}`;

  return (
    <main className="w-full min-h-screen text-black flex flex-col p-8 lg:p-24 bg-black">
      <div className="max-w-4xl mx-auto w-full z-10 flex flex-col gap-12 bg-white/90 p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Status Ticker inside the box */}
        <div className="w-full border-2 border-black bg-black text-white font-mono text-xs uppercase tracking-widest overflow-hidden py-2 -mt-2">
          <div className="ticker-scroll whitespace-nowrap">
            {doubledTicker}
          </div>
        </div>

        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="border-b-4 border-black pb-8 flex flex-col md:flex-row justify-between md:items-end gap-4"
        >
          <div>
            <h4 className="font-mono text-sm uppercase tracking-widest opacity-50 mb-2">// DEPLOYMENT REGISTRY</h4>
            <h1 className="text-5xl font-bold uppercase tracking-tighter">/shipped</h1>
            <p className="font-mono mt-4 text-sm max-w-xl">
              [SYS_LOG]: Architecture deployments currently in production or active scaling. Each node represents a shipped system.
            </p>
          </div>
          <Link href="/" className="font-mono text-sm hover:bg-black hover:text-white px-3 py-2 transition-colors border-2 border-black uppercase tracking-widest shrink-0 h-fit">
            [RETURN TO ROOT]
          </Link>
        </motion.header>

        <div className="flex flex-col gap-8">
          {shippedProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.1 }}
            >
              <Link
                href={`/shipped/${project.slug}`}
                className="group border-2 border-black p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all bg-white relative block"
              >
                {/* File tab */}
                <div className="absolute -top-[1px] left-6 bg-black text-white font-mono text-[10px] px-3 py-0.5 uppercase tracking-widest">
                  {project.fileId}
                </div>

                <div className="flex justify-between items-start mb-4 mt-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs bg-black text-white px-2 py-0.5 uppercase">{project.status}</span>
                    <h2 className="text-3xl font-bold uppercase tracking-tighter group-hover:underline">
                      {project.title}
                    </h2>
                  </div>
                  <span className="font-mono text-xs opacity-50 uppercase shrink-0 mt-2 group-hover:opacity-100 transition-opacity">CASE_FILE →</span>
                </div>
                {project.liveUrl && project.liveUrl !== "#" && (
                  <span className="font-mono text-[10px] opacity-30 group-hover:opacity-60 transition-opacity block mb-1">
                    → {project.liveUrl.replace(/^https?:\/\//, "")}
                  </span>
                )}

                <p className="text-sm border-l-2 border-black pl-4 mb-6 max-w-2xl">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-3 font-mono text-xs">
                  {project.metrics.map((m, mi) => (
                    <div key={mi} className="border border-black/30 px-3 py-1.5">
                      <span className="opacity-50">{m.label}: </span>
                      <span className="font-bold">{m.value}</span>
                    </div>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <footer className="border-t-4 border-black pt-8 flex justify-between items-center font-mono text-xs uppercase opacity-70">
          <span>// {shippedProjects.length} DEPLOYMENTS INDEXED</span>
          <span>MAYANK_HIMMATSINGKA</span>
        </footer>
      </div>
      <CommandPalette />
    </main>
  );
}
