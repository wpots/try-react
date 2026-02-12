"use client";

import { ToggleButton } from "react-aria-components";

import type { ChipSelectorProps } from "./index";
import { cn } from "../../lib/utils";

export function ChipSelector({
  options,
  selectedValues,
  onSelectedValuesChange,
  selectionMode = "single",
  variant = "default",
  className,
  ...props
}: ChipSelectorProps) {
  function handleToggle(value: string, selected: boolean): void {
    if (selectionMode === "single") {
      if (!selected) {
        onSelectedValuesChange([]);
        return;
      }

      onSelectedValuesChange([value]);
      return;
    }

    if (selected) {
      onSelectedValuesChange([...selectedValues, value]);
      return;
    }

    onSelectedValuesChange(selectedValues.filter((current) => current !== value));
  }

  return (
    <div
      {...props}
      className={cn("flex flex-wrap gap-ds-s", className)}
    >
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);

        return (
          <ToggleButton
            key={option.value}
            isSelected={isSelected}
            onChange={(selected) => handleToggle(option.value, selected)}
            className={cn(
              "rounded-ds-full px-ds-m py-ds-s text-sm font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/40",
              variant === "gentle"
                ? isSelected
                  ? "bg-ds-brand-support/40 text-ds-on-surface-strong ring-1 ring-ds-brand-support"
                  : "bg-ds-surface-muted text-ds-on-surface-secondary hover:bg-ds-surface-muted/80"
                : isSelected
                  ? "bg-ds-primary/15 text-ds-brand-primary-strong ring-1 ring-ds-primary/40"
                  : "bg-ds-surface-muted text-ds-on-surface-secondary hover:bg-ds-surface-muted/80",
            )}
          >
            {option.label}
          </ToggleButton>
        );
      })}
    </div>
  );
}

