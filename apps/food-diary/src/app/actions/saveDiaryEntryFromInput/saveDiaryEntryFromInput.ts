"use server";

import { extractUidFromIdToken, restCreateDiaryEntry, restUpdateDiaryEntry } from "@/lib/firestore/rest-helpers";
import type { CreateDiaryEntryInput } from "@/lib/firestore/types";

export interface SaveDiaryEntryFromInputData {
  entryId?: string;
  idToken: string;
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
  const userId = extractUidFromIdToken(input.idToken);

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

    const normalizedEntryId =
      typeof input.entryId === "string" && input.entryId.trim() && input.entryId.trim() !== "$undefined"
        ? input.entryId.trim()
        : undefined;

    if (normalizedEntryId) {
      await restUpdateDiaryEntry(input.idToken, normalizedEntryId, createInput);
    } else {
      await restCreateDiaryEntry(input.idToken, createInput);
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving diary entry:", error);
    return { error: "Failed to save entry" };
  }
}
