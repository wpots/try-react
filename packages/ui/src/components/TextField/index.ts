import type React from "react";

export type TextFieldProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "defaultValue"
> & {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  description?: string;
  errorMessage?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};

export { TextField } from "./TextField";
