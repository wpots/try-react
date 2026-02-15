import type React from "react";

export interface EmotionPickerProps extends React.ComponentProps<"div"> {
  selectedKeys: string[];
  onSelectedKeysChange: (keys: string[]) => void;
  /** Optional label resolver for i18n (e.g. (key) => t(`emotions.${key}`)) */
  getLabel?: (key: string) => string;
  /** Optional category label resolver for i18n (e.g. (category) => t(`emotionCategories.${category}`)) */
  getCategoryLabel?: (category: string) => string;
}

export { EmotionPicker } from "./EmotionPicker";
export type { EmotionCategory, EmotionDefinition } from "./emotions";
export { EMOTION_CATEGORY_ORDER, emotions } from "./emotions";

