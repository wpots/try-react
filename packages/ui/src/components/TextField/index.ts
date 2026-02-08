import type React from "react";

export type TextFieldProps = React.ComponentProps<"input"> & {
  label: string;
  description?: string;
  errorMessage?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};

export { TextField } from "./TextField";
