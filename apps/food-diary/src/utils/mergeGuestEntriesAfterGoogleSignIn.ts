import { mergeGuestEntries } from "@/app/actions";
import { migrateGuestEntries } from "@/lib/firestore/helpers";

import type { User } from "firebase/auth";

export interface MergeGuestEntriesAfterGoogleSignInResult {
  success: boolean;
  mergedCount: number;
  error?: string;
}

function getErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "";
  }

  const message = error.message.trim();
  if (!message) {
    return "";
  }

  return message;
}

export async function mergeGuestEntriesAfterGoogleSignIn(
  guestId: string,
  newUser: User,
): Promise<MergeGuestEntriesAfterGoogleSignInResult> {
  if (!guestId || !newUser.uid || guestId === newUser.uid) {
    return {
      success: true,
      mergedCount: 0,
    };
  }

  let serverError = "";

  try {
    const idToken = await newUser.getIdToken();
    const serverResult = await mergeGuestEntries(guestId, idToken);

    if (serverResult.success) {
      return {
        success: true,
        mergedCount: serverResult.mergedCount,
      };
    }

    serverError = serverResult.error?.trim() ?? "";
  } catch (error) {
    serverError = getErrorMessage(error);
  }

  try {
    const mergedCount = await migrateGuestEntries(guestId, newUser.uid);

    return {
      success: true,
      mergedCount,
    };
  } catch (error) {
    const fallbackError = getErrorMessage(error);
    const errorMessage = [serverError, fallbackError].filter(message => message.length > 0).join(" ");

    return {
      success: false,
      mergedCount: 0,
      error: errorMessage || "Failed to merge guest entries.",
    };
  }
}
