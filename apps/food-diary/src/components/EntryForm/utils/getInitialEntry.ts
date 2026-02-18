import type { WizardEntry } from "../index";
import { getLocalDateKey } from "@/lib/getLocalDateKey";

export function getInitialEntry(): WizardEntry {
  const now = new Date();
  const date = getLocalDateKey(now);
  const time = now.toTimeString().slice(0, 5);

  return {
    entryType: null,
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
