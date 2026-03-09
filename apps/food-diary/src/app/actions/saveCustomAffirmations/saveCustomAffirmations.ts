"use server";

import { z } from "zod";

import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { restSaveUserCustomAffirmations } from "@/lib/firestore/rest-helpers";

import type { SaveCustomAffirmationsResult } from "./index";

const customAffirmationsSchema = z
  .array(z.string().trim().min(1).max(280))
  .max(20);

export async function saveCustomAffirmations(
  idToken: string,
  affirmations: string[],
): Promise<SaveCustomAffirmationsResult> {
  try {
    const parsed = customAffirmationsSchema.parse(affirmations);
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken);
    await restSaveUserCustomAffirmations(idToken, decodedToken.uid, parsed);
    return { success: true };
  } catch (err) {
    console.error("Error saving custom affirmations:", err);
    return { success: false, error: "Failed to save affirmations." };
  }
}
