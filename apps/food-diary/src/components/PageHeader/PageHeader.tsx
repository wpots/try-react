"use client";

import { cn } from "@repo/ui";

import type { PageHeaderProps } from "./index";
import { PageHeaderScrollProvider } from "./PageHeaderScrollContext";
import { SCROLL_RANGE, useScrollProgress } from "./useScrollProgress";

import { Logo } from "@/components/Logo";

export function PageHeader({ className, id = "page-header", children, ...props }: PageHeaderProps): React.JSX.Element {
  const scrollProgress = useScrollProgress(0, SCROLL_RANGE);
  const isScrolled = scrollProgress >= 1;

  return (
    <header
      data-component-type="PageHeader"
      id={id}
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full border-b border-transparent transition-all duration-300",
        "flex items-center justify-between gap-ds-l px-ds-l text-ds-on-surface",
        isScrolled ? "bg-ds-surface shadow-ds-sm" : "bg-transparent",
        className,
      )}
      {...props}
    >
      <Logo id="page-header-logo" scrollProgress={scrollProgress} href="#home" />

      <PageHeaderScrollProvider value={{ isScrolled, scrollProgress }}>
        {children ? <div className="ml-auto flex items-center gap-ds-m">{children}</div> : null}
      </PageHeaderScrollProvider>
    </header>
  );
}
