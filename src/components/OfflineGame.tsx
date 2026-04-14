"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSystemAudio } from "@/hooks/useSystemAudio";

// ─── Types ───────────────────────────────────────────────────────────
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Phase = "BOOT" | "PLAYING" | "DEAD";
type Cell = { x: number; y: number };

// ─── Constants ───────────────────────────────────────────────────────
const COLS = 40;
const ROWS = 24;
const INITIAL_SPEED = 140; // ms per tick
const SPEED_INCREMENT = 6; // ms faster every 5 packets
const MIN_SPEED = 50;

const BOOT_LINES = [
  { text: "[CRITICAL] Network connection severed.", delay: 0 },
  { text: "[SYS] All external endpoints unreachable.", delay: 400 },
  { text: "[WARN] Data integrity at risk — packets scattered across volatile memory.", delay: 900 },
  { text: "[SYS] Deploying recovery probe into memory sector 0x7FFF...", delay: 1600 },
  { text: "[OK] Probe online. Arrow keys / WASD to navigate. ESC to abort.", delay: 2300 },
  { text: "[BEGIN] SIGNAL_LOST protocol engaged.", delay: 3000 },
];

// ─── Helpers ─────────────────────────────────────────────────────────
function randomFood(snake: Cell[]): Cell {
  let pos: Cell;
  do {
    pos = {
      x: 1 + Math.floor(Math.random() * (COLS - 2)),
      y: 1 + Math.floor(Math.random() * (ROWS - 2)),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

function getOpposite(dir: Direction): Direction {
  const map: Record<Direction, Direction> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
  return map[dir];
}

// ─── Component ───────────────────────────────────────────────────────
export function OfflineGame({ onExit }: { onExit: () => void }) {
  const [phase, setPhase] = useState<Phase>("BOOT");
  const [bootIndex, setBootIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [runtime, setRuntime] = useState(0);
  const [lastPacketMsg, setLastPacketMsg] = useState("");

  const { playKeystroke, playSnap, playAction } = useSystemAudio();

  // Game state stored in refs for rAF loop (no React re-renders during gameplay)
  const snakeRef = useRef<Cell[]>([{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }]);
  const dirRef = useRef<Direction>("RIGHT");
  const nextDirRef = useRef<Direction>("RIGHT");
  const foodRef = useRef<Cell>(randomFood(snakeRef.current));
  const scoreRef = useRef(0);
  const speedRef = useRef(INITIAL_SPEED);
  const tickRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);
  const preRef = useRef<HTMLPreElement>(null);
  const phaseRef = useRef<Phase>("BOOT");
  const startTimeRef = useRef(0);
  const runtimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync phase ref
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Load high score
  useEffect(() => {
    try {
      const saved = localStorage.getItem("signal_lost_high");
      if (saved) setHighScore(parseInt(saved, 10));
    } catch {}
  }, []);

  // ─── Boot sequence ──────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "BOOT") return;
    const timeouts: NodeJS.Timeout[] = [];
    BOOT_LINES.forEach((line, i) => {
      timeouts.push(
        setTimeout(() => {
          setBootIndex(i + 1);
          if (i === BOOT_LINES.length - 1) {
            setTimeout(() => {
              setPhase("PLAYING");
              startTimeRef.current = Date.now();
            }, 800);
          }
        }, line.delay)
      );
    });
    return () => timeouts.forEach(clearTimeout);
  }, [phase]);

  // ─── Runtime timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (phase === "PLAYING") {
      runtimeIntervalRef.current = setInterval(() => {
        setRuntime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    }
    return () => {
      if (runtimeIntervalRef.current) clearInterval(runtimeIntervalRef.current);
    };
  }, [phase]);

  // ─── Render grid to <pre> ───────────────────────────────────────────
  const renderGrid = useCallback(() => {
    if (!preRef.current) return;
    const snake = snakeRef.current;
    const food = foodRef.current;
    const sc = scoreRef.current;

    // Build grid
    const grid: string[][] = [];
    for (let y = 0; y < ROWS; y++) {
      grid[y] = [];
      for (let x = 0; x < COLS; x++) {
        // Border
        if (y === 0 || y === ROWS - 1) {
          if (x === 0) grid[y][x] = y === 0 ? "╔" : "╚";
          else if (x === COLS - 1) grid[y][x] = y === 0 ? "╗" : "╝";
          else grid[y][x] = "═";
        } else if (x === 0 || x === COLS - 1) {
          grid[y][x] = "║";
        } else {
          grid[y][x] = " ";
        }
      }
    }

    // Place food (blink via time)
    const blink = Math.floor(Date.now() / 300) % 2 === 0;
    if (blink && food.x > 0 && food.y > 0) {
      grid[food.y][food.x] = "◆";
    }

    // Place snake
    snake.forEach((cell, i) => {
      if (cell.y >= 0 && cell.y < ROWS && cell.x >= 0 && cell.x < COLS) {
        grid[cell.y][cell.x] = i === 0 ? "█" : "▓";
      }
    });

    // Overlay score into top border
    const scoreStr = ` PACKETS:${String(sc).padStart(3, "0")} `;
    const speedPct = Math.round(((INITIAL_SPEED - speedRef.current) / (INITIAL_SPEED - MIN_SPEED)) * 100);
    const speedStr = ` CLK:${speedPct}% `;
    for (let i = 0; i < scoreStr.length && i + 2 < COLS - 2; i++) {
      grid[0][i + 2] = scoreStr[i];
    }
    for (let i = 0; i < speedStr.length && COLS - 2 - speedStr.length + i > 0; i++) {
      grid[0][COLS - 2 - speedStr.length + i] = speedStr[i];
    }

    // Join and write
    preRef.current.textContent = grid.map((row) => row.join("")).join("\n");
  }, []);

  // ─── Game loop ──────────────────────────────────────────────────────
  const gameStep = useCallback(() => {
    if (phaseRef.current !== "PLAYING") return;

    const now = performance.now();
    if (now - lastTickRef.current < speedRef.current) {
      renderGrid();
      gameLoopRef.current = requestAnimationFrame(gameStep);
      return;
    }
    lastTickRef.current = now;

    const snake = snakeRef.current;
    const dir = nextDirRef.current;
    dirRef.current = dir;

    // Calculate new head
    const head = { ...snake[0] };
    if (dir === "UP") head.y--;
    if (dir === "DOWN") head.y++;
    if (dir === "LEFT") head.x--;
    if (dir === "RIGHT") head.x++;

    // Wall collision
    if (head.x <= 0 || head.x >= COLS - 1 || head.y <= 0 || head.y >= ROWS - 1) {
      handleDeath();
      return;
    }

    // Self collision
    if (snake.some((s) => s.x === head.x && s.y === head.y)) {
      handleDeath();
      return;
    }

    // Move
    const newSnake = [head, ...snake];

    // Food collision
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current++;
      setScore(scoreRef.current);
      playSnap();

      // Speed ramp every 5 packets
      if (scoreRef.current % 5 === 0) {
        speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREMENT);
      }

      // Packet message
      const hexAddr = "0x" + Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
      setLastPacketMsg(`[+1] PACKET_${hexAddr} recovered`);
      setTimeout(() => setLastPacketMsg(""), 1500);

      // New food
      foodRef.current = randomFood(newSnake);
    } else {
      newSnake.pop(); // remove tail
    }

    snakeRef.current = newSnake;

    renderGrid();
    gameLoopRef.current = requestAnimationFrame(gameStep);
  }, [renderGrid, playSnap]);

  const handleDeath = useCallback(() => {
    setPhase("DEAD");
    playAction();
    // Save high score
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
      try { localStorage.setItem("signal_lost_high", String(scoreRef.current)); } catch {}
    }
    if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    if (runtimeIntervalRef.current) clearInterval(runtimeIntervalRef.current);
  }, [highScore, playAction]);

  // Start game loop when phase becomes PLAYING
  useEffect(() => {
    if (phase === "PLAYING") {
      lastTickRef.current = performance.now();
      gameLoopRef.current = requestAnimationFrame(gameStep);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [phase, gameStep]);

  // ─── Input handling ─────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onExit();
        return;
      }

      if (phaseRef.current === "DEAD" && e.key === "Enter") {
        // Restart
        snakeRef.current = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
        dirRef.current = "RIGHT";
        nextDirRef.current = "RIGHT";
        foodRef.current = randomFood(snakeRef.current);
        scoreRef.current = 0;
        speedRef.current = INITIAL_SPEED;
        setScore(0);
        setRuntime(0);
        startTimeRef.current = Date.now();
        setPhase("PLAYING");
        return;
      }

      if (phaseRef.current !== "PLAYING") return;

      let newDir: Direction | null = null;
      switch (e.key) {
        case "ArrowUp": case "w": case "W": newDir = "UP"; break;
        case "ArrowDown": case "s": case "S": newDir = "DOWN"; break;
        case "ArrowLeft": case "a": case "A": newDir = "LEFT"; break;
        case "ArrowRight": case "d": case "D": newDir = "RIGHT"; break;
      }

      if (newDir && newDir !== getOpposite(dirRef.current)) {
        nextDirRef.current = newDir;
        playKeystroke();
      }
      
      e.preventDefault();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onExit, playKeystroke]);

  // ─── Cleanup ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
      if (runtimeIntervalRef.current) clearInterval(runtimeIntervalRef.current);
    };
  }, []);

  const formatRuntime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[250] bg-black flex items-center justify-center select-none overflow-hidden">
      {/* CRT scanline overlay */}
      <div className="absolute inset-0 pointer-events-none signal-lost-scanlines" />

      {/* Boot Phase */}
      {phase === "BOOT" && (
        <div className="font-mono text-sm text-[#00ff41] p-8 max-w-2xl w-full flex flex-col gap-2">
          {BOOT_LINES.slice(0, bootIndex).map((line, i) => (
            <div
              key={i}
              className="signal-lost-entry"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className={line.text.includes("[CRITICAL]") ? "text-red-500" : line.text.includes("[WARN]") ? "text-yellow-400" : ""}>
                {line.text}
              </span>
            </div>
          ))}
          {bootIndex < BOOT_LINES.length && (
            <span className="animate-pulse text-[#00ff41]">█</span>
          )}
        </div>
      )}

      {/* Playing Phase */}
      {(phase === "PLAYING" || phase === "DEAD") && (
        <div className="flex flex-col items-center gap-4">
          {/* HUD */}
          <div className="flex justify-between w-full max-w-[calc(40ch+2rem)] font-mono text-xs text-[#00ff41]/70 uppercase px-1">
            <span>SIGNAL_LOST v1.0</span>
            <span>UPTIME: {formatRuntime(runtime)}</span>
          </div>

          {/* Game Grid */}
          <div className="relative">
            <pre
              ref={preRef}
              className="text-[14px] md:text-[16px] leading-[1.1] tracking-tight font-mono text-[#00ff41] whitespace-pre"
              style={{
                textShadow: "0 0 6px rgba(0, 255, 65, 0.4), 0 0 12px rgba(0, 255, 65, 0.15)",
              }}
            />

            {/* Death overlay */}
            {phase === "DEAD" && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-6 signal-lost-death">
                <div className="font-mono text-red-500 text-4xl md:text-5xl font-bold tracking-widest signal-lost-glitch">
                  NETWORK_FAILURE
                </div>
                <div className="font-mono text-white/60 text-sm flex flex-col items-center gap-2">
                  <span>PACKETS RECOVERED: <strong className="text-[#00ff41]">{score}</strong></span>
                  <span>SESSION TIME: <strong className="text-[#00ff41]">{formatRuntime(runtime)}</strong></span>
                  {score >= highScore && score > 0 && (
                    <span className="text-yellow-400 font-bold mt-1">★ NEW HIGH SCORE ★</span>
                  )}
                </div>
                <div className="flex gap-4 mt-4 font-mono text-sm">
                  <button
                    onClick={() => {
                      snakeRef.current = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
                      dirRef.current = "RIGHT";
                      nextDirRef.current = "RIGHT";
                      foodRef.current = randomFood(snakeRef.current);
                      scoreRef.current = 0;
                      speedRef.current = INITIAL_SPEED;
                      setScore(0);
                      setRuntime(0);
                      startTimeRef.current = Date.now();
                      setPhase("PLAYING");
                    }}
                    className="border-2 border-[#00ff41] text-[#00ff41] px-6 py-3 hover:bg-[#00ff41] hover:text-black transition-colors uppercase tracking-widest font-bold"
                  >
                    [RETRY]
                  </button>
                  <button
                    onClick={onExit}
                    className="border-2 border-white/40 text-white/60 px-6 py-3 hover:bg-white hover:text-black transition-colors uppercase tracking-widest font-bold"
                  >
                    [RECONNECT]
                  </button>
                </div>
                <span className="font-mono text-white/30 text-[10px] uppercase mt-4">
                  ENTER to retry · ESC to reconnect
                </span>
              </div>
            )}
          </div>

          {/* Packet pickup log */}
          <div className="h-6 font-mono text-xs text-[#00ff41]/80">
            {lastPacketMsg && (
              <span className="signal-lost-packet-msg">{lastPacketMsg}</span>
            )}
          </div>

          {/* High score */}
          <div className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
            HIGH_SCORE: {highScore} · ESC to exit
          </div>
        </div>
      )}
    </div>
  );
}
