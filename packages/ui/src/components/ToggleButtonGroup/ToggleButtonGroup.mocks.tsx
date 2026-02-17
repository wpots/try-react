import { toggleButtonDefaultArgs } from "../ToggleButton/ToggleButton.mocks";
import type { ToggleButtonGroupProps } from "./index";

function handleSelectedValueChange(): void {
  // Storybook mock callback.
}

export const toggleButtonGroupDefaultArgs = {
  options: [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
  ],
  selectedValue: "breakfast",
  onSelectedValueChange: handleSelectedValueChange,
  optionClassName: toggleButtonDefaultArgs.className,
  "aria-label": "Meal type",
} satisfies ToggleButtonGroupProps;
