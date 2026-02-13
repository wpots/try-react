"use client";

import { useRef } from "react";
import { useButton } from "@react-aria/button";

import type { ButtonProps } from "./index";
import { cn } from "../../lib/utils";

export type ButtonVariantClassKey = NonNullable<ButtonProps["variant"]> | "link";
export const buttonBaseClasses =
  "group inline-flex items-center justify-center gap-ds-s whitespace-nowrap rounded-ds-md font-ds-label-base";
export const buttonFocusClasses =
  "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2";
export const buttonDisabledClasses = "disabled:pointer-events-none disabled:opacity-50";
export const buttonTransitionClasses = "transition-colors";
export const buttonIconClasses = "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

export const buttonVariantClasses: Record<ButtonVariantClassKey, string> = {
  default: "bg-ds-surface-primary !text-ds-on-primary hover:bg-ds-surface-strong",
  secondary: "bg-ds-surface-strong text-ds-on-surface-strong border-ds-surface-strong hover:bg-ds-surface-strong-hover",
  strong:
    "bg-ds-surface hover:text-ds-on-surface-strong border-ds-border-emphasis border-inset hover:bg-ds-surface-strong border-2",
  outline: "border border-1 border-ds-border-subtle bg-ds-surface text-ds-text hover:bg-ds-surface-muted",
  destructive: "bg-danger text-on-danger hover:bg-danger-hover",
  link: "bg-transparent text-ds-interactive underline-offset-4 hover:underline",
};

export const buttonSizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "px-ds-xxl py-ds-l",
  lg: "px-ds-xxl py-ds-l",
  icon: "h-10 w-10",
};

export function Button({ children, className, variant = "default", size = "default", ...props }: ButtonProps) {
  const localRef = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed } = useButton(props as Parameters<typeof useButton>[0], localRef);

  return (
    <button
      {...buttonProps}
      ref={localRef}
      className={cn(
        buttonBaseClasses,
        buttonFocusClasses,
        buttonDisabledClasses,
        buttonTransitionClasses,
        buttonIconClasses,
        buttonVariantClasses[variant],
        buttonSizeClasses[size],
        isPressed && "scale-[0.99]",
        className,
      )}
    >
      {children}
    </button>
  );
}
