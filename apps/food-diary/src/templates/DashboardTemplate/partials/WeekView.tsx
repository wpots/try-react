import { cn } from "@repo/ui";

import { MoodDot } from "./MoodDot";
import { getEntryTypeLabel } from "../utils/entryDisplayUtils";

import type { DashboardMood, DashboardWeekDay } from "../index";

interface WeekViewProps {
  days: DashboardWeekDay[];
  getEntryMoods: (entry: DashboardWeekDay["entries"][number]) => DashboardMood[];
  weekdayLabels: string[];
  translateDashboard: (key: string) => string;
  translateEntry: (key: string) => string;
}

function getTimeLabel(time: string): string {
  const value = time.trim();
  return value.length > 0 ? value : "--:--";
}

export function WeekView({
  days,
  getEntryMoods,
  weekdayLabels,
  translateDashboard,
  translateEntry,
}: WeekViewProps): React.JSX.Element {
  return (
    <section className="grid grid-cols-1 gap-ds-m md:grid-cols-7">
      {days.map((day, dayIndex) => {
        const dayLabel = weekdayLabels[dayIndex] ?? "";

        return (
          <article
            key={day.dateKey}
            className={cn(
              "rounded-ds-xl border border-ds-border-subtle bg-ds-surface p-ds-m",
              day.isToday && "border-ds-brand-primary bg-ds-brand-primary-soft/35",
            )}
          >
            <header className="mb-ds-s flex items-center justify-between">
              <p className="font-ds-label-base text-ds-on-surface">{dayLabel}</p>
              <p className="font-ds-body-sm text-ds-on-surface-secondary">
                {day.date.getDate()}
              </p>
            </header>

            {day.entries.length === 0 ? (
              <p className="font-ds-body-xs text-ds-on-surface-secondary">
                {translateDashboard("week.emptyDay")}
              </p>
            ) : (
              <div className="grid gap-ds-xs">
                {day.entries.map((entry) => {
                  const moods = getEntryMoods(entry).slice(0, 3);
                  const hasBehavior = entry.behavior.length > 0;

                  return (
                    <div
                      key={entry.id}
                      className={cn(
                        "rounded-ds-lg border border-ds-border-subtle",
                        "bg-ds-surface p-ds-s",
                        hasBehavior && "dashboard-behavior-left-border",
                        hasBehavior && "border-ds-warning-strong",
                      )}
                    >
                      <p className="font-ds-label-xs text-ds-on-surface-secondary">
                        {getTimeLabel(entry.time)}
                      </p>
                      <p className="font-ds-body-sm text-ds-on-surface">
                        {getEntryTypeLabel(entry.entryType, translateEntry)}
                      </p>

                      <div className="mt-ds-xs flex flex-wrap gap-ds-xs">
                        {moods.length > 0 ? (
                          moods.map((mood) => (
                            <MoodDot
                              key={`${entry.id}-${mood.key}`}
                              mood={mood}
                              size="week"
                            />
                          ))
                        ) : (
                          <p className="font-ds-body-xs text-ds-on-surface-secondary">
                            {translateDashboard("entry.noMood")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}
