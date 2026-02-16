"use client";

import { useId, useRef } from "react";
import { useLabel } from "@react-aria/label";
import { useTextField } from "@react-aria/textfield";

import type { TextAreaProps } from "./index";
import { cn } from "../../lib/utils";
import { FormLabel } from "../Form";

export function TextArea({
  label,
  description,
  errorMessage,
  containerClassName,
  labelClassName,
  textareaClassName,
  id,
  className,
  ...props
}: TextAreaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const localRef = useRef<HTMLTextAreaElement>(null);

  const { labelProps } = useLabel({
    label,
    "aria-label": props["aria-label"],
    "aria-labelledby": props["aria-labelledby"],
  });

  const textFieldProps = {
    ...props,
    id: textareaId,
    label,
    description,
    errorMessage,
    inputElementType: "textarea",
  } as Parameters<typeof useTextField>[0];

  const {
    inputProps,
    descriptionProps,
    errorMessageProps,
    isInvalid,
  } = useTextField(textFieldProps, localRef);

  const textareaElementProps =
    inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>;

  return (
    <div className={cn("grid w-full items-start gap-2", containerClassName)}>
      {label ? (
        <FormLabel
          {...labelProps}
          className={labelClassName}
        >
          {label}
        </FormLabel>
      ) : null}
      <textarea
        {...textareaElementProps}
        ref={localRef}
        className={cn(
          "flex min-h-[5rem] w-full resize-y rounded-md border border-ds-border bg-ds-surface px-3 py-2 text-sm text-ds-text transition-colors",
          "placeholder:text-ds-text-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isInvalid && "border-danger focus-visible:ring-danger/20",
          className,
          textareaClassName,
        )}
      />
      {description ? (
        <p {...descriptionProps} className="text-sm text-ds-text-muted">
          {description}
        </p>
      ) : null}
      {errorMessage ? (
        <p {...errorMessageProps} className="text-sm text-danger">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
