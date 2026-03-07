"use server";

import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { restGetUserCustomAffirmations } from "@/lib/firestore/rest-helpers";

import type { FetchCustomAffirmationsResult } from "./index";

export async function fetchCustomAffirmations(idToken: string): Promise<FetchCustomAffirmationsResult> {
  try {
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken);
    const affirmations = await restGetUserCustomAffirmations(idToken, decodedToken.uid);
    return { success: true, affirmations };
  } catch (err) {
    console.error("Error fetching custom affirmations:", err);
    return { success: false, error: "Failed to fetch affirmations." };
  }
}
