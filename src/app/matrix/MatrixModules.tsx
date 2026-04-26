"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// 1. 3D Wireframe Cube
export function WireframeCube() {
  return (
    <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center perspective-[800px] cursor-crosshair group overflow-hidden relative">
      <div className="absolute top-2 left-2 text-[10px] font-mono font-bold uppercase tracking-widest opacity-40">System_Core_3D</div>
      <motion.div 
        animate={{ rotateX: [0, 360], rotateY: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="relative w-24 h-24 transform-style-3d group-hover:scale-125 transition-transform duration-700"
      >
        <div className="absolute inset-0 border-2 border-black bg-white/10" style={{ transform: "translateZ(48px)" }} />
        <div className="absolute inset-0 border-2 border-black bg-white/10" style={{ transform: "rotateY(180deg) translateZ(48px)" }} />
        <div className="absolute inset-0 border-2 border-black bg-white/10" style={{ transform: "rotateY(90deg) translateZ(48px)" }} />
        <div className="absolute inset-0 border-2 border-black bg-white/10" style={{ transform: "rotateY(-90deg) translateZ(48px)" }} />
        <div className="absolute inset-0 border-2 border-black bg-white/10" style={{ transform: "rotateX(90deg) translateZ(48px)" }} />
        <div className="absolute inset-0 border-2 border-black bg-white/10" style={{ transform: "rotateX(-90deg) translateZ(48px)" }} />
      </motion.div>
      <div className="absolute bottom-2 right-2 flex gap-1">
        <span className="w-1.5 h-1.5 bg-black rounded-full animate-ping" />
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .perspective-\\[800px\\] { perspective: 800px; }
        .transform-style-3d { transform-style: preserve-3d; }
      `}} />
    </div>
  );
}

// 2. Radar Chart
export function SkillRadar() {
  // SVG polygon mapping 5 points (Frontend, Backend, Design, Arch, Ops)
  return (
    <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center relative">
      <div className="absolute top-2 left-2 text-[10px] font-mono font-bold uppercase tracking-widest opacity-40">Capability_Radar</div>
      
      <svg width="160" height="160" viewBox="0 0 160 160" className="overflow-visible mt-4">
        {/* Background Web */}
        <polygon points="80,10 146,58 121,134 39,134 14,58" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        <polygon points="80,27 130,63 111,119 49,119 30,63" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        <polygon points="80,45 113,69 100,105 60,105 47,69" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="1" />
        
        {/* Axis Lines */}
        <line x1="80" y1="80" x2="80" y2="10" stroke="rgba(0,0,0,0.1)" />
        <line x1="80" y1="80" x2="146" y2="58" stroke="rgba(0,0,0,0.1)" />
        <line x1="80" y1="80" x2="121" y2="134" stroke="rgba(0,0,0,0.1)" />
        <line x1="80" y1="80" x2="39" y2="134" stroke="rgba(0,0,0,0.1)" />
        <line x1="80" y1="80" x2="14" y2="58" stroke="rgba(0,0,0,0.1)" />

        {/* Data Polygon (Animated) */}
        <motion.polygon 
          initial={{ points: "80,80 80,80 80,80 80,80 80,80" }}
          animate={{ points: "80,15 140,60 110,120 45,130 20,65" }}
          transition={{ duration: 1.5, type: "spring", stiffness: 50 } as any}
          fill="rgba(0,0,0,0.1)" 
          stroke="black" 
          strokeWidth="2" 
        />
        
        {/* Data Points */}
        <circle cx="80" cy="15" r="3" fill="black" />
        <circle cx="140" cy="60" r="3" fill="black" />
        <circle cx="110" cy="120" r="3" fill="black" />
        <circle cx="45" cy="130" r="3" fill="black" />
        <circle cx="20" cy="65" r="3" fill="black" />

        {/* Labels */}
        <text x="80" y="-2" textAnchor="middle" className="text-[8px] font-mono font-bold uppercase">FRONTEND</text>
        <text x="150" y="58" textAnchor="start" className="text-[8px] font-mono font-bold uppercase">SYSTEMS</text>
        <text x="125" y="146" textAnchor="start" className="text-[8px] font-mono font-bold uppercase">ARCHITECTURE</text>
        <text x="35" y="146" textAnchor="end" className="text-[8px] font-mono font-bold uppercase">UX_DESIGN</text>
        <text x="10" y="58" textAnchor="end" className="text-[8px] font-mono font-bold uppercase">BACKEND</text>
      </svg>
    </div>
  );
}

// 3. Classified Dropzone
export function DropzoneModule() {
  const [dragActive, setDragActive] = useState(false);
  const [dropped, setDropped] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setDropped(true);
    
    // Fake decryption sequence
    setTimeout(() => {
      setDropped(false);
    }, 4000);
  };

  return (
    <div 
      className={`w-full h-full min-h-[200px] border-[3px] border-dashed p-6 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden ${dragActive ? 'border-black bg-black/5 scale-[0.98]' : 'border-black/20 hover:border-black/50'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="absolute top-2 left-2 text-[10px] font-mono font-bold uppercase tracking-widest opacity-40">I/O_Dropzone</div>
      
      {!dropped ? (
        <>
          <svg className={`w-12 h-12 mb-4 transition-transform ${dragActive ? 'scale-125 opacity-100' : 'opacity-40'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div className="font-mono text-sm font-bold uppercase tracking-widest text-center">
            {dragActive ? "RELEASE TO DECRYPT" : "DROP CLASSIFIED FILES"}
          </div>
          <div className="font-mono text-[9px] opacity-50 uppercase tracking-widest mt-2 text-center max-w-[200px]">
            Formats accepted: .TXT, .MD, .ENC
          </div>
        </>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-12 h-12 mb-4 rounded-full border-4 border-black border-t-transparent animate-spin" />
          <div className="font-mono text-sm font-bold uppercase tracking-widest mb-1 text-red-600 animate-pulse">
            DECRYPTION FAILED
          </div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest">
            ERROR 403: INSUFFICIENT CLEARANCE LEVEL
          </div>
        </motion.div>
      )}
    </div>
  );
}
