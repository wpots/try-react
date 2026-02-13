"use client";

import type { CardProps } from "./index";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "p-ds-xxl transition-all duration-300 rounded-ds-xl border border-ds-border-subtle bg-ds-surface",
        className,
      )}
      {...props}
    />
  );
}
