"use client";

import { useEffect } from "react";

/**
 * Adds 'page-scrollable' to body on mount, removes on unmount.
 * Used by inner pages to override the canvas's overflow:hidden.
 */
export function usePageScrollable() {
  useEffect(() => {
    document.body.classList.add("page-scrollable");
    return () => {
      document.body.classList.remove("page-scrollable");
    };
  }, []);
}
