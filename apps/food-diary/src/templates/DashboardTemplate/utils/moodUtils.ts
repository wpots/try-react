import type { DiaryEntry } from "@/lib/diaryEntries";
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

const ZONE_SUMMARY: Record<MoodZone, ZoneSummaryConfig> = {
  1: { emoji: "😣", labelKey: "moodZones.overwhelmed" },
  2: { emoji: "😟", labelKey: "moodZones.anxious" },
  3: { emoji: "😐", labelKey: "moodZones.balanced" },
  4: { emoji: "😌", labelKey: "moodZones.calm" },
  5: { emoji: "🙂", labelKey: "moodZones.happy" },
};

const EMOTION_MOOD: Record<string, EmotionMoodConfig> = {
  happy: { emoji: "😄", zone: 5 },
  hopeful: { emoji: "😊", zone: 5 },
  relieved: { emoji: "😌", zone: 5 },
  joyful: { emoji: "😁", zone: 5 },
  proud: { emoji: "🥲", zone: 5 },
  confident: { emoji: "😎", zone: 5 },
  calm: { emoji: "😌", zone: 4 },
  fine: { emoji: "🙂", zone: 4 },
  meh: { emoji: "😐", zone: 3 },
  tired: { emoji: "😴", zone: 3 },
  isolated: { emoji: "🤐", zone: 3 },
  insecure: { emoji: "🤔", zone: 2 },
  bored: { emoji: "🥱", zone: 3 },
  disappointed: { emoji: "😞", zone: 2 },
  sad: { emoji: "😢", zone: 2 },
  hurt: { emoji: "🤕", zone: 2 },
  concerned: { emoji: "😟", zone: 2 },
  lonely: { emoji: "😔", zone: 2 },
  annoyed: { emoji: "😤", zone: 2 },
  angry: { emoji: "😠", zone: 1 },
  stressed: { emoji: "😫", zone: 2 },
  anxious: { emoji: "😰", zone: 2 },
  ashamed: { emoji: "😖", zone: 1 },
  embarrassed: { emoji: "😳", zone: 2 },
  scared: { emoji: "😨", zone: 2 },
  nausea: { emoji: "🤢", zone: 2 },
};

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
