"use server";

import { z } from "zod";

import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";
import { restSaveUserContext } from "@/lib/firestore/rest-helpers";

import type { SaveUserContextResult } from "./index";

const saveUserContextInputSchema = z.object({
  company: z.string().trim().max(100).optional(),
  location: z.string().trim().max(100).optional(),
  behaviour: z.string().trim().max(280).optional(),
});

export async function saveUserContext(
  idToken: string,
  context: { company?: string; location?: string; behaviour?: string },
): Promise<SaveUserContextResult> {
  try {
    const parsed = saveUserContextInputSchema.parse(context);
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken);
    await restSaveUserContext(idToken, decodedToken.uid, parsed);

    return { success: true };
  } catch (err) {
    console.error("Error saving user context:", err);
    return { success: false, error: "Failed to save context." };
  }
}
