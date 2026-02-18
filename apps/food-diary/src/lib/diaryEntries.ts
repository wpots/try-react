import {
  createDiaryEntry,
  deleteDiaryEntryById,
  getDiaryEntryById,
  getDiaryEntriesByUser,
  updateDiaryEntry,
} from "@/lib/firestore/helpers";
import { getLocalDateKey } from "@/lib/getLocalDateKey";
import type {
  CreateDiaryEntryInput,
  DiaryEntry as FirestoreDiaryEntry,
  DiaryEntryBehavior,
  DiaryEntryCompany,
  DiaryEntryLocation,
  DiaryEntryType,
} from "@/lib/firestore/types";

export interface DiaryEntry {
  id: string;
  userId: string;
  entryType: DiaryEntryType;
  foodEaten: string;
  emotions: string[];
  location: DiaryEntryLocation;
  company: DiaryEntryCompany;
  description: string;
  behavior: DiaryEntryBehavior[];
  isBookmarked: boolean;
  date: string;
  time: string;
  locationOther?: string;
  companyOther?: string;
  behaviorOther?: string;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  imagePublicId?: string;
}

export interface SaveDiaryEntryInput {
  entryId?: string;
  userId: string;
  entryType?: DiaryEntryType;
  foodEaten: string;
  description?: string;
  emotions?: string[];
  location?: DiaryEntryLocation;
  company?: DiaryEntryCompany;
  behavior?: DiaryEntryBehavior[];
  isBookmarked?: boolean;
  date: string;
  time: string;
  locationOther?: string;
  companyOther?: string;
  behaviorOther?: string;
  imageUrl?: string;
  imagePublicId?: string;
}

function toClientEntry(entry: FirestoreDiaryEntry): DiaryEntry {
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
  };
}

export async function fetchDiaryEntries(userId: string): Promise<DiaryEntry[]> {
  const entries = await getDiaryEntriesByUser(userId);
  return entries.map((entry) => toClientEntry(entry));
}

export async function fetchDiaryEntryById(
  userId: string,
  entryId: string,
): Promise<DiaryEntry | null> {
  const entry = await getDiaryEntryById(entryId);

  if (!entry || entry.userId !== userId) {
    return null;
  }

  return toClientEntry(entry);
}

export async function saveDiaryEntry(input: SaveDiaryEntryInput): Promise<void> {
  const createInput: CreateDiaryEntryInput = {
    userId: input.userId,
    entryType: input.entryType ?? "moment",
    foodEaten: input.foodEaten,
    emotions: input.emotions,
    location: input.location,
    company: input.company,
    description: input.description ?? "",
    behavior: input.behavior,
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
    return;
  }

  await createDiaryEntry(createInput);
}

export async function deleteDiaryEntry(
  userId: string,
  entryId: string,
): Promise<boolean> {
  const normalizedUserId = userId.trim();
  const normalizedEntryId = entryId.trim();

  if (!normalizedUserId || !normalizedEntryId) {
    return false;
  }

  const entry = await getDiaryEntryById(normalizedEntryId);

  if (!entry || entry.userId !== normalizedUserId) {
    return false;
  }

  await deleteDiaryEntryById(normalizedEntryId);

  return true;
}
