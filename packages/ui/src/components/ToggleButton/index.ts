import { ToggleButton as AriaToggleButton } from "react-aria-components";
import type React from "react";

export interface ToggleButtonProps
  extends Omit<React.ComponentProps<typeof AriaToggleButton>, "className"> {
  className?: string;
}

export { ToggleButton } from "./ToggleButton";
