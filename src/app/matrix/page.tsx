"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Copy, ArrowUpRight, Github, Linkedin, Twitter, Calendar, Mail } from "lucide-react";
import { useState } from "react";
import { usePageScrollable } from "@/hooks/usePageScrollable";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { ScrambleText } from "@/components/ScrambleText";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function MatrixPage() {
  usePageScrollable();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.general.contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black p-4 md:p-8 lg:p-12 font-sans overflow-x-hidden selection:bg-black selection:text-white">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-[min-content_1fr_1fr] gap-4 md:gap-6 relative z-10"
      >
        {/* Header Block (Spans full width) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-4 flex justify-between items-center border-b-4 border-black pb-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
              <ScrambleText>Uplink_Matrix</ScrambleText>
            </h1>
            <p className="font-mono text-sm opacity-60 uppercase tracking-widest mt-1">Global Operator Hub</p>
          </div>
          <Link href="/" className="font-mono text-xs md:text-sm font-bold uppercase tracking-widest border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
            [ RETURN_TO_ROOT ]
          </Link>
        </motion.div>

        {/* 1. Profile Core (Spans 2 cols, 2 rows) */}
        <motion.div 
          variants={itemVariants} 
          className="col-span-1 md:col-span-2 md:row-span-2 bg-white border-4 border-black p-6 md:p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-black relative bg-[#e0e0e0]">
                {/* Fallback pattern while waiting for image */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#000_1px,transparent_1px)] bg-[size:4px_4px]" />
                <img 
                  src="/media/profile.jpg" 
                  alt="Mayank Himmatsingka" 
                  className="w-full h-full object-cover relative z-10 hover:scale-110 transition-transform duration-500 will-change-transform"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2U1ZTVlNSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjFlbSIgZmlsbD0iIzAwMCIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIyNCIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIj5NSDwvdGV4dD48L3N2Zz4=';
                  }}
                />
              </div>
              <div className="bg-black text-white text-[10px] font-mono font-bold px-2 py-1 uppercase tracking-widest animate-pulse">
                STATUS: AVAILABLE
              </div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none mb-2">
                {PORTFOLIO_DATA.general.name}
              </h2>
              <p className="font-mono text-base font-bold uppercase tracking-widest opacity-80 mb-6">
                {PORTFOLIO_DATA.general.role}
              </p>
              <p className="text-lg md:text-xl font-medium leading-tight">
                {PORTFOLIO_DATA.general.philosophy}
              </p>
            </div>
          </div>
        </motion.div>

        {/* 2. Primary CTA / Booking (Spans 2 cols, 1 row) */}
        <motion.div 
          variants={itemVariants} 
          className="col-span-1 md:col-span-2 bg-[#00ff41] border-4 border-black p-6 flex flex-col justify-center items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group"
          onClick={() => window.open(`mailto:${PORTFOLIO_DATA.general.contactEmail}`, '_blank')}
        >
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-8 h-8" />
            <span className="font-mono text-xl font-bold uppercase tracking-widest">SCHEDULE_UPLINK</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-center group-hover:scale-105 transition-transform">
            Book a Session
          </h3>
          <p className="font-mono text-sm font-bold opacity-80 mt-2">Consulting • Pairing • Strategy</p>
        </motion.div>

        {/* 3. Socials Grid (Spans 1 col, 1 row) */}
        <motion.div variants={itemVariants} className="col-span-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white grid grid-cols-2 grid-rows-2">
          <a href={PORTFOLIO_DATA.general.githubUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 border-r-2 border-b-2 border-black hover:bg-black hover:text-white transition-colors group">
            <Github className="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
            <span className="font-mono text-[10px] font-bold tracking-widest">GITHUB</span>
          </a>
          <a href={PORTFOLIO_DATA.general.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 border-b-2 border-black hover:bg-black hover:text-white transition-colors group">
            <Linkedin className="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
            <span className="font-mono text-[10px] font-bold tracking-widest">LINKEDIN</span>
          </a>
          <a href="https://x.com/mayankhsingka" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 border-r-2 border-black hover:bg-black hover:text-white transition-colors group">
            <Twitter className="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
            <span className="font-mono text-[10px] font-bold tracking-widest">TWITTER</span>
          </a>
          <button onClick={handleCopyEmail} className="flex flex-col items-center justify-center p-4 hover:bg-black hover:text-white transition-colors group relative">
            {copied ? (
              <span className="font-mono text-xs font-bold text-[#00ff41] uppercase">Copied!</span>
            ) : (
              <>
                <Copy className="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
                <span className="font-mono text-[10px] font-bold tracking-widest">COPY_EMAIL</span>
              </>
            )}
          </button>
        </motion.div>

        {/* 4. Quick Nav: Core Identity (Spans 1 col, 1 row) */}
        <motion.div variants={itemVariants} className="col-span-1">
          <Link href="/core-identity" className="h-full bg-black text-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.5)] transition-all group">
            <div className="flex justify-between items-start">
              <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-60">Deep Dive</span>
              <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter block">OPERATOR<br/>DOSSIER</h3>
            </div>
          </Link>
        </motion.div>

        {/* 5. Capability Matrix Expansion (Spans full width) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-4 bg-white border-4 border-black p-6 md:p-8 mt-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] border-b-2 border-black pb-4 mb-6">
            Capability Execution Array
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border-2 border-black border-dashed hover:border-solid hover:bg-black hover:text-white transition-all cursor-crosshair">
              <h4 className="font-bold text-xl uppercase tracking-tighter mb-2">Frontend Architecture</h4>
              <p className="font-mono text-xs opacity-70">Next.js 15 • React • Framer Motion • Tailwind CSS</p>
            </div>
            <div className="p-4 border-2 border-black border-dashed hover:border-solid hover:bg-black hover:text-white transition-all cursor-crosshair">
              <h4 className="font-bold text-xl uppercase tracking-tighter mb-2">Systems & Backend</h4>
              <p className="font-mono text-xs opacity-70">Node.js • Edge Functions • WebSockets • API Design</p>
            </div>
            <div className="p-4 border-2 border-black border-dashed hover:border-solid hover:bg-black hover:text-white transition-all cursor-crosshair">
              <h4 className="font-bold text-xl uppercase tracking-tighter mb-2">Data & Operations</h4>
              <p className="font-mono text-xs opacity-70">PostgreSQL • Supabase • Redis • CI/CD • Vercel</p>
            </div>
          </div>
        </motion.div>

        {/* 6. Projects Router (Spans full width) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
          <Link href="/shipped/manasya" className="bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group">
             <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1">CASE_001</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter">Manasya</h3>
            <p className="font-mono text-xs font-bold opacity-60 mt-2">Secure Mental Health Architecture</p>
          </Link>
          <Link href="/shipped/producive" className="bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group">
             <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1">CASE_002</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter">Producive</h3>
            <p className="font-mono text-xs font-bold opacity-60 mt-2">Deep Focus Browser Extension</p>
          </Link>
        </motion.div>

      </motion.div>
    </main>
  );
}
