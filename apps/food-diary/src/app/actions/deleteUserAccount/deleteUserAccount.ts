"use server";

import { restDeleteUserData } from "@/lib/firestore/rest-helpers";
import { getFirebaseAdminAuth } from "@/lib/firebaseAdmin";

import type { DeleteUserAccountResult } from "./index";

export async function deleteUserAccount(idToken: string): Promise<DeleteUserAccountResult> {
  let deletedCount = 0;

  try {
    const decodedToken = await getFirebaseAdminAuth().verifyIdToken(idToken);
    deletedCount = await restDeleteUserData(idToken, decodedToken.uid);
    await getFirebaseAdminAuth().deleteUser(decodedToken.uid);

    return {
      success: true,
      deletedCount,
    };
  } catch (err) {
    console.error("Error deleting user account:", err);
    return {
      success: false,
      deletedCount,
      error: "Failed to delete account.",
    };
  }
}
