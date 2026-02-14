"use client";

import { useEffect, useState } from "react";

const SCROLL_RANGE = 120;

export function useScrollProgress(start = 0, end = SCROLL_RANGE): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const range = end - start;
    if (range <= 0) return undefined;

    let rafId: number | undefined;

    function onScroll(): void {
      rafId = requestAnimationFrame(() => {
        rafId = undefined;
        const y = window.scrollY;
        setProgress(Math.min(1, Math.max(0, (y - start) / range)));
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  }, [start, end]);

  return progress;
}

export { SCROLL_RANGE };
