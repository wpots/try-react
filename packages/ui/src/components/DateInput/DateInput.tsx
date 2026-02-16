"use client";

import { useId, useRef } from "react";
import { useLabel } from "@react-aria/label";
import { CalendarDays } from "lucide-react";

import type { DateInputProps } from "./index";
import { cn } from "../../lib/utils";
import { FormLabel } from "../Form";
import { getFormFieldClasses } from "../../utils/getFormFieldClasses";

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
    <div className={cn(getFormFieldClasses("container"), containerClassName)}>
      {label ? (
        <FormLabel {...labelProps} className={labelClassName}>
          {label}
        </FormLabel>
      ) : null}
      <div className="relative">
        <input
          {...fieldProps}
          {...props}
          ref={ref}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={cn(
            getFormFieldClasses("controlWithRightIcon"),
            inputClassName,
          )}
        />
        <CalendarDays
          aria-hidden="true"
          className={getFormFieldClasses("rightIcon")}
        />
      </div>
    </div>
  );
}
