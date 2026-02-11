export interface DiaryEntry {
  id: string;
  userId: string;
  entryType: string;
  foodEaten: string;
  emotions: string[];
  location: string;
  company: string;
  description: string;
  behavior: string[];
  skippedMeal: boolean;
  date: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}

export { fetchDiaryEntries } from "./fetchDiaryEntries";
