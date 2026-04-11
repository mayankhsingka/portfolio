"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSystemAudio } from "@/hooks/useSystemAudio";

// ASCII gradients from dark to light (blank space for darkest pixels, @ for brightest)
const ASCII_CHARS = [" ", ".", ":", "-", "=", "+", "*", "#", "%", "@"];

interface SurveillanceProps {
  onClose: () => void;
  top?: string;
  left?: string;
}

export function SurveillanceCamera({ onClose, top = "20%", left = "70%" }: SurveillanceProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const requestRef = useRef<number | null>(null);
  const { playAction } = useSystemAudio();

  // Resolution of the ASCII grid
  // 120 columns wide gives a good dense matrix look. Rows scaled by roughly 0.5 to account for character aspect ratio (fonts are taller than they are wide).
  const cols = 100;
  const rows = 50;

  useEffect(() => {
    // Play hardware boot sound
    playAction();
        
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasPermission(true);
      } catch (err) {
        console.error("Camera permission denied", err);
        setHasPermission(false);
      }
    }
    setupCamera();

    return () => {
      // Cleanup hardware stream
      if (videoRef.current?.srcObject) {
         const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
         tracks.forEach(track => track.stop());
      }
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [playAction]);

  useEffect(() => {
    if (!hasPermission || !videoRef.current || !canvasRef.current || !preRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const video = videoRef.current;
    const pre = preRef.current;

    canvas.width = cols;
    canvas.height = rows;

    const renderFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
        // Draw the video to the canvas (hidden)
        ctx.save();
        // Flip horizontally to simulate a mirror so it feels natural to the user
        ctx.scale(-1, 1);
        ctx.drawImage(video, -cols, 0, cols, rows);
        ctx.restore();

        const imageData = ctx.getImageData(0, 0, cols, rows);
        const data = imageData.data;

        let asciiStr = "";
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const offset = (y * cols + x) * 4;
            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            // Luminance mapping standard algorithm
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
            // Map 0-255 brightness to 0-9 index in ASCII array
            const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1));
            asciiStr += ASCII_CHARS[charIndex];
          }
          asciiStr += "\n";
        }

        // Extremely critical for performance: 
        // Direct DOM text dump instead of React state diffing avoids catastrophic lag.
        pre.textContent = asciiStr;
      }
      requestRef.current = requestAnimationFrame(renderFrame);
    };

    video.addEventListener("play", () => {
      renderFrame();
    });

  }, [hasPermission]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      // Standardize the brutalist style: pure black bg, thick white borders
      className="absolute bg-black border-4 border-white shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] flex flex-col font-mono z-50 text-white cursor-move overflow-hidden"
      style={{ top, left }}
    >
      {/* Window Header */}
      <div className="border-b-4 border-white p-2 flex justify-between items-center bg-white text-black">
        <div className="flex gap-2 items-center">
            <span className="w-3 h-3 rounded-full bg-black animate-pulse" />
            <h3 className="font-bold text-xs tracking-widest uppercase">/dev/video0 : LIVE_FEED</h3>
        </div>
        <button 
          onClick={(e) => {
             e.stopPropagation();
             onClose();
          }}
          className="text-[10px] bg-black text-white px-2 uppercase hover:bg-red-600 transition-colors cursor-pointer font-bold"
        >
          [SIGKILL]
        </button>
      </div>
      
      {/* Video Terminal Container */}
      <div className="p-4 relative bg-black min-w-[340px] min-h-[240px] flex items-center justify-center">
        {hasPermission === false && (
          <div className="text-red-500 text-sm font-bold uppercase border-2 border-red-500 p-2 text-center">
            ACCESS DENIED <br/><span className="text-xs">No visual optics established.</span>
          </div>
        )}
        {hasPermission === null && (
          <div className="text-white text-xs opacity-50 animate-pulse uppercase tracking-widest">
            Awaiting system handshake...
          </div>
        )}
        
        {/* Hidden underlying elements */}
        <video ref={videoRef} autoPlay playsInline muted className="hidden" />
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Rendered ASCII grid */}
        <pre 
            ref={preRef} 
            className="text-[6px] md:text-[8px] leading-tight tracking-tighter text-[#00ff41] select-none pointer-events-none font-bold whitespace-pre"
            style={{ 
                fontFamily: "monospace",
                textShadow: "0 0 4px rgba(0, 255, 65, 0.5)" 
            }}
        />
        
        {/* Decorative Grid Lines overlaying the video feed */}
        <div className="absolute inset-0 pointer-events-none border border-white/10" />
      </div>
    </motion.div>
  );
}
