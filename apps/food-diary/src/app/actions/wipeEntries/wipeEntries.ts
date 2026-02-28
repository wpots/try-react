"use server";

import { deleteUserDataByUser } from "@/lib/firestore/helpers";

import type { WipeEntriesResult } from "./index";

export async function wipeEntries(userId: string): Promise<WipeEntriesResult> {
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
    console.error("Error wiping entries:", err);
    return {
      success: false,
      deletedCount: 0,
      error: "Failed to wipe entries.",
    };
  }
}
