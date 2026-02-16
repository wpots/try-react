import type { MoodZone } from "../index";

const moodBadgeClasses: Record<MoodZone, string> = {
  1: "bg-ds-danger/60 to-ds-surface-muted border-1 border-ds-danger ",
  2: "bg-ds-warning-strong/60 to-ds-surface-muted border-1 border-ds-warning-strong",
  3: "bg-ds-brand-support/60 to-ds-surface-muted border-1 border-ds-brand-support/50 ",
  4: "bg-ds-brand-primary/40 to-ds-surface-muted border-1 border-ds-brand-primary/50",
  5: "bg-ds-success/60 to-ds-surface-muted border-1 border-ds-success ",
};

const moodDotClasses: Record<MoodZone, string> = {
  1: "bg-ds-danger/60 ",
  2: "bg-ds-warning-strong/60 ",
  3: "bg-ds-brand-support/60",
  4: "bg-ds-brand-primary/40",
  5: "bg-ds-success/60 ",
};

export function getMoodBadgeClass(zone: MoodZone): string {
  return moodBadgeClasses[zone];
}

export function getMoodDotClass(zone: MoodZone): string {
  return moodDotClasses[zone];
}
