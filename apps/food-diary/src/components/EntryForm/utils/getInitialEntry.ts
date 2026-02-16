import type { WizardEntry } from "../index";

export function getInitialEntry(): WizardEntry {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5);

  return {
    entryType: null,
    skippedMeal: null,
    isBookmarked: false,
    date,
    time,
    location: null,
    company: null,
    foodEaten: "",
    emotions: [],
    description: "",
    behavior: [],
  };
}
