import type React from "react";

export interface EmotionPickerProps extends React.ComponentProps<"div"> {
  selectedKeys: string[];
  onSelectedKeysChange: (keys: string[]) => void;
}

export { EmotionPicker } from "./EmotionPicker";

