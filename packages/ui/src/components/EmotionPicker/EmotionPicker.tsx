"use client";

import { ToggleButton } from "react-aria-components";

import type { EmotionPickerProps } from "./index";
import { emotions } from "./emotions";
import { cn } from "../../lib/utils";

export function EmotionPicker({
  selectedKeys,
  onSelectedKeysChange,
  getLabel,
  className,
  ...props
}: EmotionPickerProps) {
  function handleToggle(key: string, selected: boolean): void {
    if (selected) {
      onSelectedKeysChange([...selectedKeys, key]);
      return;
    }

    onSelectedKeysChange(selectedKeys.filter((current) => current !== key));
  }

  return (
    <div
      {...props}
      className={cn("grid grid-cols-3 gap-ds-s sm:grid-cols-4", className)}
    >
      {emotions.map((emotion) => {
        const isSelected = selectedKeys.includes(emotion.key);
        const label = getLabel?.(emotion.key) ?? emotion.label;

        return (
          <ToggleButton
            key={emotion.key}
            isSelected={isSelected}
            onChange={(selected) => handleToggle(emotion.key, selected)}
            aria-label={label}
            className={cn(
              "flex flex-col items-center gap-ds-xs rounded-ds-xl px-ds-s py-ds-m text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/40",
              isSelected
                ? "bg-ds-primary/15 text-ds-brand-primary-strong ring-1 ring-ds-primary/40"
                : "bg-ds-surface-muted text-ds-on-surface-secondary hover:bg-ds-surface-muted/80",
            )}
          >
            <span className="text-xl font-openmoji" aria-hidden="true">
              {emotion.emoji}
            </span>
            <span>{label}</span>
          </ToggleButton>
        );
      })}
    </div>
  );
}

