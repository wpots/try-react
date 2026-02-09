"use server";

import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export interface SaveDiaryEntryResult {
  success?: boolean;
  error?: string;
}

export async function saveDiaryEntry(
  _prevState: unknown,
  formData: FormData,
): Promise<SaveDiaryEntryResult> {
  const formUserId = formData.get("userId");
  const userIdFromForm = typeof formUserId === "string" ? formUserId : null;
  const userId = auth.currentUser?.uid ?? userIdFromForm;

  if (!userId) {
    console.error("User not authenticated.");
    return { error: "User not authenticated" };
  }

  try {
    await addDoc(collection(db, "diaryEntries"), {
      userId,
      foodEaten: formData.get("foodEaten"),
      description: formData.get("description"),
      date: formData.get("date"),
      time: formData.get("time"),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { error: "Failed to save entry" };
  }
}
