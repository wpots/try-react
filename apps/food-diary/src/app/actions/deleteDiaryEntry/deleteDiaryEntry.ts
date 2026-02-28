"use server";

import { extractUidFromIdToken, restDeleteDiaryEntry, restGetDiaryEntryById } from "@/lib/firestore/rest-helpers";

export interface DeleteDiaryEntryResult {
  success?: boolean;
  error?: string;
}

export async function deleteDiaryEntry(idToken: string, entryId: string): Promise<DeleteDiaryEntryResult> {
  const userId = extractUidFromIdToken(idToken);
  const normalizedEntryId = typeof entryId === "string" ? entryId.trim() : "";

  if (!userId || !normalizedEntryId) {
    return { error: "Missing authentication or entryId" };
  }

  try {
    const entry = await restGetDiaryEntryById(idToken, normalizedEntryId);

    if (!entry || entry.userId !== userId) {
      return { error: "Entry not found or access denied" };
    }

    await restDeleteDiaryEntry(idToken, normalizedEntryId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    return { error: "Failed to delete entry" };
  }
}
