"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useClearanceContext } from "@/components/ClearanceProvider";
import { useSystemAudio } from "@/hooks/useSystemAudio";

const STATIC_NAV = [
  { path: "/shipped", label: "Registry", description: "View all architecture deployments" },
  { path: "/internal-memos", label: "Archive", description: "Classified tactical intelligence" },
  { path: "/matrix", label: "Matrix", description: "Skill graph & uplink hub" },
  { path: "/theme", label: "Phosphor", description: "Cycle hardware filter themes" },
  { path: "/core-identity", label: "About", description: "Profile: Mayank Himmatsingka" },
  { path: "/ping", label: "Contact", description: "Establish secure socket connection" },
  { path: "/engage_surveillance", label: "Camera", description: "Access local visual payload" },
];

const HIDDEN_COMMANDS = ["help", "ls", "cat", "whoami", "neofetch", "clear", "/engage_surveillance"];

export function CommandPalette() {
  const router = useRouter();
  const { trackCommand, level } = useClearanceContext();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [terminalOutput, setTerminalOutput] = useState<{cmd: string, output: string}[]>([]);
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const { playKeystroke, playAction, playSnap } = useSystemAudio();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(prev => {
          if (!prev) playSnap();
          return !prev;
        });
      }
      if (e.key === "/" && !open && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        playSnap();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, playSnap]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setInput("");
      setHistoryIdx(-1);
    }
  }, [open]);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalOutput]);

  useEffect(() => {
    const theme = localStorage.getItem("sys_theme");
    if (theme === "dark-ops") {
      setIsDark(true);
    } else if (theme) {
      document.documentElement.classList.add(theme);
      setIsDark(false);
    } else if (localStorage.getItem("night_ops_engaged") === "true") {
      setIsDark(true);
      document.documentElement.classList.add("dark-ops");
    }
  }, []);

  // Compute dynamic nav commands
  const currentNav = [
    ...STATIC_NAV,
    isDark
      ? { path: "/engage_light_ops", label: "Light Mode", description: "System tactical reset" }
      : { path: "/engage_night_ops", label: "Dark Mode", description: "System visual tactical inversion" }
  ];

  const query = input.trim().toLowerCase();
  
  // Only show Nav Commands in the search results
  const filteredNav = query
    ? currentNav.filter(c => 
        c.path.toLowerCase().includes(query) || 
        c.label.toLowerCase().includes(query)
      )
    : currentNav;

  const executeCommand = (cmdStr: string) => {
    const cmd = cmdStr.trim();
    if (!cmd) return;

    playAction();
    setHistory(prev => [cmd, ...prev.filter(h => h !== cmd)].slice(0, 30));
    setInput("");
    setHistoryIdx(-1);
    trackCommand();

    const parts = cmd.split(" ");
    const base = parts[0].toLowerCase();
    const args = parts.slice(1);

    // ═══ Navigation ═══
    if (cmd === "/shipped" || cmd === "/internal-memos") {
      setOpen(false);
      router.push(cmd);
      return;
    }

    if (cmd === "/core-identity") {
      setOpen(false);
      router.push("/core-identity");
      return;
    }

    if (cmd === "/uplink" || cmd === "/ping") {
      setOpen(false);
      router.push("/ping");
      return;
    }

    if (cmd.startsWith("/theme")) {
      const themes = ["", "theme-aviation", "dark-ops"];
      let currentTheme = localStorage.getItem("sys_theme") || "";
      let nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
      const nextTheme = themes[nextIdx];
      
      // Remove old themes
      ["", "theme-aviation", "theme-amber", "theme-matrix", "dark-ops"].forEach(t => t && document.documentElement.classList.remove(t));
      if (nextTheme) document.documentElement.classList.add(nextTheme);
      
      localStorage.setItem("sys_theme", nextTheme);
      document.documentElement.classList.add("dark-ops-transition");
      setTimeout(() => document.documentElement.classList.remove("dark-ops-transition"), 400);
      
      setTerminalOutput(prev => [...prev, { cmd, output: `[OK] Phosphor parameters updated: ${nextTheme === "" ? "cream" : nextTheme}` }]);
      return;
    }

    if (cmd === "/engage_night_ops" || cmd === "/engage_light_ops") {
      const dark = document.documentElement.classList.contains("dark-ops");
      if (dark) {
        document.documentElement.classList.remove("dark-ops");
        localStorage.setItem("sys_theme", "");
        setIsDark(false);
      } else {
        document.documentElement.classList.add("dark-ops");
        localStorage.setItem("sys_theme", "dark-ops");
        setIsDark(true);
      }
      document.documentElement.classList.add("dark-ops-transition");
      setTimeout(() => document.documentElement.classList.remove("dark-ops-transition"), 400);
      setTerminalOutput(prev => [...prev, { cmd, output: dark ? "Night Ops Disabled. Light Ops Engaged." : "Night Ops Engaged." }]);
      return;
    }

    if (cmd === "/engage_surveillance") {
      window.dispatchEvent(new CustomEvent("system-surveillance", { detail: true }));
      setTerminalOutput(prev => [...prev, { cmd, output: "Initializing hardware optics protocol..." }]);
      setOpen(false);
      return;
    }

    // ═══ Hidden Terminal Commands ═══
    if (base === "clear") {
      setTerminalOutput([]);
      return;
    }

    if (base === "ls") {
      const files = Object.keys(PORTFOLIO_DATA.fileSystem as Record<string, string>).join("  ");
      setTerminalOutput(prev => [...prev, { cmd, output: files }]);
      return;
    }

    if (base === "cat") {
      const content = (PORTFOLIO_DATA.fileSystem as Record<string, string>)[args[0]];
      setTerminalOutput(prev => [...prev, { 
        cmd, 
        output: content || (args[0] ? `cat: ${args[0]}: No such file` : "cat: missing operand") 
      }]);
      return;
    }

    if (base === "whoami") {
      setTerminalOutput(prev => [...prev, { 
        cmd, 
        output: `${PORTFOLIO_DATA.general.name}\n${PORTFOLIO_DATA.general.role}` 
      }]);
      return;
    }

    if (base === "neofetch") {
      setTerminalOutput(prev => [...prev, {
        cmd,
        output: [
          `  ██████╗ ██╗   ██╗   mayank@system-blueprint`,
          `  ██╔═══╝ ██║   ██║   ─────────────────────────`,
          `  ╚████╗  ╚██╗ ██╔╝   Version: 1.0.4-stable`,
          `   ╚══██╗  ╚████╔╝    Operator: ${PORTFOLIO_DATA.general.name}`,
          `  █████╔╝   ╚██╔╝     Clearance: [${level}]`,
          `  ╚════╝     ╚═╝      Role: ${PORTFOLIO_DATA.general.role}`,
        ].join("\n")
      }]);
      return;
    }

    if (base === "help") {
      setTerminalOutput(prev => [...prev, {
        cmd,
        output: "AVAILABLE COMMANDS:\n/shipped, /internal-memos, /commands, /core-identity, /ping, /engage_night_ops\n\nHIDDEN SHELL:\nls, cat, whoami, neofetch, clear\n\n[WARNING: 3 CLASSIFIED COMMANDS HIDDEN. ROOT CLEARANCE REQUIRED.]"
      }]);
      return;
    }

    if (base === "/play" || base === "/airplane_mode") {
       setTerminalOutput(prev => [...prev, { cmd, output: "[CRITICAL] Network connection severed intentionally. Booting offline protocol..." }]);
       setOpen(false);
       setTimeout(() => window.dispatchEvent(new CustomEvent("system-offline")), 500);
       return;
    }

    // ═══ Breach Easter Egg ═══
    const breachTriggers = ["sudo rm -rf /", "hack", "rm -rf", "sudo"];
    if (breachTriggers.some(t => cmd.toLowerCase().includes(t))) {
      setTerminalOutput(prev => [...prev, { cmd, output: "[ALERT] System Breach Initiated..." }]);
      setOpen(false);
      setTimeout(() => window.dispatchEvent(new CustomEvent("system-breach")), 200);
      return;
    }

    // Attempt direct navigation if starts with /
    if (cmd.startsWith("/")) {
      setOpen(false);
      router.push(cmd);
      return;
    }

    // If terminal output is active, keep it visible, otherwise close on random input
    if (terminalOutput.length > 0) {
      setTerminalOutput(prev => [...prev, { cmd, output: `bash: ${base}: command not found` }]);
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
        const idx = historyIdx + 1;
        setHistoryIdx(idx);
        setInput(history[idx]);
        playKeystroke();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const idx = historyIdx - 1;
        setHistoryIdx(idx);
        setInput(history[idx]);
        playKeystroke();
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput("");
        playKeystroke();
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const all = [...currentNav.map(c => c.path), ...HIDDEN_COMMANDS];
      const match = all.find(p => p.startsWith(query));
      if (match) {
        setInput(match);
        playKeystroke();
      }
    } else if (e.key.length === 1 || e.key === "Backspace") {
      playKeystroke();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] backdrop-blur-md bg-white/70"
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="System Command Palette"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col gap-6 font-mono max-h-[85vh] overflow-hidden"
          >
            {/* Input Header */}
            <div className="flex items-center gap-4 border-b-4 border-black pb-4 text-2xl font-bold shrink-0">
              <span>{">"}</span>
              <input
                ref={inputRef}
                className="w-full bg-transparent outline-none placeholder:text-black/30"
                placeholder="Search or type a command..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal Input"
              />
            </div>

            {/* Terminal Area (Only shows if output exists) */}
            {terminalOutput.length > 0 && (
              <div 
                className="max-h-[30vh] overflow-y-auto flex flex-col gap-3 p-4 bg-black/5 border-2 border-dashed border-black/20 text-sm relative"
                aria-live="polite"
                aria-atomic="false"
              >
                {terminalOutput.length > 1 && (
                  <button 
                    onClick={() => setIsTerminalExpanded(!isTerminalExpanded)}
                    className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center justify-between mb-2 pb-2 border-b border-black/10"
                  >
                    <span>[ {isTerminalExpanded ? "COLLAPSE_HISTORY" : `EXPAND_HISTORY (${terminalOutput.length - 1} PREVIOUS)`} ]</span>
                  </button>
                )}
                
                {(isTerminalExpanded ? terminalOutput : [terminalOutput[terminalOutput.length - 1]]).map((item, i) => (
                  <div key={isTerminalExpanded ? i : 'last-cmd'} className={!isTerminalExpanded ? "animate-pulse-once" : ""}>
                    <div className="opacity-40">$ {item.cmd}</div>
                    <div className="whitespace-pre-wrap">{item.output}</div>
                  </div>
                ))}
                <div ref={outputEndRef} />
              </div>
            )}

            {/* Navigation List */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[40vh] pr-2">
              <div className="text-xs font-bold uppercase tracking-widest border-b-2 border-black/10 pb-1 mb-2 sticky top-0 bg-white z-10 pt-1">
                Available System Directories
              </div>
              
              <div className="flex flex-col pb-4">
                {filteredNav.map((cmd) => (
                  <button
                    key={cmd.path}
                    onClick={() => executeCommand(cmd.path)}
                    className="flex justify-between items-center p-3 hover:bg-black hover:text-white transition-all group text-left border border-transparent hover:border-black"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-xl leading-none">{cmd.path}</span>
                      <span className="text-[10px] opacity-40 uppercase tracking-widest group-hover:opacity-100 mt-1">
                        // {cmd.label}
                      </span>
                    </div>
                    <span className="text-xs opacity-50 group-hover:opacity-100 uppercase tracking-tighter">
                      {cmd.description}
                    </span>
                  </button>
                ))}
                
                {filteredNav.length === 0 && (
                  <div className="py-8 text-center text-black/40 text-sm italic">
                    Query unrecognized. Press Enter to execute raw.
                  </div>
                )}
              </div>
            </div>

            {/* Unified Footer */}
            <div className="flex justify-between items-center text-[10px] opacity-40 uppercase tracking-widest pt-4 border-t-2 border-black/5">
              <div className="flex gap-4">
                <span>↑↓ History</span>
                <span>Tab Autocomplete</span>
                <span>ESC Close</span>
              </div>
              <span className="font-bold">Clearance: {level}</span>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
