import type { SelectProps } from "./index";

function handleSelectedKeyChange(): void {
  // Storybook mock callback.
}

export const selectDefaultArgs = {
  label: "Meal type",
  placeholder: "Select one",
  options: [
    { value: "breakfast", label: "Breakfast" },
    { value: "lunch", label: "Lunch" },
    { value: "dinner", label: "Dinner" },
  ],
  selectedKey: "breakfast",
  onSelectedKeyChange: handleSelectedKeyChange,
} satisfies SelectProps;
