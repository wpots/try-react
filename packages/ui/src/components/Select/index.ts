import type React from "react";
import type { SelectProps as AriaSelectProps } from "react-aria-components";

export interface SelectOption {
  value: string;
  label: React.ReactNode;
}

export interface SelectProps
  extends Omit<
    AriaSelectProps<object, "single">,
    | "children"
    | "defaultSelectedKey"
    | "defaultValue"
    | "items"
    | "onChange"
    | "onSelectionChange"
    | "placeholder"
    | "selectedKey"
    | "value"
  > {
  className?: string;
  label?: React.ReactNode;
  placeholder?: React.ReactNode;
  options: SelectOption[];
  selectedKey: string | null;
  onSelectedKeyChange: (key: string | null) => void;
  "aria-label"?: string;
}

export { Select } from "./Select";
