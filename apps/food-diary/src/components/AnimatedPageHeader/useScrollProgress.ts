"use client";

import { useEffect, useState } from "react";

const SCROLL_RANGE = 120;

function getViewportScrollTop(): number {
  const root = document.documentElement;
  const body = document.body;
  const scrollingElement = document.scrollingElement;

  return Math.max(
    window.scrollY,
    root.scrollTop,
    body.scrollTop,
    scrollingElement?.scrollTop ?? 0,
  );
}

function getEventScrollTop(target: EventTarget | null): number | undefined {
  if (!(target instanceof HTMLElement)) {
    return undefined;
  }

  if (
    target === document.documentElement ||
    target === document.body ||
    target.scrollHeight <= target.clientHeight
  ) {
    return undefined;
  }

  return target.scrollTop;
}

function toProgress(scrollTop: number, start: number, range: number): number {
  return Math.min(1, Math.max(0, (scrollTop - start) / range));
}

export function useScrollProgress(start = 0, end = SCROLL_RANGE): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const range = end - start;
    if (range <= 0) return undefined;

    const updateProgress = (scrollTop: number): void => {
      const nextProgress = toProgress(scrollTop, start, range);
      setProgress((prevProgress) => {
        return Math.abs(prevProgress - nextProgress) < 0.001
          ? prevProgress
          : nextProgress;
      });
    };

    const handleScroll = (event: Event): void => {
      const nextScrollTop = getEventScrollTop(event.target) ?? getViewportScrollTop();
      updateProgress(nextScrollTop);
    };

    const updateFromViewport = (): void => {
      updateProgress(getViewportScrollTop());
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("scroll", handleScroll, {
      capture: true,
      passive: true,
    });
    window.addEventListener("resize", updateFromViewport);
    window.visualViewport?.addEventListener("resize", updateFromViewport);
    const initFrameId = window.requestAnimationFrame(updateFromViewport);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", updateFromViewport);
      window.visualViewport?.removeEventListener("resize", updateFromViewport);
      window.cancelAnimationFrame(initFrameId);
    };
  }, [start, end]);

  return progress;
}

export { SCROLL_RANGE };
