import type React from "react";

export interface PebbleIconProps extends React.ComponentProps<"svg"> {
  /** Fill color (e.g. CSS variable or token). Defaults to currentColor. */
  fill?: string;
}

export { PebbleIcon } from "./PebbleIcon";
