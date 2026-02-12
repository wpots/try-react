import type React from "react";

export interface TextAreaProps
  extends Omit<React.ComponentProps<"textarea">, "children"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
}

export { TextArea } from "./TextArea";

