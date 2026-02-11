"use server";

import { auth } from "@/lib/firebase";
import { getDiaryEntriesByUser } from "@/lib/firestore/helpers";
import type { DiaryEntry } from "./index";
import { mapToActionDiaryEntry } from "./utils/mapToActionDiaryEntry";

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
