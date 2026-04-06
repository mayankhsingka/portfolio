"use client";

import { useEffect, useState, useRef } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export function TerminalLogs() {
  const [logs, setLogs] = useState<{text: string, type: string}[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isMinimized]);

  // Streaming logic based on timestamps from PORTFOLIO_DATA
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    // Initial logs with 0 delay or ones not matching streaming delay
    PORTFOLIO_DATA.logs.forEach((log, index) => {
      const delay = (log as any).delay || index * 500; // default staggered
      const t = setTimeout(() => {
        setLogs((prev) => [...prev, { text: log.text, type: log.type }]);
      }, delay);
      timeouts.push(t);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div 
      className={`fixed bottom-4 right-4 bg-white border-2 border-black font-mono text-xs flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-40 transition-all duration-300 ease-in-out ${
        isMinimized ? "w-64 h-10" : "w-96 h-64"
      }`}
    >
      <div className="flex items-center justify-between border-b-2 border-black p-2 uppercase font-bold bg-white pointer-events-auto">
        <div className="flex items-center gap-2">
          <span>Sys_Logs</span>
          {!isMinimized && <span className="animate-pulse">_</span>}
          {isMinimized && <span className="text-xs bg-black text-white px-1 ml-2">{logs.length}</span>}
        </div>
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className="hover:bg-black hover:text-white px-2 border border-transparent hover:border-black transition-colors"
        >
          {isMinimized ? "[+]" : "[-]"}
        </button>
      </div>
      
      {!isMinimized && (
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto flex flex-col gap-1 p-2 no-scrollbar pointer-events-auto bg-white"
          style={{ scrollbarWidth: "none" }}
        >
          {logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-black font-bold whitespace-nowrap">
                {new Date().toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
              </span>
              <span className="text-black">{log.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
