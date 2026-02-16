import type { DashboardViewMode } from "../index";
import { getEndOfWeek, getStartOfWeek } from "./dateUtils";

export function getHeroDateLabel(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    weekday: "long",
  }).format(date);
}

export function getPeriodLabel(
  viewMode: DashboardViewMode,
  selectedDate: Date,
  locale: string,
): string {
  if (viewMode === "day") {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(selectedDate);
  }

  if (viewMode === "week") {
    const weekStart = getStartOfWeek(selectedDate);
    const weekEnd = getEndOfWeek(selectedDate);
    const formatter = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
    });

    return `${formatter.format(weekStart)} - ${formatter.format(weekEnd)}`;
  }

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(selectedDate);
}
