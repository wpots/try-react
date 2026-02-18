import type { DiaryEntry } from "../index";
import type { DiaryEntry as FirestoreDiaryEntry } from "@/lib/firestore/types";
import { getLocalDateKey } from "@/lib/getLocalDateKey";

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
    date: getLocalDateKey(entry.date.toDate()),
    time: entry.time,
    locationOther: entry.locationOther,
    companyOther: entry.companyOther,
    behaviorOther: entry.behaviorOther,
    createdAt: entry.createdAt.toDate().toISOString(),
    updatedAt: entry.updatedAt.toDate().toISOString(),
  };
}
