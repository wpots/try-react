import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@repo/ui";

import type { DashboardViewMode } from "../index";

interface DashboardToolbarProps {
  canNavigateNext: boolean;
  onGoToToday: () => void;
  onNavigateNext: () => void;
  onNavigatePrevious: () => void;
  onSelectViewMode: (viewMode: DashboardViewMode) => void;
  periodLabel: string;
  translateDashboard: (key: string) => string;
  viewMode: DashboardViewMode;
}

const viewModeLabels: Record<DashboardViewMode, string> = {
  day: "view.day",
  month: "view.month",
  week: "view.week",
};

const viewModes: DashboardViewMode[] = ["day", "week", "month"];

export function DashboardToolbar({
  canNavigateNext,
  onGoToToday,
  onNavigateNext,
  onNavigatePrevious,
  onSelectViewMode,
  periodLabel,
  translateDashboard,
  viewMode,
}: DashboardToolbarProps): React.JSX.Element {
  return (
    <section className="grid gap-ds-s rounded-ds-xl border border-ds-border-subtle bg-ds-surface p-ds-m">
      <div className="flex flex-wrap items-center justify-between gap-ds-s">
        <div className="flex items-center gap-ds-xs">
          <button
            aria-label={translateDashboard("navigation.previous")}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-ds-full",
              "border border-ds-border-subtle text-ds-on-surface-secondary",
              "transition hover:border-ds-brand-primary",
              "hover:bg-ds-brand-primary-soft",
            )}
            onClick={onNavigatePrevious}
            type="button"
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </button>

          <button
            aria-label={translateDashboard("navigation.next")}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-ds-full",
              "border border-ds-border-subtle text-ds-on-surface-secondary",
              "transition hover:border-ds-brand-primary",
              "hover:bg-ds-brand-primary-soft",
              "disabled:cursor-not-allowed disabled:opacity-40",
            )}
            disabled={!canNavigateNext}
            onClick={onNavigateNext}
            type="button"
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <p className="font-ds-label-base text-ds-on-surface">{periodLabel}</p>

        <button
          className={cn(
            "rounded-ds-full border border-ds-border-subtle",
            "px-ds-m py-ds-xs font-ds-label-xs text-ds-on-surface-secondary",
            "transition hover:border-ds-brand-primary hover:bg-ds-brand-primary-soft",
          )}
          onClick={onGoToToday}
          type="button"
        >
          {translateDashboard("navigation.today")}
        </button>
      </div>

      <div className="flex flex-wrap gap-ds-xs">
        {viewModes.map((view) => {
          const isActive = viewMode === view;

          return (
            <button
              key={view}
              className={cn(
                "rounded-ds-full border px-ds-m py-ds-xs font-ds-label-xs",
                "transition",
                isActive
                  ? "border-ds-brand-primary bg-ds-brand-primary-soft"
                  : "border-ds-border-subtle text-ds-on-surface-secondary",
              )}
              onClick={() => onSelectViewMode(view)}
              type="button"
            >
              {translateDashboard(viewModeLabels[view])}
            </button>
          );
        })}
      </div>
    </section>
  );
}
