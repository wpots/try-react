"use client";

import { useEffect, useRef, useState } from "react";

const INTERSECTION_OPTIONS: IntersectionObserverInit = {
  rootMargin: "-35% 0px -35% 0px",
  threshold: 0.1,
};

const LG_MEDIA = "(min-width: 1024px)";

/**
 * Tracks which feature card is in the "active" viewport band (roughly centered)
 * via IntersectionObserver. Use ref callbacks on card elements and pass the same refs + count.
 * Only the visible layout (desktop vs mobile) should register refs so we observe the right elements.
 */
export function useActiveFeatureIndex(
  itemCount: number,
): [number, (idx: number) => (el: HTMLElement | null) => void, boolean] {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLg, setIsLg] = useState(false);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const mql = window.matchMedia(LG_MEDIA);
    const handle = () => setIsLg(mql.matches);
    setIsLg(mql.matches);
    mql.addEventListener("change", handle);
    return () => mql.removeEventListener("change", handle);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    for (let idx = 0; idx < itemCount; idx++) {
      const el = refs.current[idx];
      if (!el) continue;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(idx);
        },
        INTERSECTION_OPTIONS,
      );
      observer.observe(el);
      observers.push(observer);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, [itemCount, isLg]);

  const setRef = (idx: number) => (el: HTMLElement | null) => {
    refs.current[idx] = el;
  };

  return [activeIdx, setRef, isLg];
}
