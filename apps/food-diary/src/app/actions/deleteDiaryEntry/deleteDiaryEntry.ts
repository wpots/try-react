"use server";

import { deleteDiaryEntryById, getDiaryEntryById } from "@/lib/firestore/helpers";

export interface DeleteDiaryEntryResult {
  success?: boolean;
  error?: string;
}

export async function deleteDiaryEntry(userId: string, entryId: string): Promise<DeleteDiaryEntryResult> {
  const normalizedUserId = typeof userId === "string" ? userId.trim() : "";
  const normalizedEntryId = typeof entryId === "string" ? entryId.trim() : "";

  if (!normalizedUserId || !normalizedEntryId) {
    return { error: "Missing userId or entryId" };
  }

  try {
    const entry = await getDiaryEntryById(normalizedEntryId);

    if (!entry || entry.userId !== normalizedUserId) {
      return { error: "Entry not found or access denied" };
    }

    await deleteDiaryEntryById(normalizedEntryId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting diary entry:", error);
    return { error: "Failed to delete entry" };
  }
}
