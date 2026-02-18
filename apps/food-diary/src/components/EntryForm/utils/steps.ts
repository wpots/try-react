import { emotions as emotionDefinitions } from "@repo/ui";

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

export type CoachReplyKey =
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
  replyKey?: CoachReplyKey;
  optional?: boolean;
  condition?: (context: {
    entryType: WizardEntry["entryType"];
    behavior: WizardEntry["behavior"];
    emotions: WizardEntry["emotions"];
  }) => boolean;
}

const MIN_NEGATIVE_EMOTIONS_FOR_BOOKMARK = 3;
const negativeEmotionKeys = new Set(
  emotionDefinitions
    .filter((emotion) => emotion.category === "negative")
    .map((emotion) => emotion.key),
);

function getNegativeEmotionCount(
  selectedEmotions: WizardEntry["emotions"],
): number {
  return selectedEmotions.reduce((count, emotion) => {
    if (negativeEmotionKeys.has(emotion)) {
      return count + 1;
    }

    return count;
  }, 0);
}

function shouldAskBookmarkQuestion(context: {
  behavior: WizardEntry["behavior"];
  emotions: WizardEntry["emotions"];
}): boolean {
  return (
    context.behavior.length > 0 ||
    getNegativeEmotionCount(context.emotions) >=
      MIN_NEGATIVE_EMOTIONS_FOR_BOOKMARK
  );
}

export const STEPS: WizardStep[] = [
  { key: "datetime", messageKey: "coach.datetime", replyKey: "datetime" },
  { key: "entryType", messageKey: "coach.entryType", replyKey: "entryType" },
  { key: "location", messageKey: "coach.location", replyKey: "location" },
  { key: "company", messageKey: "coach.company", replyKey: "company" },
  {
    key: "behavior",
    messageKey: "coach.behavior",
    replyKey: "behavior",
    optional: true,
  },
  {
    key: "foodEaten",
    messageKey: "coach.foodEaten",
    replyKey: "foodEaten",
    condition: (context) =>
      context.entryType !== "moment" &&
      !context.behavior.includes("skipped meal"),
  },
  { key: "emotions", messageKey: "coach.emotions", replyKey: "emotions" },
  {
    key: "description",
    messageKey: "coach.description",
    replyKey: "description",
    optional: true,
  },
  {
    key: "bookmark",
    messageKey: "coach.bookmark",
    replyKey: "bookmark",
    condition: shouldAskBookmarkQuestion,
  },
  { key: "confirm", messageKey: "coach.confirm", replyKey: "confirm" },
];
