"use client";

import { useState, useEffect } from "react";

export interface ActivePreviewWrapperProps {
  Preview: React.ComponentType;
  isActive: boolean;
}

/** Mounts/unmounts preview on active change to reset animations. */
export function ActivePreviewWrapper({ Preview, isActive }: ActivePreviewWrapperProps): React.JSX.Element | null {
  const [mounted, setMounted] = useState(isActive);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    let showId: number | undefined;
    const hideId = requestAnimationFrame(() => {
      setMounted(false);
      showId = requestAnimationFrame(() => setMounted(true));
    });
    return () => {
      cancelAnimationFrame(hideId);
      if (showId != null) {
        cancelAnimationFrame(showId);
      }
    };
  }, [isActive]);

  if (!mounted) return null;
  return <Preview />;
}
