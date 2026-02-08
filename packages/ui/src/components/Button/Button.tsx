"use client";

import { useRef } from "react";
import { useButton } from "@react-aria/button";

import type { ButtonProps } from "./index";
import { cn } from "../../lib/utils";

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-brand-500 text-surface-50 hover:bg-brand-600",
  solid: "bg-brand-500 text-surface-50 hover:bg-brand-600",
  outline: "border border-border-300 bg-surface-50 text-text-900 hover:bg-surface-100",
  secondary: "bg-surface-100 text-text-900 hover:bg-surface-50",
  ghost: "text-text-900 hover:bg-surface-100",
  destructive: "bg-danger-500 text-surface-50 hover:brightness-95",
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
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
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
