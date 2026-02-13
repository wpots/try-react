import type React from "react";

/** Background + icon color variants using on-surface design tokens. */
export type IconTileVariant = "default" | "subtle" | "strong";

export interface IconTileProps extends React.ComponentProps<"div"> {
  /** Icon component (e.g. Lucide icon). */
  icon: React.ElementType<{ className?: string }>;
  /** Size of the tile. */
  size?: "sm" | "md";
  /** Background and icon color from on-surface palette. */
  variant?: IconTileVariant;
}

export { IconTile } from "./IconTile";
