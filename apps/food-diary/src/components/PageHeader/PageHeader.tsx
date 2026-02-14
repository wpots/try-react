"use client";

import NextImage from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@repo/ui";

import type { PageHeaderProps } from "./index";

import { Logo } from "@/components/Logo";

const SCROLL_RANGE = 120;

function useScrollProgress(start = 0, end = SCROLL_RANGE): number {
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

export function PageHeader({ className, id = "page-header", children, ...props }: PageHeaderProps): React.JSX.Element {
  const scrollProgress = useScrollProgress(0, SCROLL_RANGE);
  const isScrolled = scrollProgress >= 1;
  const headerChildren = typeof children === "function" ? children({ isScrolled }) : children;

  return (
    <header
      data-component-type="PageHeader"
      id={id}
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full border-b border-transparent transition-all duration-300",
        "flex items-center justify-between gap-ds-l px-ds-l",
        isScrolled ? "bg-ds-surface text-ds-on-surface-strong shadow-ds-sm" : "bg-transparent text-ds-on-primary",
        className,
      )}
      {...props}
    >
      <Logo
        id="page-header-logo"
        scrollProgress={scrollProgress}
        href="#home"
        component={NextImage}
        className={cn(isScrolled ? "text-ds-on-surface" : "text-ds-on-primary")}
      />

      {headerChildren ? <div className="ml-auto flex items-center gap-ds-m">{headerChildren}</div> : null}
    </header>
  );
}
