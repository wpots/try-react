import type { EntryOverviewItem } from "../index";

export interface EntryGroup {
  date: string;
  entries: EntryOverviewItem[];
}

export function groupEntriesByDate(
  entries: EntryOverviewItem[],
): EntryGroup[] {
  const grouped = new Map<string, EntryOverviewItem[]>();

  for (const entry of entries) {
    const existingEntries = grouped.get(entry.date) ?? [];
    grouped.set(entry.date, [...existingEntries, entry]);
  }

  return Array.from(grouped.entries()).map(([date, dateEntries]) => ({
    date,
    entries: dateEntries,
  }));
}
