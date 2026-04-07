"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export function SystemShortcuts() {
  const [view, setView] = useState<"NONE" | "ABOUT" | "CONTACT">("NONE");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input (like the command palette)
      if (document.activeElement?.tagName === "INPUT") return;

      if (e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        setView(v => v === "ABOUT" ? "NONE" : "ABOUT");
      }
      if (e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        setView(v => v === "CONTACT" ? "NONE" : "CONTACT");
      }
      if (e.key === "Escape") {
        setView("NONE");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {view !== "NONE" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-4 z-40 bg-white border-4 border-black p-8 font-sans overflow-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col pointer-events-auto"
        >
          <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-8">
            <h1 className="text-4xl font-bold uppercase tracking-tighter">
              {view === "ABOUT" ? "/core-identity" : "/ping_root"}
            </h1>
            <button 
              onClick={() => setView("NONE")}
              className="text-2xl font-bold hover:bg-black hover:text-white px-4 py-2 border-2 border-transparent hover:border-black transition-colors"
            >
              [X]
            </button>
          </div>

          <div className="max-w-4xl tracking-tight text-xl flex-1 flex flex-col gap-6">
            {view === "ABOUT" && (
              <>
                <p className="font-bold text-2xl leading-relaxed">
                  {PORTFOLIO_DATA.general.philosophy}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 border-t-4 border-black pt-8">
                  <div>
                    <h3 className="font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-4">Core Directives</h3>
                    <ul className="font-mono text-sm space-y-4">
                      <li className="flex flex-col">
                        <span className="opacity-50">01 / VELOCITY</span>
                        <span>Shipping products fast over perfect planning. Execution matters.</span>
                      </li>
                      <li className="flex flex-col">
                        <span className="opacity-50">02 / UX</span>
                        <span>Design must not just look decent; it must be functional and unique.</span>
                      </li>
                      <li className="flex flex-col">
                        <span className="opacity-50">03 / SCALE</span>
                        <span>Building digital environments that sustain actual throughput.</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-widest border-b-2 border-black pb-2 mb-4">System Specs</h3>
                    <ul className="font-mono text-sm space-y-2">
                      <li className="flex justify-between border-b border-black/10 pb-1">
                        <span>OPERATOR</span> <strong>{PORTFOLIO_DATA.general.name}</strong>
                      </li>
                      <li className="flex justify-between border-b border-black/10 pb-1">
                        <span>LIFESPAN</span> <strong>{PORTFOLIO_DATA.general.age} YEARS</strong>
                      </li>
                      <li className="flex justify-between border-b border-black/10 pb-1">
                        <span>CLASS</span> <strong>{PORTFOLIO_DATA.general.role}</strong>
                      </li>
                      <li className="flex justify-between pt-2">
                        <span>BASE_TECH</span> <strong>REACT, NEXT.JS, TAILWIND</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {view === "CONTACT" && (
              <div className="flex flex-col gap-8 h-full justify-center items-start text-4xl font-mono">
                <a 
                  href={`mailto:${PORTFOLIO_DATA.general.contactEmail}`}
                  className="hover:bg-black hover:text-white px-2 -ml-2 transition-colors inline-block"
                >
                  <span className="text-sm font-sans font-bold uppercase tracking-widest block opacity-50">Email</span>
                  {PORTFOLIO_DATA.general.contactEmail}
                </a>
                <a 
                  href={PORTFOLIO_DATA.general.linkedinUrl}
                  target="_blank"
                  className="hover:bg-black hover:text-white px-2 -ml-2 transition-colors inline-block"
                >
                  <span className="text-sm font-sans font-bold uppercase tracking-widest block opacity-50">LinkedIn</span>
                  {PORTFOLIO_DATA.general.linkedinUrl.split("linkedin.com/in/")[1]}
                </a>
                <a 
                  href={PORTFOLIO_DATA.general.githubUrl}
                  target="_blank"
                  className="hover:bg-black hover:text-white px-2 -ml-2 transition-colors inline-block"
                >
                  <span className="text-sm font-sans font-bold uppercase tracking-widest block opacity-50">GitHub</span>
                  {PORTFOLIO_DATA.general.githubUrl.split("github.com/")[1]}
                </a>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
