"use server";

import { extractUidFromIdToken, restGetDiaryEntriesByUser } from "@/lib/firestore/rest-helpers";
import type { ClientDiaryEntry } from "@/lib/firestore/types";

export async function fetchDiaryEntries(idToken?: string): Promise<ClientDiaryEntry[]> {
  if (!idToken) {
    return [];
  }

  const userId = extractUidFromIdToken(idToken);

  if (!userId) {
    return [];
  }

  return restGetDiaryEntriesByUser(idToken, userId);
}
