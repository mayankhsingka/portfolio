"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";
import { useRouter } from "next/navigation";
import { useSystemAudio } from "@/hooks/useSystemAudio";

// ─── Navigation Items ────────────────────────────────────
const NAV_ITEMS = [
  { id: "shipped", label: "SHIPPED", route: "/shipped", icon: "◈" },
  { id: "identity", label: "IDENTITY", route: "/core-identity", icon: "◇" },
  { id: "matrix", label: "MATRIX", route: "/matrix", icon: "◉" },
  { id: "memos", label: "TRANSMIT", route: "/internal-memos", icon: "◆" },
];

// ─── Layout ──────────────────────────────────────────────
const BTN_W = 128;
const BTN_H = 42;
const CHAIN_GAP = 48;
const PITCH = BTN_W + CHAIN_GAP;
const TOTAL_W = PITCH * 3 + BTN_W;
const CUT_DURATION = 1800;

// Dramatic stiffness cascade for train effect
const SPRING_CFGS = [
  { stiffness: 500, damping: 32, mass: 0.6 },
  { stiffness: 220, damping: 22, mass: 1.2 },
  { stiffness: 120, damping: 18, mass: 1.8 },
  { stiffness: 70, damping: 14, mass: 2.4 },
];

// ─── Helpers ─────────────────────────────────────────────
function getDefaultPos() {
  if (typeof window === "undefined") return { x: 200, y: 20 };
  return { x: (window.innerWidth - TOTAL_W) / 2, y: 20 };
}

function loadState() {
  try {
    const mode = (localStorage.getItem("chainnav_mode") as "chained" | "unchained") || "chained";
    const posRaw = localStorage.getItem("chainnav_pos");
    const pos = posRaw ? JSON.parse(posRaw) : getDefaultPos();
    const freeRaw = localStorage.getItem("chainnav_free");
    const free = freeRaw ? JSON.parse(freeRaw) : null;
    return { mode, pos, free };
  } catch {
    return { mode: "chained" as const, pos: getDefaultPos(), free: null };
  }
}

// ─── Chain Link SVG — Interlocking links ─────────────────
function ChainLinkSVG({ isHeating, progress }: { isHeating: boolean; progress: number }) {
  const baseColor = isHeating ? "#ef4444" : "#222";
  const glow = isHeating ? `drop-shadow(0 0 ${4 + progress * 10}px rgba(239,68,68,${0.4 + progress * 0.6}))` : "none";

  return (
    <svg viewBox="0 0 48 20" className="w-full h-5 overflow-visible" style={{ filter: glow }}>
      {/* Link 1 */}
      <rect x="1" y="3" width="14" height="14" rx="7" ry="7"
        fill="none" stroke={baseColor} strokeWidth="2.5" className="transition-colors duration-200" />
      {/* Link 2 — overlaps 1 and 3 */}
      <rect x="12" y="5" width="24" height="10" rx="5" ry="5"
        fill="none" stroke={baseColor} strokeWidth="2.5" className="transition-colors duration-200" />
      {/* Link 3 */}
      <rect x="33" y="3" width="14" height="14" rx="7" ry="7"
        fill="none" stroke={baseColor} strokeWidth="2.5" className="transition-colors duration-200" />
      {/* Stress fracture at critical heat */}
      {isHeating && progress > 0.4 && (
        <motion.line
          x1="24" y1="0" x2="24" y2="20"
          stroke="#ef4444" strokeWidth={1 + progress * 2}
          strokeDasharray="2 2"
          initial={{ opacity: 0 }} animate={{ opacity: progress * 0.8 }}
        />
      )}
    </svg>
  );
}

