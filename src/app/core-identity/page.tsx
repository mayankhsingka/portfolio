"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ScrambleText } from "@/components/ScrambleText";
import { TypewriterHeading } from "@/components/TypewriterHeading";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { CommandPalette } from "@/components/CommandPalette";
import { usePageScrollable } from "@/hooks/usePageScrollable";

const SKILLS = [
  { name: "SYSTEM_ARCHITECTURE", level: 98, status: "OPTIMIZED", details: "Designing scalable, high-throughput systems." },
  { name: "RAPID_PROTOTYPING", level: 95, status: "ACTIVE", details: "Zero to one execution speed." },
  { name: "UI_ENGINEERING", level: 92, status: "CALIBRATING", details: "Brutalist, high-performance interfaces." },
  { name: "DB_OPTIMIZATION", level: 88, status: "NOMINAL", details: "PostgreSQL, Edge KV, and RLS policies." },
  { name: "PRODUCT_STRATEGY", level: 96, status: "LOCKED_IN", details: "Aligning technical stack with business physics." }
];

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
    <main className="w-full min-h-screen bg-black text-white flex flex-col p-4 lg:p-12 overflow-visible relative selection:bg-white selection:text-black md:pl-[19rem]">
      {/* Background static / scanline */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MiIgaGVpZ2h0PSI0MiI+CjxwYXRoIGQ9Ik0wIDBoNDJ2NDJIMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+')] mix-blend-overlay" />
      
      <div className="max-w-5xl mx-auto w-full z-10 flex flex-col gap-8">
        
        <header className="border-b-4 border-white pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8 md:mt-0">
          <div>
            <h4 className="font-mono text-sm uppercase tracking-widest opacity-50 mb-2 text-white">// OPERATOR_DOSSIER</h4>
            <TypewriterHeading 
              text="/core-identity" 
              className="text-5xl lg:text-7xl font-bold uppercase tracking-tighter" 
            />
          </div>
          <Link href="/" className="font-mono text-sm hover:bg-white hover:text-black px-4 py-2 transition-colors border-2 border-white uppercase tracking-widest shrink-0">
            [RETURN TO ROOT]
          </Link>
        </header>

        {decrypting ? (
          <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] font-mono text-white">
            <div className="w-64 h-8 border-2 border-white relative overflow-hidden mb-4">
              <motion.div 
                className="absolute inset-0 bg-white" 
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
            <div className="col-span-1 border-2 border-white p-6 font-mono relative group hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-shadow">
              <div className="absolute top-0 right-0 bg-white text-black text-[10px] px-2 py-1 font-bold uppercase">SEC_LEVEL: ALPHA</div>
              
              <div className="w-full aspect-square border-2 border-white/20 mb-6 flex items-center justify-center bg-white/5 relative overflow-hidden group">
                <div className="absolute top-0 w-full h-1 bg-white/50 scanline-anim z-10 shadow-[0_0_10px_var(--sys-white)]" />
                <img 
                  src="/profile.jpg" 
                  alt="Mayank Himmatsingka" 
                  className="w-full h-full object-cover relative z-0 preserve-color"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute bottom-2 left-2 text-[10px] text-white z-10 bg-black/50 px-1">SYS.IMG.VERIFIED</div>
              </div>

              <div className="space-y-4 text-xs lg:text-sm">
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="opacity-50">DESIGNATION:</span>
                  <span className="font-bold">{PORTFOLIO_DATA.general.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="opacity-50">ROLE:</span>
                  <span className="font-bold text-right pl-4">{PORTFOLIO_DATA.general.role}</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2">
                  <span className="opacity-50">AGE_CYCLE:</span>
                  <span className="font-bold">{PORTFOLIO_DATA.general.age}</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-2 text-white">
                  <span className="opacity-50 text-white">STATUS:</span>
                  <span className="font-bold animate-pulse">ACTIVE_DEPLOYMENT</span>
                </div>
              </div>
            </div>

            {/* Right Col: Deep Profile & Skills */}
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
              
              {/* Directive Section */}
              <div className="border-l-4 border-white pl-6 py-2">
                <h3 className="font-mono text-[10px] opacity-50 uppercase tracking-[0.3em] mb-2">Primary Directive</h3>
                <p className="font-sans text-xl lg:text-3xl font-bold uppercase tracking-tighter leading-tight text-white/90">
                  <ScrambleText>{PORTFOLIO_DATA.general.philosophy}</ScrambleText>
                </p>
              </div>

              {/* Skills Visualizer */}
              <div className="border-2 border-white p-6 font-mono flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest">Capability Matrix</h3>
                  <span className="text-[10px] text-white bg-white/10 px-2 py-0.5">LIVE_TELEMETRY</span>
                </div>

                <div className="flex flex-col gap-6">
                  {SKILLS.map((skill, index) => (
                    <div key={skill.name} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold tracking-widest">{skill.name}</span>
                        <div className="text-right">
                          <span className="text-[10px] opacity-50 block">{skill.details}</span>
                          <span className="text-xs text-white">{skill.status} // {skill.level}%</span>
                        </div>
                      </div>
                      {/* Loading bar visual */}
                      <div className="h-1.5 w-full bg-white/10 relative overflow-hidden">
                        <motion.div 
                          className="absolute left-0 top-0 h-full bg-white"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              <div className="flex justify-end gap-4 font-mono text-xs opacity-50 uppercase tracking-widest">
                <span>[ DOSSIER_END ]</span>
                <span className="text-white">END_OF_TRANSMISSION</span>
              </div>
            </div>

          </motion.div>
        )}
      </div>
      <CommandPalette />
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanline-drop { 0% { top: -10px; } 100% { top: 100%; } }
        .scanline-anim { animation: scanline-drop 3s linear infinite; }
      `}} />
    </main>
  );
}
