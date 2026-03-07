"use server";

import { extractUidFromIdToken, restGetUserContext } from "@/lib/firestore/rest-helpers";

import type { FetchUserContextResult } from "./index";

export async function fetchUserContext(idToken: string): Promise<FetchUserContextResult> {
  const userId = extractUidFromIdToken(idToken);
  if (!userId) {
    return { success: false, error: "NOT_AUTHENTICATED" };
  }

  try {
    const context = await restGetUserContext(idToken, userId);
    return { success: true, context: context ?? {} };
  } catch (err) {
    console.error("Error fetching user context:", err);
    return { success: false, error: "Failed to fetch context." };
  }
}
