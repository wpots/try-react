"use server";

import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { restGetDiaryEntriesByUser } from "@/lib/firestore/rest-helpers";

import type { ExportUserDataResult } from "./index";

export async function exportUserData(idToken: string): Promise<ExportUserDataResult> {
  try {
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken);
    const entries = await restGetDiaryEntriesByUser(idToken, decodedToken.uid);
    const userRecord = await getFirebaseAdminAuth().getUser(decodedToken.uid);

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      profile: {
        uid: userRecord.uid,
        displayName: userRecord.displayName ?? null,
        email: userRecord.email ?? null,
        createdAt: userRecord.metadata.creationTime ?? null,
      },
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
