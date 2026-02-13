"use client";

import { useState, useEffect } from "react";

export interface ActivePreviewWrapperProps {
  Preview: React.ComponentType;
  isActive: boolean;
}

/** Mounts/unmounts preview on active change to reset animations. */
export function ActivePreviewWrapper({
  Preview,
  isActive,
}: ActivePreviewWrapperProps): React.JSX.Element | null {
  const [mounted, setMounted] = useState(isActive);

  useEffect(() => {
    if (isActive) {
      setMounted(false);
      const id = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isActive]);

  if (!mounted) return null;
  return <Preview />;
}
