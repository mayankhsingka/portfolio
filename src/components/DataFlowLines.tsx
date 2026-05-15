"use client";

import { useState, useEffect, useCallback, useRef, RefObject } from "react";
import { PORTFOLIO_DATA } from "@/data/portfolio";

// Node connection definitions
const CONNECTIONS = [
  { from: "core", to: "exp_1" },
  { from: "core", to: "exp_2" },
  { from: "core", to: "skill_matrix" },
  { from: "core", to: "reading_list" },
];

interface LineData {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  fromId: string;
  toId: string;
}

interface DataFlowLinesProps {
  canvasRef: RefObject<HTMLDivElement | null>;
  hoveredNodeId?: string | null;
}

export function DataFlowLines({ canvasRef, hoveredNodeId }: DataFlowLinesProps) {
  const [lines, setLines] = useState<LineData[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const calculateLines = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    const newLines = CONNECTIONS.map((conn) => {
      const fromEl = canvas.querySelector(`[data-node-id="${conn.from}"]`) as HTMLElement | null;
      const toEl = canvas.querySelector(`[data-node-id="${conn.to}"]`) as HTMLElement | null;
      if (!fromEl || !toEl) return null;

      const canvasRect = canvas.getBoundingClientRect();
      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      return {
        x1: fromRect.left + fromRect.width / 2 - canvasRect.left,
        y1: fromRect.top + fromRect.height / 2 - canvasRect.top,
        x2: toRect.left + toRect.width / 2 - canvasRect.left,
        y2: toRect.top + toRect.height / 2 - canvasRect.top,
        fromId: conn.from,
        toId: conn.to,
      };
    }).filter(Boolean) as LineData[];

    setLines(newLines);
  }, [canvasRef]);

  useEffect(() => {
    // Massive Performance Fix: 
    // The relative coordinates inside the canvas DO NOT change during a drag interaction.
    // We do NOT need a 60fps requestAnimationFrame loop.
    // We only need to calculate the connections once on mount, and whenever the window resizes.
    
    // Initial calculation (slight delay to ensure DOM paint)
    const timeout = setTimeout(() => calculateLines(), 100);

    // Watch for window resizes
    const handleResize = () => calculateLines();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateLines]);

  if (lines.length === 0) return null;

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Animated line flow effect */}
        <style>
          {`
            @keyframes wire-flow {
              from { stroke-dashoffset: 28; }
              to { stroke-dashoffset: 0; }
            }
            .wire-path {
              animation: wire-flow 1.5s linear infinite;
            }
            .wire-path-hovered {
              animation: wire-flow 0.5s linear infinite;
            }
          `}
        </style>
        {/* Deep terminal glow filter — creates the space-navigation particle feel */}
        <filter id="packet-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtler glow for the wire itself */}
        <filter id="wire-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Radial gradient for the packet — bright center, soft fade */}
        <radialGradient id="packet-gradient">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="40%" stopColor="white" stopOpacity="0.8" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {lines.map((line, i) => {
        const isHovered = hoveredNodeId === line.fromId || hoveredNodeId === line.toId;
        const pathId = `flow-path-${i}`;
        const dx = line.x2 - line.x1;
        const dy = line.y2 - line.y1;
        const len = Math.sqrt(dx * dx + dy * dy);

        // Create a slightly curved path for more organic feel
        const midX = (line.x1 + line.x2) / 2;
        const midY = (line.y1 + line.y2) / 2;
        // Perpendicular offset for curve
        const nx = -dy / len;
        const ny = dx / len;
        const curveAmount = len * 0.04; // Subtle curve
        const cx = midX + nx * curveAmount;
        const cy = midY + ny * curveAmount;

        const pathD = `M ${line.x1} ${line.y1} Q ${cx} ${cy} ${line.x2} ${line.y2}`;
        // Reverse path for return packets
        const pathDReverse = `M ${line.x2} ${line.y2} Q ${cx} ${cy} ${line.x1} ${line.y1}`;
        const pathIdReverse = `flow-path-${i}-rev`;

        // Speed: normal 6s per cycle, hovered 2s
        const baseDuration = isHovered ? 2 : 6;

        // --- Rubber Band Tension Physics ---
        // Base length assumes a comfortable distance around 400px.
        // If stretched to 1000px, it turns tense thinner and more transparent.
        const tension = Math.min(Math.max(len / 400, 0.5), 2.5);
        const dynamicStrokeWidth = (isHovered ? 2.5 : 2) / tension;
        const dynamicOpacity = (isHovered ? 0.9 : 0.4) / tension;

        return (
          <g key={i}>
            {/* The connection wire — dashed with subtle glow and animated flow */}
            <path
              d={pathD}
              stroke={isHovered ? "#E11D48" : (tension > 1.8 ? "#880000" : "black")}
              strokeWidth={dynamicStrokeWidth}
              strokeDasharray="14 14"
              fill="none"
              opacity={dynamicOpacity}
              filter={isHovered ? "url(#packet-glow)" : "url(#wire-glow)"}
              className={isHovered ? "wire-path-hovered" : "wire-path"}
              style={{ transition: "stroke 0.3s ease" }}
            />

            {/* Hidden paths for animateMotion */}
            <path id={pathId} d={pathD} fill="none" stroke="none" />
            <path id={pathIdReverse} d={pathDReverse} fill="none" stroke="none" />

            {/* === DATA PACKETS — forward direction === */}
            {/* Packet 1: primary */}
            <circle
              r={isHovered ? 3.5 : 2.5}
              fill="black"
              opacity={isHovered ? 1 : 0.7}
              filter="url(#packet-glow)"
              style={{ transition: "r 0.3s ease, opacity 0.3s ease" }}
            >
              <animateMotion
                dur={`${baseDuration}s`}
                repeatCount="indefinite"
                begin="0s"
              >
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </circle>

            {/* Packet 2: delayed, slightly smaller */}
            <circle
              r={isHovered ? 2.5 : 1.5}
              fill="black"
              opacity={isHovered ? 0.8 : 0.4}
              filter="url(#packet-glow)"
            >
              <animateMotion
                dur={`${baseDuration}s`}
                repeatCount="indefinite"
                begin={`${baseDuration * 0.33}s`}
              >
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </circle>

            {/* Packet 3: return direction — gives bidirectional data flow feel */}
            <circle
              r={isHovered ? 2 : 1}
              fill="black"
              opacity={isHovered ? 0.6 : 0.25}
              filter="url(#packet-glow)"
            >
              <animateMotion
                dur={`${baseDuration * 1.3}s`}
                repeatCount="indefinite"
                begin={`${baseDuration * 0.5}s`}
              >
                <mpath href={`#${pathIdReverse}`} />
              </animateMotion>
            </circle>

            {/* Trailing particle effect — very small dots that follow main packet with delay */}
            <circle
              r={isHovered ? 1.5 : 0.8}
              fill="black"
              opacity={isHovered ? 0.5 : 0.15}
            >
              <animateMotion
                dur={`${baseDuration}s`}
                repeatCount="indefinite"
                begin="0.15s"
              >
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </circle>

            {/* Connection port dots at endpoints */}
            <circle
              cx={line.x1}
              cy={line.y1}
              r={isHovered ? 4 : 3}
              fill="black"
              opacity={isHovered ? 0.9 : 0.5}
              style={{ transition: "all 0.3s ease" }}
            />
            <circle
              cx={line.x2}
              cy={line.y2}
              r={isHovered ? 4 : 3}
              fill="black"
              opacity={isHovered ? 0.9 : 0.5}
              style={{ transition: "all 0.3s ease" }}
            />

            {/* Pulsing ring on hover */}
            {isHovered && (
              <>
                <circle
                  cx={line.x1}
                  cy={line.y1}
                  r="6"
                  fill="none"
                  stroke="black"
                  strokeWidth="1"
                  opacity="0.4"
                >
                  <animate
                    attributeName="r"
                    values="4;10;4"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0;0.4"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle
                  cx={line.x2}
                  cy={line.y2}
                  r="6"
                  fill="none"
                  stroke="black"
                  strokeWidth="1"
                  opacity="0.4"
                >
                  <animate
                    attributeName="r"
                    values="4;10;4"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.4;0;0.4"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}
