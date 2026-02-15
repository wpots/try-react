export type AnimatedLogoVariant = "default" | "strong";

export interface AnimatedLogoProps extends React.ComponentProps<"div"> {
  /** Pebble fill color variant. */
  variant?: AnimatedLogoVariant;
}

export { AnimatedLogo } from "./AnimatedLogo";

