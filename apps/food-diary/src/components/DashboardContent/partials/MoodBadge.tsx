import { cn } from "@repo/ui";
import type { DashboardMood } from "../index";
import { getMoodBadgeClass } from "../utils/moodClassUtils";

interface MoodBadgeProps {
  mood: DashboardMood;
}

export function MoodBadge({ mood }: MoodBadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-ds-xs rounded-ds-full",
        "px-ds-s py-ds-xs font-ds-body-xs",
        getMoodBadgeClass(mood.zone),
      )}
      title={mood.label}
    >
      <span aria-hidden="true" className="font-openmoji text-sm leading-none">
        {mood.emoji}
      </span>
      <span>{mood.label}</span>
    </span>
  );
}
