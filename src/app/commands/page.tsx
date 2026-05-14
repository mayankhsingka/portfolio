"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CommandPalette } from "@/components/CommandPalette";

type Log = { text: string; type: "input" | "output" | "system" | "error" };

export default function CommandsSandbox() {
  const defaultLogs: Log[] = [
    { text: "SYSTEM BOOT SEQUENCE INITIATED...", type: "system" },
    { text: "KERNEL VERSION 4.2.0-secure", type: "system" },
    { text: "MOUNTING VIRTUAL FILESYSTEM... [OK]", type: "system" },
    { text: "Type 'help' for available commands.", type: "output" }
  ];

  const [logs, setLogs] = useState<Log[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("terminal_sandbox_logs");
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        setLogs(defaultLogs);
      }
    } else {
      setLogs(defaultLogs);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      // Keep only last 100 logs to prevent localStorage bloat
      const logsToSave = logs.length > 100 ? logs.slice(logs.length - 100) : logs;
      localStorage.setItem("terminal_sandbox_logs", JSON.stringify(logsToSave));
    }
  }, [logs, isLoaded]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    setLogs(prev => [...prev, { text: `> ${cmd}`, type: "input" }]);
    setInput("");

    const args = cmd.toLowerCase().split(" ");
    const baseCmd = args[0];

    setTimeout(() => {
      switch (baseCmd) {
        case "help":
          setLogs(prev => [...prev, 
            { text: "AVAILABLE COMMANDS:", type: "output" },
            { text: "  whoami                 - Display operator info", type: "output" },
            { text: "  /shipped               - Navigate to Deployment Registry", type: "output" },
            { text: "  /matrix                - Navigate to Uplink Hub", type: "output" },
            { text: "  /internal-memos        - Access Intelligence Archive", type: "output" },
            { text: "  /theme                 - Cycle system phosphor filters", type: "output" },
            { text: "  /engage_surveillance   - Activate local camera payload", type: "output" },
            { text: "  /play                  - Enter offline protocol", type: "output" },
            { text: "  clear                  - Clear terminal output", type: "output" },
            { text: "  sudo                   - Execute with elevated privileges", type: "output" },
          ]);
          break;
        case "whoami":
          setLogs(prev => [...prev, { text: "OPERATOR: Mayank Himmatsingka. ROLE: System Architect.", type: "output" }]);
          break;
        case "neofetch":
          setLogs(prev => [...prev, 
            { text: "  ██████╗ ██╗   ██╗   mayank@system-blueprint", type: "output" },
            { text: "  ██╔═══╝ ██║   ██║   ─────────────────────────", type: "output" },
            { text: "  ╚████╗  ╚██╗ ██╔╝   Version: 1.0.4-stable", type: "output" },
            { text: "   ╚══██╗  ╚████╔╝    Operator: Mayank Himmatsingka", type: "output" },
            { text: "  █████╔╝   ╚██╔╝     Role: System Architect", type: "output" },
            { text: "  ╚════╝     ╚═╝      Framework: Next.js + Tailwind", type: "output" }
          ]);
          break;
        case "clear":
          setLogs([]);
          break;
        case "/shipped":
        case "/matrix":
        case "/internal-memos":
        case "shipped":
        case "matrix":
          const route = baseCmd.startsWith('/') ? baseCmd : `/${baseCmd}`;
          setLogs(prev => [...prev, { text: `Initiating jump to ${route}...`, type: "system" }]);
          setTimeout(() => router.push(route), 800);
          break;
        case "/theme":
          const themes = ["", "theme-aviation", "theme-amber", "theme-matrix", "dark-ops"];
          const currentTheme = localStorage.getItem("sys_theme") || "";
          const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
          const nextTheme = themes[nextIdx];
          themes.forEach(t => t && document.documentElement.classList.remove(t));
          if (nextTheme) document.documentElement.classList.add(nextTheme);
          localStorage.setItem("sys_theme", nextTheme);
          setLogs(prev => [...prev, { text: `Theme shifted to: ${nextTheme || 'DEFAULT_LIGHT'}`, type: "system" }]);
          break;
        case "/engage_surveillance":
        case "/play":
        case "/breach":
          const eventName = baseCmd === "/engage_surveillance" 
            ? "system-surveillance" 
            : baseCmd === "/breach" 
              ? "system-breach" 
              : "system-offline";
          const eventDetail = baseCmd === "/engage_surveillance" ? true : undefined;
          setLogs(prev => [...prev, { text: `Deploying payload: ${baseCmd}`, type: "system" }]);
          setTimeout(() => {
            router.push("/");
            setTimeout(() => {
              window.dispatchEvent(
                eventDetail !== undefined 
                  ? new CustomEvent(eventName, { detail: eventDetail })
                  : new CustomEvent(eventName)
              );
            }, 800);
          }, 500);
          break;
        case "sudo":
          setLogs(prev => [...prev, { text: "ACCESS DENIED. This incident will be reported.", type: "error" }]);
          break;
        default:
          setLogs(prev => [...prev, { text: `Command not found: ${baseCmd}`, type: "error" }]);
      }
    }, 200);
  };

  return (
    <main className="fixed inset-0 bg-black text-white p-4 md:p-8 font-mono text-sm sm:text-base selection:bg-white selection:text-black cursor-text z-50" onClick={() => inputRef.current?.focus()}>
      <div className="max-w-4xl mx-auto w-full h-full flex flex-col gap-2 relative z-10">
        {/* Header */}
        <div className="border-b border-white/30 pb-4 mb-4 flex justify-between">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-widest text-white">SECURE_SHELL // SANDBOX</h1>
          </div>
          <button onClick={() => router.push("/")} className="text-xs border border-white/50 px-2 py-1 hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-white">
            [ EXIT ]
          </button>
        </div>

        {/* Logs */}
        <div className="flex flex-col gap-2 flex-1 overflow-y-auto pb-24">
          {logs.map((log, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className={`
                ${log.type === "input" ? "font-bold text-white mt-2" : ""}
                ${log.type === "system" ? "opacity-70 italic" : ""}
                ${log.type === "error" ? "text-red-500 font-bold" : ""}
              `}
            >
              {log.text}
            </motion.div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleCommand} className="absolute bottom-0 left-0 right-0 py-6 bg-black border-t border-white/30 flex items-center gap-2">
          <div className="w-full flex items-center gap-3 text-lg font-bold">
            <span className="text-white">sys@root:~$</span>
            <input 
              ref={inputRef}
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/20 font-mono"
              placeholder="_"
              autoFocus
              spellCheck={false}
              autoComplete="off"
            />
          </div>
        </form>
      </div>

      {/* CRT Scanline */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
      
      <CommandPalette />
    </main>
  );
}
