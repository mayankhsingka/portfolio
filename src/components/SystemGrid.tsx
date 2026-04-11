"use client";

import { motion, useMotionValue } from "framer-motion";
import { ReactNode, RefObject, useEffect } from "react";

interface SystemGridProps {
  children: ReactNode;
  canvasRef?: RefObject<HTMLDivElement | null>;
}

export function SystemGrid({ children, canvasRef }: SystemGridProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Allow normal scroll if taking place over a scrollable element (e.g. terminal logs)
      if ((e.target as Element).closest(".overflow-auto") || (e.target as Element).closest(".overflow-y-auto")) return;
      e.preventDefault();
      x.set(x.get() - e.deltaX);
      y.set(y.get() - e.deltaY);
    };
    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [x, y]);
  // We make a huge canvas that the user can drag around inside the window
  return (
    <div 
      className="fixed inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <motion.div
        ref={canvasRef}
        drag
        style={{ x, y }}
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
