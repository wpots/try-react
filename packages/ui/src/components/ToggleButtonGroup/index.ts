import type React from "react";

export interface ToggleButtonGroupOption {
  disabled?: boolean;
  label: React.ReactNode;
  value: string;
}

export interface ToggleButtonGroupProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  options: ToggleButtonGroupOption[];
  selectedValue: string | null;
  onSelectedValueChange: (value: string) => void;
  optionClassName?: string;
  "aria-label"?: string;
}

export { ToggleButtonGroup } from "./ToggleButtonGroup";
