"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ScrambleText } from "@/components/ScrambleText";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { CommandPalette } from "@/components/CommandPalette";

type Field = "name" | "email" | "message" | "confirm";

export default function UplinkPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"handshake" | "form" | "sending" | "done">("handshake");
  const [logs, setLogs] = useState<string[]>([]);
  const [currentField, setCurrentField] = useState<Field>("name");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Handshake sequence
  useEffect(() => {
    if (phase !== "handshake") return;
    const sequence = [
      "INITIATING SECURE SOCKET...",
      "EXCHANGING PUBLIC KEYS...",
      "VERIFYING OPERATOR CLEARANCE...",
      "HANDSHAKE COMPLETE. CHANNEL OPEN."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev, sequence[i]]);
      i++;
      if (i === sequence.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("form"), 800);
      }
    }, 600);
    
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === "form" || phase === "handshake") {
      inputRef.current?.focus();
    }
  }, [phase, currentField]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = inputVal.trim();
      
      if (currentField === "name") {
        if (!val) return;
        setFormData(prev => ({ ...prev, name: val }));
        setLogs(prev => [...prev, `> SENDER_ID: ${val}`]);
        setCurrentField("email");
        setInputVal("");
      } else if (currentField === "email") {
        if (!val || !val.includes("@")) return;
        setFormData(prev => ({ ...prev, email: val }));
        setLogs(prev => [...prev, `> RETURN_ADDR: ${val}`]);
        setCurrentField("message");
        setInputVal("");
      } else if (currentField === "message") {
        if (!val) return;
        setFormData(prev => ({ ...prev, message: val }));
        setLogs(prev => [...prev, `> PAYLOAD_ATTACHED: [ENCRYPTED]`]);
        setCurrentField("confirm");
        setInputVal("");
      } else if (currentField === "confirm") {
        if (val.toLowerCase() === "y") {
          setLogs(prev => [...prev, `> TRANSMIT_CONFIRMED: Y`]);
          transmitPayload();
        } else if (val.toLowerCase() === "n") {
          setLogs(prev => [...prev, `> TRANSMIT_ABORTED: N`, "Resetting connection..."]);
          setTimeout(() => {
            setFormData({ name: "", email: "", message: "" });
            setCurrentField("name");
            setInputVal("");
          }, 1000);
        } else {
          setInputVal("");
        }
      }
    }
  };

  const transmitPayload = () => {
    setPhase("sending");
    setLogs(prev => [...prev, "ENCRYPTING PAYLOAD...", "ROUTING THROUGH PROXY_NODES..."]);
    
    setTimeout(() => {
      setPhase("done");
      setLogs(prev => [...prev, "TRANSMISSION SUCCESSFUL. SOCKET CLOSED."]);
      
      const subject = encodeURIComponent(`Secure Uplink: ${formData.name}`);
      const body = encodeURIComponent(`SENDER: ${formData.name}\nRETURN_ADDR: ${formData.email}\n\nPAYLOAD:\n${formData.message}`);
      window.location.href = `mailto:${PORTFOLIO_DATA.general.contactEmail}?subject=${subject}&body=${body}`;
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-12 font-mono flex flex-col items-center justify-center relative overflow-hidden selection:bg-white selection:text-black">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-0 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="max-w-3xl w-full border-2 border-white p-6 md:p-8 bg-black/80 backdrop-blur-sm shadow-[12px_12px_0px_0px_rgba(255,255,255,0.1)] relative z-10 flex flex-col h-[70vh]">
        <div className="flex justify-between items-end border-b-2 border-white/30 pb-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold uppercase tracking-widest text-white">
              <ScrambleText>Secure_Uplink</ScrambleText>
            </h1>
            <p className="text-xs opacity-50 mt-1">DIRECT_CHANNEL // {PORTFOLIO_DATA.general.name}</p>
          </div>
          <button onClick={() => router.push("/")} className="text-[10px] uppercase border border-white/30 px-2 py-1 hover:bg-white hover:text-black transition-colors">
            [ CLOSE_SOCKET ]
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 text-sm md:text-base pb-8" onClick={() => inputRef.current?.focus()}>
          {logs.map((log, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className={`${log.startsWith(">") ? "text-white font-bold" : "text-white/60"}`}
            >
              {log}
            </motion.div>
          ))}
          
          {phase === "form" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="text-white font-bold whitespace-nowrap">
                  {currentField === "name" ? "ENTER SENDER_ID:" : 
                   currentField === "email" ? "ENTER RETURN_ADDR:" : 
                   currentField === "message" ? "ENTER PAYLOAD:" : 
                   "TRANSMIT? (Y/N):"}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/20 caret-white"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 border border-white p-4 text-center">
              <p className="font-bold text-lg mb-2">Transmission complete.</p>
              <p className="opacity-60 text-xs">Your system email client has been opened to finalize the payload delivery.</p>
              <button onClick={() => router.push("/")} className="mt-4 border-2 border-white px-6 py-2 hover:bg-white hover:text-black uppercase text-sm font-bold tracking-widest transition-colors">
                RETURN TO ROOT
              </button>
            </motion.div>
          )}
          <div ref={(el) => el?.scrollIntoView()} />
        </div>
      </div>

      <CommandPalette />
      
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 mix-blend-overlay" />
    </main>
  );
}
