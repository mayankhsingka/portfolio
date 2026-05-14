"use client";

import { useEffect, useState, useRef } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export function TerminalLogs() {
  const [logs, setLogs] = useState<{text: string, type: string, timestamp: number}[]>([]);
  const [isMinimized, setIsMinimized] = useState(true);
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
        setLogs((prev) => [...prev, { text: log.text, type: log.type, timestamp: Date.now() }]);
      }, delay);
      timeouts.push(t);
    });

    const handleExternalLog = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && typeof detail === 'string') {
        setLogs((prev) => [...prev, { text: detail, type: "SYSTEM", timestamp: Date.now() }]);
      }
    };

    window.addEventListener("system-log", handleExternalLog);
    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener("system-log", handleExternalLog);
    };
  }, []);

  // Idle ghost logic
  useEffect(() => {
    let idleTimeout: NodeJS.Timeout;
    
    const resetIdle = () => {
      clearTimeout(idleTimeout);
      idleTimeout = setTimeout(() => {
        setLogs((prev) => {
          // Avoid spam if multiple idles overlap
          if (prev.length > 0 && prev[prev.length - 1].text.includes("Awaiting input")) return prev;
          return [...prev, { 
            text: "[WARNING] OPERATOR UNRESPONSIVE. Awaiting input...", 
            type: "SYSTEM", 
            timestamp: Date.now() 
          }];
        });
      }, 60000); // 60 seconds
    };

    window.addEventListener("mousemove", resetIdle);
    window.addEventListener("keydown", resetIdle);
    window.addEventListener("wheel", resetIdle);
    resetIdle();

    return () => {
      clearTimeout(idleTimeout);
      window.removeEventListener("mousemove", resetIdle);
      window.removeEventListener("keydown", resetIdle);
      window.removeEventListener("wheel", resetIdle);
    };
  }, []);

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
  };

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
                {formatTime(log.timestamp)}
              </span>
              <span className="text-black">{log.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
