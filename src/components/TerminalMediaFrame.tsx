"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface TerminalMediaFrameProps {
  type: "image" | "video";
  url: string;
  caption?: string;
  index: number;
}

export function TerminalMediaFrame({ type, url, caption, index }: TerminalMediaFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="group relative flex flex-col border-2 border-black bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
    >
      {/* Header bar */}
      <div className="bg-white border-b-2 border-black p-2 flex justify-between items-center">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-black/20" />
          <div className="w-2 h-2 rounded-full bg-black/20" />
          <div className="w-2 h-2 rounded-full bg-black/20" />
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">
          Source_ID: 0x{Math.floor(Math.random() * 65535).toString(16).toUpperCase()}
        </span>
      </div>

      {/* Media Content Wrapper */}
      <div className="relative aspect-video w-full bg-[#0a0a0a] overflow-hidden">
        {type === "image" ? (
          <div className="relative w-full h-full">
            {/* Standard Image with system fallback */}
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 border-2 border-dashed border-white/5 m-4">
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em]">
                [MEDIA_PENDING_DEPLOY]
              </span>
            </div>
            {/* Real Image (once user adds them) */}
            <img 
              src={url} 
              alt={caption || "System Visualization"} 
              className="w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              onLoad={(e) => {
                e.currentTarget.classList.remove("opacity-0");
                e.currentTarget.classList.add("opacity-100");
              }}
            />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <span className="font-mono text-[10px] text-[#00ff41] animate-pulse">
              &gt; STREAMING_SECURE_VIDEO_LINK...
            </span>
          </div>
        )}

        {/* CRT Effects */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
        
        {/* Subtle Scanline Animation */}
        <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(transparent_0%,rgba(0,0,0,0.05)_50%,transparent_100%)] bg-[length:100%_10%] animate-[scanline_8s_linear_infinite]" />
      </div>

      {/* Footer / Caption */}
      <div className="p-3 bg-white border-t-2 border-black flex flex-col gap-1">
        <div className="flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-tighter">
          <span>{type === "image" ? "STATIC_IMG" : "VID_STREAM_v0.1"}</span>
          <span className="text-black/30">REF_ID_{index + 1}</span>
        </div>
        {caption && (
          <p className="font-mono text-[11px] leading-tight border-l-2 border-black pl-3 mt-1 py-1 opacity-70 italic">
            {caption}
          </p>
        )}
      </div>
    </motion.div>
  );
}
