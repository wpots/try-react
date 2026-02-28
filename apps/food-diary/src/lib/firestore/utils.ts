import { Timestamp } from "firebase/firestore";

import type { DiaryEntry } from "@/lib/firestore/types";

/**
 * Parses an entry date+time pair into a Firestore Timestamp.
 * Falls back to Timestamp.now() if the date string is invalid.
 */
export function parseEntryDate(date: string, time: string): Timestamp {
  const combined = `${date}T${time}:00`;
  const parsed = new Date(combined);

  if (Number.isNaN(parsed.getTime())) {
    return Timestamp.now();
  }

  return Timestamp.fromDate(parsed);
}

/**
 * Back-fills the legacy `skippedMeal` boolean field into the `behavior` array
 * so old entries are normalised without a migration.
 */
export function withLegacySkippedMealBehavior(
  behavior: DiaryEntry["behavior"],
  skippedMeal?: boolean,
): DiaryEntry["behavior"] {
  if (!skippedMeal || behavior.includes("skipped meal")) {
    return behavior;
  }

  return [...behavior, "skipped meal"];
}
