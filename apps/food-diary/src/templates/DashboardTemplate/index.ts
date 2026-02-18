import type { DiaryEntry } from "@/lib/diaryEntries";
import type { IconName } from "@repo/ui";

export type DashboardViewMode = "day" | "week" | "month";
export type MoodZone = 1 | 2 | 3 | 4 | 5;

interface EmojiMoodVisual {
  emoji: string;
}

interface IconMoodVisual {
  iconName: IconName;
}

export type DashboardMoodVisual = EmojiMoodVisual | IconMoodVisual;

export type DashboardMood = DashboardMoodVisual & {
  key: string;
  label: string;
  zone: MoodZone;
};

export interface DashboardMoodSummary {
  iconName: IconName;
  label: string;
  zone: MoodZone;
}

export interface DashboardMonthCell {
  date: Date;
  dateKey: string;
  entries: DiaryEntry[];
  isCurrentMonth: boolean;
  isFuture: boolean;
  isToday: boolean;
  moods: DashboardMood[];
}

export interface DashboardWeekDay {
  date: Date;
  dateKey: string;
  entries: DiaryEntry[];
  isFuture: boolean;
  isToday: boolean;
}

export { DashboardTemplate } from "./DashboardTemplate";
