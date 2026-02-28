import { migrateGuestEntriesByIds } from "@/lib/firestore/helpers";

import type { User } from "firebase/auth";

export interface MergeGuestEntriesAfterGoogleSignInResult {
  success: boolean;
  mergedCount: number;
  error?: string;
}

/**
 * Transfers ownership of pre-fetched guest diary entries to the new Google user.
 *
 * `guestEntryIds` must be collected *before* the Google sign-in popup so the
 * anonymous user's read permissions are used for the query.  After sign-in the
 * Firestore update rule (`request.resource.data.userId == request.auth.uid`)
 * allows the new user to claim the entries without read access.
 */
export async function mergeGuestEntriesAfterGoogleSignIn(
  guestId: string,
  newUser: User,
  guestEntryIds: string[],
): Promise<MergeGuestEntriesAfterGoogleSignInResult> {
  if (!guestId || !newUser.uid || guestId === newUser.uid || guestEntryIds.length === 0) {
    return {
      success: true,
      mergedCount: 0,
    };
  }

  try {
    const mergedCount = await migrateGuestEntriesByIds(guestEntryIds, newUser.uid);

    return {
      success: true,
      mergedCount,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message.trim() : "";

    return {
      success: false,
      mergedCount: 0,
      error: message || "Failed to merge guest entries.",
    };
  }
}
