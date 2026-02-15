import type React from "react";

export interface EmotionPickerProps extends React.ComponentProps<"div"> {
  selectedKeys: string[];
  onSelectedKeysChange: (keys: string[]) => void;
  /** Optional label resolver for i18n (e.g. (key) => t(`emotions.${key}`)) */
  getLabel?: (key: string) => string;
}

export { EmotionPicker } from "./EmotionPicker";

