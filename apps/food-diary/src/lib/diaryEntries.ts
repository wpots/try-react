import {
  createDiaryEntry,
  getDiaryEntriesByUser,
} from "@/lib/firestore/helpers";
import type { CreateDiaryEntryInput } from "@/lib/firestore/types";

export interface DiaryEntry {
  id: string;
  userId: string;
  entryType: string;
  foodEaten: string;
  emotions: string[];
  location: string;
  company: string;
  description: string;
  behavior: string[];
  skippedMeal: boolean;
  date: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  imagePublicId?: string;
}

export interface SaveDiaryEntryInput {
  userId: string;
  foodEaten: string;
  description: string;
  date: string;
  time: string;
}

function toClientEntry(entry: Awaited<ReturnType<typeof getDiaryEntriesByUser>>[number]) {
  return {
    id: entry.entryId,
    userId: entry.userId,
    entryType: entry.entryType,
    foodEaten: entry.foodEaten,
    emotions: entry.emotions,
    location: entry.location,
    company: entry.company,
    description: entry.description,
    behavior: entry.behavior,
    skippedMeal: entry.skippedMeal,
    date: entry.date.toDate().toISOString().slice(0, 10),
    time: entry.time,
    createdAt: entry.createdAt.toDate().toISOString(),
    updatedAt: entry.updatedAt.toDate().toISOString(),
    imageUrl: entry.imageUrl,
    imagePublicId: entry.imagePublicId,
  };
}

export async function fetchDiaryEntries(userId: string): Promise<DiaryEntry[]> {
  const entries = await getDiaryEntriesByUser(userId);
  return entries.map((entry) => toClientEntry(entry));
}

export async function saveDiaryEntry(input: SaveDiaryEntryInput): Promise<void> {
  const createInput: CreateDiaryEntryInput = {
    userId: input.userId,
    foodEaten: input.foodEaten,
    description: input.description,
    date: input.date,
    time: input.time,
    entryType: "moment",
  };

  await createDiaryEntry(createInput);
}
