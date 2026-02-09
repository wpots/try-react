"use server";

import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface MergeGuestEntriesResult {
  success: boolean;
  mergedCount: number;
  error?: string;
}

export async function mergeGuestEntries(
  guestId: string,
  userId: string,
): Promise<MergeGuestEntriesResult> {
  if (!guestId || !userId) {
    return {
      success: false,
      mergedCount: 0,
      error: "Guest ID and user ID are required.",
    };
  }

  if (guestId === userId) {
    return {
      success: true,
      mergedCount: 0,
    };
  }

  try {
    const entriesReference = collection(db, "diaryEntries");
    const guestEntriesQuery = query(
      entriesReference,
      where("userId", "==", guestId),
    );
    const querySnapshot = await getDocs(guestEntriesQuery);

    const updatePromises = querySnapshot.docs.map((snapshot) =>
      updateDoc(doc(db, "diaryEntries", snapshot.id), {
        userId,
      }),
    );

    await Promise.all(updatePromises);

    return {
      success: true,
      mergedCount: querySnapshot.docs.length,
    };
  } catch (err) {
    console.error("Error merging guest entries:", err);
    return {
      success: false,
      mergedCount: 0,
      error: "Failed to merge guest entries.",
    };
  }
}
