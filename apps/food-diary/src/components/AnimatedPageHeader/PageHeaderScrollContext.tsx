"use client";

import { createContext, useContext, useMemo } from "react";

export interface PageHeaderScrollContextValue {
  isScrolled: boolean;
  scrollProgress: number;
}

const PageHeaderScrollContext = createContext<PageHeaderScrollContextValue | null>(null);

export function PageHeaderScrollProvider({
  value,
  children,
}: {
  value: PageHeaderScrollContextValue;
  children: React.ReactNode;
}): React.JSX.Element {
  const memoValue = useMemo(() => value, [value]);
  return (
    <PageHeaderScrollContext.Provider value={memoValue}>
      {children}
    </PageHeaderScrollContext.Provider>
  );
}

export function usePageHeaderScroll(): PageHeaderScrollContextValue {
  const ctx = useContext(PageHeaderScrollContext);
  if (ctx === null) {
    throw new Error("usePageHeaderScroll must be used within an AnimatedPageHeader");
  }
  return ctx;
}
