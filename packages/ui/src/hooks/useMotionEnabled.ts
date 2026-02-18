"use client";

import { useEffect, useState } from "react";

type MotionMode = "auto" | "always" | "never";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function resolveReducedMotionQuery(): MediaQueryList | null {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return null;
  }

  return window.matchMedia(REDUCED_MOTION_QUERY);
}

function resolveIsMotionEnabled(
  motionMode: MotionMode,
  mediaQuery: MediaQueryList | null,
): boolean {
  if (motionMode === "always") {
    return true;
  }

  if (motionMode === "never") {
    return false;
  }

  return !(mediaQuery?.matches ?? false);
}

export function useMotionEnabled(
  motionMode: MotionMode = "auto",
): boolean {
  const [isMotionEnabled, setIsMotionEnabled] = useState<boolean>(() => {
    return resolveIsMotionEnabled(motionMode, resolveReducedMotionQuery());
  });

  useEffect(() => {
    const mediaQuery = resolveReducedMotionQuery();

    const applyMotionPreference = () => {
      setIsMotionEnabled(resolveIsMotionEnabled(motionMode, mediaQuery));
    };

    applyMotionPreference();

    if (motionMode !== "auto" || mediaQuery === null) {
      return;
    }

    mediaQuery.addEventListener("change", applyMotionPreference);

    return () => {
      mediaQuery.removeEventListener("change", applyMotionPreference);
    };
  }, [motionMode]);

  return isMotionEnabled;
}
