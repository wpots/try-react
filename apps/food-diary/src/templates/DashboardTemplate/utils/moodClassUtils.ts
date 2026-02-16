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

const moodAuraGlowClasses: Record<MoodZone, string> = {
  1: "bg-ds-danger/40",
  2: "bg-ds-warning-strong/40",
  3: "bg-ds-brand-support/35",
  4: "bg-ds-brand-primary/35",
  5: "bg-ds-success/40",
};

const moodAuraRingClasses: Record<MoodZone, string> = {
  1: "border-ds-danger/65",
  2: "border-ds-warning-strong/65",
  3: "border-ds-brand-support/55",
  4: "border-ds-brand-primary/55",
  5: "border-ds-success/65",
};

const moodAuraParticleClasses: Record<MoodZone, string> = {
  1: "bg-ds-danger/80",
  2: "bg-ds-warning-strong/80",
  3: "bg-ds-brand-support/70",
  4: "bg-ds-brand-primary/70",
  5: "bg-ds-success/80",
};

export function getMoodBadgeClass(zone: MoodZone): string {
  return moodBadgeClasses[zone];
}

export function getMoodDotClass(zone: MoodZone): string {
  return moodDotClasses[zone];
}

export function getMoodAuraGlowClass(zone: MoodZone): string {
  return moodAuraGlowClasses[zone];
}

export function getMoodAuraRingClass(zone: MoodZone): string {
  return moodAuraRingClasses[zone];
}

export function getMoodAuraParticleClass(zone: MoodZone): string {
  return moodAuraParticleClasses[zone];
}
