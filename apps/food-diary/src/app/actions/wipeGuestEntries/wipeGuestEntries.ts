"use server";

import { deleteDiaryEntriesByUser } from "@/lib/firestore/helpers";
import type { WipeGuestEntriesResult } from "./index";

export async function wipeGuestEntries(
  guestId: string,
): Promise<WipeGuestEntriesResult> {
  if (!guestId) {
    return {
      success: false,
      deletedCount: 0,
      error: "Guest ID is required.",
    };
  }

  try {
    const deletedCount = await deleteDiaryEntriesByUser(guestId);

    return {
      success: true,
      deletedCount,
    };
  } catch (err) {
    console.error("Error wiping guest entries:", err);
    return {
      success: false,
      deletedCount: 0,
      error: "Failed to wipe guest entries.",
    };
  }
}
