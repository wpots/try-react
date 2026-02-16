import type { DashboardViewMode } from "../index";

export interface MonthGridDate {
  date: Date;
  isCurrentMonth: boolean;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function compareDays(a: Date, b: Date): number {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function fromDateKey(dateKey: string): Date | null {
  const parts = dateKey.split("-").map((part) => Number(part));
  const [year, month, day] = parts;

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  const parsed = new Date(year, month - 1, day);

  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== month - 1 ||
    parsed.getDate() !== day
  ) {
    return null;
  }

  return parsed;
}

export function addDays(date: Date, amount: number): Date {
  const next = startOfDay(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function addMonths(date: Date, amount: number): Date {
  const source = startOfDay(date);
  const day = source.getDate();

  source.setDate(1);
  source.setMonth(source.getMonth() + amount);

  const maxDay = new Date(
    source.getFullYear(),
    source.getMonth() + 1,
    0,
  ).getDate();

  source.setDate(Math.min(day, maxDay));

  return source;
}

export function getStartOfWeek(date: Date): Date {
  const dayIndex = startOfDay(date).getDay();
  const offsetToMonday = (dayIndex + 6) % 7;

  return addDays(date, -offsetToMonday);
}

export function getStartOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getEndOfWeek(date: Date): Date {
  return addDays(getStartOfWeek(date), 6);
}

export function getWeekDates(anchorDate: Date): Date[] {
  const start = getStartOfWeek(anchorDate);

  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function getMonthGridDates(anchorDate: Date): MonthGridDate[] {
  const monthStart = getStartOfMonth(anchorDate);
  const monthEnd = new Date(
    monthStart.getFullYear(),
    monthStart.getMonth() + 1,
    0,
  );
  const gridStart = getStartOfWeek(monthStart);
  const gridEnd = addDays(getStartOfWeek(monthEnd), 6);
  const cells: MonthGridDate[] = [];

  let cursor = gridStart;

  while (compareDays(cursor, gridEnd) <= 0) {
    cells.push({
      date: cursor,
      isCurrentMonth: cursor.getMonth() === monthStart.getMonth(),
    });
    cursor = addDays(cursor, 1);
  }

  while (cells.length < 35) {
    const nextDate = addDays(cells[cells.length - 1]?.date ?? gridEnd, 1);

    cells.push({
      date: nextDate,
      isCurrentMonth: nextDate.getMonth() === monthStart.getMonth(),
    });
  }

  return cells;
}

export function canNavigateForward(
  viewMode: DashboardViewMode,
  anchorDate: Date,
  today: Date,
): boolean {
  const currentDay = startOfDay(today);

  if (viewMode === "day") {
    return compareDays(addDays(anchorDate, 1), currentDay) <= 0;
  }

  if (viewMode === "week") {
    const nextWeekStart = getStartOfWeek(addDays(anchorDate, 7));
    const todayWeekStart = getStartOfWeek(currentDay);

    return compareDays(nextWeekStart, todayWeekStart) <= 0;
  }

  const nextMonthStart = getStartOfMonth(addMonths(anchorDate, 1));
  const todayMonthStart = getStartOfMonth(currentDay);

  return compareDays(nextMonthStart, todayMonthStart) <= 0;
}

export function navigatePeriod(
  viewMode: DashboardViewMode,
  anchorDate: Date,
  direction: "next" | "prev",
): Date {
  const sign = direction === "next" ? 1 : -1;

  if (viewMode === "day") {
    return addDays(anchorDate, sign);
  }

  if (viewMode === "week") {
    return addDays(anchorDate, sign * 7);
  }

  return addMonths(anchorDate, sign);
}

export function isFutureDay(date: Date, today: Date): boolean {
  return compareDays(date, today) > 0;
}

export function isSameDay(a: Date, b: Date): boolean {
  return compareDays(a, b) === 0;
}
