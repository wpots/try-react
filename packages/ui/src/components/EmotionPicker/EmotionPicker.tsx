"use client";

import { ToggleButton } from "react-aria-components";

import type { EmotionPickerProps } from "./index";
import { EMOTION_CATEGORY_ORDER, EMOTIONS_BY_CATEGORY } from "./emotions";
import { cn } from "../../lib/utils";

export function EmotionPicker({
  selectedKeys,
  onSelectedKeysChange,
  getLabel,
  getCategoryLabel,
  className,
  ...props
}: EmotionPickerProps) {
  function handleToggle(key: string, selected: boolean): void {
    if (selected) {
      onSelectedKeysChange([...selectedKeys, key]);
      return;
    }

    onSelectedKeysChange(selectedKeys.filter(current => current !== key));
  }

  return (
    <div {...props} className={cn("flex flex-col gap-ds-l", className)}>
      {EMOTION_CATEGORY_ORDER.map((category) => {
        const categoryEmotions = EMOTIONS_BY_CATEGORY[category];
        if (!categoryEmotions.length) return null;

        const categoryLabel = getCategoryLabel?.(category);

        return (
          <section key={category} className="flex flex-col gap-ds-s">
            {categoryLabel ? (
              <h3 className="text-xs font-medium text-ds-on-surface-secondary">
                {categoryLabel}
              </h3>
            ) : null}
            <div className="grid grid-cols-3 gap-ds-s sm:grid-cols-4">
              {categoryEmotions.map(emotion => {
                const isSelected = selectedKeys.includes(emotion.key);
                const label = getLabel?.(emotion.key) ?? emotion.label;

                return (
                  <ToggleButton
                    key={emotion.key}
                    isSelected={isSelected}
                    onChange={selected => handleToggle(emotion.key, selected)}
                    aria-label={label}
                    className={cn(
                      "flex flex-col items-center gap-ds-xs rounded-ds-xl px-ds-s py-ds-m text-xs font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-focus-ring/40",
                      isSelected
                        ? "bg-ds-primary/15 text-ds-brand-primary-strong ring-1 ring-ds-primary/40"
                        : "bg-ds-surface-muted text-ds-on-surface-secondary hover:bg-ds-surface-muted/80",
                    )}
                  >
                    <span
                      className="text-5xl font-openmoji grayscale brightness-110"
                      aria-hidden="true"
                    >
                      {emotion.emoji}
                    </span>
                    <span>{label}</span>
                  </ToggleButton>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
