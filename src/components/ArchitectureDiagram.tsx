"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function ArchitectureDiagram() {
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [metrics, setMetrics] = useState({ requests: 42, latency: 12, errorRate: 0.01 });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStressTesting) {
      interval = setInterval(() => {
        setMetrics({
          requests: Math.floor(Math.random() * 5000) + 1000,
          latency: Math.floor(Math.random() * 50) + 80,
          errorRate: +(Math.random() * 2).toFixed(2),
        });
      }, 500);
    } else {
      interval = setInterval(() => {
        setMetrics({
          requests: Math.floor(Math.random() * 50) + 20,
          latency: Math.floor(Math.random() * 5) + 10,
          errorRate: 0.0,
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isStressTesting]);

  const packetDuration = isStressTesting ? 0.5 : 2;

  return (
    <div className="border-4 border-black p-4 bg-[#fafafa] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col font-mono relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
        <div>
          <h3 className="text-xl font-bold uppercase tracking-widest">Live Telemetry</h3>
          <p className="text-[10px] opacity-60">NODE_TOPOLOGY_ACTIVE</p>
        </div>
        <button
          onClick={() => setIsStressTesting(!isStressTesting)}
          className={`border-2 border-black px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
            isStressTesting ? "bg-red-500 text-white border-red-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" : "bg-black text-white hover:bg-white hover:text-black"
          }`}
        >
          {isStressTesting ? "ABORT STRESS TEST" : "INITIATE STRESS TEST"}
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 mb-6 text-xs">
        <div className="bg-black text-white p-2 flex flex-col justify-between">
          <span className="opacity-60">REQ/S</span>
          <span className="font-bold text-lg">{metrics.requests}</span>
        </div>
        <div className="bg-black text-white p-2 flex flex-col justify-between">
          <span className="opacity-60">LATENCY</span>
          <span className="font-bold text-lg">{metrics.latency}ms</span>
        </div>
        <div className={`p-2 flex flex-col justify-between border-2 border-black ${metrics.errorRate > 1 ? "bg-red-500 text-white" : "bg-white text-black"}`}>
          <span className="opacity-60">ERR_RATE</span>
          <span className="font-bold text-lg">{metrics.errorRate}%</span>
        </div>
      </div>

      {/* Diagram Area */}
      <div className="relative h-[300px] w-full border-2 border-dashed border-black/30 p-4">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {/* Client -> LB */}
          <path d="M 50 150 L 150 150" stroke="black" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <motion.circle cx="50" cy="150" r="4" fill="black"
            animate={{ cx: [50, 150] }}
            transition={{ repeat: Infinity, duration: packetDuration, ease: "linear" }}
          />

          {/* LB -> API 1 */}
          <path d="M 150 150 L 250 80" stroke="black" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <motion.circle cx="150" cy="150" r="4" fill="black"
            animate={{ cx: [150, 250], cy: [150, 80] }}
            transition={{ repeat: Infinity, duration: packetDuration, ease: "linear", delay: 0.2 }}
          />

          {/* LB -> API 2 */}
          <path d="M 150 150 L 250 220" stroke="black" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <motion.circle cx="150" cy="150" r="4" fill="black"
            animate={{ cx: [150, 250], cy: [150, 220] }}
            transition={{ repeat: Infinity, duration: packetDuration, ease: "linear", delay: 0.4 }}
          />

          {/* API 1 -> DB */}
          <path d="M 250 80 L 350 150" stroke="black" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <motion.circle cx="250" cy="80" r="4" fill="black"
            animate={{ cx: [250, 350], cy: [80, 150] }}
            transition={{ repeat: Infinity, duration: packetDuration, ease: "linear", delay: 0.6 }}
          />

          {/* API 2 -> DB */}
          <path d="M 250 220 L 350 150" stroke="black" strokeWidth="2" strokeDasharray="4 4" fill="none" />
          <motion.circle cx="250" cy="220" r="4" fill="black"
            animate={{ cx: [250, 350], cy: [220, 150] }}
            transition={{ repeat: Infinity, duration: packetDuration, ease: "linear", delay: 0.8 }}
          />
        </svg>

        {/* Nodes */}
        <div className="absolute top-[130px] left-[10px] w-[80px] h-[40px] bg-white border-2 border-black flex items-center justify-center font-bold text-[10px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
          CLIENT
        </div>

        <div className="absolute top-[130px] left-[130px] w-[40px] h-[40px] bg-black text-white flex items-center justify-center font-bold text-[10px] z-10">
          LB
        </div>

        <div className={`absolute top-[60px] left-[230px] w-[80px] h-[40px] bg-white border-2 flex items-center justify-center font-bold text-[10px] z-10 transition-colors ${isStressTesting ? "border-red-500 text-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]" : "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"}`}>
          NODE_01
        </div>

        <div className={`absolute top-[200px] left-[230px] w-[80px] h-[40px] bg-white border-2 flex items-center justify-center font-bold text-[10px] z-10 transition-colors ${isStressTesting ? "border-red-500 text-red-500 shadow-[4px_4px_0px_0px_rgba(239,68,68,1)]" : "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"}`}>
          NODE_02
        </div>

        <div className="absolute top-[120px] left-[330px] w-[60px] h-[60px] bg-black text-white border-4 border-black flex flex-col items-center justify-center font-bold text-[10px] z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
          <span>DB</span>
          <div className="w-full flex justify-center gap-1 mt-1">
            <motion.div className="w-1 h-1 bg-green-500 rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: isStressTesting ? 0.2 : 1 }} />
            <motion.div className="w-1 h-1 bg-green-500 rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: isStressTesting ? 0.2 : 1, delay: 0.2 }} />
            <motion.div className="w-1 h-1 bg-green-500 rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: isStressTesting ? 0.2 : 1, delay: 0.4 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
