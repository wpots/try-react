import type React from "react";

export interface ChipSelectorOption {
  value: string;
  label: React.ReactNode;
}

export interface ChipSelectorProps extends React.ComponentProps<"div"> {
  options: ChipSelectorOption[];
  selectedValues: string[];
  onSelectedValuesChange: (values: string[]) => void;
  selectionMode?: "single" | "multiple";
  variant?: "default" | "gentle";
}

export { ChipSelector } from "./ChipSelector";

