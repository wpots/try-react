"use client";

import type { CardProps } from "./index";
import { cn } from "../../lib/utils";

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-surface p-4",
        className,
      )}
      {...props}
    />
  );
}
