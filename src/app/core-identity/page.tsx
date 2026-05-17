"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ScrambleText } from "@/components/ScrambleText";
import { TypewriterHeading } from "@/components/TypewriterHeading";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { usePageScrollable } from "@/hooks/usePageScrollable";
import { PageHeaderNav } from "@/components/PageHeaderNav";

const SKILLS = [
  { name: "SYSTEM_ARCHITECTURE", level: 98, status: "OPTIMIZED", details: "Designing scalable, high-throughput systems." },
  { name: "RAPID_PROTOTYPING", level: 95, status: "ACTIVE", details: "Zero to one execution speed." },
  { name: "UI_ENGINEERING", level: 92, status: "CALIBRATING", details: "Brutalist, high-performance interfaces." },
  { name: "DB_OPTIMIZATION", level: 88, status: "NOMINAL", details: "PostgreSQL, Edge KV, and RLS policies." },
  { name: "PRODUCT_STRATEGY", level: 96, status: "LOCKED_IN", details: "Aligning technical stack with business physics." }
];

const PRINCIPLES = [
  {
    title: "1. Optimisation over Bloatisation",
    content: "In every industry, I feel there have been overburdening of resources like RAM in the Computer world. Earlier systems were made efficient and made to run on low memory, but now companies and people ship products quick while optimising the resources isn't being looked at. I love optimising things, I hate Electron Based Apps, I run Windows 10/Linux with a boring Sublime Text. Applications consuming 10GBs of RAM at idle isn't great what I feel. (Unable to find a chromium substitute/will switch soon)"
  },
  {
    title: "2. Influence In Environments",
    content: "I believe influence plays a great role, and environments shape the operator. A clean, raw workspace—both physical and digital—dictates clarity of thought. The tools we surround ourselves with directly impact the systems we architect."
  },
  {
    title: "3. Brutal Utility Over Aesthetics",
    content: "True design serves function. A beautiful system that fails under load is a failed system. Form must follow function, stripping away unnecessary abstraction until only raw, performant utility remains."
  },
  {
    title: "4. Systems Thinking From Day Zero",
    content: "The best engineers don't just build features; they architect systems. Every component must be designed with its eventual scale and operational load in mind, preventing architectural debt before it accrues."
  },
  {
    title: "5. Execution Velocity",
    content: "Speed is a feature. Shipping a functional product is infinitely more valuable than perfecting a local branch. Iterate fast, fail fast, and optimize relentlessly."
  }
];

