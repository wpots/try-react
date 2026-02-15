"use client";

import { useId, useRef } from "react";
import { useLabel } from "@react-aria/label";

import type { DateInputProps } from "./index";
import { cn } from "../../lib/utils";

const inputBaseClasses =
  "h-10 w-full rounded-md border border-ds-border bg-ds-surface-elevated px-ds-m py-ds-s text-ds-on-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/20 disabled:cursor-not-allowed disabled:opacity-50";

export function DateInput({
  label,
  value,
  onChange,
  containerClassName,
  labelClassName,
  inputClassName,
  id: idProp,
  "aria-label": ariaLabel,
  ...props
}: DateInputProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const ref = useRef<HTMLInputElement>(null);

  const { labelProps, fieldProps } = useLabel({
    label: label ?? ariaLabel ?? "Date",
    id: inputId,
  });

  return (
    <div className={cn("grid w-full gap-2", containerClassName)}>
      {label ? (
        <label {...labelProps} className={cn("text-sm font-medium text-ds-text-muted", labelClassName)}>
          {label}
        </label>
      ) : null}
      <input
        {...fieldProps}
        {...props}
        ref={ref}
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(inputBaseClasses, inputClassName)}
      />
    </div>
  );
}
