import { mapFirestoreDiaryEntryToClient } from "@/lib/diaryEntries";
import type { ClientDiaryEntry, DiaryEntry as FirestoreDiaryEntry } from "@/lib/firestore/types";

export function mapToActionDiaryEntry(entry: FirestoreDiaryEntry): ClientDiaryEntry {
  return mapFirestoreDiaryEntryToClient(entry);
}
