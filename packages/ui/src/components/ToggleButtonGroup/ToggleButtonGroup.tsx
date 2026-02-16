"use client";

import { ToggleButton, ToggleButtonGroup as AriaToggleButtonGroup } from "react-aria-components";

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
    <AriaToggleButtonGroup
      selectionMode="single"
      selectedKeys={selectedValue ? [selectedValue] : []}
      onSelectionChange={keys => {
        const selectedKey = [...keys][0];
        if (typeof selectedKey === "string") {
          onSelectedValueChange(selectedKey);
        }
      }}
      aria-label={ariaLabel}
      className={cn("flex flex-wrap ", className)}
      {...props}
    >
      {options.map(option => {
        return (
          <ToggleButton
            key={option.value}
            id={option.value}
            isDisabled={option.disabled}
            className={({ isSelected }) =>
              cn(
                "border px-ds-m py-ds-xs font-ds-label-xs",
                "-ml-0 first:rounded-l-ds-full first:ml-0 last:rounded-r-ds-full",
                "transition focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-ds-focus-ring/40 disabled:cursor-not-allowed",
                "disabled:opacity-50",
                isSelected
                  ? "border-ds-brand-primary bg-ds-brand-primary-soft text-ds-on-surface"
                  : "border-ds-border-subtle text-ds-on-surface-secondary",
                optionClassName,
              )
            }
          >
            {option.label}
          </ToggleButton>
        );
      })}
    </AriaToggleButtonGroup>
  );
}
