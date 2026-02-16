import type React from "react";

export interface SelectOption {
  value: string;
  label: React.ReactNode;
}

export interface SelectProps extends React.ComponentProps<"div"> {
  label?: React.ReactNode;
  placeholder?: React.ReactNode;
  options: SelectOption[];
  selectedKey: string | null;
  onSelectedKeyChange: (key: string | null) => void;
  "aria-label"?: string;
}

export { Select } from "./Select";

