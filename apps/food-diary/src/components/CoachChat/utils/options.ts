import type {
  DiaryEntryBehavior,
  DiaryEntryCompany,
  DiaryEntryLocation,
  DiaryEntryType,
} from "@/lib/firestore/types";

interface SelectOptionDefinition<TValue extends string> {
  value: TValue;
  labelKey: string;
}

export const entryTypeOptions: SelectOptionDefinition<DiaryEntryType>[] = [
  { value: "breakfast", labelKey: "entryTypes.breakfast" },
  { value: "lunch", labelKey: "entryTypes.lunch" },
  { value: "dinner", labelKey: "entryTypes.dinner" },
  { value: "snack", labelKey: "entryTypes.snack" },
  { value: "moment", labelKey: "entryTypes.moment" },
];

export const locationOptions: SelectOptionDefinition<DiaryEntryLocation>[] = [
  { value: "home", labelKey: "locations.home" },
  { value: "work", labelKey: "locations.work" },
  { value: "restaurant", labelKey: "locations.restaurant" },
  { value: "friend's house", labelKey: "locations.friends" },
  { value: "on the road", labelKey: "locations.onTheRoad" },
  { value: "family event", labelKey: "locations.familyEvent" },
];

export const companyOptions: SelectOptionDefinition<DiaryEntryCompany>[] = [
  { value: "alone", labelKey: "company.alone" },
  { value: "partner", labelKey: "company.partner" },
  { value: "family", labelKey: "company.family" },
  { value: "friends", labelKey: "company.friends" },
  { value: "colleagues", labelKey: "company.colleagues" },
  { value: "kids", labelKey: "company.kids" },
];

export const behaviorOptions: SelectOptionDefinition<DiaryEntryBehavior>[] = [
  { value: "restricted", labelKey: "behaviors.restricted" },
  { value: "binged", labelKey: "behaviors.binged" },
  { value: "overate", labelKey: "behaviors.overate" },
  { value: "threw up", labelKey: "behaviors.threwUp" },
];

export function isEntryType(value: string): value is DiaryEntryType {
  return entryTypeOptions.some((option) => option.value === value);
}

export function isEntryLocation(value: string): value is DiaryEntryLocation {
  return locationOptions.some((option) => option.value === value);
}

export function isEntryCompany(value: string): value is DiaryEntryCompany {
  return companyOptions.some((option) => option.value === value);
}

export function areEntryBehaviors(
  values: string[],
): values is DiaryEntryBehavior[] {
  return values.every((value) =>
    behaviorOptions.some((option) => option.value === value),
  );
}
