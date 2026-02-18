"use server";

import { deleteUserDataByUser } from "@/lib/firestore/helpers";

import type { WipeUserEntriesResult } from "./index";

export async function wipeUserEntries(
  userId: string,
): Promise<WipeUserEntriesResult> {
  if (!userId) {
    return {
      success: false,
      deletedCount: 0,
      error: "User ID is required.",
    };
  }

  try {
    const deletedCount = await deleteUserDataByUser(userId);

    return {
      success: true,
      deletedCount,
    };
  } catch (err) {
    console.error("Error wiping user entries:", err);
    return {
      success: false,
      deletedCount: 0,
      error: "Failed to wipe user entries.",
    };
  }
}