// ─── Chain Link Connector between two buttons ────────────
function ChainLinkSegment({
  leftX, leftY, rightX, rightY,
  isHeating, cutProgress,
  onCutStart, onCutCancel,
}: {
  leftX: MotionValue<number>; leftY: MotionValue<number>;
  rightX: MotionValue<number>; rightY: MotionValue<number>;
  isHeating: boolean; cutProgress: number;
  onCutStart: () => void; onCutCancel: () => void;
}) {
  const linkX = useTransform(
    [leftX, rightX] as MotionValue[],
    ([lx, rx]: number[]) => (lx as number) + BTN_W - 1
  );
  const linkY = useTransform(
    [leftY, rightY] as MotionValue[],
    ([ly, ry]: number[]) => ((ly as number) + (ry as number)) / 2 + BTN_H / 2 - 10
  );
  const linkW = useTransform(
    [leftX, rightX] as MotionValue[],
    ([lx, rx]: number[]) => Math.max(8, (rx as number) - ((lx as number) + BTN_W) + 2)
  );

  return (
    <motion.div
      style={{ x: linkX, y: linkY, width: linkW, position: "absolute" as const }}
      className="h-5 pointer-events-auto cursor-pointer z-[46] group"
      onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onCutStart(); }}
      onPointerUp={onCutCancel}
      onPointerLeave={onCutCancel}
    >
      <ChainLinkSVG isHeating={isHeating} progress={cutProgress} />

      {/* Large cut progress ring */}
      {isHeating && cutProgress > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(239,68,68,0.1)" strokeWidth="2" />
            <circle
              cx="28" cy="28" r="24"
              fill="none" stroke="#ef4444" strokeWidth="3"
              strokeDasharray={`${cutProgress * 150.8} 150.8`}
              strokeLinecap="round" transform="rotate(-90 28 28)"
            />
            <circle cx="28" cy="28" r="16" fill="none" stroke="rgba(239,68,68,0.15)" strokeWidth="1"
              strokeDasharray={`${cutProgress * 100.5} 100.5`} transform="rotate(90 28 28)" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-red-500 font-mono text-[9px] font-black">
            {Math.round(cutProgress * 100)}%
          </span>
        </div>
      )}

      {/* Hover tooltip */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-60 transition-opacity duration-300 text-[7px] font-mono font-bold uppercase tracking-[0.2em] whitespace-nowrap pointer-events-none text-black">
        ⛓ HOLD TO SEVER
      </div>
    </motion.div>
  );
}

// ─── Break Particles ─────────────────────────────────────
function BreakParticles({ originX, originY }: { originX: number; originY: number }) {
  const particles = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      dx: (Math.random() - 0.5) * 200,
      dy: (Math.random() - 0.5) * 140 - 20,
      size: 2 + Math.random() * 5,
      delay: Math.random() * 0.1,
      rotation: Math.random() * 360,
      isChainBit: i < 6,
    }))
  ).current;

  return (
    <>
      <motion.div
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.12 }}
        className="fixed inset-0 bg-white pointer-events-none z-[48]"
      />
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: originX, y: originY, opacity: 1, scale: 1, rotate: 0 }}
          animate={{ x: originX + p.dx, y: originY + p.dy, opacity: 0, scale: 0, rotate: p.rotation }}
          transition={{ duration: 0.7, delay: p.delay, ease: "easeOut" }}
          className={`absolute pointer-events-none z-[48] ${
            p.isChainBit ? "w-3 h-1.5 border border-black bg-transparent rounded-full" : "bg-black rounded-full"
          }`}
          style={p.isChainBit ? {} : { width: p.size, height: p.size }}
        />
      ))}
      <motion.div
        initial={{ width: 0, height: 0, opacity: 0.5 }}
        animate={{ width: 140, height: 140, opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="absolute border-2 border-black/30 rounded-full pointer-events-none z-[48]"
        style={{ left: originX - 70, top: originY - 70 }}
      />
    </>
  );
}

