"use client";

import type { InputHTMLAttributes } from "react";
import { useId, useRef } from "react";
import { useLabel } from "@react-aria/label";
import { useTextField } from "@react-aria/textfield";

import type { TextFieldProps } from "./index";
import { cn } from "../../lib/utils";

export function TextField({
  label,
  description,
  errorMessage,
  containerClassName,
  labelClassName,
  inputClassName,
  id,
  ...props
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const localRef = useRef<HTMLInputElement>(null);

  const { labelProps } = useLabel({ label });
  const textFieldProps = {
    ...props,
    id: inputId,
    label,
    description,
    errorMessage,
  } as Parameters<typeof useTextField>[0];

  const { inputProps, descriptionProps, errorMessageProps, isInvalid } = useTextField(
    textFieldProps,
    localRef,
  );
  const inputElementProps = inputProps as InputHTMLAttributes<HTMLInputElement>;

  return (
    <div className={cn("grid w-full items-start gap-2", containerClassName)}>
      <label {...labelProps} className={cn("text-sm font-medium text-text-700", labelClassName)}>
        {label}
      </label>
      <input
        {...inputElementProps}
        ref={localRef}
        className={cn(
          "flex h-10 w-full rounded-md border border-border-300 bg-surface-50 px-3 py-2 text-sm text-text-900 transition-colors",
          "placeholder:text-text-700/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isInvalid && "border-danger-500 focus-visible:ring-danger-500/20",
          inputClassName,
        )}
      />
      {description ? (
        <p {...descriptionProps} className="text-sm text-text-700">
          {description}
        </p>
      ) : null}
      {errorMessage ? (
        <p {...errorMessageProps} className="text-sm text-danger-500">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
