"use client";

import React, { useId, useRef } from "react";
import { useLabel } from "@react-aria/label";
import { useTextField } from "@react-aria/textfield";
import classNames from "classnames";

import type { TextFieldProps } from "./index";

export const TextField = ({
  label,
  description,
  errorMessage,
  className,
  id,
  ...props
}: TextFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

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
    inputRef,
  );
  const inputElementProps = inputProps as React.InputHTMLAttributes<HTMLInputElement>;

  return (
    <div className={classNames("flex w-full flex-col gap-2", className)}>
      <label {...labelProps} className="text-sm font-medium text-text-700">
        {label}
      </label>
      <input
        {...inputElementProps}
        ref={inputRef}
        className={classNames(
          "w-full rounded-md border border-border-300 bg-surface-50 px-3 py-2 text-base text-text-900 outline-none transition-colors",
          "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
          isInvalid && "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20",
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
};
