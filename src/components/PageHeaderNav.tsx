"use client";

import { useRouter } from "next/navigation";

interface PageHeaderNavProps {
  theme?: "light" | "dark";
}

export function PageHeaderNav({ theme = "dark" }: PageHeaderNavProps) {
  const router = useRouter();

  // Define colors based on the page's theme.
  // Dark theme (e.g., Core Identity): white text, white borders. On hover, bg white, text black.
  // Light theme (e.g., Matrix): black text, black borders. On hover, bg black, text white.
  const baseClasses = "px-3 py-1.5 border-2 transition-all duration-200 uppercase tracking-widest font-bold flex items-center justify-center";
  const colorClasses = theme === "dark" 
    ? "border-white text-white opacity-60 hover:opacity-100 hover:bg-white hover:text-black"
    : "border-black text-black opacity-60 hover:opacity-100 hover:bg-black hover:text-white";

  const triggerCmd = () => {
    // Dispatch a '/' keydown event to trigger the command palette
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] md:text-xs shrink-0">
      <button onClick={() => router.back()} className={`${baseClasses} ${colorClasses}`}>
        &lt; BACK
      </button>
      <button onClick={() => router.push("/")} className={`${baseClasses} ${colorClasses}`}>
        HOME
      </button>
      <button onClick={triggerCmd} className={`${baseClasses} ${colorClasses}`}>
        [ / ] CMD
      </button>
      <div className={`${baseClasses} border-transparent opacity-40 hidden sm:flex cursor-help`} title="Hold Shift + N to open Orbital Navigation anywhere">
        [SHIFT+N] NAV
      </div>
    </div>
  );
}
