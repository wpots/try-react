import type { AnalyzeFoodImageData } from "@/app/actions/analyze-food-image";
import type { DiaryEntryBehavior, DiaryEntryCompany, DiaryEntryLocation, DiaryEntryType } from "@/lib/firestore/types";

import type { RefObject } from "react";

export type EntryFormMode = "chat" | "form";

export interface WizardEntry {
  entryType: DiaryEntryType | null;
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

export interface FoodAnalysisPrefill {
  foodName: string;
  mealType: string;
  description: string;
}

export interface FoodPhotoAnalyzerProps {
  readonly onPrefill: (data: FoodAnalysisPrefill) => void;
}

export type AnalysisStatus = "idle" | "analyzing" | "success" | "quota-reached" | "error";

export interface ChatEntry {
  id: string;
  role: "user" | "model";
  text: string;
  updatedData?: Partial<AnalyzeFoodImageData>;
}

export interface ChatPanelProps {
  readonly messages: ChatEntry[];
  readonly chatScrollRef: RefObject<HTMLDivElement | null>;
  readonly isSending: boolean;
  readonly chatInput: string;
  readonly chatError: boolean;
  readonly onInputChange: (value: string) => void;
  readonly onSend: () => void;
  readonly onPrefill: (data: FoodAnalysisPrefill) => void;
}

export { ChatPanel } from "./ChatPanel";
export { EntryForm } from "./EntryForm";
export { FoodPhotoAnalyzer } from "./FoodPhotoAnalyzer";
