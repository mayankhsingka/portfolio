"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { CommandPalette } from "@/components/CommandPalette";
import { usePageScrollable } from "@/hooks/usePageScrollable";

// Typewriter — first visit only, then instant
function useTypewriter(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const key = `typed_${text.slice(0, 30).replace(/\s/g, "_")}`;
    if (sessionStorage.getItem(key)) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setDone(true);
        sessionStorage.setItem(key, "1");
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayed, done };
}

export default function ShippedCaseFile({ params }: { params: Promise<{ slug: string }> }) {
  usePageScrollable();

  const resolvedParams = use(params);
  const node = PORTFOLIO_DATA.nodes.find(n => "slug" in n && n.slug === resolvedParams.slug);

  if (!node) {
    notFound();
  }

  const sourceUrl = (node as any).sourceUrl;
  const liveUrl = (node as any).liveUrl;
  const techStack = (node as any).techStack as { label: string; value: string; reason?: string }[] | undefined;
  const problem = (node as any).problem as string | undefined;
  const archDecisions = (node as any).architectureDecisions as string[] | undefined;
  const challenges = (node as any).challenges as { title: string; detail: string }[] | undefined;
  const impact = (node as any).impact as string | undefined;
  const fileId = (node as any).fileId || "CASE_000";

  const { displayed: typedProblem, done: typingDone } = useTypewriter(problem || node.description, 18);
  const [hoveredTech, setHoveredTech] = useState<number | null>(null);

  return (
    <main className="w-full min-h-screen text-black flex flex-col p-8 lg:p-24 bg-black">
      <div className="max-w-4xl mx-auto w-full z-10 flex flex-col gap-12 bg-white/90 p-8 lg:p-16 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="border-b-4 border-black pb-8 flex flex-col gap-6"
        >
          <Link href="/shipped" className="font-mono text-sm hover:underline uppercase block w-fit">
            &lt; Return to Deployment Registry
          </Link>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h4 className="font-mono text-sm uppercase tracking-widest opacity-50 mb-2">// ARCHITECTURE CASE FILE — {fileId}</h4>
              <h1 className="text-5xl font-bold uppercase tracking-tighter leading-tight">
                {node.title}
              </h1>
              {liveUrl && liveUrl !== "#" && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                  className="font-mono text-xs opacity-40 hover:opacity-100 hover:underline transition-opacity mt-1 block w-fit">
                  → {liveUrl.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
            <div className="flex gap-2 shrink-0 font-mono text-xs font-bold">
              {sourceUrl && sourceUrl !== "#" ? (
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
                  [SOURCE_CODE]
                </a>
              ) : (
                <span className="border-2 border-black/30 px-4 py-2 text-black/30 cursor-not-allowed">[SOURCE_CODE]</span>
              )}
              {liveUrl && liveUrl !== "#" ? (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer"
                  className="bg-black text-white px-4 py-2 hover:bg-white hover:text-black border-2 border-black transition-colors">
                  [LIVE_DEPLOYMENT]
                </a>
              ) : (
                <span className="bg-black/30 text-white/70 px-4 py-2 border-2 border-black/30 cursor-not-allowed">[LIVE_DEPLOYMENT]</span>
              )}
            </div>
          </div>
        </motion.header>

        {/* SYSTEM OVERVIEW + METRICS */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b-2 border-black pb-12"
        >
          <div className="md:col-span-2 flex flex-col gap-4 font-sans text-xl leading-relaxed">
            <h3 className="font-bold text-2xl uppercase tracking-tighter">System Overview</h3>
            <p className="text-sm border-l-2 border-black pl-3 opacity-60 italic">{node.description}</p>
            <div className="text-lg leading-relaxed mt-2">
              {typedProblem}
              {!typingDone && <span className="typewriter-cursor" />}
            </div>
          </div>
          <div className="border-l-2 border-black pl-8 flex flex-col gap-6">
            <h3 className="font-bold uppercase tracking-widest text-sm">Target Metrics</h3>
            <ul className="flex flex-col gap-4 font-mono text-sm">
              {node.metrics.map((m, i) => (
                <li key={i} className="flex flex-col">
                  <span className="opacity-50 uppercase">{m.label}</span>
                  <span className="font-bold">{m.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        {/* ARCHITECTURE DECISIONS */}
        {archDecisions && archDecisions.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-6 border-b-2 border-black pb-12"
          >
            <h3 className="font-bold text-2xl uppercase tracking-tighter">Architecture Decisions</h3>
            <div className="flex flex-col gap-4">
              {archDecisions.map((decision, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="font-mono text-xs font-bold opacity-30 shrink-0 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-sm leading-relaxed border-l-2 border-black/15 pl-4">{decision}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* CHALLENGES & SOLUTIONS */}
        {challenges && challenges.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-6 border-b-2 border-black pb-12"
          >
            <h3 className="font-bold text-2xl uppercase tracking-tighter">Challenges & Solutions</h3>
            <div className="flex flex-col gap-6">
              {challenges.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="border-2 border-black p-5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 uppercase">INCIDENT_{String(i + 1).padStart(2, "0")}</span>
                    <h4 className="font-bold uppercase tracking-tight">{c.title}</h4>
                  </div>
                  <p className="text-sm leading-relaxed opacity-80 pl-4 border-l-2 border-black/15">{c.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
        
        {/* TECH STACK — with hover reasons */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35 }}
          className="flex flex-col gap-6 border-b-2 border-black pb-12"
        >
          <h3 className="font-bold text-2xl uppercase tracking-tighter">Tech Stack Implementation</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-mono text-sm">
            {techStack ? (
              techStack.map((tech, i) => (
                <div
                  key={i}
                  className="border-2 border-black p-4 hover:bg-black hover:text-white transition-all cursor-default"
                  onMouseEnter={() => setHoveredTech(i)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  <span className="text-xs opacity-50 block uppercase">[{tech.label}]</span>
                  <span className="font-bold">{tech.value}</span>
                  {tech.reason && hoveredTech === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-[11px] mt-2 pt-2 border-t border-current/20 leading-relaxed font-sans"
                    >
                      {tech.reason}
                    </motion.div>
                  )}
                </div>
              ))
            ) : (
              <div className="border border-black/30 p-4 text-black/40">[DATA_PENDING]</div>
            )}
          </div>
        </motion.section>

        {/* IMPACT */}
        {impact && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-bold text-2xl uppercase tracking-tighter">Impact</h3>
            <div className="bg-black text-white p-6 font-mono text-sm leading-relaxed shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
              <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-2">[SYSTEM_REPORT]</span>
              {impact}
            </div>
          </motion.section>
        )}

        <footer className="border-t-4 border-black pt-8 mt-4 flex justify-between items-center font-mono text-xs uppercase opacity-70">
          <span>// DEPLOYMENT SPECS END</span>
          <span>MAYANK_HIMMATSINGKA</span>
        </footer>
      </div>
      <CommandPalette />
    </main>
  );
}
