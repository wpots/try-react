"use server";

import { extractUidFromIdToken, restGetDiaryEntryById } from "@/lib/firestore/rest-helpers";
import type { ClientDiaryEntry } from "@/lib/firestore/types";

export interface FetchDiaryEntryByIdResult {
  entry?: ClientDiaryEntry;
  error?: string;
}

export async function fetchDiaryEntryById(idToken: string, entryId: string): Promise<FetchDiaryEntryByIdResult> {
  const userId = extractUidFromIdToken(idToken);
  const normalizedEntryId = typeof entryId === "string" ? entryId.trim() : "";

  if (!userId || !normalizedEntryId) {
    return { error: "Missing authentication or entryId" };
  }

  try {
    const entry = await restGetDiaryEntryById(idToken, normalizedEntryId);

    if (!entry || entry.userId !== userId) {
      return { error: "Entry not found" };
    }

    return { entry };
  } catch (error) {
    console.error("Error fetching diary entry:", error);
    return { error: "Failed to fetch entry" };
  }
}
