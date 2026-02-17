import type { DiaryEntry } from "@/lib/diaryEntries";
import type { EmotionCategory } from "@repo/ui";
import { emotions } from "@repo/ui";
import type {
  DashboardMood,
  DashboardMoodSummary,
  MoodZone,
} from "../index";

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

function getMoodConfig(emotionKey: string): EmotionMoodConfig {
  return EMOTION_MOOD[emotionKey] ?? FALLBACK_MOOD;
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
  const scores = entries.flatMap((entry) =>
    entry.emotions.map((emotionKey) => getMoodConfig(emotionKey).zone),
  );

  if (scores.length === 0) {
    return null;
  }

  const total = scores.reduce((sum, score) => sum + score, 0);
  const average = total / scores.length;

  return toMoodZone(Math.round(average));
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
