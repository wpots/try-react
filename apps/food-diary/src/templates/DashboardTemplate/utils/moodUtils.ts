import { emotions } from "@repo/ui";

import type { DiaryEntry } from "@/lib/diaryEntries";

import type {
  DashboardMood,
  DashboardMoodSummary,
  MoodZone,
} from "../index";
import type { EmotionCategory } from "@repo/ui";

interface EmotionMoodConfig {
  emoji: string;
  zone: MoodZone;
}

interface ZoneSummaryConfig {
  emoji: string;
  labelKey: string;
}

const FALLBACK_MOOD: EmotionMoodConfig = {
  emoji: "😐",
  zone: 3,
};

const CATEGORY_ZONE: Record<EmotionCategory, MoodZone> = {
  positive: 5,
  optimistic: 4,
  neutral: 3,
  worried: 2,
  negative: 1,
};

const ZONE_SUMMARY: Record<MoodZone, ZoneSummaryConfig> = {
  1: { emoji: "😣", labelKey: "moodZones.negative" },
  2: { emoji: "😟", labelKey: "moodZones.worried" },
  3: { emoji: "😐", labelKey: "moodZones.neutral" },
  4: { emoji: "😌", labelKey: "moodZones.optimistic" },
  5: { emoji: "🙂", labelKey: "moodZones.positive" },
};

function createEmotionMoodMap(): Record<string, EmotionMoodConfig> {
  const moodMap: Record<string, EmotionMoodConfig> = {};

  for (const emotion of emotions) {
    moodMap[emotion.key] = {
      emoji: emotion.emoji,
      zone: CATEGORY_ZONE[emotion.category],
    };
  }

  return moodMap;
}

const EMOTION_MOOD = createEmotionMoodMap();

function toMoodZone(value: number): MoodZone {
  if (value <= 1) {
    return 1;
  }

  if (value === 2) {
    return 2;
  }

  if (value === 3) {
    return 3;
  }

  if (value === 4) {
    return 4;
  }

  return 5;
}

function isEmotionCategory(value: string): value is EmotionCategory {
  return (
    value === "positive" ||
    value === "optimistic" ||
    value === "neutral" ||
    value === "worried" ||
    value === "negative"
  );
}

function getCategoryMoodConfig(category: EmotionCategory): EmotionMoodConfig {
  const zone = CATEGORY_ZONE[category];

  return {
    emoji: ZONE_SUMMARY[zone].emoji,
    zone,
  };
}

function getMoodConfig(emotionKey: string): EmotionMoodConfig {
  const key = emotionKey.trim();
  const mappedByKey = EMOTION_MOOD[key];

  if (mappedByKey) {
    return mappedByKey;
  }

  const normalizedKey = key.toLowerCase();
  const mappedByNormalizedKey = EMOTION_MOOD[normalizedKey];

  if (mappedByNormalizedKey) {
    return mappedByNormalizedKey;
  }

  if (isEmotionCategory(normalizedKey)) {
    return getCategoryMoodConfig(normalizedKey);
  }

  return FALLBACK_MOOD;
}

function getEntryWeight(emotionCount: number): number {
  return Math.max(emotionCount, 0);
}

function roundMoodAverage(value: number): number {
  const flooredValue = Math.floor(value);
  const decimalPart = value - flooredValue;

  if (decimalPart <= 0.5) {
    return flooredValue;
  }

  return flooredValue + 1;
}

function getEntryAverageMoodScore(entry: DiaryEntry): number | null {
  if (entry.emotions.length === 0) {
    return null;
  }

  const total = entry.emotions.reduce((sum, emotionKey) => {
    return sum + getMoodConfig(emotionKey).zone;
  }, 0);

  return total / entry.emotions.length;
}

function computeAverageMood(entries: DiaryEntry[]): MoodZone | null {
  let weightedTotal = 0;
  let totalWeight = 0;

  for (const entry of entries) {
    const entryAverage = getEntryAverageMoodScore(entry);

    if (entryAverage == null) {
      continue;
    }

    const entryWeight = getEntryWeight(entry.emotions.length);
    weightedTotal += entryAverage * entryWeight;
    totalWeight += entryWeight;
  }

  if (totalWeight === 0) {
    return null;
  }

  const average = weightedTotal / totalWeight;
  return toMoodZone(roundMoodAverage(average));
}

export function getEntryMoods(
  entry: DiaryEntry,
  resolveLabel: (emotionKey: string) => string,
): DashboardMood[] {
  return entry.emotions.map((emotionKey) => {
    const mood = getMoodConfig(emotionKey);

    return {
      emoji: mood.emoji,
      key: emotionKey,
      label: resolveLabel(emotionKey),
      zone: mood.zone,
    };
  });
}

export function getAverageMoodZone(entries: DiaryEntry[]): MoodZone | null {
  return computeAverageMood(entries);
}

export function getMoodSummary(
  zone: MoodZone | null,
  resolveLabel: (labelKey: string) => string,
): DashboardMoodSummary | null {
  if (zone == null) {
    return null;
  }

  const summary = ZONE_SUMMARY[zone];

  return {
    emoji: summary.emoji,
    label: resolveLabel(summary.labelKey),
    zone,
  };
}
