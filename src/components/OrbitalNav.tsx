"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// ─── Navigation Items ────────────────────────────────────
const NAV_ITEMS = [
  { id: "shipped", label: "SHIPPED", desc: "Deployment Registry", route: "/shipped" },
  { id: "identity", label: "IDENTITY", desc: "Operator Dossier", route: "/core-identity" },
  { id: "matrix", label: "MATRIX", desc: "Uplink Hub", route: "/matrix" },
  { id: "memos", label: "TRANSMIT", desc: "Classified Archive", route: "/internal-memos" },
];

const RADIUS = 150;

// Cardinal positions: top, left, right, bottom
const POSITIONS = [
  { x: 0, y: -RADIUS },
  { x: -RADIUS, y: 0 },
  { x: RADIUS, y: 0 },
  { x: 0, y: RADIUS },
];

function getSelectedIndex(dx: number, dy: number, dist: number): number | null {
  if (dist < 40) return null;
  const angle = Math.atan2(dy, dx);
  if (angle > -3 * Math.PI / 4 && angle <= -Math.PI / 4) return 0; // top
  if (Math.abs(angle) > 3 * Math.PI / 4) return 1;   // left
  if (angle > -Math.PI / 4 && angle <= Math.PI / 4) return 2; // right
  return 3; // bottom
}

export function OrbitalNav() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  // Use state instead of ref so re-renders use correct center
  const [center, setCenter] = useState({ x: 0, y: 0 });

  // ─── Shift+N Listener ──────────────────────────────────
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
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
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

  // ─── Mouse tracking ───────────────────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const dx = e.clientX - center.x;
      const dy = e.clientY - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      setSelected(getSelectedIndex(dx, dy, dist));
    },
    [center]
  );

  // ─── Navigate ─────────────────────────────────────────
  const handleSelect = useCallback(
    (idx: number | null) => {
      if (idx === null) { setIsOpen(false); return; }
      router.push(NAV_ITEMS[idx].route);
      setIsOpen(false);
      window.dispatchEvent(new CustomEvent("system-log", {
        detail: `[NAV] Orbital jump → ${NAV_ITEMS[idx].label}`,
      }));
    },
    [router]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[70] cursor-crosshair select-none"
          onMouseMove={handleMouseMove}
          onClick={() => handleSelect(selected)}
        >
          {/* Backdrop blur */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(14px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/50"
          />

          {/* Central Hub */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
            className="absolute w-16 h-16 bg-black border-2 border-white rounded-full flex items-center justify-center z-10"
            style={{ left: center.x - 32, top: center.y - 32 }}
          >
            <span className="font-mono text-white text-[10px] font-bold tracking-widest">NAV</span>
            {/* Pulse ring */}
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 border border-white/30 rounded-full"
            />
          </motion.div>

          {/* Sector lines */}
          <svg className="absolute inset-0 pointer-events-none z-[5]">
            {/* Sector dividers — faint diagonal lines */}
            {[Math.PI / 4, -Math.PI / 4, 3 * Math.PI / 4, -3 * Math.PI / 4].map((angle, i) => (
              <motion.line
                key={`sector-${i}`}
                x1={center.x} y1={center.y}
                x2={center.x + Math.cos(angle) * 300}
                y2={center.y + Math.sin(angle) * 300}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
            ))}
            {/* Item connector lines */}
            {POSITIONS.map((pos, i) => (
              <motion.line
                key={i}
                x1={center.x} y1={center.y}
                x2={center.x + pos.x} y2={center.y + pos.y}
                stroke={selected === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.12)"}
                strokeWidth={selected === i ? 2 : 1}
                strokeDasharray={selected === i ? "none" : "4 4"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
              />
            ))}
          </svg>

          {/* Nav Items */}
          {NAV_ITEMS.map((item, i) => {
            const isSelected = selected === i;
            const isDimmed = selected !== null && !isSelected;

            return (
              <motion.div
                key={item.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isSelected ? 1.1 : 1,
                  opacity: isDimmed ? 0.2 : 1,
                  x: center.x + POSITIONS[i].x - 72,
                  y: center.y + POSITIONS[i].y - 30,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 20,
                  delay: i * 0.04,
                }}
                className="absolute pointer-events-none z-10"
              >
                <div
                  className={`
                    bg-white border-2 font-mono text-center px-5 py-3 min-w-[144px]
                    transition-all duration-200
                    ${isSelected
                      ? "border-white shadow-[0_0_30px_rgba(255,255,255,0.5),0_0_60px_rgba(255,255,255,0.2)]"
                      : "border-white/30"
                    }
                  `}
                >
                  <div className="text-sm font-black uppercase tracking-widest text-black">
                    {item.label}
                  </div>
                  <div className="text-[8px] font-bold uppercase tracking-widest text-black/40 mt-0.5">
                    {item.desc}
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-center text-white font-mono text-[10px] font-bold mt-1.5 uppercase tracking-widest"
                  >
                    ▸ SELECT
                  </motion.div>
                )}
              </motion.div>
            );
          })}

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.45, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.25 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white font-mono text-[10px] uppercase tracking-widest flex items-center gap-4"
          >
            <span>Move to select</span>
            <span className="opacity-30">·</span>
            <span>Click to navigate</span>
            <span className="opacity-30">·</span>
            <kbd className="bg-white/10 px-1.5 py-0.5 text-[9px] rounded-sm">ESC</kbd>
            <span>close</span>
          </motion.div>

          {/* Shortcut + GTA V nod */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ delay: 0.4 }}
            className="absolute top-6 right-6 text-right"
          >
            <div className="text-white font-mono text-[10px] uppercase tracking-widest">SHIFT+N</div>
            <div className="text-white/40 font-mono text-[7px] uppercase tracking-widest mt-1">
              Weapon Wheel™ — You know the vibe
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
