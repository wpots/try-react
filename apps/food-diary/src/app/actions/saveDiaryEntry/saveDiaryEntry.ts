"use server";

import { auth } from "@/lib/firebase";
import { createDiaryEntrySchema } from "@/lib/firestore/schemas";
import { createDiaryEntry } from "@/lib/firestore/helpers";
import type { SaveDiaryEntryResult } from "./index";

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
    const parsed = createDiaryEntrySchema.parse({
      userId,
      entryType: "moment",
      foodEaten:
        typeof formData.get("foodEaten") === "string"
          ? formData.get("foodEaten")
          : "",
      description:
        typeof formData.get("description") === "string"
          ? formData.get("description")
          : "",
      date:
        typeof formData.get("date") === "string"
          ? formData.get("date")
          : new Date().toISOString().slice(0, 10),
      time:
        typeof formData.get("time") === "string"
          ? formData.get("time")
          : "00:00",
    });

    await createDiaryEntry(parsed);

    return { success: true };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { error: "Failed to save entry" };
  }
}
