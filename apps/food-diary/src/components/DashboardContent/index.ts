import type { DiaryEntry } from "@/lib/diaryEntries";

export type DashboardViewMode = "day" | "week" | "month";
export type MoodZone = 1 | 2 | 3 | 4 | 5;

export interface DashboardMood {
  emoji: string;
  key: string;
  label: string;
  zone: MoodZone;
}

export interface DashboardMoodSummary {
  emoji: string;
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

export { DashboardContent } from "./DashboardContent";
