"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CommandPalette } from "@/components/CommandPalette";
import { TypewriterHeading } from "@/components/TypewriterHeading";
import { usePageScrollable } from "@/hooks/usePageScrollable";

const COMMANDS = [
  {
    btnLabel: "[ /theme ]",
    cmd: "/theme",
    desc: "Rotates the system's hardware phosphor filters.",
    syntax: "/theme",
    status: "ACTIVE",
    isRedacted: false,
    executeEvent: "system-shortcut", // or just dispatch exact string in terminal
  },
  {
    btnLabel: "[ /engage_surveillance ]",
    cmd: "/engage_surveillance",
    desc: "Activates local camera payload with real-time ASCII conversion filter.",
    syntax: "/engage_surveillance",
    status: "SECURE",
    isRedacted: false,
  },
  {
    btnLabel: "[ /internal-memos ]",
    cmd: "/internal-memos",
    desc: "Access the Classified Intelligence Archive (Blog).",
    syntax: "/internal-memos",
    status: "PUBLIC",
    isRedacted: false,
    link: "/internal-memos"
  },
  {
    btnLabel: "[ /shipped ]",
    cmd: "/shipped",
    desc: "View the deployment registry of active System Architecture nodes.",
    syntax: "/shipped",
    status: "PUBLIC",
    isRedacted: false,
    link: "/shipped"
  },
  {
    btnLabel: "[ /??????? ]",
    cmd: "/play",
    desc: "Sever network connection instantly. Boot Offline Game Protocol.",
    syntax: "/play",
    status: "CLASSIFIED",
    isRedacted: true,
  },
  {
    btnLabel: "[ /?????? ]",
    cmd: "/breach",
    desc: "Unsanctioned payload. Do not execute.",
    syntax: "sudo rm -rf /",
    status: "CRITICAL",
    isRedacted: true,
  }
];

export default function CommandsSandbox() {
  usePageScrollable();
  const router = useRouter();
  const [activeCmd, setActiveCmd] = useState(COMMANDS[0]);
  const [glitchTrigger, setGlitchTrigger] = useState(0);

  const handleSelect = (cmd: typeof COMMANDS[0]) => {
    setActiveCmd(cmd);
    setGlitchTrigger(prev => prev + 1); // trigger re-animation on CRT
  };

  const handleExecute = () => {
    if (activeCmd.link) {
      router.push(activeCmd.link);
      return;
    }
    
    if (activeCmd.cmd === "/theme") {
      const themes = ["", "theme-aviation", "theme-amber", "theme-matrix", "dark-ops"];
      const currentTheme = localStorage.getItem("sys_theme") || "";
      const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
      const nextTheme = themes[nextIdx];
      themes.forEach(t => t && document.documentElement.classList.remove(t));
      if (nextTheme) document.documentElement.classList.add(nextTheme);
      localStorage.setItem("sys_theme", nextTheme);
      document.documentElement.classList.add("dark-ops-transition");
      setTimeout(() => document.documentElement.classList.remove("dark-ops-transition"), 400);
    } else if (activeCmd.cmd === "/engage_surveillance" || activeCmd.cmd === "/breach" || activeCmd.cmd === "/play") {
      // These events only have listeners on the home page — navigate there first
      const eventName = activeCmd.cmd === "/engage_surveillance" 
        ? "system-surveillance" 
        : activeCmd.cmd === "/breach" 
          ? "system-breach" 
          : "system-offline";
      const eventDetail = activeCmd.cmd === "/engage_surveillance" ? true : undefined;
      router.push("/");
      setTimeout(() => {
        window.dispatchEvent(
          eventDetail !== undefined 
            ? new CustomEvent(eventName, { detail: eventDetail })
            : new CustomEvent(eventName)
        );
      }, 800);
    }
  };

  return (
    <main className="w-full min-h-full text-black flex flex-col p-4 lg:p-12 overflow-y-auto bg-grid-pattern">
      <div className="max-w-6xl mx-auto w-full z-10 flex flex-col gap-8 bg-white/95 p-6 lg:p-12 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        
        <header className="border-b-4 border-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <TypewriterHeading 
              text="/commands" 
              className="text-5xl lg:text-7xl font-bold uppercase tracking-tighter" 
            />
            <p className="font-mono mt-2 text-sm uppercase opacity-70">
              Interactive System Control Dashboard
            </p>
          </div>
          <Link href="/" className="font-mono text-sm hover:bg-black hover:text-white px-3 py-2 transition-colors border-2 border-black uppercase tracking-widest shrink-0">
            [RETURN TO ROOT]
          </Link>
        </header>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-[500px]">
          
          {/* Left Column: Command Buttons */}
          <div className="flex flex-col gap-4 border-r-0 lg:border-r-4 border-black lg:pr-8">
            <h3 className="font-mono text-xs font-bold uppercase mb-2 border-b-2 border-black pb-2">
              Select Execution Parameter
            </h3>
            <div className="flex flex-col gap-3">
              {COMMANDS.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(c)}
                  className={`text-left font-mono p-4 border-2 transition-all uppercase tracking-widest text-sm lg:text-base ${
                    activeCmd.cmd === c.cmd 
                      ? "bg-black text-white border-black scale-[1.02] shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]" 
                      : "bg-white text-black border-black/50 hover:border-black hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  }`}
                >
                  {c.btnLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: execution sandbox */}
          <div className="flex flex-col relative bg-black p-6 border-4 border-black text-white font-mono shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]">
            <div className="absolute top-0 w-full left-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-50 scanline-anim" />
            
            <div className="flex justify-between items-center border-b border-white/20 pb-4 mb-6">
              <span className="text-xs opacity-50 uppercase tracking-widest">Sandbox_Terminal</span>
              <span className="text-[10px] bg-white text-black px-2 py-0.5">{activeCmd.status}</span>
            </div>

            <div key={glitchTrigger} className="flex flex-col gap-4 flex-grow animate-pulse-fast">
              <div className="flex gap-4">
                <span className="opacity-50">&gt; COMMAND:</span>
                <span className={`font-bold ${activeCmd.isRedacted ? "text-red-500" : "text-[#00ff41]"}`}>
                  {activeCmd.cmd}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="opacity-50 break-words">&gt; PURPOSE:</span>
                <span className="max-w-[70%]">{activeCmd.desc}</span>
              </div>
              <div className="flex gap-4">
                <span className="opacity-50">&gt; SYNTAX:</span>
                <span>{activeCmd.syntax}</span>
              </div>
            </div>

            {/* Execute Button */}
            <button 
              onClick={handleExecute}
              className="mt-12 w-full py-4 border-2 border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-colors uppercase tracking-widest font-bold text-lg group relative overflow-hidden"
            >
              <span className="relative z-10 block group-hover:scale-105 transition-transform duration-75">
                [ EXECUTE PAYLOAD ]
              </span>
            </button>
          </div>

        </div>
      </div>
      <CommandPalette />
      
      {/* Small inject for CRT scanline anim just for this component */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanline-drop { 0% { top: -10px; } 100% { top: 100%; } }
        .scanline-anim { animation: scanline-drop 4s linear infinite; }
        @keyframes pulse-fast { 0% { opacity: 1; } 50% { opacity: 0.9; } 100% { opacity: 1; } }
        .animate-pulse-fast { animation: pulse-fast 0.1s infinite; }
      `}} />
    </main>
  );
}
