"use client";

import { type ReactNode } from "react";
import { usePersona } from "@/hooks/usePersona";

export function DevOnly({ children }: { children: ReactNode }) {
  const { persona, mounted } = usePersona();
  if (!mounted) return null;
  if (persona !== "dev") return null;
  return <>{children}</>;
}

export function NonDevOnly({ children }: { children: ReactNode }) {
  const { persona, mounted } = usePersona();
  if (!mounted) return null;
  if (persona !== "non-dev") return null;
  return <>{children}</>;
}
