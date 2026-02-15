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
  function resolveLabel(key: string, fallback: string): string {
    if (!getLabel) {
      return fallback;
    }

    try {
      const translatedLabel = getLabel(key);
      if (translatedLabel.trim().length > 0) {
        return translatedLabel;
      }
    } catch {
      return fallback;
    }

    return fallback;
  }

  function handleToggle(key: string, selected: boolean): void {
    if (selected) {
      if (selectedKeys.includes(key)) {
        return;
      }

      onSelectedKeysChange([...selectedKeys, key]);
      return;
    }

    onSelectedKeysChange(selectedKeys.filter(current => current !== key));
  }

  return (
    <div
      {...props}
      className={cn(
        "grid grid-cols-4 gap-ds-s sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7",
        className,
      )}
    >
      {emotions.map((emotion, index) => {
        const isSelected = selectedKeys.includes(emotion.key);
        const label = resolveLabel(emotion.key, emotion.label);

        return (
          <ToggleButton
            key={`${emotion.category}-${emotion.key}-${index}`}
            isSelected={isSelected}
            onChange={(selected) => handleToggle(emotion.key, selected)}
            aria-label={label}
            className={cn(
              "flex min-h-12 min-w-12 flex-col items-center justify-center gap-ds-xs rounded-ds-xl px-ds-s py-ds-m text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/40",
              isSelected
                ? "bg-ds-primary/15 text-ds-brand-primary-strong ring-1 ring-ds-primary/40"
                : "bg-ds-surface-muted text-ds-on-surface-secondary hover:bg-ds-surface-muted/80",
            )}
          >
            <span
              className="text-5xl font-openmoji leading-none grayscale brightness-110"
              aria-hidden="true"
            >
              {emotion.emoji}
            </span>
            <span>{label}</span>
          </ToggleButton>
        );
      })}
    </div>
  );
}
