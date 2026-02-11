"use client";

import { useEffect, useRef } from "react";

import type { HamburgerMenuProps } from "./index";

import { cn } from "../../lib/utils";

export function HamburgerMenu({
  buttonLabel,
  isOpen,
  onToggle,
  className,
  panelClassName,
  buttonClassName,
  children,
  ...props
}: HamburgerMenuProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent): void {
      if (!isOpen) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      if (!containerRef.current?.contains(target)) {
        onToggle();
      }
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape" && isOpen) {
        onToggle();
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onToggle]);

  return (
    <div ref={containerRef} className={cn("relative", className)} {...props}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-label={buttonLabel}
        onClick={onToggle}
        className={cn(
          "group inline-flex h-10 w-10 items-center justify-center rounded-ds-md",
          "border border-ds-border bg-ds-surface text-ds-on-surface-strong",
          "transition-colors hover:bg-ds-surface-subtle",
          "focus:outline-none focus:ring-2 focus:ring-ds-focus-ring",
          buttonClassName,
        )}
      >
        <span className="sr-only">{buttonLabel}</span>
        <span className="flex h-4 w-4 flex-col justify-between">
          <span
            className={cn(
              "block h-0.5 w-4 bg-current transition-transform duration-200",
              isOpen && "translate-y-1.5 rotate-45",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-4 bg-current transition-opacity duration-200",
              isOpen && "opacity-0",
            )}
          />
          <span
            className={cn(
              "block h-0.5 w-4 bg-current transition-transform duration-200",
              isOpen && "-translate-y-1.5 -rotate-45",
            )}
          />
        </span>
      </button>

      {isOpen ? (
        <div
          className={cn(
            "absolute right-0 top-12 z-50 min-w-52 rounded-ds-md border border-ds-border",
            "bg-ds-surface p-ds-s shadow-ds-md",
            panelClassName,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
