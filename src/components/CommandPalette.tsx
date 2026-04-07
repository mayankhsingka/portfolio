"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "/" && !open && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInput("");
      setHistoryIdx(-1);
    }
  }, [open]);

  // Check initial night ops state
  useEffect(() => {
    const isNightOps = localStorage.getItem("night_ops_engaged") === "true";
    if (isNightOps) {
      document.documentElement.classList.add("dark-ops");
    }
  }, []);

  const executeCommand = (cmd: string) => {
    if (!cmd.trim()) return;
    
    // Save to history
    setHistory(prev => [cmd, ...prev].slice(0, 50));
    setInput("");
    setHistoryIdx(-1);

    // Special command: Night Ops Toggle
    if (cmd === "/engage_night_ops") {
      const isCurrentlyDark = document.documentElement.classList.contains("dark-ops");
      if (isCurrentlyDark) {
        document.documentElement.classList.remove("dark-ops");
        localStorage.setItem("night_ops_engaged", "false");
      } else {
        document.documentElement.classList.add("dark-ops");
        localStorage.setItem("night_ops_engaged", "true");
      }
      setOpen(false);
      return;
    }
    
    // Check if it's a known route
    const exactMatch = PORTFOLIO_DATA.commands.find(c => c.path === cmd);
    if (exactMatch) {
      window.location.href = exactMatch.path;
    } else if (cmd.startsWith("/")) {
      window.location.href = cmd; // Blind route attempt
    } else {
      setOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIdx < history.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const prevIdx = historyIdx - 1;
        setHistoryIdx(prevIdx);
        setInput(history[prevIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (input) {
        // Find best completion
        const matches = PORTFOLIO_DATA.commands.filter(c => c.path.startsWith(input));
        if (matches.length === 1) {
          setInput(matches[0].path);
        } else if (matches.length > 1) {
          // If multiple matches, we could cycle or just pick first
          setInput(matches[0].path);
        }
      }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] backdrop-blur-md bg-white/70"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4 flex flex-col gap-4 font-mono"
          >
            <div className="flex items-center gap-4 border-b-2 border-black pb-4 text-xl">
              <span className="text-black font-bold">{">"}</span>
              <input
                ref={inputRef}
                className="w-full bg-transparent outline-none placeholder:text-black/50"
                placeholder="Enter command or path (Tab to autocomplete)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
              />
            </div>
            
            <div className="flex flex-col gap-2 min-h-[300px]">
              <div className="text-sm font-bold uppercase tracking-widest border-b border-black/20 pb-1 mb-2">Available System Directories</div>
              {PORTFOLIO_DATA.commands.map((cmd) => (
                <button
                  key={cmd.path}
                  onClick={() => executeCommand(cmd.path)}
                  className="flex items-center justify-between p-2 hover:bg-black hover:text-white transition-colors border border-transparent hover:border-black text-left"
                >
                  <span>{cmd.path}</span>
                  <span className="text-xs opacity-50 block uppercase">{cmd.description}</span>
                </button>
              ))}
              
              {history.length > 0 && (
                <div className="mt-8">
                  <div className="text-sm font-bold uppercase tracking-widest border-b border-black/20 pb-1 mb-2">Recent Execution History</div>
                  <div className="text-xs flex flex-col gap-1 opacity-60">
                    {history.slice(0, 5).map((h, i) => (
                      <span key={i}>[{i}] {h}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
