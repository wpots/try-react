export type AnimatedLogoVariant = "default" | "strong";
export type AnimatedLogoMotionMode = "auto" | "always" | "never";

export interface AnimatedLogoProps extends React.ComponentProps<"div"> {
  /** Pebble fill color variant. */
  variant?: AnimatedLogoVariant;
  /**
   * Motion behavior:
   * - "auto" respects the device's reduced-motion preference
   * - "always" keeps animation enabled
   * - "never" disables animation
   */
  motionMode?: AnimatedLogoMotionMode;
}

export { AnimatedLogo } from "./AnimatedLogo";
