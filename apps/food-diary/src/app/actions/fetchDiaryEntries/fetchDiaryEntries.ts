"use server";

import { getDiaryEntriesByUser } from "@/lib/firestore/helpers";

import { mapToActionDiaryEntry } from "./utils/mapToActionDiaryEntry";

import type { DiaryEntry } from "./index";

export async function fetchDiaryEntries(
  userIdFromClient?: string,
): Promise<DiaryEntry[]> {
  const userId =
    typeof userIdFromClient === "string" ? userIdFromClient.trim() : "";

  if (!userId) {
    return [];
  }

  const entries = await getDiaryEntriesByUser(userId);

  return entries.map((entry) => mapToActionDiaryEntry(entry));
}
