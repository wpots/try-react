import { cn } from "@repo/ui";

import { getMoodDotClass } from "../utils/moodClassUtils";

import type { DashboardMood } from "../index";

interface MoodDotProps {
  mood: DashboardMood;
  size: "week" | "month";
}

const sizeClassName: Record<MoodDotProps["size"], string> = {
  month: "h-3 w-3 sm:h-4 sm:w-4",
  week: "h-5 w-5",
};

export function MoodDot({ mood, size }: MoodDotProps): React.JSX.Element {
  return (
    <span
      aria-label={mood.label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full",
        sizeClassName[size],
        getMoodDotClass(mood.zone),
      )}
      title={mood.label}
    >
      {size === "week" ? (
        <span className="font-openmoji text-xs leading-none" aria-hidden="true">
          {mood.emoji}
        </span>
      ) : null}
    </span>
  );
}
