"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { useClearanceContext } from "@/components/ClearanceProvider";

const STATIC_NAV = [
  { path: "/shipped", label: "Projects", description: "View shipped deployments" },
  { path: "/internal-memos", label: "Blog", description: "Read operational memos" },
  { path: "/core-identity", label: "About", description: "Core identity overlay" },
  { path: "/ping", label: "Contact", description: "Establish connection" },
];

const HIDDEN_COMMANDS = ["help", "ls", "cat", "whoami", "neofetch", "clear"];

export function CommandPalette() {
  const router = useRouter();
  const { trackCommand, level } = useClearanceContext();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [terminalOutput, setTerminalOutput] = useState<{cmd: string, output: string}[]>([]);
  const [isDark, setIsDark] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(prev => !prev);
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
    const dark = localStorage.getItem("night_ops_engaged") === "true";
    if (dark) {
      document.documentElement.classList.add("dark-ops");
      setIsDark(true);
    } else {
      setIsDark(false);
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
      window.dispatchEvent(new CustomEvent("system-shortcut", { detail: "ABOUT" }));
      setOpen(false);
      return;
    }

    if (cmd === "/ping") {
      window.dispatchEvent(new CustomEvent("system-shortcut", { detail: "CONTACT" }));
      setOpen(false);
      return;
    }

    if (cmd === "/engage_night_ops" || cmd === "/engage_light_ops") {
      const dark = document.documentElement.classList.contains("dark-ops");
      if (dark) {
        document.documentElement.classList.remove("dark-ops");
        localStorage.setItem("night_ops_engaged", "false");
        setIsDark(false);
      } else {
        document.documentElement.classList.add("dark-ops");
        localStorage.setItem("night_ops_engaged", "true");
        setIsDark(true);
      }
      document.documentElement.classList.add("dark-ops-transition");
      setTimeout(() => document.documentElement.classList.remove("dark-ops-transition"), 400);
      setTerminalOutput(prev => [...prev, { cmd, output: dark ? "Night Ops Disabled. Light Ops Engaged." : "Night Ops Engaged." }]);
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
        output: "AVAILABLE COMMANDS:\n/shipped, /internal-memos, /core-identity, /ping, /engage_night_ops\n\nHIDDEN SHELL:\nls, cat, whoami, neofetch, clear"
      }]);
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
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const idx = historyIdx - 1;
        setHistoryIdx(idx);
        setInput(history[idx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const all = [...NAV_COMMANDS.map(c => c.path), ...HIDDEN_COMMANDS];
      const match = all.find(p => p.startsWith(query));
      if (match) setInput(match);
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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 flex flex-col gap-6 font-mono"
          >
            {/* Input Header */}
            <div className="flex items-center gap-4 border-b-4 border-black pb-4 text-2xl font-bold">
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
              />
            </div>

            {/* Terminal Area (Only shows if output exists) */}
            {terminalOutput.length > 0 && (
              <div className="max-h-[30vh] overflow-y-auto flex flex-col gap-3 p-4 bg-black/5 border-2 border-dashed border-black/20 text-sm">
                {terminalOutput.map((item, i) => (
                  <div key={i}>
                    <div className="opacity-40">$ {item.cmd}</div>
                    <div className="whitespace-pre-wrap">{item.output}</div>
                  </div>
                ))}
                <div ref={outputEndRef} />
              </div>
            )}

            {/* Navigation List */}
            <div className="flex flex-col gap-2 min-h-[250px]">
              <div className="text-xs font-bold uppercase tracking-widest border-b-2 border-black/10 pb-1 mb-2">
                Available System Directories
              </div>
              
              <div className="flex flex-col">
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
