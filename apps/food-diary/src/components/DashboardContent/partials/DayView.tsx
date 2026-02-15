import type { DiaryEntry } from "@/lib/diaryEntries";
import type { DashboardMood } from "../index";
import { DayEntryCard } from "./DayEntryCard";

interface DayViewProps {
  entries: DiaryEntry[];
  getEntryMoods: (entry: DiaryEntry) => DashboardMood[];
  isBookmarked: (entryId: string) => boolean;
  isExpanded: (entryId: string) => boolean;
  onEditEntry: (entryId: string) => void;
  onToggleBookmark: (entryId: string) => void;
  onToggleExpanded: (entryId: string) => void;
  translateDashboard: (key: string) => string;
  translateEntry: (key: string) => string;
}

export function DayView({
  entries,
  getEntryMoods,
  isBookmarked,
  isExpanded,
  onEditEntry,
  onToggleBookmark,
  onToggleExpanded,
  translateDashboard,
  translateEntry,
}: DayViewProps): React.JSX.Element {
  if (entries.length === 0) {
    return (
      <section
        className="rounded-ds-xl border border-ds-border-subtle bg-ds-surface p-ds-xxl"
      >
        <h2 className="font-ds-heading-xs text-ds-on-surface">
          {translateDashboard("day.emptyTitle")}
        </h2>
        <p className="mt-ds-s font-ds-body-base text-ds-on-surface-secondary">
          {translateDashboard("day.emptyBody")}
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-ds-m lg:grid-cols-2">
      {entries.map((entry) => (
        <DayEntryCard
          key={entry.id}
          entry={entry}
          entryMoods={getEntryMoods(entry)}
          isBookmarked={isBookmarked(entry.id)}
          isExpanded={isExpanded(entry.id)}
          onEditEntry={onEditEntry}
          onToggleBookmark={onToggleBookmark}
          onToggleExpanded={onToggleExpanded}
          translateDashboard={translateDashboard}
          translateEntry={translateEntry}
        />
      ))}
    </section>
  );
}
