"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSystemAudio } from "@/hooks/useSystemAudio";

// ─── Navigation Items ────────────────────────────────────
// TO ADD A NEW NODE: Simply add a new entry here. The geometry will auto-adjust.
const NAV_ITEMS = [
  { id: "shipped", label: "SHIPPED", desc: "Deployment Registry", route: "/shipped" },
  { id: "identity", label: "IDENTITY", desc: "Operator Dossier", route: "/core-identity" },
  { id: "matrix", label: "MATRIX", desc: "Uplink Hub", route: "/matrix" },
  { id: "memos", label: "TRANSMIT", desc: "Classified Archive", route: "/internal-memos" },
  { id: "ping", label: "COMM_PORT", desc: "Global Ping Console", route: "/ping" },
  { id: "sandbox", label: "SANDBOX", desc: "Terminal Emulator", route: "/commands" },
];

const RADIUS = 160;

export function OrbitalNav() {
  const router = useRouter();
  const { playSnap, playKeystroke } = useSystemAudio();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });

  // ─── Dynamic Geometry Calculation ───────────────────────
  const navPositions = useMemo(() => {
    return NAV_ITEMS.map((_, i) => {
      // Start from -90deg (top) and move clockwise
      const angle = (i * (360 / NAV_ITEMS.length) - 90) * (Math.PI / 180);
      return {
        x: Math.cos(angle) * RADIUS,
        y: Math.sin(angle) * RADIUS,
        angle: angle
      };
    });
  }, []);

  // ─── Radial Selection Logic ──────────────────────────────
  const getSelectedIndex = useCallback((dx: number, dy: number, dist: number) => {
    if (dist < 45) return null;

    // Calculate angle in degrees (0 to 360)
    let mouseAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (mouseAngle < 0) mouseAngle += 360;

    // Find the item with the closest angle
    let closestIdx = 0;
    let minDiff = Infinity;

    NAV_ITEMS.forEach((_, i) => {
      let itemAngle = (i * (360 / NAV_ITEMS.length)) % 360;
      // Adjust because our atan2 starts at 0 (right), but our logic starts at -90 (top)
      itemAngle = (itemAngle + 270) % 360;

      let diff = Math.abs(mouseAngle - itemAngle);
      if (diff > 180) diff = 360 - diff;

      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    });

    return closestIdx;
  }, []);

  // ─── Key Listeners ─────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (e.shiftKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (!isOpen) {
          setCenter({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
          setSelected(null);
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
      }
      if (e.key === "Escape" && isOpen) setIsOpen(false);
    };

    const handleOrbital = () => {
      setCenter({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      setSelected(null);
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKey);
    window.addEventListener("system-open-orbital", handleOrbital);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("system-open-orbital", handleOrbital);
    };
  }, [isOpen]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const dx = e.clientX - center.x;
    const dy = e.clientY - center.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const newIdx = getSelectedIndex(dx, dy, dist);
    if (newIdx !== selected) {
      setSelected(newIdx);
      if (newIdx !== null) playSnap();
    }
  };

  const handleSelect = (idx: number | null) => {
    if (idx === null) { setIsOpen(false); return; }
    playKeystroke();
    router.push(NAV_ITEMS[idx].route);
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("system-log", {
      detail: `[NAV] Jump initiated → ${NAV_ITEMS[idx].label}`,
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[1000] cursor-crosshair select-none"
          onMouseMove={handleMouseMove}
          onClick={() => handleSelect(selected)}
        >
          {/* Backdrop Blur */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
            animate={{ backdropFilter: "blur(12px)", opacity: 1 }}
            exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
            className="absolute inset-0 bg-black/60"
          />

          {/* Central Hub */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 90 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute w-20 h-20 bg-black border-2 border-white rounded-full flex items-center justify-center z-20 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            style={{ left: center.x - 40, top: center.y - 40 }}
          >
            <div className="flex flex-col items-center">
              <span className="font-mono text-white text-[10px] font-bold tracking-[0.2em]">DIRECTIVE</span>
              <span className="font-mono text-white/40 text-[8px] uppercase">Active</span>
            </div>
            {/* Pulse */}
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border-2 border-white rounded-full"
            />
          </motion.div>

          {/* Dynamic Selection Lines */}
          <svg className="absolute inset-0 pointer-events-none z-10">
            {navPositions.map((pos, i) => {
              const isSelected = selected === i;
              return (
                <motion.line
                  key={`line-${i}`}
                  x1={center.x} y1={center.y}
                  x2={center.x + pos.x} y2={center.y + pos.y}
                  stroke="white"
                  strokeWidth={isSelected ? 3 : 1}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: isSelected ? 0.8 : 0.15,
                    strokeDasharray: isSelected ? "none" : "5 5"
                  }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                />
              );
            })}
          </svg>

          {/* Nav Items */}
          {NAV_ITEMS.map((item, i) => {
            const pos = navPositions[i];
            const isSelected = selected === i;
            const isDimmed = selected !== null && !isSelected;

            return (
              <motion.div
                key={item.id}
                initial={{ scale: 0, opacity: 0, x: center.x - 72, y: center.y - 30 }}
                animate={{
                  scale: isSelected ? 1.15 : 1,
                  opacity: isDimmed ? 0.3 : 1,
                  x: center.x + pos.x - 72,
                  y: center.y + pos.y - 30,
                }}
                exit={{ scale: 0, opacity: 0, x: center.x - 72, y: center.y - 30 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                  delay: i * 0.03,
                }}
                className="absolute pointer-events-none z-30"
              >
                <div
                  className={`
                    bg-white border-2 font-mono text-center px-6 py-4 min-w-[160px]
                    transition-all duration-300 rounded-xl
                    ${isSelected
                      ? "border-white shadow-[0_0_40px_rgba(255,255,255,0.4)] scale-105"
                      : "border-white/20"
                    }
                  `}
                >
                  <div className="text-[11px] font-black uppercase tracking-widest text-black">
                    {item.label}
                  </div>
                  <div className="text-[7px] font-bold uppercase tracking-widest text-black/50 mt-1">
                    {item.desc}
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-white font-mono text-[9px] font-bold mt-2 uppercase tracking-[0.3em] drop-shadow-md"
                  >
                    DEPLOY_UPLINK_PROTOCAL
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Bottom Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.6, y: 0 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 font-mono text-[9px] text-white uppercase tracking-[0.2em]"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              ORBITAL_NAV_V2
            </div>
            <div className="h-3 w-[1px] bg-white/20" />
            <span>CLICK TO DEPLOY</span>
            <div className="h-3 w-[1px] bg-white/20" />
            <span>ESC TO TERMINATE</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
