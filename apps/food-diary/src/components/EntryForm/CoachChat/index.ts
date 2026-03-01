import type { WizardStep } from "../utils/steps";

export interface CoachChatFollowupInputProps {
  step: WizardStep;
  inputChips: string[];
  inputEmotions: string[];
  inputBookmarked: boolean | null;
  inputOtherText: string;
  inputText: string;
  setInputChips: (value: string[]) => void;
  setInputEmotions: (value: string[]) => void;
  setInputBookmarked: (value: boolean | null) => void;
  setInputOtherText: (value: string) => void;
  setInputText: (value: string) => void;
  onSkip: () => void;
  onStepBack: () => void;
  onSubmitBehavior: () => void;
  onSubmitBookmark: (override?: boolean | null) => void;
  onSubmitCompany: (override?: string) => void;
  onSubmitDescription: () => void;
  onSubmitEmotions: () => void;
  onSubmitFood: () => void;
  onSubmitLocation: (override?: string) => void;
}
