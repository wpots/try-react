import type { NextImageLikeProps } from "@repo/ui";

export interface LogoProps extends React.ComponentProps<"a"> {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  /** 0 = expanded (large wordmark), 1 = collapsed (short wordmark + icon). When set, overrides showText. */
  scrollProgress?: number;
  /** Image component to render for the logo graphic (e.g. next/image). Falls back to native img if omitted. */
  component?: React.ComponentType<NextImageLikeProps>;
}

export { Logo } from "./Logo";
