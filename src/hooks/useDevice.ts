"use client";

import { useState, useEffect } from "react";

interface DeviceState {
  isMobile: boolean;
  isTouch: boolean;
}

const MOBILE_BREAKPOINT = 768;

/**
 * SSR-safe device detection hook.
 * Uses matchMedia for responsive breakpoint detection
 * and 'ontouchstart' for touch capability.
 * 
 * Desktop components remain untouched — this hook is the single
 * gate that controls which component tree renders.
 */
export function useDevice(): DeviceState {
  const [state, setState] = useState<DeviceState>({
    isMobile: false,
    isTouch: false,
  });

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    const update = () => {
      setState({
        isMobile: mql.matches,
        isTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      });
    };

    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return state;
}
