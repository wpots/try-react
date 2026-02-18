import { Timestamp } from "firebase/firestore";
import { z } from "zod";

import {
  diaryEntryBehavior,
  diaryEntryCompany,
  diaryEntryLocations,
  diaryEntryTypes,
} from "@/lib/firestore/types";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;
const dateKeyPattern = /^\d{4}-\d{2}-\d{2}$/;

function parseTimestamp(value: unknown): Timestamp {
  if (value instanceof Timestamp) {
    return value;
  }

  if (typeof value === "string" || value instanceof Date) {
    const candidateDate = new Date(value);
    if (!Number.isNaN(candidateDate.getTime())) {
      return Timestamp.fromDate(candidateDate);
    }
  }

  return Timestamp.now();
}

export const firestoreUserSchema = z.object({
  userId: z.string().min(1),
  email: z.string().email().optional(),
  displayName: z.string().min(1).optional(),
  photoURL: z.string().url().optional(),
  createdAt: z.instanceof(Timestamp),
  lastLoginAt: z.instanceof(Timestamp),
});

export const firestoreDiaryEntrySchema = z.object({
  entryId: z.string().min(1),
  userId: z.string().min(1),
  entryType: z.enum(diaryEntryTypes),
  foodEaten: z.string(),
  emotions: z.array(z.string()),
  location: z.enum(diaryEntryLocations),
  company: z.enum(diaryEntryCompany),
  description: z.string(),
  behavior: z.array(z.enum(diaryEntryBehavior)),
  isBookmarked: z.boolean().default(false),
  date: z.instanceof(Timestamp),
  time: z.string().regex(timePattern),
  locationOther: z.string().optional(),
  companyOther: z.string().optional(),
  behaviorOther: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imagePublicId: z.string().min(1).optional(),
  createdAt: z.instanceof(Timestamp),
  updatedAt: z.instanceof(Timestamp),
});

export const storedDiaryEntrySchema = z.object({
  userId: z.string().min(1),
  entryType: z.enum(diaryEntryTypes).default("moment"),
  foodEaten: z.string().default(""),
  emotions: z.array(z.string()).default([]),
  location: z.enum(diaryEntryLocations).default("home"),
  company: z.enum(diaryEntryCompany).default("alone"),
  description: z.string().default(""),
  behavior: z.array(z.enum(diaryEntryBehavior)).default([]),
  skippedMeal: z.boolean().optional(),
  isBookmarked: z.boolean().default(false),
  date: z
    .union([z.instanceof(Timestamp), z.string(), z.date()])
    .transform((value) => parseTimestamp(value)),
  time: z.string().regex(timePattern).default("00:00"),
  locationOther: z.string().optional(),
  companyOther: z.string().optional(),
  behaviorOther: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imagePublicId: z.string().min(1).optional(),
  createdAt: z
    .union([z.instanceof(Timestamp), z.string(), z.date()])
    .transform((value) => parseTimestamp(value))
    .optional(),
  updatedAt: z
    .union([z.instanceof(Timestamp), z.string(), z.date()])
    .transform((value) => parseTimestamp(value))
    .optional(),
});

export const createDiaryEntrySchema = z.object({
  userId: z.string().min(1),
  entryType: z.enum(diaryEntryTypes).default("moment"),
  foodEaten: z.string(),
  emotions: z.array(z.string()).default([]),
  location: z.enum(diaryEntryLocations).default("home"),
  company: z.enum(diaryEntryCompany).default("alone"),
  description: z.string().default(""),
  behavior: z.array(z.enum(diaryEntryBehavior)).default([]),
  isBookmarked: z.boolean().default(false),
  date: z.string().regex(dateKeyPattern),
  time: z.string().regex(timePattern),
  locationOther: z.string().optional(),
  companyOther: z.string().optional(),
  behaviorOther: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imagePublicId: z.string().min(1).optional(),
});

export const userAnalysisQuotaSchema = z.object({
  userId: z.string().min(1),
  date: z.string().regex(dateKeyPattern),
  count: z.number().int().min(0).max(3),
  lastReset: z.instanceof(Timestamp),
  lastAnalysisAt: z.instanceof(Timestamp).optional(),
});

export type FirestoreUserSchema = z.infer<typeof firestoreUserSchema>;
export type FirestoreDiaryEntrySchema = z.infer<typeof firestoreDiaryEntrySchema>;
export type StoredDiaryEntrySchema = z.infer<typeof storedDiaryEntrySchema>;
export type CreateDiaryEntrySchema = z.infer<typeof createDiaryEntrySchema>;
export type UserAnalysisQuotaSchema = z.infer<typeof userAnalysisQuotaSchema>;
