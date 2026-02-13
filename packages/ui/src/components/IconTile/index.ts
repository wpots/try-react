import type React from "react";

export interface IconTileProps extends React.ComponentProps<"div"> {
  /** Icon component (e.g. Lucide icon). */
  icon: React.ElementType<{ className?: string }>;
  /** Size of the tile. */
  size?: "sm" | "md";
}

export { IconTile } from "./IconTile";
