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
  onComplete?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export interface TraditionalFormProps {
  initialEntry: WizardEntry;
  onComplete: (entry: WizardEntry) => void;
  onEntryChange?: (entry: WizardEntry) => void;
}

export interface CoachChatProps {
  onComplete?: () => void;
}

export { EntryForm } from "./EntryForm";
