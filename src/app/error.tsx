"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("System Error Caught:", error);
  }, [error]);

  return (
    <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center font-mono text-white p-8">
      <div className="max-w-xl w-full flex flex-col gap-6">
        <div className="text-red-500 text-4xl md:text-5xl font-bold tracking-widest">
          SYSTEM_FAILURE
        </div>
        <div className="border-2 border-red-500/40 p-4 text-sm text-red-400/80">
          <div className="flex gap-2 mb-2">
            <span className="text-red-500 font-bold">[FATAL]</span>
            <span>Component process terminated unexpectedly.</span>
          </div>
          <pre className="text-xs text-white/40 mt-3 overflow-auto max-h-32 whitespace-pre-wrap">
            {error.message || "Unknown error occurred"}
          </pre>
          {error.digest && (
            <div className="text-xs text-white/20 mt-2">
              DIGEST: {error.digest}
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="border-2 border-[#00ff41] text-[#00ff41] px-6 py-3 hover:bg-[#00ff41] hover:text-black transition-colors uppercase tracking-widest font-bold text-sm"
          >
            [RESTART_PROCESS]
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="border-2 border-white/30 text-white/50 px-6 py-3 hover:bg-white hover:text-black transition-colors uppercase tracking-widest font-bold text-sm"
          >
            [FULL_REBOOT]
          </button>
        </div>
        <span className="text-white/20 text-[10px] uppercase tracking-widest">
          Error boundary caught at root level • PID: {Math.floor(Math.random() * 65535)}
        </span>
      </div>
    </div>
  );
}
