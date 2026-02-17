import type { DiaryEntry } from "@/lib/diaryEntries";

function toMinutes(timeValue: string): number {
  const [hoursText, minutesText] = timeValue.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
}

export function sortEntriesByTime(entries: DiaryEntry[]): DiaryEntry[] {
  return [...entries].sort((first, second) => {
    const firstMinutes = toMinutes(first.time);
    const secondMinutes = toMinutes(second.time);

    if (firstMinutes === secondMinutes) {
      return first.createdAt.localeCompare(second.createdAt);
    }

    return firstMinutes - secondMinutes;
  });
}

export function getEntryTypeLabel(
  entryType: string,
  translate: (key: string) => string,
): string {
  if (entryType === "breakfast") {
    return translate("entryTypes.breakfast");
  }

  if (entryType === "lunch") {
    return translate("entryTypes.lunch");
  }

  if (entryType === "dinner") {
    return translate("entryTypes.dinner");
  }

  if (entryType === "snack") {
    return translate("entryTypes.snack");
  }

  return translate("entryTypes.moment");
}

export function getEntryLocationLabel(
  entry: DiaryEntry,
  translate: (key: string) => string,
): string {
  if (entry.location === "home") {
    return translate("locations.home");
  }

  if (entry.location === "work") {
    return translate("locations.work");
  }

  if (entry.location === "restaurant") {
    return translate("locations.restaurant");
  }

  if (entry.location === "friend's house") {
    return translate("locations.friends");
  }

  if (entry.location === "on the road") {
    return translate("locations.onTheRoad");
  }

  if (entry.location === "party") {
    return translate("locations.party");
  }

  return entry.locationOther?.trim() || translate("locations.anders");
}

export function getEntryCompanyLabel(
  entry: DiaryEntry,
  translate: (key: string) => string,
): string {
  if (entry.company === "alone") {
    return translate("company.alone");
  }

  if (entry.company === "partner") {
    return translate("company.partner");
  }

  if (entry.company === "family") {
    return translate("company.family");
  }

  if (entry.company === "friends") {
    return translate("company.friends");
  }

  if (entry.company === "colleagues") {
    return translate("company.colleagues");
  }

  if (entry.company === "kids") {
    return translate("company.kids");
  }

  return entry.companyOther?.trim() || translate("company.anders");
}

export function getBehaviorLabel(
  behavior: string,
  translate: (key: string) => string,
  behaviorOther?: string,
): string {
  if (behavior === "restricted") {
    return translate("behaviors.restricted");
  }

  if (behavior === "binged") {
    return translate("behaviors.binged");
  }

  if (behavior === "overate") {
    return translate("behaviors.overate");
  }

  if (behavior === "threw up") {
    return translate("behaviors.threwUp");
  }

  if (behavior === "overexercised") {
    return translate("behaviors.overExercised");
  }

  return behaviorOther?.trim() || translate("behaviors.anders");
}
