export interface WizardEntry {
  entryType: string | null;
  skippedMeal: boolean | null;
  date: string;
  time: string;
  location: string | null;
  company: string | null;
  foodEaten: string;
  emotions: string[];
  description: string;
  behavior: string[];
  imageUrl?: string;
  imagePublicId?: string;
}

