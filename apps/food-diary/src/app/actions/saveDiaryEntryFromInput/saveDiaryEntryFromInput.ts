"use server";

import { createDiaryEntry, updateDiaryEntry } from "@/lib/firestore/helpers";
import type { CreateDiaryEntryInput } from "@/lib/firestore/types";

export interface SaveDiaryEntryFromInputData {
  entryId?: string;
  userId: string;
  entryType?: string;
  foodEaten: string;
  description?: string;
  emotions?: string[];
  location?: string;
  company?: string;
  behavior?: string[];
  isBookmarked?: boolean;
  date: string;
  time: string;
  locationOther?: string;
  companyOther?: string;
  behaviorOther?: string;
  imageUrl?: string;
  imagePublicId?: string;
}

export interface SaveDiaryEntryFromInputResult {
  success?: boolean;
  error?: string;
}

export async function saveDiaryEntryFromInput(
  input: SaveDiaryEntryFromInputData,
): Promise<SaveDiaryEntryFromInputResult> {
  const userId = typeof input.userId === "string" ? input.userId.trim() : "";

  if (!userId) {
    return { error: "User not authenticated" };
  }

  try {
    const createInput: CreateDiaryEntryInput = {
      userId,
      entryType: (input.entryType as CreateDiaryEntryInput["entryType"]) ?? "moment",
      foodEaten: input.foodEaten,
      emotions: input.emotions,
      location: input.location as CreateDiaryEntryInput["location"],
      company: input.company as CreateDiaryEntryInput["company"],
      description: input.description ?? "",
      behavior: input.behavior as CreateDiaryEntryInput["behavior"],
      isBookmarked: input.isBookmarked ?? false,
      date: input.date,
      time: input.time,
      locationOther: input.locationOther,
      companyOther: input.companyOther,
      behaviorOther: input.behaviorOther,
      imageUrl: input.imageUrl,
      imagePublicId: input.imagePublicId,
    };

    if (input.entryId) {
      await updateDiaryEntry(input.entryId, createInput);
    } else {
      await createDiaryEntry(createInput);
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving diary entry:", error);
    return { error: "Failed to save entry" };
  }
}
