"use client";

import React, { useRef } from "react";
import { useButton } from "@react-aria/button";
import classNames from "classnames";

import type { ButtonProps } from "./index";

export const Button = ({ children, className, variant = "solid", ...props }: ButtonProps) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps, isPressed } = useButton(props as Parameters<typeof useButton>[0], ref);

  return (
    <button
      {...buttonProps}
      ref={ref}
      className={classNames(
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "solid" && "bg-brand-500 text-surface-50 hover:bg-brand-600",
        variant === "outline" && "border border-border-300 bg-surface-50 text-text-900 hover:bg-surface-100",
        isPressed && "scale-[0.99]",
        className,
      )}
    >
      {children}
    </button>
  );
};
