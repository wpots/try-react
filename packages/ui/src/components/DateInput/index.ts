import type React from "react";

export interface DateInputProps extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  "aria-label"?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export { DateInput } from "./DateInput";
