"use client";

import { motion, useMotionValue } from "framer-motion";
import { ReactNode, RefObject, useEffect, useState } from "react";

interface SystemGridProps {
  children: ReactNode;
  canvasRef?: RefObject<HTMLDivElement | null>;
}

export function SystemGrid({ children, canvasRef }: SystemGridProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [constraints, setConstraints] = useState({ top: -1000, bottom: 1000, left: -1000, right: 1000 });

  useEffect(() => {
    // Determine the constraints so we can't drag the canvas off-screen.
    // The canvas is 300vw x 300vh, offset by -100vw and -100vh.
    // So we can move at most 100vw/100vh in any direction before an edge hits the viewport.
    const handleResize = () => {
      setConstraints({
        top: -window.innerHeight,
        bottom: window.innerHeight,
        left: -window.innerWidth,
        right: window.innerWidth,
      });
    };
    
    handleResize(); // Initial set
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        dragElastic={0.2}
        dragConstraints={constraints}
        style={{ x, y }}
        className="relative w-[300vw] h-[300vh] left-[-100vw] top-[-100vh]"
      >
        {/* Draw a subtle central crosshair as the origin point */}
        <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-black/5 -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-[1px] h-full bg-black/5 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        {children}
      </motion.div>
    </div>
  );
}
