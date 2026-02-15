import type { Timestamp } from "firebase/firestore";

export const diaryEntryTypes = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "moment",
  "thought",
] as const;

export const diaryEntryLocations = [
  "home",
  "work",
  "restaurant",
  "friend's house",
  "on the road",
  "anders",
] as const;

export const diaryEntryCompany = [
  "family",
  "friends",
  "alone",
  "colleagues",
  "kids",
  "partner",
  "anders",
] as const;

export const diaryEntryBehavior = [
  "restricted",
  "binged",
  "overate",
  "threw up",
  "anders",
] as const;

export type DiaryEntryType = (typeof diaryEntryTypes)[number];
export type DiaryEntryLocation = (typeof diaryEntryLocations)[number];
export type DiaryEntryCompany = (typeof diaryEntryCompany)[number];
export type DiaryEntryBehavior = (typeof diaryEntryBehavior)[number];

export interface User {
  userId: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
}

export interface DiaryEntry {
  entryId: string;
  userId: string;
  entryType: DiaryEntryType;
  foodEaten: string;
  emotions: string[];
  location: DiaryEntryLocation;
  company: DiaryEntryCompany;
  description: string;
  behavior: DiaryEntryBehavior[];
  skippedMeal: boolean;
  date: Timestamp;
  time: string;
  locationOther?: string;
  companyOther?: string;
  behaviorOther?: string;
  imageUrl?: string;
  imagePublicId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserAnalysisQuota {
  userId: string;
  date: string;
  count: number;
  lastReset: Timestamp;
  lastAnalysisAt?: Timestamp;
}

export interface CreateDiaryEntryInput {
  userId: string;
  entryType?: DiaryEntryType;
  foodEaten: string;
  emotions?: string[];
  location?: DiaryEntryLocation;
  company?: DiaryEntryCompany;
  description?: string;
  behavior?: DiaryEntryBehavior[];
  skippedMeal?: boolean;
  date: string;
  time: string;
  locationOther?: string;
  companyOther?: string;
  behaviorOther?: string;
  imageUrl?: string;
  imagePublicId?: string;
}
