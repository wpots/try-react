import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import type { DiaryEntry, User, UserAnalysisQuota } from "@/lib/firestore/types";
import {
  firestoreUserSchema,
  storedDiaryEntrySchema,
  userAnalysisQuotaSchema,
} from "@/lib/firestore/schemas";

function parseTimestampInput(value: string): Timestamp {
  const timestampDate = new Date(value);
  if (Number.isNaN(timestampDate.getTime())) {
    return Timestamp.now();
  }

  return Timestamp.fromDate(timestampDate);
}

function parseEntryDate(date: string, time: string): Timestamp {
  const combined = `${date}T${time}:00`;
  return parseTimestampInput(combined);
}

function getOptionalDiaryEntryFields(input: {
  locationOther?: string;
  companyOther?: string;
  behaviorOther?: string;
  imageUrl?: string;
  imagePublicId?: string;
}): Record<string, string> {
  const optionalFields: Record<string, string> = {};

  if (input.locationOther !== undefined) {
    optionalFields.locationOther = input.locationOther;
  }
  if (input.companyOther !== undefined) {
    optionalFields.companyOther = input.companyOther;
  }
  if (input.behaviorOther !== undefined) {
    optionalFields.behaviorOther = input.behaviorOther;
  }
  if (input.imageUrl !== undefined) {
    optionalFields.imageUrl = input.imageUrl;
  }
  if (input.imagePublicId !== undefined) {
    optionalFields.imagePublicId = input.imagePublicId;
  }

  return optionalFields;
}

function withLegacySkippedMealBehavior(
  behavior: DiaryEntry["behavior"],
  skippedMeal?: boolean,
): DiaryEntry["behavior"] {
  if (!skippedMeal || behavior.includes("skipped meal")) {
    return behavior;
  }

  return [...behavior, "skipped meal"];
}

export function mapUserSnapshot(snapshot: QueryDocumentSnapshot<DocumentData>): User {
  const parsed = firestoreUserSchema.parse({
    userId: snapshot.id,
    ...snapshot.data(),
  });

  return parsed;
}

export function mapDiaryEntrySnapshot(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): DiaryEntry {
  const parsed = storedDiaryEntrySchema.parse(snapshot.data());

  return {
    entryId: snapshot.id,
    userId: parsed.userId,
    entryType: parsed.entryType,
    foodEaten: parsed.foodEaten,
    emotions: parsed.emotions,
    location: parsed.location,
    company: parsed.company,
    description: parsed.description,
    behavior: withLegacySkippedMealBehavior(parsed.behavior, parsed.skippedMeal),
    isBookmarked: parsed.isBookmarked,
    date: parsed.date,
    time: parsed.time,
    locationOther: parsed.locationOther,
    companyOther: parsed.companyOther,
    behaviorOther: parsed.behaviorOther,
    imageUrl: parsed.imageUrl,
    imagePublicId: parsed.imagePublicId,
    createdAt: parsed.createdAt ?? Timestamp.now(),
    updatedAt: parsed.updatedAt ?? Timestamp.now(),
  };
}

export function mapUserAnalysisQuotaSnapshot(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): UserAnalysisQuota {
  const parsed = userAnalysisQuotaSchema.parse({
    userId: snapshot.id,
    ...snapshot.data(),
  });

  return parsed;
}

export function toDiaryEntryWriteData(input: {
  userId: string;
  entryType: string;
  foodEaten: string;
  emotions: string[];
  location: string;
  company: string;
  description: string;
  behavior: string[];
  isBookmarked: boolean;
  date: string;
  time: string;
  locationOther?: string;
  companyOther?: string;
  behaviorOther?: string;
  imageUrl?: string;
  imagePublicId?: string;
}): DocumentData {
  return {
    userId: input.userId,
    entryType: input.entryType,
    foodEaten: input.foodEaten,
    emotions: input.emotions,
    location: input.location,
    company: input.company,
    description: input.description,
    behavior: input.behavior,
    isBookmarked: input.isBookmarked,
    date: parseEntryDate(input.date, input.time),
    time: input.time,
    ...getOptionalDiaryEntryFields(input),
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}
