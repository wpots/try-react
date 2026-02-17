import { formLabelDefaultArgs } from "../Form/FormLabel.mocks";
import type { DateInputProps } from "./index";

function handleDateChange(): void {
  // Storybook mock callback.
}

const dateInputLabel =
  typeof formLabelDefaultArgs.children === "string"
    ? formLabelDefaultArgs.children
    : "Field label";

export const dateInputDefaultArgs = {
  label: dateInputLabel,
  value: "2026-02-17",
  onChange: handleDateChange,
} satisfies DateInputProps;
