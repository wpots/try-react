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

type MoodMappingSource =
  | "exact-key"
  | "normalized-key"
  | "category-key"
  | "fallback";

interface ResolvedMoodConfig {
  config: EmotionMoodConfig;
  normalizedKey: string;
  source: MoodMappingSource;
}

interface AverageMoodDebugEntry {
  entryId: string;
  entryType: DiaryEntry["entryType"];
  date: string;
  time: string;
  emotionCount: number;
  emotions: Array<{
    key: string;
    normalizedKey: string;
    source: MoodMappingSource;
    zone: MoodZone;
  }>;
  entryAverage: number | null;
  weight: number;
  weightedContribution: number;
}

interface AverageMoodDebug {
  entries: AverageMoodDebugEntry[];
  weightedTotal: number;
  totalWeight: number;
  average: number | null;
  roundedAverage: number | null;
  zone: MoodZone | null;
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

function resolveMoodConfig(emotionKey: string): ResolvedMoodConfig {
  const key = emotionKey.trim();
  const mappedByKey = EMOTION_MOOD[key];

  if (mappedByKey) {
    return {
      config: mappedByKey,
      normalizedKey: key,
      source: "exact-key",
    };
  }

  const normalizedKey = key.toLowerCase();
  const mappedByNormalizedKey = EMOTION_MOOD[normalizedKey];

  if (mappedByNormalizedKey) {
    return {
      config: mappedByNormalizedKey,
      normalizedKey,
      source: "normalized-key",
    };
  }

  if (isEmotionCategory(normalizedKey)) {
    return {
      config: getCategoryMoodConfig(normalizedKey),
      normalizedKey,
      source: "category-key",
    };
  }

  return {
    config: FALLBACK_MOOD,
    normalizedKey,
    source: "fallback",
  };
}

function getMoodConfig(emotionKey: string): EmotionMoodConfig {
  return resolveMoodConfig(emotionKey).config;
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

function computeAverageMood(entries: DiaryEntry[]): AverageMoodDebug {
  let weightedTotal = 0;
  let totalWeight = 0;
  const debugEntries: AverageMoodDebugEntry[] = [];

  for (const entry of entries) {
    const resolvedEmotions = entry.emotions.map((emotionKey) => {
      const resolved = resolveMoodConfig(emotionKey);

      return {
        key: emotionKey,
        normalizedKey: resolved.normalizedKey,
        source: resolved.source,
        zone: resolved.config.zone,
      };
    });
    const emotionCount = resolvedEmotions.length;
    const weight = emotionCount > 0 ? getEntryWeight(emotionCount) : 0;
    const entryAverage =
      emotionCount > 0
        ? resolvedEmotions.reduce((sum, emotion) => sum + emotion.zone, 0) /
          emotionCount
        : null;
    const weightedContribution =
      entryAverage == null ? 0 : entryAverage * weight;

    if (weight > 0) {
      weightedTotal += weightedContribution;
      totalWeight += weight;
    }

    debugEntries.push({
      entryId: entry.id,
      entryType: entry.entryType,
      date: entry.date,
      time: entry.time,
      emotionCount,
      emotions: resolvedEmotions,
      entryAverage,
      weight,
      weightedContribution,
    });
  }

  if (totalWeight === 0) {
    return {
      entries: debugEntries,
      weightedTotal,
      totalWeight,
      average: null,
      roundedAverage: null,
      zone: null,
    };
  }

  const average = weightedTotal / totalWeight;
  const roundedAverage = roundMoodAverage(average);

  return {
    entries: debugEntries,
    weightedTotal,
    totalWeight,
    average,
    roundedAverage,
    zone: toMoodZone(roundedAverage),
  };
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

export function getAverageMoodDebug(entries: DiaryEntry[]): AverageMoodDebug {
  return computeAverageMood(entries);
}

export function getAverageMoodZone(entries: DiaryEntry[]): MoodZone | null {
  return computeAverageMood(entries).zone;
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
