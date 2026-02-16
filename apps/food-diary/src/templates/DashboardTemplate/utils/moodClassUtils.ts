import type { MoodZone } from "../index";

const moodBadgeClasses: Record<MoodZone, string> = {
  1: "bg-gradient-to-br from-ds-danger to-ds-surface-muted border-1 border-ds-danger ",
  2: "bg-gradient-to-br from-ds-warning-strong to-ds-surface-muted border-1 border-ds-warning-strong",
  3: "bg-gradient-to-br from-ds-brand-support to-ds-surface-muted border-1 border-ds-brand-support/50 ",
  4: "bg-gradient-to-br from-ds-brand-primary/50 to-ds-surface-muted border-1 border-ds-brand-primary/50",
  5: "bg-gradient-to-br from-ds-success to-ds-surface-muted border-1 border-ds-success ",
};

const moodDotClasses: Record<MoodZone, string> = {
  1: "bg-ds-danger text-ds-on-danger",
  2: "bg-ds-warning text-ds-on-warning",
  3: "bg-ds-surface-subtle text-ds-on-surface",
  4: "bg-ds-brand-primary text-ds-on-primary",
  5: "bg-ds-success text-ds-on-success",
};

export function getMoodBadgeClass(zone: MoodZone): string {
  return moodBadgeClasses[zone];
}

export function getMoodDotClass(zone: MoodZone): string {
  return moodDotClasses[zone];
}
