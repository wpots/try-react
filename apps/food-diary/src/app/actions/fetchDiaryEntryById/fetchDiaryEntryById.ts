"use server";

import { getDiaryEntryById } from "@/lib/firestore/helpers";
import type { ClientDiaryEntry } from "@/lib/firestore/types";
import { getLocalDateKey } from "@/lib/getLocalDateKey";

export interface FetchDiaryEntryByIdResult {
  entry?: ClientDiaryEntry;
  error?: string;
}

export async function fetchDiaryEntryById(
  userId: string,
  entryId: string,
): Promise<FetchDiaryEntryByIdResult> {
  const normalizedUserId = typeof userId === "string" ? userId.trim() : "";
  const normalizedEntryId = typeof entryId === "string" ? entryId.trim() : "";

  if (!normalizedUserId || !normalizedEntryId) {
    return { error: "Missing userId or entryId" };
  }

  try {
    const entry = await getDiaryEntryById(normalizedEntryId);

    if (!entry || entry.userId !== normalizedUserId) {
      return { error: "Entry not found" };
    }

    return {
      entry: {
        id: entry.entryId,
        userId: entry.userId,
        entryType: entry.entryType,
        foodEaten: entry.foodEaten,
        emotions: entry.emotions,
        location: entry.location,
        company: entry.company,
        description: entry.description,
        behavior: entry.behavior,
        isBookmarked: entry.isBookmarked,
        date: getLocalDateKey(entry.date.toDate()),
        time: entry.time,
        locationOther: entry.locationOther,
        companyOther: entry.companyOther,
        behaviorOther: entry.behaviorOther,
        createdAt: entry.createdAt.toDate().toISOString(),
        updatedAt: entry.updatedAt.toDate().toISOString(),
        imageUrl: entry.imageUrl,
        imagePublicId: entry.imagePublicId,
      },
    };
  } catch (error) {
    console.error("Error fetching diary entry:", error);
    return { error: "Failed to fetch entry" };
  }
}
