import { isEntryType } from "./options";

import type { WizardEntry } from "../index";

type PrefillData = { foodName: string; mealType: string; description: string };

export function applyPrefill(entry: WizardEntry, data: PrefillData): WizardEntry {
  return {
    ...entry,
    entryType: isEntryType(data.mealType) ? data.mealType : entry.entryType,
    foodEaten: data.foodName || entry.foodEaten,
    description: data.description || entry.description,
  };
}

export function validateEntry(entry: WizardEntry, t: (key: string) => string): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!entry.entryType) {
    errors.entryType = t("errors.validationEntryType");
  }

  const hasSkippedMealBehavior = entry.behavior.includes("skipped meal");
  const needsFoodEaten = entry.entryType !== "moment" && !hasSkippedMealBehavior;
  if (needsFoodEaten && !entry.foodEaten.trim()) {
    errors.foodEaten = t("errors.validationFoodEaten");
  }

  return errors;
}
