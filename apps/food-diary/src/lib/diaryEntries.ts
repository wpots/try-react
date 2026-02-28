import { getLocalDateKey } from "@/lib/getLocalDateKey";
import type {
  ClientDiaryEntry,
  DiaryEntry as FirestoreDiaryEntry,
} from "@/lib/firestore/types";

export type { ClientDiaryEntry as DiaryEntry } from "@/lib/firestore/types";

export function mapFirestoreDiaryEntryToClient(
  entry: FirestoreDiaryEntry,
): ClientDiaryEntry {
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
    isBookmarked: entry.isBookmarked,
    date: getLocalDateKey(entry.date.toDate()),
    time: entry.time,
    locationOther: entry.locationOther,
    companyOther: entry.companyOther,
    behaviorOther: entry.behaviorOther,
    createdAt: entry.createdAt.toDate().toISOString(),
    updatedAt: entry.updatedAt.toDate().toISOString(),
    imageUrl: entry.imageUrl,
    imagePublicId: entry.imagePublicId,
  };
}

export function mapFirestoreDiaryEntriesToClient(
  entries: FirestoreDiaryEntry[],
): ClientDiaryEntry[] {
  return entries.map(mapFirestoreDiaryEntryToClient);
}
