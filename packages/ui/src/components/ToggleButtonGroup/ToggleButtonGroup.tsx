"use client";

import type { ToggleButtonGroupProps } from "./index";
import { cn } from "../../lib/utils";

export function ToggleButtonGroup({
  options,
  selectedValue,
  onSelectedValueChange,
  className,
  optionClassName,
  "aria-label": ariaLabel,
  ...props
}: ToggleButtonGroupProps): React.JSX.Element {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-ds-xs", className)}
      {...props}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={option.disabled}
            aria-pressed={isSelected}
            onClick={() => onSelectedValueChange(option.value)}
            className={cn(
              "rounded-ds-full border px-ds-m py-ds-xs font-ds-label-xs",
              "transition focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-ds-focus-ring/40 disabled:cursor-not-allowed",
              "disabled:opacity-50",
              isSelected
                ? "border-ds-brand-primary bg-ds-brand-primary-soft text-ds-on-surface"
                : "border-ds-border-subtle text-ds-on-surface-secondary",
              optionClassName,
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
