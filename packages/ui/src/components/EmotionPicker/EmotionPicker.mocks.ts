import { chipSelectorDefaultArgs } from "../ChipSelector/ChipSelector.mocks";
import type { EmotionPickerProps } from "./index";

export const emotionPickerDefaultArgs = {
  selectedKeys: chipSelectorDefaultArgs.selectedValues,
  onSelectedKeysChange: chipSelectorDefaultArgs.onSelectedValuesChange,
} satisfies EmotionPickerProps;
