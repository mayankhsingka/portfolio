"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePageScrollable } from "@/hooks/usePageScrollable";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { ScrambleText } from "@/components/ScrambleText";
import { PageHeaderNav } from "@/components/PageHeaderNav";
import { SkillConsole } from "./SkillConsole";
import { WireframeCube, SkillRadar, DropzoneModule } from "./MatrixModules";

// Inline SVG icons — replaces lucide-react dependency
const IconCopy = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);
const IconArrowUpRight = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M7 17 17 7" /><path d="M7 7h10v10" />
  </svg>
);
const IconGithub = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-1 1.25-1.11 2.69-1 4 .09 1.4.52 2.76 1 4 0 3.5 3 5.5 6 5.5a4.8 4.8 0 0 0-1 3.5v4" />
  </svg>
);
const IconLinkedin = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);
const IconTwitter = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);
const IconCalendar = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
  </svg>
);

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
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } as any }
};

export default function MatrixPage() {
  const router = useRouter();
  usePageScrollable();
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.general.contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] text-black p-4 md:p-8 lg:p-12 font-sans overflow-visible selection:bg-black selection:text-white">
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
          <PageHeaderNav theme="light" />
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
                  src="/profile.jpg"
                  alt="Mayank Himmatsingka"
                  className="w-full h-full object-cover relative z-10 hover:scale-110 transition-transform duration-500 will-change-transform preserve-color"
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
          className="col-span-1 md:col-span-2 bg-white border-4 border-black p-6 flex flex-col justify-center items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group"
          onClick={() => router.push('/ping')}
        >
          <div className="flex items-center gap-3 mb-2">
            <IconCalendar className="w-8 h-8" />
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
            <IconGithub className="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
            <span className="font-mono text-[10px] font-bold tracking-widest">GITHUB</span>
          </a>
          <a href={PORTFOLIO_DATA.general.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 border-b-2 border-black hover:bg-black hover:text-white transition-colors group">
            <IconLinkedin className="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
            <span className="font-mono text-[10px] font-bold tracking-widest">LINKEDIN</span>
          </a>
          <a href="https://x.com/mayankhsingka" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 border-r-2 border-black hover:bg-black hover:text-white transition-colors group">
            <IconTwitter className="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
            <span className="font-mono text-[10px] font-bold tracking-widest">TWITTER</span>
          </a>
          <button onClick={handleCopyEmail} className="flex flex-col items-center justify-center p-4 hover:bg-black hover:text-white transition-colors group relative">
            {copied ? (
              <span className="font-mono text-xs font-bold text-white uppercase">Copied!</span>
            ) : (
              <>
                <IconCopy className="w-8 h-8 mb-2 group-hover:-translate-y-1 transition-transform" />
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
              <IconArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter block">OPERATOR<br />DOSSIER</h3>
            </div>
          </Link>
        </motion.div>

        {/* 5. Telemetry & Hardware Nodes */}
        <motion.div variants={itemVariants} className="col-span-1 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden">
          <WireframeCube />
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1 bg-[#e0e0e0] border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden">
          <SkillRadar />
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all overflow-hidden">
          <DropzoneModule />
        </motion.div>

        {/* 6. Capability Matrix Expansion (Spans full width) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-4 mt-4">
          <SkillConsole />
        </motion.div>

        {/* 6. Operations History (Experience) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex items-center gap-3 mb-6 border-b-2 border-black pb-4">
            <h3 className="text-2xl font-black uppercase tracking-tighter">OPERATIONS_HISTORY</h3>
          </div>
          <div className="flex flex-col gap-6">
            <div className="relative pl-6 border-l-2 border-black">
              <div className="absolute -left-[7px] top-1 w-3 h-3 bg-white border-2 border-black animate-pulse" />
              <div className="font-mono text-xs font-bold uppercase tracking-widest opacity-60 mb-1">2025+</div>
              <h4 className="text-xl font-bold uppercase tracking-tight">Software Engineer</h4>
              <p className="font-mono text-sm mt-2 opacity-80">Building robust, scalable applications and diving deep into systemic architecture.</p>
            </div>
            <div className="relative pl-6 border-l-2 border-black">
              <div className="absolute -left-[7px] top-1 w-3 h-3 bg-black border-2 border-white" />
              <div className="font-mono text-xs font-bold uppercase tracking-widest opacity-60 mb-1">2006 - PRESENT</div>
              <h4 className="text-xl font-bold uppercase tracking-tight">Architect</h4>
              <p className="font-mono text-sm mt-2 opacity-80">Architecting my life and learning the fundamentals of engineering, design, and systems.</p>
            </div>
          </div>
        </motion.div>

        {/* 7. Education & Raw Skills */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 bg-black text-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.6)] transition-all flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4 border-b-2 border-white/20 pb-4">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white">CORE_TRAINING</h3>
            </div>
            <div className="mb-2">
              <h4 className="text-lg font-bold uppercase tracking-tight">B.Tech (Electrical & Electronics Engineering)</h4>
              <p className="font-mono text-xs opacity-60 mt-1 uppercase tracking-widest">VSSUT Burla • 2025 - Present</p>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4 border-b-2 border-white/20 pb-4">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-white">RAW_CAPABILITIES</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {["TypeScript", "React", "Next.js", "Node.js", "Python", "Go", "PostgreSQL", "Redis", "Docker", "AWS", "Framer Motion", "Tailwind"].map(skill => (
                <span key={skill} className="font-mono text-[10px] border border-white/30 px-2 py-1 uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 8. Projects Router (Spans full width) */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-4">
          <Link href="/shipped/manasya" className="bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1">CASE_001</span>
              <IconArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter">Manasya</h3>
            <p className="font-mono text-xs font-bold opacity-60 mt-2">Secure Mental Health Architecture</p>
          </Link>
          <Link href="/shipped/producive" className="bg-white border-4 border-black p-6 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest bg-black text-white px-2 py-1">CASE_002</span>
              <IconArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter">Producive</h3>
            <p className="font-mono text-xs font-bold opacity-60 mt-2">Deep Focus Browser Extension</p>
          </Link>
        </motion.div>

        {/* 9. Internal Memos / Transmissions */}
        <motion.div variants={itemVariants} className="col-span-1 md:col-span-4 mt-4 mb-12">
          <Link href="/internal-memos" className="bg-black text-white border-4 border-black p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.6)] transition-all group">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-60">CLASSIFIED_ARCHIVE</h3>
              </div>
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">Internal_Memos</h2>
              <p className="font-mono text-sm opacity-80 mt-2 max-w-xl">Raw thoughts, system architecture logs, and technical transmissions detailing my build processes.</p>
            </div>
            <div className="mt-6 md:mt-0 flex items-center gap-2 border-2 border-white px-6 py-3 uppercase font-bold tracking-widest text-xs group-hover:bg-white group-hover:text-black transition-colors shrink-0">
              Access Archive <IconArrowUpRight className="w-4 h-4" />
            </div>
          </Link>
        </motion.div>

      </motion.div>
    </main>
  );
}
