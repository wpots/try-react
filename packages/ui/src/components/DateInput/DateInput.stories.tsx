import type { Meta, StoryObj } from "@storybook/react";

import { DateInput } from "./DateInput";
import { dateInputDefaultArgs } from "./DateInput.mocks";

const meta = {
  title: "Components/DateInput",
  component: DateInput,
  tags: ["autodocs", "a11y"],
  args: dateInputDefaultArgs,
} satisfies Meta<typeof DateInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
