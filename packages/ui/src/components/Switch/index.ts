import type React from "react";
import { Switch as AriaSwitch } from "react-aria-components";

export interface SwitchProps
  extends Omit<React.ComponentProps<typeof AriaSwitch>, "className" | "children"> {
  className?: string;
  children?: React.ReactNode;
}

export { Switch } from "./Switch";
