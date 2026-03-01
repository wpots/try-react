"use server";

import { extractUidFromIdToken, restCreateDiaryEntry, restUpdateDiaryEntry } from "@/lib/firestore/rest-helpers";
import { diaryEntryBehavior, diaryEntryCompany, diaryEntryLocations, diaryEntryTypes } from "@/lib/firestore/types";
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

export type SaveDiaryEntryErrorCode =
  | "NOT_AUTHENTICATED"
  | "VALIDATION_ERROR"
  | "UNKNOWN_ERROR";

export interface SaveDiaryEntryFromInputResult {
  success?: boolean;
  error?: string;
  errorCode?: SaveDiaryEntryErrorCode;
  field?: string;
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validationError(error: string, field: string): SaveDiaryEntryFromInputResult {
  return { error, errorCode: "VALIDATION_ERROR", field };
}

function validateInput(input: SaveDiaryEntryFromInputData): SaveDiaryEntryFromInputResult | null {
  if (!input.foodEaten?.trim()) return validationError("Food eaten is required", "foodEaten");
  if (!input.date?.trim()) return validationError("Date is required", "date");
  if (!input.time?.trim()) return validationError("Time is required", "time");

  const entryType = input.entryType ?? "moment";
  if (!diaryEntryTypes.includes(entryType as (typeof diaryEntryTypes)[number])) {
    return validationError("Invalid entry type", "entryType");
  }

  const { location, company, behavior } = input;
  if (location !== undefined && !diaryEntryLocations.includes(location as (typeof diaryEntryLocations)[number])) {
    return validationError("Invalid location", "location");
  }
  if (company !== undefined && !diaryEntryCompany.includes(company as (typeof diaryEntryCompany)[number])) {
    return validationError("Invalid company", "company");
  }
  if (behavior !== undefined) {
    const hasInvalid = behavior.some(b => !diaryEntryBehavior.includes(b as (typeof diaryEntryBehavior)[number]));
    if (hasInvalid) return validationError("Invalid behavior values", "behavior");
  }

  return null;
}

// ─── Server action ────────────────────────────────────────────────────────────

export async function saveDiaryEntryFromInput(
  input: SaveDiaryEntryFromInputData,
): Promise<SaveDiaryEntryFromInputResult> {
  const userId = extractUidFromIdToken(input.idToken);

  if (!userId) {
    return { error: "User not authenticated", errorCode: "NOT_AUTHENTICATED" };
  }

  const validationResult = validateInput(input);
  if (validationResult) return validationResult;

  try {
    const entryType = (input.entryType ?? "moment") as CreateDiaryEntryInput["entryType"];

    const createInput: CreateDiaryEntryInput = {
      userId,
      entryType,
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
    return { error: "Failed to save entry", errorCode: "UNKNOWN_ERROR" };
  }
}

