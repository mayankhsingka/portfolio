"use client";

import { motion } from "framer-motion";

interface NumberPlateProps {
  size?: "sm" | "md";
  animated?: boolean;
  className?: string;
}

/**
 * MH · 04 · 2006 — styled after an Indian car number plate.
 *  MH  : Maharashtra state code · also Mayank Himmatsingka initials
 *  04  : month of birth (April)
 *  2006: year of birth
 *
 * White plate, hard black border, condensed bold uppercase. A small "IND"
 * emblem hugs the left edge the way real Indian plates do. Sized for
 * inline use in headers and status bars.
 */
export function NumberPlate({ size = "sm", animated = true, className = "" }: NumberPlateProps) {
  const isMd = size === "md";

  const Inner = (
    <div
      className={`inline-flex items-stretch bg-white border-2 border-black select-none font-mono ${
        isMd ? "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : "shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      } ${className}`}
      title="MH-04-2006 · Mayank Himmatsingka, born 10 April 2006"
      aria-label="MH-04-2006 plate"
    >
      {/* IND emblem strip */}
      <div
        className={`bg-black text-white flex items-center justify-center font-black tracking-tight ${
          isMd ? "px-1.5 text-[8px]" : "px-1 text-[7px]"
        }`}
      >
        IND
      </div>
      {/* MH · 04 · 2006 */}
      <div
        className={`flex items-center text-black font-black tracking-[0.12em] ${
          isMd ? "px-2 py-1 text-[13px] gap-1.5" : "px-1.5 py-0.5 text-[10px] gap-1"
        }`}
      >
        <span>MH</span>
        <span className="opacity-40">·</span>
        <span>04</span>
        <span className="opacity-40">·</span>
        <span>2006</span>
      </div>
    </div>
  );

  if (!animated) return Inner;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      {Inner}
    </motion.div>
  );
}
