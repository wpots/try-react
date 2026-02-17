"use client";

import { useEffect, useState } from "react";

const SCROLL_RANGE = 120;

function getScrollTop(): number {
  const root = document.documentElement;
  return window.scrollY || root.scrollTop || 0;
}

function toProgress(scrollTop: number, start: number, range: number): number {
  return Math.min(1, Math.max(0, (scrollTop - start) / range));
}

export function useScrollProgress(start = 0, end = SCROLL_RANGE): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const range = end - start;
    if (range <= 0) return undefined;

    const updateProgress = (): void => {
      const nextProgress = toProgress(getScrollTop(), start, range);
      setProgress((prevProgress) => {
        return Math.abs(prevProgress - nextProgress) < 0.001
          ? prevProgress
          : nextProgress;
      });
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    const initFrameId = window.requestAnimationFrame(updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      window.cancelAnimationFrame(initFrameId);
    };
  }, [start, end]);

  return progress;
}

export { SCROLL_RANGE };
