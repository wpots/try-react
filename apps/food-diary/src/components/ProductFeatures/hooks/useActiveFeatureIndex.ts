"use client";

import { useEffect, useRef, useState } from "react";

const INTERSECTION_OPTIONS: IntersectionObserverInit = {
  rootMargin: "-35% 0px -35% 0px",
  threshold: [0, 0.25, 0.5, 0.75, 1],
};

const LG_MEDIA = "(min-width: 1024px)";

/**
 * Tracks which feature card has the most area in the "active" viewport band (roughly centered).
 * Uses a single IntersectionObserver and picks the index with the largest intersection ratio
 * so the active index doesn't skip or jump randomly when multiple cards intersect.
 */
export function useActiveFeatureIndex(
  itemCount: number,
): [number, (idx: number) => (el: HTMLElement | null) => void, boolean] {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLg, setIsLg] = useState(false);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const ratiosRef = useRef<number[]>([]);

  useEffect(() => {
    const mql = window.matchMedia(LG_MEDIA);
    const handle = () => setIsLg(mql.matches);
    setIsLg(mql.matches);
    mql.addEventListener("change", handle);
    return () => mql.removeEventListener("change", handle);
  }, []);

  useEffect(() => {
    const elements = refs.current;
    const ratios = ratiosRef.current;
    const targetToIdx = new Map<Element, number>();
    for (let i = 0; i < itemCount; i++) {
      const el = elements[i];
      if (el) targetToIdx.set(el, i);
    }
    if (targetToIdx.size === 0) return;

    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        for (const entry of entries) {
          const idx = targetToIdx.get(entry.target);
          if (idx !== undefined) ratios[idx] = entry.intersectionRatio;
        }
        let bestIdx = 0;
        let bestRatio = 0;
        for (let i = 0; i < itemCount; i++) {
          const r = ratios[i] ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestIdx = i;
          }
        }
        setActiveIdx(bestIdx);
      },
      INTERSECTION_OPTIONS,
    );

    for (let i = 0; i < itemCount; i++) {
      const el = elements[i];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [itemCount, isLg]);

  const setRef = (idx: number) => (el: HTMLElement | null) => {
    refs.current[idx] = el;
  };

  return [activeIdx, setRef, isLg];
}
