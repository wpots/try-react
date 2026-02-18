import { Activity, Bookmark, FileDown, Heart, Shield, UtensilsCrossed } from "lucide-react";

import { BookmarkPreview, EmotionsPreview, ExportPreview, FoodEntryPreview } from "../partials/FeaturePreviews";
import { BehaviorsPreview, TriggerFreePreview } from "../partials/FeaturePreviews";

import type { IconTileVariant } from "@repo/ui";

/** Feature option with icon and IconTile variant for background/icon color. */
export interface FeatureOption {
  icon: React.ElementType;
  /** IconTile variant (on-surface background + contrasting icon). */
  variant: IconTileVariant;
  /** Optional preview component for phone frame; when absent, no preview is shown. */
  Preview?: React.ComponentType;
}

const OPTIONS: Record<string, FeatureOption> = {
  "feature-moments": {
    icon: UtensilsCrossed,
    variant: "default",
    Preview: FoodEntryPreview,
  },
  "feature-without-triggers": {
    icon: Shield,
    variant: "strong",
    Preview: TriggerFreePreview,
  },
  "feature-feelings": {
    icon: Heart,
    variant: "subtle",
    Preview: EmotionsPreview,
  },
  "feature-behaviors": {
    icon: Activity,
    variant: "default",
    Preview: BehaviorsPreview,
  },
  "feature-export": {
    icon: FileDown,
    variant: "strong",
    Preview: ExportPreview,
  },
  "feature-saved": {
    icon: Bookmark,
    variant: "subtle",
    Preview: BookmarkPreview,
  },
};

const DEFAULT_OPTION: FeatureOption = {
  icon: UtensilsCrossed,
  variant: "default",
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
