import type { WizardEntry } from "../index";

interface HasUnsavedEntryChangesParams {
  initialEntry: WizardEntry;
  currentEntry: WizardEntry;
  currentStepIndex: number;
  inputText: string;
  inputChips: string[];
  inputEmotions: string[];
  inputBookmarked: boolean | null;
  inputSkippedMeal: boolean | null;
  inputOtherText: string;
  messages: { role: "coach" | "user" }[];
}

interface NormalizedEntry {
  behavior: string[];
  behaviorOther?: string;
  company: string | null;
  companyOther?: string;
  date: string;
  description: string;
  emotions: string[];
  entryType: string | null;
  foodEaten: string;
  imagePublicId?: string;
  imageUrl?: string;
  isBookmarked: boolean;
  location: string | null;
  locationOther?: string;
  skippedMeal: boolean | null;
  time: string;
}

function normalizeOptionalText(value?: string): string | undefined {
  const next = value?.trim() ?? "";
  return next.length > 0 ? next : undefined;
}

function normalizeEntry(entry: WizardEntry): NormalizedEntry {
  return {
    behavior: [...entry.behavior].sort(),
    behaviorOther: normalizeOptionalText(entry.behaviorOther),
    company: entry.company,
    companyOther: normalizeOptionalText(entry.companyOther),
    date: entry.date,
    description: entry.description.trim(),
    emotions: [...entry.emotions].sort(),
    entryType: entry.entryType,
    foodEaten: entry.foodEaten.trim(),
    imagePublicId: entry.imagePublicId,
    imageUrl: entry.imageUrl,
    isBookmarked: entry.isBookmarked,
    location: entry.location,
    locationOther: normalizeOptionalText(entry.locationOther),
    skippedMeal: entry.skippedMeal,
    time: entry.time,
  };
}

export function hasUnsavedEntryChanges({
  initialEntry,
  currentEntry,
  currentStepIndex,
  inputText,
  inputChips,
  inputEmotions,
  inputBookmarked,
  inputSkippedMeal,
  inputOtherText,
  messages,
}: HasUnsavedEntryChangesParams): boolean {
  const hasEntryValueChanged =
    JSON.stringify(normalizeEntry(initialEntry)) !==
    JSON.stringify(normalizeEntry(currentEntry));

  const hasPendingInput =
    inputText.trim().length > 0 ||
    inputOtherText.trim().length > 0 ||
    inputChips.length > 0 ||
    inputEmotions.length > 0 ||
    inputBookmarked !== null ||
    inputSkippedMeal !== null;

  const hasChatProgress =
    currentStepIndex > 0 || messages.some((message) => message.role === "user");

  return hasEntryValueChanged || hasPendingInput || hasChatProgress;
}
