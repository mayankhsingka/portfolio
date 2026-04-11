"use client";

import { useScrambleText } from "@/hooks/useScrambleText";

export function ScrambleText({ children }: { children: string }) {
  const scrambled = useScrambleText(children);
  return <>{scrambled}</>;
}
