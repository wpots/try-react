import { ChevronDown, Pencil, ClockIcon, Bookmark } from "lucide-react";
import { cn } from "@repo/ui";

import { FormButton } from "@/components/FormButton";
import type { DiaryEntry } from "@/lib/diaryEntries";
import type { DashboardMood } from "../index";
import {
  getBehaviorLabel,
  getEntryCompanyLabel,
  getEntryLocationLabel,
  getEntryTypeLabel,
} from "../utils/entryDisplayUtils";
import { MoodBadge } from "./MoodBadge";

interface DayEntryCardProps {
  entry: DiaryEntry;
  entryMoods: DashboardMood[];
  isBookmarked: boolean;
  isExpanded: boolean;
  onEditEntry: (entryId: string) => void;
  onToggleBookmark: (entryId: string) => void;
  onToggleExpanded: (entryId: string) => void;
  translateDashboard: (key: string) => string;
  translateEntry: (key: string) => string;
}

function getTimeLabel(entry: DiaryEntry): string {
  const time = entry.time?.trim();

  if (!time) {
    return "--:--";
  }

  return time;
}

export function DayEntryCard({
  entry,
  entryMoods,
  isBookmarked,
  isExpanded,
  onEditEntry,
  onToggleBookmark,
  onToggleExpanded,
  translateDashboard,
  translateEntry,
}: DayEntryCardProps): React.JSX.Element {
  const hasBehavior = entry.behavior.length > 0;
  const locationLabel = getEntryLocationLabel(entry, translateEntry);
  const companyLabel = getEntryCompanyLabel(entry, translateEntry);
  const entryTypeLabel = getEntryTypeLabel(entry.entryType, translateEntry);
  const behaviorLabels = entry.behavior.map(behavior =>
    getBehaviorLabel(behavior, translateEntry, entry.behaviorOther),
  );

  return (
    <article
      className={cn(
        "rounded-ds-xl border border-ds-border-subtle bg-ds-surface",
        "p-ds-l shadow-ds-sm transition-colors",
        hasBehavior && "border-b-4 border-ds-warning-strong bg-ds-warning/10",
      )}
    >
      <div className="flex items-start justify-between gap-ds-m">
        <h3 className="font-ds-heading-xs text-ds-on-surface flex items-center gap-ds-s">
          {entryTypeLabel}
          <span className="text-ds-brand-neutral flex items-center gap-ds-xs">
            <ClockIcon />
            {getTimeLabel(entry)}
          </span>
        </h3>

        <div className="flex items-center gap-ds-xs">
          <FormButton
            aria-label={
              isBookmarked
                ? translateDashboard("entry.removeBookmark")
                : translateDashboard("entry.addBookmark")
            }
            variant="iconOnly"
            className={cn(
              "hover:border-ds-warning-strong hover:bg-ds-warning/20",
              isBookmarked && "border-ds-warning-strong bg-ds-warning",
              isBookmarked && "text-ds-on-warning",
            )}
            onClick={() => onToggleBookmark(entry.id)}
            type="button"
          >
            <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} aria-hidden="true" />
          </FormButton>

          <FormButton
            aria-label={translateDashboard("entry.edit")}
            variant="iconOnly"
            className={cn(
              "hover:border-ds-brand-primary",
              "hover:bg-ds-brand-primary-soft",
            )}
            onClick={() => onEditEntry(entry.id)}
            type="button"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </FormButton>

          <FormButton
            aria-label={isExpanded ? translateDashboard("entry.collapse") : translateDashboard("entry.expand")}
            variant="iconOnly"
            className={cn(
              "hover:border-ds-brand-primary",
              "hover:bg-ds-brand-primary-soft",
            )}
            onClick={() => onToggleExpanded(entry.id)}
            type="button"
          >
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
              aria-hidden="true"
            />
          </FormButton>
        </div>
      </div>

      <div className="mt-ds-m flex flex-wrap gap-ds-xs">
        {entryMoods.length > 0 ? (
          entryMoods.map(mood => <MoodBadge key={`${entry.id}-${mood.key}`} mood={mood} />)
        ) : (
          <p className="font-ds-body-sm text-ds-on-surface-secondary">{translateDashboard("entry.noMood")}</p>
        )}
      </div>

      {isExpanded ? (
        <div className="mt-ds-l grid gap-ds-m">
          <section>
            <p className="font-ds-label-sm text-ds-on-surface-secondary">{translateDashboard("entry.whatAte")}</p>
            <p className="font-ds-body-base text-ds-on-surface">
              {entry.foodEaten.trim() || translateDashboard("entry.emptyField")}
            </p>
          </section>

          <section className="grid gap-ds-xs sm:grid-cols-2">
            <div>
              <p className="font-ds-label-sm text-ds-on-surface-secondary">{translateDashboard("entry.location")}</p>
              <p className="font-ds-body-base text-ds-on-surface">{locationLabel}</p>
            </div>
            <div>
              <p className="font-ds-label-sm text-ds-on-surface-secondary">{translateDashboard("entry.company")}</p>
              <p className="font-ds-body-base text-ds-on-surface">{companyLabel}</p>
            </div>
          </section>

          <section>
            <p className="font-ds-label-sm text-ds-on-surface-secondary">{translateDashboard("entry.notes")}</p>
            <p className="font-ds-body-base text-ds-on-surface">
              {entry.description.trim() || translateDashboard("entry.emptyField")}
            </p>
          </section>

          {hasBehavior ? (
            <section className={cn("rounded-ds-lg border border-ds-warning-strong bg-ds-warning/20", "p-ds-m")}>
              <p className="font-ds-label-base text-ds-on-warning">{translateDashboard("entry.behaviorTitle")}</p>
              <p className="mt-ds-xs font-ds-body-sm text-ds-on-warning">
                {translateDashboard("entry.behaviorNotice")}
              </p>
              <p className="mt-ds-xs font-ds-body-sm text-ds-on-warning">{behaviorLabels.join(", ")}</p>
            </section>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
