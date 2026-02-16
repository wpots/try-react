"use client";

import { useId, useRef } from "react";
import { useLabel } from "@react-aria/label";
import { Clock3 } from "lucide-react";

import type { TimeInputProps } from "./index";
import { cn } from "../../lib/utils";
import { FormLabel } from "../Form";
import { getFormFieldClasses } from "../../utils/getFormFieldClasses";

export function TimeInput({
  label,
  value,
  onChange,
  containerClassName,
  labelClassName,
  inputClassName,
  id: idProp,
  "aria-label": ariaLabel,
  ...props
}: TimeInputProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const ref = useRef<HTMLInputElement>(null);

  const { labelProps, fieldProps } = useLabel({
    label: label ?? ariaLabel ?? "Time",
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
          type="time"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={cn(
            getFormFieldClasses("controlWithRightIcon"),
            inputClassName,
          )}
        />
        <Clock3
          aria-hidden="true"
          className={getFormFieldClasses("rightIcon")}
        />
      </div>
    </div>
  );
}
