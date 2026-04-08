"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ArchitectureNodeProps {
  id: string;
  title: string;
  status?: "ACTIVE" | "ARCHIVED" | "SCALING" | "CLASSIFIED";
  description: string;
  metrics?: { label: string; value: string }[];
  top: string;
  left: string;
  onHover?: (id: string | null) => void;
}

export function ArchitectureNode({
  id,
  title,
  status = "ACTIVE",
  description,
  metrics,
  top,
  left,
  onHover,
}: ArchitectureNodeProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      data-node-id={id}
      layoutId={`node-${id}`}
      drag
      dragMomentum={false}
      className="absolute bg-white border-2 border-black flex flex-col font-sans hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow cursor-pointer z-10"
      style={{ top, left, width: expanded ? 400 : 250 }}
      onMouseEnter={() => onHover?.(id)}
      onMouseLeave={() => onHover?.(null)}
      onDragStart={(e) => {
        // Prevent expanding when strictly dragging
        e.stopPropagation();
      }}
      onClick={(e) => {
        e.stopPropagation(); // prevent drag from triggering canvas
        setExpanded(!expanded);
      }}
    >
      <motion.div layout className="border-b-2 border-black p-2 flex justify-between items-center bg-black text-white">
        <h3 className="font-bold text-sm tracking-widest uppercase">{title}</h3>
        <span className="text-[10px] bg-white text-black px-1 uppercase font-mono">{status}</span>
      </motion.div>
      
      <motion.div layout className="p-3 flex flex-col gap-2 relative">
        <p className="text-sm border-l-2 border-black pl-2">{description}</p>
        
        {expanded && metrics && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mt-2 font-mono text-xs border border-black p-2"
          >
            <div className="font-bold mb-1 border-b border-black pb-1">SYS_METRICS:</div>
            {metrics.map((m, i) => (
              <div key={i} className="flex justify-between">
                <span>{m.label}</span>
                <span className="font-bold">{m.value}</span>
              </div>
            ))}
          </motion.div>
        )}
        
        {/* Connection port dot */}
        <div className="absolute w-2 h-2 bg-black rounded-full -left-1 top-1/2 -translate-y-1/2" />
        <div className="absolute w-2 h-2 bg-black rounded-full -right-1 top-1/2 -translate-y-1/2" />
      </motion.div>
    </motion.div>
  );
}
