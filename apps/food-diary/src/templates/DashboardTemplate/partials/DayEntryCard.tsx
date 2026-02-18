import {
  ChevronDown,
  Pencil,
  ClockIcon,
  MapPin,
  Trash2,
  Users,
} from "lucide-react";
import { Card, cn, Typography } from "@repo/ui";

import { BookmarkToggleButton } from "@/components/BookmarkToggleButton";
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
  isDeleting: boolean;
  isExpanded: boolean;
  onDeleteEntry: (entryId: string) => void;
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
  isDeleting,
  isExpanded,
  onDeleteEntry,
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

  function handleDeleteClick(): void {
    if (!window.confirm(translateDashboard("entry.deleteConfirm"))) {
      return;
    }

    onDeleteEntry(entry.id);
  }

  return (
    <Card
      as="article"
      className={cn(
        "items-stretch gap-0 border-ds-border-subtle bg-ds-surface",
        "p-ds-l shadow-ds-sm transition-colors md:p-ds-l",
        hasBehavior && "border-b-4 border-ds-surface-strong",
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
          <BookmarkToggleButton
            addBookmarkLabel={translateDashboard("entry.addBookmark")}
            isBookmarked={isBookmarked}
            onToggle={() => onToggleBookmark(entry.id)}
            removeBookmarkLabel={translateDashboard("entry.removeBookmark")}
          />

          <FormButton
            aria-label={translateDashboard("entry.edit")}
            iconOnly
            onClick={() => onEditEntry(entry.id)}
            type="button"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </FormButton>

          <FormButton
            aria-label={translateDashboard("entry.delete")}
            className={cn(
              "text-ds-danger",
              "hover:border-ds-danger hover:bg-ds-danger/10",
            )}
            disabled={isDeleting}
            iconOnly
            onClick={handleDeleteClick}
            type="button"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </FormButton>

          <FormButton
            aria-label={isExpanded ? translateDashboard("entry.collapse") : translateDashboard("entry.expand")}
            iconOnly
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
        <div className="grid gap-ds-xl border-t-1 border-ds-border-subtle pt-ds-xl">
          {entry.description.trim() && (
            <section>
              <Typography variant="label" size="sm">
                {translateDashboard("entry.notes")}
              </Typography>
              <Typography variant="body" size="sm">
                {entry.description.trim()}
              </Typography>
            </section>
          )}
          <section className="grid grid-cols-2 gap-ds-m">
            <Card variant="soft" className="flex flex-row !py-ds-xs">
              <MapPin className="h-4 w-4" />
              <Typography variant="body" size="sm">
                {locationLabel}
              </Typography>
            </Card>
            <Card variant="soft" className="flex flex-row !py-ds-xs">
              <Users className="h-4 w-4" />
              <Typography variant="body" size="sm">
                {companyLabel}
              </Typography>
            </Card>
          </section>
          {entry.foodEaten.trim() && (
            <section>
              <Typography variant="label" size="sm">
                {translateDashboard("entry.whatAte")}
              </Typography>
              <Typography variant="body" size="base">
                {entry.foodEaten.trim()}
              </Typography>
            </section>
          )}

          {hasBehavior ? (
            <section className={cn("rounded-ds-lg border border-ds-surface-strong bg-ds-surface-strong/10", "p-ds-m")}>
              <Typography variant="label" size="sm">
                {translateDashboard("entry.behaviorTitle")}
              </Typography>

              {/* TODO convert to chips */}
              <p className="mt-ds-xs font-ds-body-sm text-ds-on-warning">{behaviorLabels.join(", ")}</p>
            </section>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
