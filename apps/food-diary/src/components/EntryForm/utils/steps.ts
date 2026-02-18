import type { WizardEntry } from "../index";

export type WizardStepKey =
  | "entryType"
  | "datetime"
  | "location"
  | "company"
  | "behavior"
  | "foodEaten"
  | "emotions"
  | "description"
  | "bookmark"
  | "confirm";

export interface WizardStep {
  key: WizardStepKey;
  messageKey: string;
  optional?: boolean;
  condition?: (context: {
    entryType: WizardEntry["entryType"];
    behavior: WizardEntry["behavior"];
  }) => boolean;
}

export const STEPS: WizardStep[] = [
  { key: "datetime", messageKey: "coach.datetime" },
  { key: "entryType", messageKey: "coach.entryType" },
  { key: "location", messageKey: "coach.location" },
  { key: "company", messageKey: "coach.company" },
  {
    key: "behavior",
    messageKey: "coach.behavior",
    optional: true,
  },
  {
    key: "foodEaten",
    messageKey: "coach.foodEaten",
    condition: (context) =>
      context.entryType !== "moment" &&
      !context.behavior.includes("skipped meal"),
  },
  { key: "emotions", messageKey: "coach.emotions" },
  {
    key: "description",
    messageKey: "coach.description",
    optional: true,
  },
  { key: "bookmark", messageKey: "coach.bookmark" },
  { key: "confirm", messageKey: "coach.confirm" },
];
