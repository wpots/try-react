"use client";

import type { EmotionPickerProps } from "./index";
import { ChipSelector } from "../ChipSelector";
import { emotions } from "./emotions";
import { cn } from "../../lib/utils";

export function EmotionPicker({
  selectedKeys,
  onSelectedKeysChange,
  getLabel,
  className,
  ...props
}: EmotionPickerProps) {
  function toLowercaseLabel(label: string): string {
    return label.trim().toLocaleLowerCase();
  }

  function resolveLabel(key: string, fallback: string): string {
    if (!getLabel) {
      return toLowercaseLabel(fallback);
    }

    try {
      const translatedLabel = getLabel(key);
      if (translatedLabel.trim().length > 0) {
        return toLowercaseLabel(translatedLabel);
      }
    } catch {
      return toLowercaseLabel(fallback);
    }

    return toLowercaseLabel(fallback);
  }

  return (
    <ChipSelector
      {...props}
      options={emotions.map(emotion => ({
        value: emotion.key,
        label: (
          <span className="inline-flex items-center gap-1.5">
            <span className="font-openmoji text-base leading-none grayscale-50 brightness-110" aria-hidden="true">
              {emotion.emoji}
            </span>
            <span>{resolveLabel(emotion.key, emotion.label)}</span>
          </span>
        ),
      }))}
      selectedValues={selectedKeys}
      onSelectedValuesChange={onSelectedKeysChange}
      selectionMode="multiple"
      className={cn("gap-ds-xs", className)}
    />
  );
}
