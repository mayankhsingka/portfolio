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
import { usePathname, useRouter } from "next/navigation";
import { useSystemAudio } from "@/hooks/useSystemAudio";

// ─── Navigation Items ────────────────────────────────────
const NAV_ITEMS = [
  { id: "core",    label: "CORE",    sublabel: "about · me", route: "/core-identity",  icon: "◇" },
  { id: "shipped", label: "SHIPPED", sublabel: "projects",   route: "/shipped",        icon: "◈" },
  { id: "memos",   label: "MEMOS",   sublabel: "writing",    route: "/internal-memos", icon: "◆" },
  { id: "ping",    label: "CONTACT", sublabel: "reach out",  route: "/ping",           icon: "⎈" },
];

// ─── Layout ──────────────────────────────────────────────
const BTN_W = 132;
const BTN_H = 52;
const CHAIN_GAP = 52;
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
  if (typeof window === "undefined") return { x: 200, y: 24 };
  return { x: (window.innerWidth - TOTAL_W) / 2, y: 24 };
}

function loadState() {
  try {
    const mode = (localStorage.getItem("chainnav_mode") as "chained" | "unchained") || "chained";
    // Always calculate perfect center on boot for chained mode
    const pos = getDefaultPos();
    const freeRaw = localStorage.getItem("chainnav_free");
    const free = freeRaw ? JSON.parse(freeRaw) : null;
    return { mode, pos, free };
  } catch {
    return { mode: "chained" as const, pos: getDefaultPos(), free: null };
  }
}