function ExpandablePrinciple({ title, content }: { title: string, content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-2 border-black/20 p-4 hover:border-black transition-colors cursor-pointer group" onClick={() => setIsOpen(!isOpen)}>
      <div className="flex justify-between items-center font-bold tracking-tight uppercase">
        <h4 className="text-[15px] md:text-lg">{title}</h4>
        <span className="font-mono text-xl opacity-50 group-hover:opacity-100 transition-opacity">{isOpen ? "[-]" : "[+]"}</span>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="font-mono text-sm opacity-80 mt-4 leading-relaxed border-l-2 border-black/20 pl-4">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CoreIdentityPage() {
  usePageScrollable();
  const [decrypting, setDecrypting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDecrypting(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col p-4 lg:p-12 overflow-visible relative">
      <div className="max-w-5xl mx-auto w-full z-10 flex flex-col gap-8">

        <header className="border-b-4 border-current pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8 md:mt-0">
          <div>
            <h4 className="font-mono text-sm uppercase tracking-widest opacity-50 mb-2">// OPERATOR_DOSSIER</h4>
            <TypewriterHeading
              text="/core-identity"
              className="text-5xl lg:text-7xl font-bold uppercase tracking-tighter"
            />
          </div>
          <PageHeaderNav theme="light" />
        </header>

        {decrypting ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] font-mono">
            <div className="w-64 h-8 border-2 border-current relative overflow-hidden mb-4">
              <motion.div
                className="absolute inset-0 bg-current"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "linear" }}
              />
            </div>
            <div className="uppercase tracking-widest text-sm animate-pulse">
              <ScrambleText>Decrypting Operator Profile...</ScrambleText>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Col: Basic Info */}
            <div className="col-span-1 border-2 border-current p-6 font-mono relative group hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.15)] transition-shadow h-fit">
              <div className="absolute top-0 right-0 bg-current text-[var(--background)] text-[10px] px-2 py-1 font-bold uppercase">SEC_LEVEL: ALPHA</div>

              <div className="w-full aspect-square border-2 border-current/20 mb-6 flex items-center justify-center bg-current/5 relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-current/40 scanline-anim z-10" />
                <img
                  src="/profile.jpg"
                  alt="Mayank Himmatsingka"
                  className="w-full h-full object-cover relative z-0 preserve-color"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute bottom-2 left-2 text-[10px] text-[var(--background)] z-10 bg-[var(--foreground)]/60 px-1">SYS.IMG.VERIFIED</div>
              </div>

              <div className="space-y-4 text-xs lg:text-sm">
                <div className="flex justify-between border-b border-current/20 pb-2">
                  <span className="opacity-50">DESIGNATION:</span>
                  <span className="font-bold">{PORTFOLIO_DATA.general.name}</span>
                </div>
                <div className="flex justify-between border-b border-current/20 pb-2">
                  <span className="opacity-50">ROLE:</span>
                  <span className="font-bold text-right pl-4">{PORTFOLIO_DATA.general.role}</span>
                </div>
                <div className="flex justify-between border-b border-current/20 pb-2">
                  <span className="opacity-50">AGE_CYCLE:</span>
                  <span className="font-bold">{PORTFOLIO_DATA.general.age}</span>
                </div>
                <div className="flex justify-between border-b border-current/20 pb-2">
                  <span className="opacity-50">STATUS:</span>
                  <span className="font-bold animate-pulse">ACTIVE_DEPLOYMENT</span>
                </div>
              </div>
            </div>

            {/* Right Col: Deep Profile & Skills */}
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">

              {/* Directive Section */}
              <div className="border-l-4 border-current pl-6 py-2">
                <h3 className="font-mono text-[10px] opacity-50 uppercase tracking-[0.3em] mb-2">Primary Directive</h3>
                <p className="font-sans text-xl lg:text-3xl font-bold uppercase tracking-tighter leading-tight opacity-90">
                  <ScrambleText>{PORTFOLIO_DATA.general.philosophy}</ScrambleText>
                </p>
              </div>

              {/* Arsenal Section */}
              <div className="border-2 border-current p-6 font-mono flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b border-current/20 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Hardware / Software Arsenal</h3>
                  <span className="text-[10px] bg-current/10 px-2 py-0.5">LOCAL_ENV</span>
                </div>
                <div className="text-sm opacity-80 leading-relaxed space-y-4">
                  <p>I absolutely love using <span className="font-bold opacity-100">Linux</span> for its raw power and control.</p>
                  <p>I execute all my tasks on a <span className="font-bold bg-current/10 px-1 py-0.5">12GB RAM laptop</span>, keeping things grounded and strictly avoiding resource bloat.</p>
                  <p>My primary IDE is a beautifully boring, ultra-fast <span className="font-bold opacity-100">Sublime Text</span>.</p>
                  <p>Lately, <span className="font-bold underline decoration-dashed underline-offset-4">Antigravity</span> has been my vibe coding friend, amplifying my execution velocity.</p>
                </div>
              </div>

              {/* Operating Principles */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-2xl font-bold uppercase tracking-tighter">Operating Principles</h3>
                  <div className="h-0.5 flex-1 bg-current/20" />
                </div>
                <div className="flex flex-col gap-3">
                  {PRINCIPLES.map(p => (
                    <ExpandablePrinciple key={p.title} title={p.title} content={p.content} />
                  ))}
                </div>
              </div>

              {/* Skills Visualizer */}
              <div className="border-2 border-current p-6 font-mono flex flex-col mt-4">
                <div className="flex justify-between items-center mb-6 border-b border-current/20 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Capability Matrix</h3>
                  <span className="text-[10px] bg-current/10 px-2 py-0.5">LIVE_TELEMETRY</span>
                </div>

                <div className="flex flex-col gap-6">
                  {SKILLS.map((skill, index) => (
                    <div key={skill.name} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold tracking-widest">{skill.name}</span>
                        <div className="text-right">
                          <span className="text-[10px] opacity-50 block">{skill.details}</span>
                          <span className="text-xs">{skill.status} // {skill.level}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-current/10 relative overflow-hidden">
                        <motion.div
                          className="absolute left-0 top-0 h-full bg-current"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matrix Call to Action */}
              <div className="border-4 border-current p-6 md:p-8 flex flex-col items-center text-center mt-4 group hover:bg-current hover:text-[var(--background)] transition-colors relative overflow-hidden">
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 relative z-10">Access The Matrix</h3>
                <p className="font-mono text-sm opacity-80 mb-8 max-w-lg relative z-10 group-hover:opacity-100 font-bold">
                  To view my exact competency nodes, detailed operational history, and an interactive map of my technical skills, visit the Matrix. It&apos;s where the raw system data lives.
                </p>
                <Link
                  href="/matrix"
                  className="border-4 border-current px-8 py-4 font-mono text-sm font-bold uppercase tracking-widest relative z-10 bg-current text-[var(--background)] group-hover:bg-[var(--background)] group-hover:text-current hover:scale-[1.02] transition-transform shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] group-hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.4)]"
                >
                  [ INITIATE UPLINK TO MATRIX ]
                </Link>
              </div>

              <div className="flex justify-end gap-4 font-mono text-xs opacity-50 uppercase tracking-widest mt-8">
                <span>[ DOSSIER_END ]</span>
                <span>END_OF_TRANSMISSION</span>
              </div>
            </div>

          </motion.div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanline-drop { 0% { top: -10px; } 100% { top: 100%; } }
        .scanline-anim { animation: scanline-drop 3s linear infinite; }
      `}} />
    </main>
  );
}
