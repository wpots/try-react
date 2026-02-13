import type {
  DiaryEntryBehavior,
  DiaryEntryCompany,
  DiaryEntryLocation,
  DiaryEntryType,
} from "@/lib/firestore/types";

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
  imageUrl?: string;
  imagePublicId?: string;
}

export interface CoachChatProps {
  onComplete?: () => void;
}

export interface TraditionalFormProps {
  initialEntry: WizardEntry;
  onSwitchToChat: () => void;
  onComplete: (entry: WizardEntry) => void;
}

export { CoachChat } from "./CoachChat";
export { TraditionalForm } from "./TraditionalForm";
