import { formLabelDefaultArgs } from "../Form/FormLabel.mocks";
import type { TimeInputProps } from "./index";

function handleTimeChange(): void {
  // Storybook mock callback.
}

const timeInputLabel =
  typeof formLabelDefaultArgs.children === "string"
    ? formLabelDefaultArgs.children
    : "Field label";

export const timeInputDefaultArgs = {
  label: timeInputLabel,
  value: "12:30",
  onChange: handleTimeChange,
} satisfies TimeInputProps;
