import type { DiaryEntryBehavior, DiaryEntryCompany, DiaryEntryLocation, DiaryEntryType } from "@/lib/firestore/types";

export interface WizardEntry {
  entryType: DiaryEntryType | null;
  skippedMeal: boolean | null;
  date: string;
  time: string;
  location: DiaryEntryLocation | null;
  company: DiaryEntryCompany | null;
  foodEaten: string;
  emotions: string[];
  description: string;
  behavior: DiaryEntryBehavior[];
  locationOther?: string;
  companyOther?: string;
  behaviorOther?: string;
  imageUrl?: string;
  imagePublicId?: string;
}

export interface EntryFormProps {
  cms: Record<string, unknown>;
  onComplete?: () => void;
}

export interface TraditionalFormProps {
  cms: Record<string, unknown>;
  initialEntry: WizardEntry;
  onComplete: (entry: WizardEntry) => void;
}

export interface CoachChatProps {
  cms: Record<string, unknown>;
  onComplete?: () => void;
}

export { EntryForm } from "./EntryForm";
export { TraditionalForm } from "./TraditionalForm";
