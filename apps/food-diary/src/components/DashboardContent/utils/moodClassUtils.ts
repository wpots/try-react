import type { MoodZone } from "../index";

const moodBadgeClasses: Record<MoodZone, string> = {
  1: "bg-ds-danger/20 text-ds-on-surface",
  2: "bg-ds-warning/45 text-ds-on-warning",
  3: "bg-ds-surface-subtle/40 text-ds-on-surface",
  4: "bg-ds-brand-primary-soft text-ds-brand-primary-strong",
  5: "bg-ds-success/35 text-ds-on-success",
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
