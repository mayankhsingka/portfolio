"use client";

import { useState, useEffect, useCallback } from "react";

export type ClearanceLevel = "GUEST" | "OPERATOR" | "ROOT";

const OPERATOR_THRESHOLD = 3; // Commands needed to reach OPERATOR
const STORAGE_KEY = "clearance_data";

interface ClearanceData {
  level: ClearanceLevel;
  commandsExecuted: number;
  promotionTimestamps: Record<string, number>; // level -> timestamp
}

const DEFAULT_DATA: ClearanceData = {
  level: "GUEST",
  commandsExecuted: 0,
  promotionTimestamps: {},
};

function loadClearance(): ClearanceData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_DATA;
}

function saveClearance(data: ClearanceData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useClearance() {
  const [data, setData] = useState<ClearanceData>(DEFAULT_DATA);
  const [notification, setNotification] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    setData(loadClearance());
  }, []);

  const trackCommand = useCallback(() => {
    setData((prev) => {
      const next = { ...prev, commandsExecuted: prev.commandsExecuted + 1 };

      // Auto-promote to OPERATOR
      if (next.level === "GUEST" && next.commandsExecuted >= OPERATOR_THRESHOLD) {
        next.level = "OPERATOR";
        next.promotionTimestamps = {
          ...next.promotionTimestamps,
          OPERATOR: Date.now(),
        };
        setNotification("CLEARANCE ELEVATED: OPERATOR");
        // Auto-dismiss notification
        setTimeout(() => setNotification(null), 4000);
      }

      saveClearance(next);
      return next;
    });
  }, []);

  const promoteToRoot = useCallback(() => {
    setData((prev) => {
      if (prev.level === "ROOT") return prev; // Already ROOT
      const next = {
        ...prev,
        level: "ROOT" as ClearanceLevel,
        promotionTimestamps: {
          ...prev.promotionTimestamps,
          ROOT: Date.now(),
        },
      };
      saveClearance(next);
      setNotification("⚠ CLEARANCE ELEVATED: ROOT ACCESS GRANTED");
      setTimeout(() => setNotification(null), 5000);
      return next;
    });
  }, []);

  return {
    level: data.level,
    commandsExecuted: data.commandsExecuted,
    notification,
    trackCommand,
    promoteToRoot,
    clearNotification: () => setNotification(null),
  };
}
