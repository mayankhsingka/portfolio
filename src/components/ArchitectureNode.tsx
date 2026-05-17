"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSystemAudio } from "@/hooks/useSystemAudio";
import { useScrambleText } from "@/hooks/useScrambleText";
import { ScrambleText } from "@/components/ScrambleText";


interface ArchitectureNodeProps {
  id: string;
  title: string;
  status?: "ACTIVE" | "SCALING" | "CLASSIFIED" | "LOCKED" | "IN_PROGRESS";
  description: string;
  metrics?: { label: string; value: string }[];
  top?: string;
  left?: string;
  slug?: string;
  onHover?: (id: string | null) => void;
}

function emitMoved() {
  window.dispatchEvent(new CustomEvent("system-node-moved"));
}

export function ArchitectureNode({
  id,
  title,
  status = "ACTIVE",
  description,
  metrics,
  top,
  left,
  slug,
  onHover,
}: ArchitectureNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const { playSnap, playKeystroke } = useSystemAudio();
  const scrambledTitle = useScrambleText(title);
  const scrambledDesc = useScrambleText(description);

  // Tell DataFlowLines to re-trace whenever this node finishes its expand/collapse animation.
  useEffect(() => {
    const t = setTimeout(emitMoved, 320);
    return () => clearTimeout(t);
  }, [expanded]);

  const isLocked = status === "LOCKED" || status === "CLASSIFIED";
  const isCore = id === "core";

  return (
    <motion.div
      data-node-id={id}
      layoutId={`node-${id}`}
      drag
      dragMomentum={true}
      dragElastic={0.4}
      dragTransition={{ bounceStiffness: 200, bounceDamping: 10, power: 0.2 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        filter: isLocked ? "grayscale(1) blur(1px)" : "grayscale(0) blur(0px)",
      }}
      whileHover={{ scale: isLocked ? 1 : 1.02 }}
      className={`absolute bg-white border-2 border-black flex flex-col font-sans hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow z-10 ${isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
      style={{ top, left, width: expanded ? 400 : 250 }}
      onMouseEnter={() => !isLocked && onHover?.(id)}
      onMouseLeave={() => !isLocked && onHover?.(null)}
      onDragStart={(e) => {
        if (isLocked) {
          e.preventDefault();
          return;
        }
        e.stopPropagation();
        playKeystroke();
      }}
      onDrag={emitMoved}
      onDragEnd={emitMoved}
      onClick={(e) => {
        e.stopPropagation();
        // Allow expanding even if locked to show the hint
        playSnap();
        setExpanded(!expanded);
      }}
    >
      <motion.div layout className={`border-b-2 border-black p-2 flex justify-between items-center ${isLocked ? 'bg-zinc-800' : 'bg-black'} text-white`}>
        <h3 className="font-bold text-sm tracking-widest uppercase">{scrambledTitle}</h3>
        <span className="text-[10px] bg-white text-black px-1 uppercase font-mono">{status}</span>
      </motion.div>
      
      <motion.div layout className="p-3 flex flex-col gap-2 relative">
        <div className="text-sm border-l-2 border-black pl-2">
          {isLocked ? (
            <div className="flex flex-col gap-2">
              <span className="text-red-500 font-bold uppercase tracking-widest text-xs">ACCESS_RESTRICTED: Insufficient clearance.</span>
              <span className="text-xs uppercase font-mono opacity-60">
                [HINT]: Use the Command Palette (/) to execute system actions. 
                Sufficient activity will automatically elevate your clearance to OPERATOR.
              </span>
            </div>
          ) : (
            <p>{description}</p>
          )}
        </div>
        
        {expanded && metrics && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="mt-2 font-mono text-xs border border-black p-2 bg-zinc-50"
          >
            <div className="font-bold mb-1 border-b border-black pb-1 uppercase">Sys_Metrics:</div>
            {metrics.map((m, i) => (
              <div key={i} className="flex justify-between">
                <span className="opacity-60">{m.label}</span>
                <span className="font-bold">{String(m.value)}</span>
              </div>
            ))}

            {slug && (
              <div className="mt-4 pt-4 border-t border-black/20">
                <Link 
                  href={`/shipped/${slug}`}
                  className="block w-full border-2 border-black bg-black text-white text-center py-2 px-1 hover:bg-white hover:text-black transition-colors uppercase font-bold tracking-tighter text-[10px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  [ DECRYPT_CASE_FILE ]
                </Link>
                <div className="text-[8px] mt-1 opacity-40 text-center uppercase tracking-widest">
                  View full system documentation
                </div>
              </div>
            )}

            {id === "skill_matrix" && (
              <div className="mt-4 pt-4 border-t border-black/20">
                <Link 
                  href={`/matrix`}
                  className="block w-full border-2 border-black bg-[#00ff41] text-black text-center py-2 px-1 hover:bg-white hover:text-black transition-colors uppercase font-bold tracking-tighter text-[10px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  [ ENTER_MATRIX_HUB ]
                </Link>
                <div className="text-[8px] mt-1 opacity-40 text-center uppercase tracking-widest text-[#00ff41]">
                  Global Operator Wikipedia
                </div>
              </div>
            )}

            {id === "reading_list" && (
              <div className="mt-4 pt-4 border-t border-black/20">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent("system-open-reading-list"));
                  }}
                  className="block w-full border-2 border-black bg-black text-white text-center py-2 px-1 hover:bg-white hover:text-black transition-colors uppercase font-bold tracking-tighter text-[10px]"
                >
                  [ DECRYPT_ARCHIVE ]
                </button>
                <div className="text-[8px] mt-1 opacity-40 text-center uppercase tracking-widest text-black">
                  Classified Databank
                </div>
              </div>
            )}

            {isCore && (
              <div className="mt-4 pt-4 border-t border-black/20">
                <Link
                  href="/ping"
                  className="block w-full border-2 border-black bg-black text-white text-center py-2 px-1 hover:bg-white hover:text-black transition-colors uppercase font-bold tracking-tighter text-[10px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  [ ESTABLISH_UPLINK ]
                </Link>
                <div className="text-[8px] mt-1 opacity-40 text-center uppercase tracking-widest">
                  Open the comms console
                </div>
              </div>
            )}
          </motion.div>
        )}
        
      </motion.div>

      {/* Connection ports — anchored to the OUTER node midpoint so DataFlowLines snaps cleanly */}
      <div className="absolute w-2 h-2 bg-black rounded-full -left-1 top-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute w-2 h-2 bg-black rounded-full -right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
    </motion.div>
  );
}
