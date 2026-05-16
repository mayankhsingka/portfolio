"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { usePageScrollable } from "@/hooks/usePageScrollable";

export default function StandardLayout() {
  usePageScrollable();

  return (
    <main className="w-full min-h-screen bg-[#fafafa] text-[#111] font-sans selection:bg-black selection:text-white">
      <div className="max-w-4xl mx-auto px-6 py-24 flex flex-col gap-24">
        {/* Header */}
        <header className="flex flex-col gap-6 border-b-2 border-[#111] pb-12">
          <div className="flex justify-between items-start">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
              {PORTFOLIO_DATA.general.name}
            </h1>
            <button 
              onClick={() => {
                localStorage.setItem("user_persona", "dev");
                window.location.href = "/";
              }}
              className="text-xs uppercase font-mono font-bold hover:underline"
            >
              [ Switch to Dev Mode ]
            </button>
          </div>
          <h2 className="text-xl md:text-2xl font-medium max-w-2xl text-[#444]">
            {PORTFOLIO_DATA.general.philosophy}
          </h2>
          <div className="flex gap-6 font-mono text-sm uppercase tracking-widest font-bold">
            <a href={`mailto:${PORTFOLIO_DATA.general.contactEmail}`} className="hover:underline">Email</a>
            <a href={PORTFOLIO_DATA.general.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
            <a href={PORTFOLIO_DATA.general.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
          </div>
        </header>

        {/* Selected Work */}
        <section className="flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black uppercase tracking-tighter">Selected Work</h3>
            <div className="h-[2px] bg-[#111] flex-1 opacity-20" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/shipped/manasya" className="group">
              <div className="aspect-[4/3] bg-[#e0e0e0] border-2 border-[#111] mb-4 relative overflow-hidden group-hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] transition-all">
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 left-4 font-mono text-[10px] font-bold uppercase bg-black text-white px-2 py-1">Case 01</div>
              </div>
              <h4 className="text-2xl font-bold uppercase tracking-tight mb-2">Manasya</h4>
              <p className="text-[#444] mb-4">Secure Mental Health Architecture</p>
              <div className="flex gap-2">
                {["Next.js", "PostgreSQL", "WebSockets"].map(tag => (
                  <span key={tag} className="font-mono text-[10px] uppercase border border-[#111] px-2 py-1">{tag}</span>
                ))}
              </div>
            </Link>

            <Link href="/shipped/producive" className="group">
              <div className="aspect-[4/3] bg-[#e0e0e0] border-2 border-[#111] mb-4 relative overflow-hidden group-hover:shadow-[8px_8px_0px_0px_rgba(17,17,17,1)] transition-all">
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-4 left-4 font-mono text-[10px] font-bold uppercase bg-black text-white px-2 py-1">Case 02</div>
              </div>
              <h4 className="text-2xl font-bold uppercase tracking-tight mb-2">Producive</h4>
              <p className="text-[#444] mb-4">Deep Focus Browser Extension</p>
              <div className="flex gap-2">
                {["Chrome API", "React", "Tailwind"].map(tag => (
                  <span key={tag} className="font-mono text-[10px] uppercase border border-[#111] px-2 py-1">{tag}</span>
                ))}
              </div>
            </Link>
          </div>
        </section>

        {/* Experience / Skills */}
        <section className="flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-black uppercase tracking-tighter">Experience & Capabilities</h3>
            <div className="h-[2px] bg-[#111] flex-1 opacity-20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h4 className="font-mono text-sm font-bold uppercase tracking-widest mb-6 opacity-60">Operations History</h4>
              <div className="flex flex-col gap-6">
                <div className="border-l-2 border-[#111] pl-6 relative">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 bg-white border-2 border-[#111]" />
                  <div className="font-mono text-[10px] uppercase font-bold opacity-60 mb-1">2025+</div>
                  <div className="text-xl font-bold uppercase tracking-tight">Software Engineer</div>
                  <p className="text-[#444] mt-2">Building robust, scalable applications and diving deep into systemic architecture.</p>
                </div>
                <div className="border-l-2 border-[#111] pl-6 relative">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 bg-black border-2 border-[#111]" />
                  <div className="font-mono text-[10px] uppercase font-bold opacity-60 mb-1">2006 - Present</div>
                  <div className="text-xl font-bold uppercase tracking-tight">Architect</div>
                  <p className="text-[#444] mt-2">Architecting my life and learning the fundamentals of engineering, design, and systems.</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-mono text-sm font-bold uppercase tracking-widest mb-6 opacity-60">Technical Stack</h4>
              <div className="flex flex-wrap gap-2">
                {["TypeScript", "React", "Next.js", "Node.js", "Python", "Go", "PostgreSQL", "Redis", "Docker", "AWS", "Framer Motion"].map(skill => (
                  <span key={skill} className="font-mono text-[10px] uppercase border border-[#111] px-3 py-1.5 hover:bg-[#111] hover:text-white transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
