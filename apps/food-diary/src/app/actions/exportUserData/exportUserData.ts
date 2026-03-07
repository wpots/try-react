"use server";

import { extractUidFromIdToken, restGetDiaryEntriesByUser } from "@/lib/firestore/rest-helpers";

import type { ExportUserDataResult } from "./index";

export async function exportUserData(idToken: string): Promise<ExportUserDataResult> {
  const userId = extractUidFromIdToken(idToken);

  if (!userId) {
    return {
      success: false,
      error: "User not authenticated.",
    };
  }

  try {
    const entries = await restGetDiaryEntriesByUser(idToken, userId);

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      userId,
      entryCount: entries.length,
      entries,
    };

    const filename = `food-diary-export-${new Date().toISOString().slice(0, 10)}.json`;

    return {
      success: true,
      jsonData: JSON.stringify(exportPayload, null, 2),
      filename,
    };
  } catch (err) {
    console.error("Error exporting user data:", err);
    return {
      success: false,
      error: "Failed to export data.",
    };
  }
}
