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

  const cycleTheme = () => {
    const themes = ["", "theme-aviation", "dark-ops"];
    const currentTheme = localStorage.getItem("sys_theme") || "";
    const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
    const nextTheme = themes[nextIdx];

    ["", "theme-aviation", "theme-amber", "theme-matrix", "dark-ops"].forEach(
      (t) => t && document.documentElement.classList.remove(t)
    );
    if (nextTheme) document.documentElement.classList.add(nextTheme);

    localStorage.setItem("sys_theme", nextTheme);
    document.documentElement.classList.add("dark-ops-transition");
    setTimeout(() => document.documentElement.classList.remove("dark-ops-transition"), 400);
  };

  const triggerCmd = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] md:text-xs shrink-0">
      <button onClick={() => router.back()} className={`${baseClasses} ${colorClasses}`}>
        &lt; BACK
      </button>
      <button onClick={() => router.forward()} className={`${baseClasses} ${colorClasses}`}>
        FWD &gt;
      </button>
      <button onClick={() => router.push("/")} className={`${baseClasses} ${colorClasses}`}>
        HOME
      </button>
      <button onClick={triggerCmd} className={`${baseClasses} ${colorClasses} hidden sm:flex`}>
        [ / ] CMD
      </button>
      <div className={`${baseClasses} border-transparent opacity-40 hidden sm:flex cursor-help`} title="Hold Shift + N to open Orbital Navigation anywhere">
        [SHIFT+N] NAV
      </div>
      <button onClick={cycleTheme} className={`${baseClasses} ${colorClasses}`} title="Cycle Theme">
        THEME ◉
      </button>
    </div>
  );
}
