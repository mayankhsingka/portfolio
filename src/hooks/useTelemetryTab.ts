"use client";

import { useEffect } from "react";

const TELEMETRY_MESSAGES = [
  "> 🎵 Listening to Charlie Puth...",
  "> ⚙️ Architecting Manasya Edge Functions...",
  "> 📡 Operator AFK. Awaiting return...",
  "> 🚀 Shipping code faster than light...",
  "> 🛠️ Compiling System Blueprint..."
];

export function useTelemetryTab() {
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const originalTitle = "Mayank | System Blueprint";
    
    // Keep track of which message to show next across tab switches
    let msgIndex = 0;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Wait strictly 18 seconds before showing a message
        timeout = setTimeout(() => {
          document.title = TELEMETRY_MESSAGES[msgIndex];
          // Increment index for the next time they switch away
          msgIndex = (msgIndex + 1) % TELEMETRY_MESSAGES.length;
        }, 18000);
      } else {
        clearTimeout(timeout);
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = originalTitle;
    };
  }, []);
}
