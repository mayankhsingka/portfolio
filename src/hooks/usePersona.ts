"use client";

import { useEffect, useState, useCallback } from "react";

export type Persona = "dev" | "non-dev";

const STORAGE_KEY = "user_persona";

function readPersona(): Persona {
  if (typeof window === "undefined") return "non-dev";
  try {
    return localStorage.getItem(STORAGE_KEY) === "dev" ? "dev" : "non-dev";
  } catch {
    return "non-dev";
  }
}

export function usePersona() {
  const [persona, setPersonaState] = useState<Persona>("non-dev");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setPersonaState(readPersona());
    setMounted(true);

    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "dev" || detail === "non-dev") setPersonaState(detail);
    };
    window.addEventListener("persona-change", handler);
    return () => window.removeEventListener("persona-change", handler);
  }, []);

  const setPersona = useCallback((next: Persona) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
    document.documentElement.setAttribute("data-persona", next);
    setPersonaState(next);
    window.dispatchEvent(new CustomEvent("persona-change", { detail: next }));
  }, []);

  return { persona, setPersona, mounted };
}
