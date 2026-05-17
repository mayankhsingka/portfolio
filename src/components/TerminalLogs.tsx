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

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
  };

  // ─── Collapsed: just a 40×40 dot showing the log count ───────────────
  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        aria-label={`Open system logs (${logs.length})`}
        title="System logs"
        className="fixed bottom-4 right-4 z-40 w-10 h-10 bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-all font-mono font-bold flex items-center justify-center hover:bg-black hover:text-white text-black"
      >
        <span className="text-[10px] tracking-tight">{">"}_</span>
        {logs.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold leading-none w-[18px] h-[18px] flex items-center justify-center border-2 border-white">
            {logs.length > 99 ? "99+" : logs.length}
          </span>
        )}
      </button>
    );
  }

  // ─── Expanded: full log panel ─────────────────────────────────────────
  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-black font-mono text-xs flex flex-col shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-40 w-96 h-64 transition-all duration-300 ease-in-out">
      <div className="flex items-center justify-between border-b-2 border-black p-2 uppercase font-bold bg-white pointer-events-auto">
        <div className="flex items-center gap-2">
          <span>Sys_Logs</span>
          <span className="animate-pulse">_</span>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="hover:bg-black hover:text-white px-2 border border-transparent hover:border-black transition-colors"
        >
          [-]
        </button>
      </div>

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
    </div>
  );
}
