"use client";

import { createContext, useContext, ReactNode } from "react";
import { useClearance, ClearanceLevel } from "@/hooks/useClearance";

interface ClearanceContextValue {
  level: ClearanceLevel;
  commandsExecuted: number;
  notification: string | null;
  trackCommand: () => void;
  promoteToRoot: () => void;
  clearNotification: () => void;
}

const ClearanceContext = createContext<ClearanceContextValue | null>(null);

export function ClearanceProvider({ children }: { children: ReactNode }) {
  const clearance = useClearance();

  return (
    <ClearanceContext.Provider value={clearance}>
      {children}
    </ClearanceContext.Provider>
  );
}

export function useClearanceContext() {
  const ctx = useContext(ClearanceContext);
  if (!ctx) {
    // Return a safe default when used outside provider (e.g., on shipped pages)
    return {
      level: "GUEST" as ClearanceLevel,
      commandsExecuted: 0,
      notification: null,
      trackCommand: () => {},
      promoteToRoot: () => {},
      clearNotification: () => {},
    };
  }
  return ctx;
}
