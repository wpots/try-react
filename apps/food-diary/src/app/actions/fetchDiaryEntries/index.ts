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
  date: string;
  time: string;
  locationOther?: string;
  companyOther?: string;
  behaviorOther?: string;
  createdAt: string;
  updatedAt: string;
}

export { fetchDiaryEntries } from "./fetchDiaryEntries";
