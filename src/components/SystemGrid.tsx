"use client";

import { motion } from "framer-motion";
import { ReactNode, useRef } from "react";

interface SystemGridProps {
  children: ReactNode;
}

export function SystemGrid({ children }: SystemGridProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);

  // We make a huge canvas that the user can drag around inside the window
  return (
    <div 
      className="fixed inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
      ref={constraintsRef}
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
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
