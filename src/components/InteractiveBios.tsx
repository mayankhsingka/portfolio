"use client";

import { useState, useEffect } from "react";
import { useSystemAudio } from "@/hooks/useSystemAudio";

type Tab = "MAIN" | "ADVANCED" | "BOOT";

interface BiosItem {
  id: string;
  label: string;
  value: string;
  options?: string[]; // If present, pressing enter cycles these
  action?: () => void; // If present, pressing enter calls this
  help: string;
}

export function InteractiveBios({ onExit }: { onExit: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("MAIN");
  const [selectionIndex, setSelectionIndex] = useState(0);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const { playKeystroke, playSnap } = useSystemAudio();

  // Fake states for interactivity
  const [hyperThreading, setHyper] = useState("Enabled");
  const [fastBoot, setFastBoot] = useState("Enabled");
  const [clockSpeed, setClock] = useState("Unclocked (4.2 GHz)");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const TABS: Tab[] = ["MAIN", "ADVANCED", "BOOT"];

  const biosData: Record<Tab, BiosItem[]> = {
    MAIN: [
      { id: "time", label: "System Time", value: `[${time}]`, help: "Current system clock. Cannot be overwritten without ROOT." },
      { id: "op", label: "Operator Identity", value: "[Mayank Himmatsingka]", help: "Primary architect of the SYS_BLUEPRINT interface." },
      { id: "age", label: "Runtime (Age)", value: "[20 Cycles]", help: "Standard lifecycle designation." },
      { id: "role", label: "Designation", value: "[Product Builder]", help: "Core directive assigned to operator." }
    ],
    ADVANCED: [
      { id: "fw1", label: "Frontend Firmware", value: "[Next.js App Router]", help: "Primary visual delivery mechanism." },
      { id: "fw2", label: "Styling Protocol", value: "[Tailwind CSS v4]", help: "Atomic utility class generation." },
      { id: "fw3", label: "Backend Core", value: "[Supabase Edge]", help: "Database and real-time socket connections." },
      { 
        id: "hyper", 
        label: "Hyperthreading", 
        value: `[${hyperThreading}]`, 
        options: ["Enabled", "Disabled"],
        help: "Toggle multitasking processing. Requires restart to apply deep physical layout." 
      },
      { 
        id: "clock", 
        label: "CPU Ratio", 
        value: `[${clockSpeed}]`, 
        options: ["Locked (3.0 GHz)", "Unclocked (4.2 GHz)", "Overclock (5.0 GHz!!)", "Underclock (1.2 GHz)"],
        help: "Adjust base clock multiplier. Overclocking may cause terminal instability." 
      }
    ],
    BOOT: [
      { 
        id: "fast", 
        label: "Fast Boot", 
        value: `[${fastBoot}]`, 
        options: ["Enabled", "Disabled", "Ultra Fast"],
        help: "Skip POST memory checks to accelerate UI mounting." 
      },
      { id: "opt1", label: "Boot Option #1", value: "[SYS_BLUEPRINT_UI]", help: "Primary hard disk. Contains visual framework." },
      { id: "opt2", label: "Boot Option #2", value: "[Network IPv6]", help: "Fallback PXE boot protocol." },
      { 
        id: "save", 
        label: "> Save Changes and Exit", 
        value: "", 
        action: onExit,
        help: "Execute write command to CMOS and boot into System Grid." 
      },
      { 
        id: "discard", 
        label: "> Discard Changes and Exit", 
        value: "", 
        action: onExit,
        help: "Abandon unwritten configuration and boot into System Grid." 
      }
    ]
  };

  const currentItems = biosData[activeTab];

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault(); // Prevent scrolling when in BIOS
      playKeystroke();
      
      if (e.key === "ArrowRight") {
        const next = TABS.indexOf(activeTab) + 1;
        if (next < TABS.length) {
          setActiveTab(TABS[next]);
          setSelectionIndex(0);
        }
      } else if (e.key === "ArrowLeft") {
        const prev = TABS.indexOf(activeTab) - 1;
        if (prev >= 0) {
          setActiveTab(TABS[prev]);
          setSelectionIndex(0);
        }
      } else if (e.key === "ArrowDown") {
        setSelectionIndex(prev => Math.min(prev + 1, currentItems.length - 1));
      } else if (e.key === "ArrowUp") {
        setSelectionIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        playSnap();
        const activeItem = currentItems[selectionIndex];
        
        if (activeItem.action) {
          activeItem.action();
        } else if (activeItem.options) {
           // Cycle option
           const currentValRaw = activeItem.value.replace(/\[|\]/g, "");
           const opIndex = activeItem.options.indexOf(currentValRaw);
           const nextOp = activeItem.options[(opIndex + 1) % activeItem.options.length];
           
           if (activeItem.id === "hyper") setHyper(nextOp);
           if (activeItem.id === "fast") setFastBoot(nextOp);
           if (activeItem.id === "clock") setClock(nextOp);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTab, selectionIndex, currentItems, playKeystroke, playSnap]);


  return (
    <div className="fixed inset-0 z-[300] bg-[#0000a0] text-gray-300 font-mono text-sm leading-relaxed uppercase overflow-hidden select-none">
      {/* Header */}
      <div className="text-center bg-gray-300 text-[#0000a0] font-bold py-1 mb-4">
        BIOS SETUP UTILITY - COPYRIGHT (C) 2026, HIMSINGKA INC.
      </div>
      
      {/* Tab Bar */}
      <div className="flex px-8 mb-4 gap-8 font-bold border-b-2 border-gray-400 pb-2">
        {TABS.map(tab => (
          <div key={tab} className={activeTab === tab ? "text-white" : "text-gray-400"}>
            {activeTab === tab ? `[ ${tab} ]` : `  ${tab}  `}
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="flex px-8 h-[70vh]">
        
        {/* Left Column - Options */}
        <div className="w-2/3 border-r-2 border-gray-400 pr-8">
          <div className="flex flex-col gap-2">
            {currentItems.map((item, idx) => {
              const isSelected = idx === selectionIndex;
              return (
                <div 
                  key={item.id} 
                  className={`flex justify-between ${isSelected ? "text-white cursor-pointer" : "text-gray-300"}`}
                  onClick={() => {
                     setSelectionIndex(idx);
                     playKeystroke();
                  }}
                >
                  <span className={isSelected ? "bg-black/30 w-1/2 px-1 text-white shadow-[0_0_8px_rgba(255,255,255,0.4)]" : "w-1/2 px-1"}>
                    {item.label}
                  </span>
                  <span className={isSelected && item.options ? "text-yellow-400 font-bold" : ""}>
                    {item.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Help panel */}
        <div className="w-1/3 pl-8 text-cyan-400">
          <div className="mb-4 text-white uppercase border-b border-cyan-400/50 pb-1">
            Item Specific Help
          </div>
          <div className="leading-widest">
            {currentItems[selectionIndex]?.help}
          </div>
          
          {currentItems[selectionIndex]?.options && (
            <div className="mt-8 text-yellow-500 animate-pulse">
              [PRESS ENTER TO CYCLE VALUE]
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Instructions */}
      <div className="absolute bottom-4 left-0 w-full px-8 text-gray-400 flex justify-between border-t-2 border-gray-400 pt-2 text-xs">
        <div>
          <span className="text-white">←/→</span> Select Screen
        </div>
        <div>
          <span className="text-white">↑/↓</span> Select Item
        </div>
        <div>
          <span className="text-white">ENTER</span> Change/Execute
        </div>
        <div>
          <span className="text-white">F10</span> Save and Exit
        </div>
      </div>
      
    </div>
  );
}
