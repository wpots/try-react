"use server";

import { migrateGuestEntries } from "@/lib/firestore/helpers";

import type { MergeGuestEntriesResult } from "./index";

export async function mergeGuestEntries(
  guestId: string,
  userId: string,
): Promise<MergeGuestEntriesResult> {
  if (!guestId || !userId) {
    return {
      success: false,
      mergedCount: 0,
      error: "Guest ID and user ID are required.",
    };
  }

  if (guestId === userId) {
    return {
      success: true,
      mergedCount: 0,
    };
  }

  try {
    const mergedCount = await migrateGuestEntries(guestId, userId);

    return {
      success: true,
      mergedCount,
    };
  } catch (err) {
    console.error("Error merging guest entries:", err);
    return {
      success: false,
      mergedCount: 0,
      error: "Failed to merge guest entries.",
    };
  }
}
