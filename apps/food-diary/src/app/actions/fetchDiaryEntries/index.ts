"use server";

import { auth } from "@/lib/firebase";
import { getDiaryEntriesByUser } from "@/lib/firestore/helpers";
import type { DiaryEntry as FirestoreDiaryEntry } from "@/lib/firestore/types";

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

export async function fetchDiaryEntries(
  userIdFromClient?: string,
): Promise<DiaryEntry[]> {
  const userId = auth.currentUser?.uid ?? userIdFromClient;
  if (!userId) {
    return [];
  }

  const entries = await getDiaryEntriesByUser(userId);

  return entries.map((entry) => mapToActionDiaryEntry(entry));
}

function mapToActionDiaryEntry(entry: FirestoreDiaryEntry): DiaryEntry {
  return {
    id: entry.entryId,
    userId: entry.userId,
    entryType: entry.entryType,
    foodEaten: entry.foodEaten,
    emotions: entry.emotions,
    location: entry.location,
    company: entry.company,
    description: entry.description,
    behavior: entry.behavior,
    skippedMeal: entry.skippedMeal,
    date: entry.date.toDate().toISOString().slice(0, 10),
    time: entry.time,
    createdAt: entry.createdAt.toDate().toISOString(),
    updatedAt: entry.updatedAt.toDate().toISOString(),
  };
}