// ─── Chain Link SVG — Interlocking links ─────────────────
function ChainLinkSVG({ isHeating, progress }: { isHeating: boolean; progress: number }) {
  const baseColor = isHeating ? "#ef4444" : "#000";
  const glow = isHeating ? `drop-shadow(0 0 ${4 + progress * 10}px rgba(239,68,68,${0.4 + progress * 0.6}))` : "none";

  return (
    <svg viewBox="0 0 52 20" className="w-full h-5 overflow-visible" preserveAspectRatio="none" style={{ filter: glow }}>
      {/* Industrial Chain Links */}
      <rect x="2" y="4" width="18" height="12" fill="none" stroke={baseColor} strokeWidth="2" />
      <rect x="16" y="6" width="20" height="8" fill="#fff" stroke={baseColor} strokeWidth="2" />
      <rect x="32" y="4" width="18" height="12" fill="none" stroke={baseColor} strokeWidth="2" />
      
      {/* Stress fracture at critical heat */}
      {isHeating && progress > 0.4 && (
        <motion.path
          d="M 26 2 L 30 10 L 26 18"
          stroke="#ef4444" strokeWidth={2 + progress * 2}
          fill="none"
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
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[8px] font-mono font-bold uppercase tracking-[0.2em] whitespace-nowrap pointer-events-none text-black bg-white/90 px-2 py-1 border border-black/20 shadow-sm backdrop-blur-sm">
        ⛓ HOLD TO SEVER
      </div>
    </motion.div>
  );
}

// ─── Broken Link Indicator (severed, clickable to re-forge) ──
function BrokenLinkSegment({
  leftX, leftY, rightX, rightY, onReforge,
}: {
  leftX: MotionValue<number>; leftY: MotionValue<number>;
  rightX: MotionValue<number>; rightY: MotionValue<number>;
  onReforge: () => void;
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
      onClick={onReforge}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Dashed broken line */}
      <svg viewBox="0 0 52 20" className="w-full h-5 overflow-visible" preserveAspectRatio="none">
        <line x1="4" y1="10" x2="48" y2="10" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
        <circle cx="26" cy="10" r="3" fill="none" stroke="#ef4444" strokeWidth="1" opacity="0.5" />
        <line x1="24" y1="8" x2="28" y2="12" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
      </svg>

      {/* Hover tooltip */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[8px] font-mono font-bold uppercase tracking-[0.2em] whitespace-nowrap pointer-events-none text-white bg-red-600 px-2 py-1 border border-red-800 shadow-sm">
        🔧 CLICK TO RE-FORGE
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
  item, isActive = false, isFree = false, isDragging = false,
}: {
  item: (typeof NAV_ITEMS)[0]; isActive?: boolean; isFree?: boolean; isDragging?: boolean;
}) {
  return (
    <div
      className={`
        relative flex items-center select-none transition-all duration-200
        ${isDragging
          ? "scale-[1.05] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.15)] z-50 bg-white border-2 border-black"
          : isActive
            ? "bg-black text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
            : "bg-white text-black border-2 border-black hover:bg-black hover:text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[2px] hover:-translate-x-[2px]"
        }
      `}
      style={{ width: BTN_W, height: BTN_H }}
    >
      <span className="flex items-center gap-2.5 w-full h-full px-3 relative z-10">
        <span className="text-[16px] leading-none shrink-0">{item.icon}</span>
        <span className="flex flex-col leading-none gap-1 min-w-0">
          <span className="font-mono text-[11px] font-black uppercase tracking-[0.12em] truncate">
            {item.label}
          </span>
          <span className="font-mono text-[8px] font-medium tracking-[0.15em] opacity-55 truncate">
            {item.sublabel}
          </span>
        </span>
        {isActive && (
          <span className="ml-auto text-[#0f0] animate-pulse font-bold text-[14px] leading-none shrink-0">
            _
          </span>
        )}
      </span>
      {/* Chain anchor squares */}
      {!isFree && (
        <>
          <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-[6px] h-[6px] bg-black border border-white" />
          <div className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-[6px] h-[6px] bg-black border border-white" />
        </>
      )}
      {isFree && (
        <>
          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 border-2 border-black animate-pulse" />
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] font-mono font-bold opacity-50 whitespace-nowrap uppercase tracking-widest text-black bg-white/90 px-1 border border-black/10">
            2× Click to Re-Forge
          </div>
        </>
      )}
    </div>
  );
}

// ─── Free-floating Button (Unchained) ────────────────────
function FreeButton({
  item, index, initialX, initialY, onSave, onRechain, isActive
}: {
  item: (typeof NAV_ITEMS)[0]; index: number;
  initialX: number; initialY: number;
  onSave: (id: string, x: number, y: number) => void;
  onRechain: () => void;
  isActive?: boolean;
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
      <NavButton item={item} isFree isActive={isActive} />
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CHAIN NAV — Main
// ═══════════════════════════════════════════════════════════
export function ChainNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { playSnap } = useSystemAudio();

  const [severedLinks, setSeveredLinks] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);
  const allSevered = severedLinks.size >= 3;
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
    try {
      const savedSevered = localStorage.getItem("chainnav_severed");
      if (savedSevered) {
        const parsed = JSON.parse(savedSevered);
        setSeveredLinks(new Set(parsed));
      }
    } catch {}
    if (saved.mode === "unchained" && saved.free) {
      setSeveredLinks(new Set([0, 1, 2]));
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
      if (allSevered) return;
      dragActive.current = true;
      wasDragged.current = false;
      dragBtnIdx.current = idx;
      dragStartPos.current = { x: e.clientX, y: e.clientY };
      lastPtr.current = { x: e.clientX, y: e.clientY };
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [allSevered]
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

    // Magnetic Docking
    let docked = false;
    if (baseY.get() < 80) { // If dragged near the top 80px
      const pos = getDefaultPos();
      baseX.set(pos.x);
      baseY.set(pos.y);
      docked = true;
      window.dispatchEvent(new CustomEvent("system-log", {
        detail: "[SYS] Nav array docked successfully.",
      }));
    }

    if (!wasDragged.current && dragBtnIdx.current !== null) {
      router.push(NAV_ITEMS[dragBtnIdx.current].route);
    }
    
    if (!docked) {
      localStorage.setItem("chainnav_pos", JSON.stringify({ x: baseX.get(), y: baseY.get() }));
    } else {
      const pos = getDefaultPos();
      localStorage.setItem("chainnav_pos", JSON.stringify(pos));
    }
    dragBtnIdx.current = null;
  }, [baseX, baseY, router]);

  // ─── Chain Cut ─────────────────────────────────────────
  const startCut = useCallback(
    (linkIdx: number) => {
      if (severedLinks.has(linkIdx)) return;
      setHeatingLink(linkIdx);
      cutStartRef.current = Date.now();

      cutTimerRef.current = setInterval(() => {
        const elapsed = Date.now() - cutStartRef.current;
        const p = Math.min(elapsed / CUT_DURATION, 1);
        setCutProgress(p);

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
        detail: `[WARN] Link ${linkIdx} integrity compromised... hold to sever.`,
      }));
    },
    [severedLinks]
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
      const lx = springs[linkIdx].x.get() + BTN_W;
      const ly = springs[linkIdx].y.get() + BTN_H / 2;
      const rx = springs[linkIdx + 1].x.get();
      const ry = springs[linkIdx + 1].y.get() + BTN_H / 2;
      setBreakOrigin({ x: (lx + rx) / 2, y: (ly + ry) / 2 });
      setTimeout(() => setBreakOrigin(null), 1000);

      playSnap();
      const newSevered = new Set(severedLinks);
      newSevered.add(linkIdx);
      setSeveredLinks(newSevered);
      setHeatingLink(null);
      setCutProgress(0);

      localStorage.setItem("chainnav_severed", JSON.stringify([...newSevered]));

      // If ALL 3 links now severed, go fully unchained
      if (newSevered.size >= 3) {
        const current: Record<string, { x: number; y: number }> = {};
        NAV_ITEMS.forEach((item, i) => {
          current[item.id] = { x: springs[i].x.get(), y: springs[i].y.get() };
        });
        const breakX = (lx + rx) / 2;
        NAV_ITEMS.forEach((item) => {
          const dir = current[item.id].x > breakX ? 1 : -1;
          current[item.id].x += dir * (30 + Math.random() * 50);
          current[item.id].y += (Math.random() - 0.5) * 60;
        });
        setFreePositions(current);
        localStorage.setItem("chainnav_mode", "unchained");
        localStorage.setItem("chainnav_free", JSON.stringify(current));
        window.dispatchEvent(new CustomEvent("system-log", {
          detail: "[CRITICAL] ⛓ ALL chains severed. Full system detach. Double-click to re-forge.",
        }));
      } else {
        window.dispatchEvent(new CustomEvent("system-log", {
          detail: `[WARN] ⛓ Link ${linkIdx} severed. ${3 - newSevered.size} link(s) remain. Hold another to continue.`,
        }));
      }
    },
    [springs, playSnap, severedLinks]
  );

  // ─── Re-chain ──────────────────────────────────────────
  const reChain = useCallback(() => {
    const pos = getDefaultPos();
    baseX.set(pos.x);
    baseY.set(pos.y);
    setSeveredLinks(new Set());
    localStorage.setItem("chainnav_severed", "[]");
    localStorage.setItem("chainnav_mode", "chained");
    localStorage.setItem("chainnav_pos", JSON.stringify(pos));
    playSnap();
    window.dispatchEvent(new CustomEvent("system-log", {
      detail: "[OK] ⛓ All chains re-forged. Full integrity restored.",
    }));
  }, [baseX, baseY, playSnap]);

  // ─── Re-forge single link ──────────────────────────────
  const reForgeLink = useCallback((linkIdx: number) => {
    const newSevered = new Set(severedLinks);
    newSevered.delete(linkIdx);
    setSeveredLinks(newSevered);
    localStorage.setItem("chainnav_severed", JSON.stringify([...newSevered]));
    playSnap();
    window.dispatchEvent(new CustomEvent("system-log", {
      detail: `[OK] ⛓ Link ${linkIdx} re-forged. ${newSevered.size} severed link(s) remain.`,
    }));
  }, [severedLinks, playSnap]);

  const saveFreePos = useCallback((id: string, x: number, y: number) => {
    setFreePositions((prev) => {
      const next = { ...prev, [id]: { x, y } };
      localStorage.setItem("chainnav_free", JSON.stringify(next));
      return next;
    });
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[46]">
      {/* Ghost Rail / Docking Area */}
      {/* Ghost Rail / Docking Area */}
      {!allSevered && (
        <div className="fixed top-[24px] left-0 right-0 pointer-events-none flex justify-center z-[40]">
          <div 
            className="relative flex items-center"
            style={{ width: TOTAL_W, height: BTN_H }}
          >
            {/* Tech accents */}
            <div className="absolute -top-6 left-0 flex items-center gap-2">
              <div className="w-2 h-2 bg-black animate-pulse" />
              <div className="text-[9px] font-mono font-bold text-black/40 uppercase tracking-widest">
                MAIN_SYS_NAV // {severedLinks.size > 0 ? `${severedLinks.size} LINK(S) SEVERED` : 'DOCK // DRAG TO DETACH'}
              </div>
            </div>
            
            {/* Outlines of the buttons & links */}
            {NAV_ITEMS.map((_, i) => (
              <div key={i} className="absolute border border-black/10 bg-black/[0.02]" style={{ width: BTN_W, height: BTN_H, left: i * PITCH, top: 0 }}>
                 <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-black/20" />
                 <div className="absolute top-0 right-0 w-1 h-1 border-t border-r border-black/20" />
                 <div className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-black/20" />
                 <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-black/20" />
              </div>
            ))}
            {/* Ghost chain links */}
            {[0, 1, 2].map((i) => (
              <div key={`link-${i}`} className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center" style={{ left: BTN_W + i * PITCH, width: CHAIN_GAP }}>
                 <div className={`h-[1px] w-[80%] ${severedLinks.has(i) ? 'bg-red-500/20 border-t border-dashed border-red-500/30' : 'bg-black/10'}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {!allSevered ? (
        <>
          {/* Chain links — only render intact ones */}
          {[0, 1, 2].map((i) => (
            severedLinks.has(i) ? (
              // ─── Broken Link Indicator (clickable to re-forge) ───
              <BrokenLinkSegment
                key={`broken-${i}`}
                leftX={springs[i].x} leftY={springs[i].y}
                rightX={springs[i + 1].x} rightY={springs[i + 1].y}
                onReforge={() => reForgeLink(i)}
              />
            ) : (
              <ChainLinkSegment
                key={i}
                leftX={springs[i].x} leftY={springs[i].y}
                rightX={springs[i + 1].x} rightY={springs[i + 1].y}
                isHeating={heatingLink === i}
                cutProgress={heatingLink === i ? cutProgress : 0}
                onCutStart={() => startCut(i)}
                onCutCancel={cancelCut}
              />
            )
          ))}

          {/* Buttons */}
          {NAV_ITEMS.map((item, i) => {
            const isActive = pathname === item.route || (item.id === 'core' && pathname === '/');
            return (
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
                  <NavButton 
                    item={item} 
                    isDragging={isDragging && dragBtnIdx.current === i} 
                    isActive={isActive} 
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </>
      ) : (
        <>
          {NAV_ITEMS.map((item, i) => {
            const isActive = pathname === item.route || (item.id === 'core' && pathname === '/');
            return (
              <FreeButton
                key={item.id}
                item={item} index={i}
                initialX={freePositions[item.id]?.x ?? getDefaultPos().x + i * PITCH}
                initialY={freePositions[item.id]?.y ?? getDefaultPos().y}
                onSave={saveFreePos}
                onRechain={reChain}
                isActive={isActive}
              />
            );
          })}
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
