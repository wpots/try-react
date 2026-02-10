"use client";

import { useRef } from "react";
import { useButton } from "@react-aria/button";

import type { ButtonProps } from "./index";
import { cn } from "../../lib/utils";

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-interactive text-on-interactive hover:bg-interactive-hover",
  solid: "bg-interactive text-on-interactive hover:bg-interactive-hover",
  outline: "border border-border bg-surface text-foreground hover:bg-surface-muted",
  secondary: "bg-surface-muted text-foreground hover:bg-interactive hover:text-on-interactive",
  ghost: "text-foreground hover:bg-surface-muted",
  destructive: "bg-danger text-on-danger hover:bg-danger-hover",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "h-10 w-10",
};

export function Button({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  const localRef = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed } = useButton(
    props as Parameters<typeof useButton>[0],
    localRef,
  );

  return (
    <button
      {...buttonProps}
      ref={localRef}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        variantClasses[variant],
        isPressed && "scale-[0.99]",
        className,
      )}
    >
      {children}
    </button>
  );
}
