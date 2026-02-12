export type WizardStepKey =
  | "entryType"
  | "datetime"
  | "skippedMeal"
  | "location"
  | "company"
  | "foodEaten"
  | "emotions"
  | "description"
  | "behavior"
  | "confirm";

export interface WizardStep {
  key: WizardStepKey;
  messageKey: string;
  optional?: boolean;
  condition?: (context: { entryType: string | null }) => boolean;
}

export const STEPS: WizardStep[] = [
  { key: "entryType", messageKey: "createEntry.coach.entryType" },
  { key: "datetime", messageKey: "createEntry.coach.datetime" },
  {
    key: "skippedMeal",
    messageKey: "createEntry.coach.skippedMeal",
    condition: (context) =>
      context.entryType === "breakfast" ||
      context.entryType === "lunch" ||
      context.entryType === "dinner",
  },
  { key: "location", messageKey: "createEntry.coach.location" },
  { key: "company", messageKey: "createEntry.coach.company" },
  {
    key: "foodEaten",
    messageKey: "createEntry.coach.foodEaten",
    condition: (context) => context.entryType !== "moment",
  },
  { key: "emotions", messageKey: "createEntry.coach.emotions" },
  {
    key: "description",
    messageKey: "createEntry.coach.description",
    optional: true,
  },
  {
    key: "behavior",
    messageKey: "createEntry.coach.behavior",
    optional: true,
  },
  { key: "confirm", messageKey: "createEntry.coach.confirm" },
];

