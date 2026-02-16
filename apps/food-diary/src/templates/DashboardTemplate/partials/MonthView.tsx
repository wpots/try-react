import { cn } from "@repo/ui";

import type { DashboardMonthCell, DashboardMood } from "../index";
import { getAverageMoodZone, getMoodSummary } from "../utils/moodUtils";
import { MoodDot } from "./MoodDot";

interface MonthViewProps {
  cells: DashboardMonthCell[];
  locale: string;
  onSelectDate: (date: Date) => void;
  translateDashboard: (key: string) => string;
  weekdayLabels: string[];
}

export function MonthView({
  cells,
  locale,
  onSelectDate,
  translateDashboard,
  weekdayLabels,
}: MonthViewProps): React.JSX.Element {
  const dayFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="rounded-ds-xl border border-ds-border-subtle bg-ds-surface p-ds-m">
      <div className="grid grid-cols-7 gap-ds-xs">
        {weekdayLabels.map((label, index) => (
          <p
            key={`${label}-${index}`}
            className="pb-ds-xs text-center font-ds-label-xs text-ds-on-surface-secondary"
          >
            {label}
          </p>
        ))}

        {cells.map((cell) => {
          const averageMoodSummary = getMoodSummary(
            getAverageMoodZone(cell.entries),
            translateDashboard,
          );
          const averageMood: DashboardMood | null = averageMoodSummary
            ? {
                emoji: averageMoodSummary.emoji,
                key: `${cell.dateKey}-average`,
                label: averageMoodSummary.label,
                zone: averageMoodSummary.zone,
              }
            : null;
          const ariaLabel = `${dayFormatter.format(cell.date)}.`;

          return (
            <button
              key={cell.dateKey}
              aria-label={ariaLabel}
              className={cn(
                "relative flex min-h-20 flex-col rounded-ds-lg border",
                "border-ds-border-subtle bg-ds-surface p-ds-xs text-left",
                "transition hover:border-ds-brand-primary",
                "sm:min-h-24 sm:p-ds-s",
                cell.isToday &&
                  "border-2 border-ds-brand-primary bg-ds-brand-primary-soft/40",
                !cell.isCurrentMonth && "opacity-40",
                cell.isFuture && "cursor-not-allowed",
              )}
              disabled={cell.isFuture}
              onClick={() => onSelectDate(cell.date)}
              type="button"
            >
              <span className="font-ds-label-xs text-ds-on-surface-secondary">
                {cell.date.getDate()}
              </span>

              <span className="mt-ds-xs flex flex-wrap gap-ds-xxs sm:gap-ds-xs">
                {averageMood ? <MoodDot mood={averageMood} size="month" /> : null}
              </span>

              {cell.entries.length > 0 ? (
                <span
                  className={cn(
                    "absolute bottom-ds-xs right-ds-xs rounded-ds-full",
                    "bg-ds-brand-primary-soft px-ds-xs py-ds-xxs",
                    "font-ds-body-xs text-ds-brand-primary-strong",
                  )}
                >
                  {cell.entries.length}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {cells.length === 0 ? (
        <p className="mt-ds-m font-ds-body-base text-ds-on-surface-secondary">
          {translateDashboard("month.empty")}
        </p>
      ) : null}
    </section>
  );
}
