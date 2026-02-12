import type React from "react";

export type StackGap = "xs" | "s" | "m" | "l" | "xl";

export type StackDirection = "row" | "column";

export type StackAlign = "start" | "center" | "end" | "stretch";

export type StackJustify = "start" | "center" | "end" | "between" | "around";

export interface StackProps extends React.ComponentProps<"div"> {
  /**
   * Optional element type to render instead of a `div`.
   * Useful for semantic containers (e.g. `section`, `ul`).
   */
  as?: React.ElementType;
  /**
   * Flex direction for the stack.
   * - `column` (default): vertical stack
   * - `row`: horizontal stack
   */
  direction?: StackDirection;
  /**
   * Cross‑axis alignment.
   */
  align?: StackAlign;
  /**
   * Main‑axis justification.
   */
  justify?: StackJustify;
  /**
   * Whether children should wrap when they run out of space.
   */
  wrap?: boolean;
  /**
   * Base gap between children using design tokens.
   * Defaults to `"m"`.
   */
  gap?: StackGap;
  /**
   * Responsive gaps – override the base gap at specific breakpoints.
   */
  gapSm?: StackGap;
  gapMd?: StackGap;
  gapLg?: StackGap;
  gapXl?: StackGap;
}

export { Stack } from "./Stack";

