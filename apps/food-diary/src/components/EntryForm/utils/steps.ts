import type { WizardEntry } from "../index";

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
  | "bookmark"
  | "confirm";

export interface WizardStep {
  key: WizardStepKey;
  messageKey: string;
  optional?: boolean;
  condition?: (context: { entryType: WizardEntry["entryType"] }) => boolean;
}

export const STEPS: WizardStep[] = [
  { key: "datetime", messageKey: "coach.datetime" },
  { key: "entryType", messageKey: "coach.entryType" },
  {
    key: "skippedMeal",
    messageKey: "coach.skippedMeal",
    condition: (context) =>
      context.entryType === "breakfast" ||
      context.entryType === "lunch" ||
      context.entryType === "dinner",
  },
  { key: "location", messageKey: "coach.location" },
  { key: "company", messageKey: "coach.company" },
  {
    key: "foodEaten",
    messageKey: "coach.foodEaten",
    condition: (context) => context.entryType !== "moment",
  },
  { key: "emotions", messageKey: "coach.emotions" },
  {
    key: "description",
    messageKey: "coach.description",
    optional: true,
  },
  {
    key: "behavior",
    messageKey: "coach.behavior",
    optional: true,
  },
  { key: "bookmark", messageKey: "coach.bookmark" },
  { key: "confirm", messageKey: "coach.confirm" },
];
