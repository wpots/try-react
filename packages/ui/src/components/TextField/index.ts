import type React from "react";

export type TextFieldProps = React.ComponentProps<"input"> & {
  label: string;
  description?: string;
  errorMessage?: string;
};

export { TextField } from "./TextField";
