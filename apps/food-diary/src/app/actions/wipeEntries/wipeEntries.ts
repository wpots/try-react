"use server";

import { extractUidFromIdToken, restDeleteUserData } from "@/lib/firestore/rest-helpers";

import type { WipeEntriesResult } from "./index";

export async function wipeEntries(idToken: string): Promise<WipeEntriesResult> {
  const userId = extractUidFromIdToken(idToken);

  if (!userId) {
    return {
      success: false,
      deletedCount: 0,
      error: "User not authenticated.",
    };
  }

  try {
    const deletedCount = await restDeleteUserData(idToken, userId);

    return {
      success: true,
      deletedCount,
    };
  } catch (err) {
    console.error("Error wiping entries:", err);
    return {
      success: false,
      deletedCount: 0,
      error: "Failed to wipe entries.",
    };
  }
}
