import type { DiaryEntry } from "../index";
import type { DiaryEntry as FirestoreDiaryEntry } from "@/lib/firestore/types";

export function mapToActionDiaryEntry(
  entry: FirestoreDiaryEntry,
): DiaryEntry {
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