// ─── Nav Button ──────────────────────────────────────────
function NavButton({
  item, isFree = false, isDragging = false,
}: {
  item: (typeof NAV_ITEMS)[0]; isFree?: boolean; isDragging?: boolean;
}) {
  return (
    <div
      className={`
        relative bg-white border-[2.5px] border-black font-mono text-[10px] font-black
        uppercase tracking-[0.15em] select-none transition-all duration-150
        ${isDragging
          ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] scale-[1.03] bg-gray-50"
          : "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white"
        }
      `}
      style={{ width: BTN_W, height: BTN_H }}
    >
      <span className="flex items-center justify-center h-full gap-2">
        <span className="text-[13px] leading-none">{item.icon}</span>
        {item.label}
      </span>
      {/* Chain anchor dots */}
      {!isFree && (
        <>
          <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-black rounded-full border-2 border-white" />
          <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-[8px] h-[8px] bg-black rounded-full border-2 border-white" />
        </>
      )}
      {isFree && (
        <>
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border border-white animate-pulse" />
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[7px] font-mono font-bold opacity-40 whitespace-nowrap uppercase tracking-widest">
            2× click to re-forge
          </div>
        </>
      )}
    </div>
  );
}

// ─── Free-floating Button (Unchained) ────────────────────
function FreeButton({
  item, index, initialX, initialY, onSave, onRechain,
}: {
  item: (typeof NAV_ITEMS)[0]; index: number;
  initialX: number; initialY: number;
  onSave: (id: string, x: number, y: number) => void;
  onRechain: () => void;
}) {
  const router = useRouter();
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);
  const wasDragged = useRef(false);

  return (
    <motion.div
      initial={{ scale: 0.3, opacity: 0, rotate: -15 + index * 10 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ delay: index * 0.08, type: "spring", stiffness: 180, damping: 12 }}
      drag dragMomentum={false}
      style={{ x, y, position: "absolute" as const }}
      className="pointer-events-auto cursor-grab active:cursor-grabbing select-none z-[46]"
      onDragStart={() => { wasDragged.current = true; }}
      onDragEnd={() => {
        onSave(item.id, x.get(), y.get());
        setTimeout(() => { wasDragged.current = false; }, 150);
      }}
      onDoubleClick={onRechain}
      onClick={() => { if (!wasDragged.current) router.push(item.route); }}
      whileDrag={{ scale: 1.06 }}
    >
      <NavButton item={item} isFree />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CHAIN NAV — Main
// ═══════════════════════════════════════════════════════════
export function ChainNav() {
  const router = useRouter();
  const { playSnap } = useSystemAudio();

  const [mode, setMode] = useState<"chained" | "unchained">("chained");
  const [mounted, setMounted] = useState(false);
  const [heatingLink, setHeatingLink] = useState<number | null>(null);
  const [cutProgress, setCutProgress] = useState(0);
  const [breakOrigin, setBreakOrigin] = useState<{ x: number; y: number } | null>(null);
  const [freePositions, setFreePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [isDragging, setIsDragging] = useState(false);

  const cutTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cutStartRef = useRef(0);

  // ─── Chain Physics ─────────────────────────────────────
  const baseX = useMotionValue(0);
  const baseY = useMotionValue(0);

  const t0x = useTransform(baseX, (v) => v);
  const s0x = useSpring(t0x, SPRING_CFGS[0]);
  const s0y = useSpring(baseY, SPRING_CFGS[0]);

  const t1x = useTransform(baseX, (v) => v + PITCH);
  const s1x = useSpring(t1x, SPRING_CFGS[1]);
  const s1y = useSpring(baseY, SPRING_CFGS[1]);

  const t2x = useTransform(baseX, (v) => v + PITCH * 2);
  const s2x = useSpring(t2x, SPRING_CFGS[2]);
  const s2y = useSpring(baseY, SPRING_CFGS[2]);

  const t3x = useTransform(baseX, (v) => v + PITCH * 3);
  const s3x = useSpring(t3x, SPRING_CFGS[3]);
  const s3y = useSpring(baseY, SPRING_CFGS[3]);

  const springs = useMemo(
    () => [
      { x: s0x, y: s0y },
      { x: s1x, y: s1y },
      { x: s2x, y: s2y },
      { x: s3x, y: s3y },
    ],
    [s0x, s0y, s1x, s1y, s2x, s2y, s3x, s3y]
  );

  // ─── Init ──────────────────────────────────────────────
  useEffect(() => {
    const saved = loadState();
    baseX.set(saved.pos.x);
    baseY.set(saved.pos.y);
    if (saved.mode === "unchained" && saved.free) {
      setMode("unchained");
      setFreePositions(saved.free);
    }
    setMounted(true);
  }, []);

  // ─── Drag ──────────────────────────────────────────────
  const dragActive = useRef(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const lastPtr = useRef({ x: 0, y: 0 });
  const wasDragged = useRef(false);
  const dragBtnIdx = useRef<number | null>(null);

  const onBtnPointerDown = useCallback(
    (e: React.PointerEvent, idx: number) => {
      if (mode !== "chained") return;
      dragActive.current = true;
      wasDragged.current = false;
      dragBtnIdx.current = idx;
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      lastPtr.current = { x: e.clientX, y: e.clientY };
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [mode]
  );

  const onBtnPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragActive.current) return;
      const dx = e.clientX - lastPtr.current.x;
      const dy = e.clientY - lastPtr.current.y;
      lastPtr.current = { x: e.clientX, y: e.clientY };
      const totalD = Math.abs(e.clientX - dragStartPos.current.x) + Math.abs(e.clientY - dragStartPos.current.y);
      if (totalD > 4) wasDragged.current = true;
      baseX.set(baseX.get() + dx);
      baseY.set(baseY.get() + dy);
    },
    [baseX, baseY]
  );

  const onBtnPointerUp = useCallback(() => {
    if (!dragActive.current) return;
    dragActive.current = false;
    setIsDragging(false);
    if (!wasDragged.current && dragBtnIdx.current !== null) {
      router.push(NAV_ITEMS[dragBtnIdx.current].route);
    }
    localStorage.setItem("chainnav_pos", JSON.stringify({ x: baseX.get(), y: baseY.get() }));
    dragBtnIdx.current = null;
  }, [baseX, baseY, router]);

  // ─── Chain Cut ─────────────────────────────────────────
  const startCut = useCallback(
    (linkIdx: number) => {
      if (mode !== "chained") return;
      setHeatingLink(linkIdx);
      cutStartRef.current = Date.now();

      cutTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - cutStartRef.current;
        const p = Math.min(elapsed / CUT_DURATION, 1);
        setCutProgress(p);

        // Screen shake
        if (p > 0.3) {
          const i = (p - 0.3) * 3;
          document.body.style.transform = `translate(${(Math.random() - 0.5) * i}px, ${(Math.random() - 0.5) * i}px)`;
        }
        if (p >= 1) {
          clearInterval(cutTimerRef.current!);
          document.body.style.transform = "";
          executeCut(linkIdx);
        }
      }, 16);

      window.dispatchEvent(new CustomEvent("system-log", {
        detail: "[WARN] Chain integrity compromised... hold to sever.",
      }));
    },
    [mode]
  );

  const cancelCut = useCallback(() => {
    if (cutTimerRef.current) {
      clearInterval(cutTimerRef.current);
      document.body.style.transform = "";
    }
    setHeatingLink(null);
    setCutProgress(0);
  }, []);

  const executeCut = useCallback(
    (linkIdx: number) => {
      const current: Record<string, { x: number; y: number }> = {};
      NAV_ITEMS.forEach((item, i) => {
        current[item.id] = { x: springs[i].x.get(), y: springs[i].y.get() };
      });

      const lx = springs[linkIdx].x.get() + BTN_W;
      const ly = springs[linkIdx].y.get() + BTN_H / 2;
      const rx = springs[linkIdx + 1].x.get();
      const ry = springs[linkIdx + 1].y.get() + BTN_H / 2;
      setBreakOrigin({ x: (lx + rx) / 2, y: (ly + ry) / 2 });
      setTimeout(() => setBreakOrigin(null), 1000);

      // Scatter force from break point
      const breakX = (lx + rx) / 2;
      NAV_ITEMS.forEach((item) => {
        const dir = current[item.id].x > breakX ? 1 : -1;
        current[item.id].x += dir * (30 + Math.random() * 50);
        current[item.id].y += (Math.random() - 0.5) * 60;
      });

      playSnap();
      setFreePositions(current);
      setMode("unchained");
      setHeatingLink(null);
      setCutProgress(0);

      localStorage.setItem("chainnav_mode", "unchained");
      localStorage.setItem("chainnav_free", JSON.stringify(current));

      window.dispatchEvent(new CustomEvent("system-log", {
        detail: "[CRITICAL] ⛓ Chain severed. Nodes unlinked. Double-click to re-forge.",
      }));
    },
    [springs, playSnap]
  );

  // ─── Re-chain ──────────────────────────────────────────
  const reChain = useCallback(() => {
    const pos = getDefaultPos();
    baseX.set(pos.x);
    baseY.set(pos.y);
    setMode("chained");
    localStorage.setItem("chainnav_mode", "chained");
    localStorage.setItem("chainnav_pos", JSON.stringify(pos));
    playSnap();
    window.dispatchEvent(new CustomEvent("system-log", {
      detail: "[OK] ⛓ Chain integrity restored. Nodes re-linked.",
    }));
  }, [baseX, baseY, playSnap]);

  const saveFreePos = useCallback((id: string, x: number, y: number) => {
    setFreePositions((prev) => {
      const next = { ...prev, [id]: { x, y } };
      localStorage.setItem("chainnav_free", JSON.stringify(next));
      return next;
    });
  }, []);

  // Memoize default pos for hint
  const hintPos = useMemo(() => {
    if (typeof window === "undefined") return { left: 200, top: 70 };
    return {
      left: (window.innerWidth - TOTAL_W) / 2 + TOTAL_W / 2 - 40,
      top: 20 + BTN_H + 14,
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[46]">
      {mode === "chained" ? (
        <>
          {/* Chain links */}
          {[0, 1, 2].map((i) => (
            <ChainLinkSegment
              key={i}
              leftX={springs[i].x} leftY={springs[i].y}
              rightX={springs[i + 1].x} rightY={springs[i + 1].y}
              isHeating={heatingLink === i}
              cutProgress={heatingLink === i ? cutProgress : 0}
              onCutStart={() => startCut(i)}
              onCutCancel={cancelCut}
            />
          ))}

          {/* Buttons */}
          {NAV_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              style={{ x: springs[i].x, y: springs[i].y, position: "absolute" as const }}
              className="pointer-events-auto cursor-grab active:cursor-grabbing select-none z-[46]"
              onPointerDown={(e) => onBtnPointerDown(e, i)}
              onPointerMove={onBtnPointerMove}
              onPointerUp={onBtnPointerUp}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0, y: -30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 200, damping: 14 }}
              >
                <NavButton item={item} isDragging={isDragging && dragBtnIdx.current === i} />
              </motion.div>
            </motion.div>
          ))}

          {/* Drag hint */}
          {!isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 3.5, duration: 1 }}
              className="fixed font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-black pointer-events-none z-[45]"
              style={{ left: hintPos.left, top: hintPos.top }}
            >
              ← drag chain →
            </motion.div>
          )}
        </>
      ) : (
        <>
          {NAV_ITEMS.map((item, i) => (
            <FreeButton
              key={item.id}
              item={item} index={i}
              initialX={freePositions[item.id]?.x ?? getDefaultPos().x + i * PITCH}
              initialY={freePositions[item.id]?.y ?? getDefaultPos().y}
              onSave={saveFreePos}
              onRechain={reChain}
            />
          ))}
        </>
      )}

      <AnimatePresence>
        {breakOrigin && <BreakParticles originX={breakOrigin.x} originY={breakOrigin.y} />}
      </AnimatePresence>

      {/* Heating red vignette */}
      <AnimatePresence>
        {heatingLink !== null && cutProgress > 0.2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: cutProgress * 0.15 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-[45]"
            style={{
              background: `radial-gradient(circle at 50% 0%, rgba(239,68,68,${cutProgress * 0.3}) 0%, transparent 60%)`,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
