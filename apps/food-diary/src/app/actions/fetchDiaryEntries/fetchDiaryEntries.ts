"use server";

import { getDiaryEntriesByUser } from "@/lib/firestore/helpers";
import type { ClientDiaryEntry } from "@/lib/firestore/types";

import { mapToActionDiaryEntry } from "./utils/mapToActionDiaryEntry";

export async function fetchDiaryEntries(
  userIdFromClient?: string,
): Promise<ClientDiaryEntry[]> {
  const userId =
    typeof userIdFromClient === "string" ? userIdFromClient.trim() : "";

  if (!userId) {
    return [];
  }

  const entries = await getDiaryEntriesByUser(userId);

  return entries.map((entry) => mapToActionDiaryEntry(entry));
}
