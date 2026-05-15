"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PORTFOLIO_DATA } from "@/data/portfolio";
import type { ArchNode } from "@/data/types";
import { isProjectNode } from "@/data/types";

interface MobileNodeCardProps {
  node: ArchNode;
  index: number;
}

/**
 * Mobile-optimized node card. Replaces the draggable ArchitectureNode
 * with a tap-to-expand accordion. Full-width, large touch targets.
 */
export function MobileNodeCard({ node, index }: MobileNodeCardProps) {
  const [expanded, setExpanded] = useState(false);

  const isLocked = node.status === "LOCKED" || node.status === "CLASSIFIED";
  const isProject = isProjectNode(node);
  const isCore = node.id === "core";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={`border-2 ${isLocked ? "border-dashed" : ""} border-black bg-white`}
    >
      {/* Header — always visible, tap target */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left active:bg-black/5 transition-colors"
        style={{ minHeight: 56 }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 uppercase shrink-0">
            {node.status}
          </span>
          <h3 className="font-bold text-lg uppercase tracking-tight truncate">
            {node.title}
          </h3>
        </div>
        <span className="font-mono text-xs opacity-50 shrink-0 ml-2">
          {expanded ? "[ − ]" : "[ + ]"}
        </span>
      </button>

      {/* Description — always visible */}
      <div className="px-4 pb-3 text-sm">
        {isLocked ? (
          <span className="text-red-500 font-bold uppercase text-xs">
            ACCESS_RESTRICTED: Insufficient clearance.
          </span>
        ) : (
          <p className="opacity-80">{node.description}</p>
        )}
      </div>

      {/* Expanded section */}
      <AnimatePresence>
        {expanded && !isLocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 flex flex-col gap-4 border-t border-black/30 pt-3">
              {/* Metrics */}
              {node.metrics && node.metrics.length > 0 && (
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  {node.metrics.map((m, i) => (
                    <div key={i} className="border border-black/30 p-2">
                      <span className="opacity-50 block">{m.label}</span>
                      <span className="font-bold">{String(m.value)}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                {isProject && (
                  <Link
                    href={`/shipped/${node.slug}`}
                    className="block w-full border-2 border-black bg-black text-white text-center py-3 uppercase font-bold font-mono text-sm tracking-tight active:bg-white active:text-black transition-colors"
                    style={{ minHeight: 48 }}
                  >
                    View Case File →
                  </Link>
                )}

                {node.id === "skill_matrix" && (
                  <Link
                    href="/matrix"
                    className="block w-full border-2 border-black bg-black text-white text-center py-3 uppercase font-bold font-mono text-sm tracking-tight active:bg-white active:text-black transition-colors"
                    style={{ minHeight: 48 }}
                  >
                    Explore Skill Matrix →
                  </Link>
                )}

                {node.id === "reading_list" && (
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent("system-open-reading-list"))}
                    className="block w-full border-2 border-black bg-black text-white text-center py-3 uppercase font-bold font-mono text-sm tracking-tight active:bg-white active:text-black transition-colors"
                    style={{ minHeight: 48 }}
                  >
                    Open Reading Queue
                  </button>
                )}

                {isCore && (
                  <a
                    href={PORTFOLIO_DATA.general.builderArchiveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full border-2 border-black bg-white text-black text-center py-3 uppercase font-bold font-mono text-sm tracking-tight active:bg-black active:text-white transition-colors"
                    style={{ minHeight: 48 }}
                  >
                    Download Resume
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
