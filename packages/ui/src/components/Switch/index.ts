import type React from "react";

export interface SwitchProps
  extends Omit<
    React.ComponentProps<"div">,
    "onChange" | "children"
  > {
  /** Whether the switch is selected (on). */
  isSelected?: boolean;
  /** Default selection state (uncontrolled). */
  defaultSelected?: boolean;
  /** Handler called when selection changes. */
  onChange?: (isSelected: boolean) => void;
  /** Whether the switch is disabled. */
  isDisabled?: boolean;
  /** Whether the switch is read only. */
  isReadOnly?: boolean;
  /** Form value when selected. */
  value?: string;
  /** Form name. */
  name?: string;
  /** Label and/or custom content. */
  children?: React.ReactNode;
}

export { Switch } from "./Switch.tsx";
