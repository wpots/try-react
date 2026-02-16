import type React from "react";

export type TextAreaProps = Omit<
  React.ComponentProps<"textarea">,
  "children" | "onChange" | "value" | "defaultValue"
> & {
  label?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  description?: React.ReactNode;
  errorMessage?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
};

export { TextArea } from "./TextArea";
