import type { ChipSelectorProps } from "./index";

function handleSelectedValuesChange(): void {
  // Storybook mock callback.
}

export const chipSelectorDefaultArgs = {
  options: [
    { value: "happy", label: "Happy" },
    { value: "calm", label: "Calm" },
    { value: "tired", label: "Tired" },
  ],
  selectedValues: ["happy"],
  onSelectedValuesChange: handleSelectedValuesChange,
} satisfies ChipSelectorProps;
