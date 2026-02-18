import type { DiaryEntryBehavior, DiaryEntryCompany, DiaryEntryLocation, DiaryEntryType } from "@/lib/firestore/types";

export type EntryFormMode = "chat" | "form";

export interface WizardEntry {
  entryType: DiaryEntryType | null;
  skippedMeal: boolean | null;
  isBookmarked: boolean;
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
  entryId?: string;
  initialMode?: EntryFormMode;
  isBookmarked?: boolean;
  onBookmarkChange?: (isBookmarked: boolean) => void;
  onComplete?: () => void;
  onDirtyChange?: (isDirty: boolean) => void;
}

export interface TraditionalFormProps {
  canDelete?: boolean;
  deleteError?: string | null;
  initialEntry: WizardEntry;
  isDeleting?: boolean;
  onComplete: (entry: WizardEntry) => void;
  onDelete?: () => void;
  onEntryChange?: (entry: WizardEntry) => void;
}

export interface CoachChatProps {
  entryId?: string;
  initialMode?: EntryFormMode;
  onComplete?: () => void;
}

export { EntryForm } from "./EntryForm";
