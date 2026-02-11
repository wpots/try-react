"use client";

import type { TextProps } from "./index";
import { cn } from "../../lib/utils";

const toneClasses: Record<NonNullable<TextProps["tone"]>, string> = {
  default: "text-ds-text",
  danger: "text-danger",
};

export function Text({ className, tone = "default", ...props }: TextProps) {
  return <p className={cn(toneClasses[tone], className)} {...props} />;
}
