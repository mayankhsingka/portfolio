"use client";

import { motion } from "framer-motion";
import { ReactNode, RefObject } from "react";

interface SystemGridProps {
  children: ReactNode;
  canvasRef?: RefObject<HTMLDivElement | null>;
}

export function SystemGrid({ children, canvasRef }: SystemGridProps) {
  // We make a huge canvas that the user can drag around inside the window
  return (
    <div 
      className="fixed inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <motion.div
        ref={canvasRef}
        drag
        dragElastic={0.2}
        className="relative w-[300vw] h-[300vh] left-[-100vw] top-[-100vh]"
      >
        {/* Draw a subtle central crosshair as the origin point */}
        <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-black/20 -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[1px] h-full bg-black/20 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        {children}
      </motion.div>
    </div>
  );
}
