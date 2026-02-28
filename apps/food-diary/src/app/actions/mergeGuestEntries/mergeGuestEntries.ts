"use server";

import { extractUidFromIdToken, restMigrateGuestEntries } from "@/lib/firestore/rest-helpers";

import type { MergeGuestEntriesResult } from "./index";

export async function mergeGuestEntries(guestId: string, idToken: string): Promise<MergeGuestEntriesResult> {
  const userId = extractUidFromIdToken(idToken);

  if (!guestId || !userId) {
    return {
      success: false,
      mergedCount: 0,
      error: "Guest ID and authentication token are required.",
    };
  }

  if (guestId === userId) {
    return {
      success: true,
      mergedCount: 0,
    };
  }

  try {
    // restMigrateGuestEntries queries for guestId documents and reassigns them.
    // Requires Firestore rules that allow the new authenticated user to read
    // entries owned by the anonymous guestId.  Falls back to 0 (client handles
    // migration) when security rules block cross-user reads.
    const mergedCount = await restMigrateGuestEntries(guestId, idToken, userId);

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
