"use client";

import {
  Button as AriaButton,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
} from "react-aria-components";
import type { SelectProps } from "./index.ts";
import { cn } from "../../lib/utils";
import { ChevronDown } from "lucide-react";
import { getFormFieldClasses } from "../../utils/getFormFieldClasses";

export function Select({
  label,
  placeholder,
  options,
  selectedKey,
  onSelectedKeyChange,
  className,
  "aria-label": ariaLabel,
  ...props
}: SelectProps): React.JSX.Element {
  return (
    <AriaSelect
      selectedKey={selectedKey ?? undefined}
      onSelectionChange={key => {
        if (key == null || typeof key === "string") {
          onSelectedKeyChange(key ?? null);
        }
      }}
      aria-label={ariaLabel}
      className={cn(getFormFieldClasses("container"), className)}
      {...props}
    >
      {label ? <Label className="text-sm font-medium text-ds-text-muted">{label}</Label> : null}
      <AriaButton className={getFormFieldClasses("selectTrigger")}>
        <SelectValue className={cn(getFormFieldClasses("selectValue"), "text-ds-on-surface")}>
          {({ selectedText }) => selectedText || placeholder || "\u00A0"}
        </SelectValue>
        <ChevronDown aria-hidden="true" className={getFormFieldClasses("rightIcon")} />
      </AriaButton>

      <Popover
        className={cn(
          "z-50 w-[var(--trigger-width)] rounded-md border border-ds-border",
          "bg-ds-surface py-1 shadow-lg",
        )}
      >
        <ListBox className="max-h-60 overflow-auto outline-none">
          {options.map(option => (
            <ListBoxItem
              key={option.value}
              textValue={typeof option.label === "string" ? option.label : undefined}
              className={({ isFocused, isSelected }) =>
                cn(
                  "cursor-default px-ds-m py-ds-s text-sm text-ds-on-surface",
                  isSelected && "bg-ds-primary/10",
                  isFocused && "bg-ds-surface-muted",
                )
              }
            >
              {option.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
