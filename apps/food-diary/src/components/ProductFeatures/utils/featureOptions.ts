import { Activity, Bookmark, FileDown, Heart, ShieldOff, UtensilsCrossed } from "lucide-react";
import { BookmarkPreview, EmotionsPreview, ExportPreview, FoodEntryPreview } from "../partials/FeaturePreviews";
import { BehaviorsPreview, TriggerFreePreview } from "../partials/FeaturePreviews";

/** Design-token icon background + text color classes for feature cards. */
export interface FeatureOption {
  icon: React.ElementType;
  /** Tailwind classes for the icon container (e.g. bg-ds-surface-subtle text-ds-primary). */
  colorClass: string;
  /** Optional preview component for phone frame; when absent, no preview is shown. */
  Preview?: React.ComponentType;
}

const OPTIONS: Record<string, FeatureOption> = {
  "feature-moments": {
    icon: UtensilsCrossed,
    colorClass: "bg-ds-surface-subtle text-ds-primary",
    Preview: FoodEntryPreview,
  },
  "feature-without-triggers": {
    icon: ShieldOff,
    colorClass: "bg-ds-surface-muted text-ds-on-surface-muted",
    Preview: TriggerFreePreview,
  },
  "feature-feelings": {
    icon: Heart,
    colorClass: "bg-ds-surface-subtle text-ds-primary",
    Preview: EmotionsPreview,
  },
  "feature-behaviors": {
    icon: Activity,
    colorClass: "bg-ds-surface-subtle text-ds-primary",
    Preview: BehaviorsPreview,
  },
  "feature-export": {
    icon: FileDown,
    colorClass: "bg-ds-surface-muted text-ds-on-surface-muted",
    Preview: ExportPreview,
  },
  "feature-saved": {
    icon: Bookmark,
    colorClass: "bg-ds-surface-subtle text-ds-primary",
    Preview: BookmarkPreview,
  },
};

const DEFAULT_OPTION: FeatureOption = {
  icon: UtensilsCrossed,
  colorClass: "bg-ds-surface-subtle text-ds-on-surface",
};

/**
 * Returns icon and color for a feature by id. Uses fallback when id is unknown.
 */
export function getFeatureOption(id: string): FeatureOption {
  return OPTIONS[id] ?? DEFAULT_OPTION;
}

/** Whether any feature has a Preview (for showing the phone column). */
export function hasAnyPreview(ids: string[]): boolean {
  return ids.some(id => OPTIONS[id]?.Preview != null);
}
