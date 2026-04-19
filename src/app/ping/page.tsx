"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ScrambleText } from "@/components/ScrambleText";
import { TypewriterHeading } from "@/components/TypewriterHeading";
import { CommandPalette } from "@/components/CommandPalette";
import { useSystemAudio } from "@/hooks/useSystemAudio";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import { usePageScrollable } from "@/hooks/usePageScrollable";

const OFFICIAL_PORTS = [
  { id: "PORT_01", label: "EMAIL", url: \`mailto:\${PORTFOLIO_DATA.general.contactEmail}\`, protocol: "SMTP", status: "LISTENING" },
  { id: "PORT_02", label: "GITHUB", url: PORTFOLIO_DATA.general.githubUrl, protocol: "SSH", status: "ESTABLISHED" },
  { id: "PORT_03", label: "LINKEDIN", url: PORTFOLIO_DATA.general.linkedinUrl, protocol: "TCP", status: "LISTENING" },
  { id: "PORT_04", label: "X_ARCHIVE", url: "https://x.com/mayankhsingka", protocol: "UDP", status: "LISTENING" },
];

const UNOFFICIAL_PORTS = [
  { id: "PORT_80", label: "DISCORD", url: "#", protocol: "WSS", status: "OFFLINE", notes: "TODO: Add URL for Domain Deployment" },
  { id: "PORT_443", label: "CALENDLY", url: "#", protocol: "HTTPS", status: "OFFLINE", notes: "TODO: Add URL for Domain Deployment" },
  { id: "PORT_8080", label: "REGIONAL_COMMS", url: "#", protocol: "LOCAL", status: "UNKNOWN", notes: "TODO: Add specific country/local platforms here" }
];

export default function PingPage() {
  usePageScrollable();
  const [connecting, setConnecting] = useState(true);
  const [traceLogs, setTraceLogs] = useState<string[]>([]);
  const [copiedPort, setCopiedPort] = useState<string | null>(null);
  const { playKeystroke, playSnap } = useSystemAudio();

  // Fake Traceroute
  useEffect(() => {
    const lines = [
      "tracing route to sys.mayank.host [192.168.0.1]...",
      "1  <1 ms  <1 ms  <1 ms  root.local [127.0.0.1]",
      "2    3 ms    2 ms    2 ms  gateway.isp [10.0.0.1]",
      "3   14 ms   12 ms   13 ms  edge.routing.node [172.16.2.4]",
      "4  * * * Request timed out.",
      "5   45 ms   42 ms   40 ms  secure.proxy.net [198.51.100.2]",
      "6   89 ms   88 ms   92 ms  sys.mayank.host [192.168.0.1]",
      "Trace complete.",
      "[SECURE UPLINK ESTABLISHED]"
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < lines.length) {
        setTraceLogs(prev => [...prev, lines[current]]);
        playKeystroke();
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setConnecting(false);
          playSnap();
        }, 1000);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [playKeystroke, playSnap]);

  const handleCopy = (e: React.MouseEvent, textToCopy: string, portId: string) => {
    // If it's a social link, we let it naturally open the link (or we could preventDefault and just copy).
    // Let's allow natural navigation, but run the copy logic for email.
    if (textToCopy.startsWith("mailto:")) {
      e.preventDefault();
      navigator.clipboard.writeText(textToCopy.replace("mailto:", ""));
      setCopiedPort(portId);
      setTimeout(() => setCopiedPort(null), 3000);
    }
  };

  return (
    <main className="w-full min-h-screen bg-black text-white flex flex-col p-4 lg:p-12 overflow-hidden relative md:pl-[19rem]">
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MiIgaGVpZ2h0PSI0MiI+CjxwYXRoIGQ9Ik0wIDBoNDJ2NDJIMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1IiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz4KPC9zdmc+')] mix-blend-overlay" />

      <div className="max-w-4xl mx-auto w-full z-10 flex flex-col gap-8 h-full">
        
        <header className="border-b-4 border-white pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-8 md:mt-0">
          <div>
            <h4 className="font-mono text-sm uppercase tracking-widest opacity-50 mb-2 text-[#00ff41]">// COMMS_DASHBOARD</h4>
            <TypewriterHeading 
              text="/ping" 
              className="text-5xl lg:text-7xl font-bold uppercase tracking-tighter" 
            />
          </div>
          <Link href="/" className="font-mono text-sm hover:bg-white hover:text-black px-4 py-2 transition-colors border-2 border-white uppercase tracking-widest shrink-0">
            [RETURN TO ROOT]
          </Link>
        </header>

        {connecting ? (
          <div className="flex-1 font-mono text-sm flex flex-col gap-2 opacity-80 min-h-[50vh]">
            {traceLogs.map((log, i) => (
              <div key={i} className={log.includes("ESTABLISHED") ? "text-[#00ff41] font-bold mt-4" : ""}>
                {log}
              </div>
            ))}
            <div className="w-2 h-4 bg-white animate-pulse mt-2" />
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-12 font-mono"
          >
            {/* Top Bar Status */}
            <div className="flex justify-between items-center border border-[#00ff41]/50 bg-[#00ff41]/5 px-4 py-2 text-[#00ff41] text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2"><div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"/> UPLINK_SECURE</span>
              <span>ENC: AES-256</span>
              <span className="hidden md:inline">LATENCY: 12ms</span>
            </div>

            {/* Official Ports */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] opacity-50 border-b border-white/20 pb-2">Primary / Official Ports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {OFFICIAL_PORTS.map((port) => (
                  <a
                    key={port.id}
                    href={port.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleCopy(e, port.url, port.id)}
                    className="border-2 border-white p-4 hover:bg-white hover:text-black transition-colors group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs opacity-50 group-hover:opacity-100 transition-opacity bg-white/10 group-hover:bg-black/10 px-1">{port.id}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#00ff41] group-hover:text-black">{port.status}</span>
                    </div>
                    <div className="text-xl font-bold uppercase tracking-tighter mb-4"><ScrambleText>{port.label}</ScrambleText></div>
                    <div className="flex justify-between text-[10px] uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity border-t border-white/20 group-hover:border-black/20 pt-2">
                      <span>PROTOCOL: {port.protocol}</span>
                      <span>[ CONNECT ]</span>
                    </div>

                    <AnimatePresence>
                      {copiedPort === port.id && (
                        <motion.div 
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          className="absolute inset-0 bg-[#00ff41] text-black flex items-center justify-center font-bold text-xs uppercase tracking-widest text-center px-4"
                        >
                          Payload encrypted and copied to clipboard.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </a>
                ))}
              </div>
            </div>

            {/* Unofficial Ports */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] opacity-50 border-b border-white/20 pb-2">Secondary / Unofficial Ports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-70 hover:opacity-100 transition-opacity">
                {UNOFFICIAL_PORTS.map((port) => (
                  <div key={port.id} className="border border-white/30 p-4 border-dashed relative">
                    <div className="absolute -top-2 left-4 bg-black px-2 text-[10px] text-yellow-500 uppercase font-bold">UNVERIFIED_UPLINK</div>
                    <div className="flex justify-between items-center mt-2 mb-2">
                      <span className="text-xs opacity-50">{port.id}</span>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-red-500">{port.status}</span>
                    </div>
                    <div className="text-lg font-bold uppercase tracking-tighter mb-2 text-white/50">{port.label}</div>
                    
                    <a href={port.url} className="block mt-4 text-[10px] bg-white/10 hover:bg-white hover:text-black text-center py-2 uppercase transition-colors">
                      [ ESTABLISH_CONNECTION ]
                    </a>
                    
                    <div className="mt-2 text-[9px] text-yellow-500/80 uppercase tracking-widest">
                      // {port.notes}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center font-mono text-[10px] opacity-30 mt-8">
              WARNING: UNAUTHORIZED PINGS WILL BE LOGGED.
            </div>
          </motion.div>
        )}

      </div>
      <CommandPalette />
    </main>
  );
}
