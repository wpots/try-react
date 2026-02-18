import { Icon, cn } from "@repo/ui";

import { getMoodBadgeClass } from "../utils/moodClassUtils";

import type { DashboardMood } from "../index";

interface MoodBadgeProps {
  mood: DashboardMood;
}

function renderMoodVisual(mood: DashboardMood): React.JSX.Element {
  if ("iconName" in mood) {
    return <Icon aria-hidden="true" className="h-4 w-4" name={mood.iconName} />;
  }

  return (
    <span aria-hidden="true" className="font-openmoji text-sm leading-none">
      {mood.emoji}
    </span>
  );
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
      {renderMoodVisual(mood)}
      <span>{mood.label}</span>
    </span>
  );
}
