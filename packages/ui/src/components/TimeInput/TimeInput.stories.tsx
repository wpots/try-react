import type { Meta, StoryObj } from "@storybook/react";

import { TimeInput } from "./TimeInput";
import { timeInputDefaultArgs } from "./TimeInput.mocks";

const meta = {
  title: "Components/TimeInput",
  component: TimeInput,
  tags: ["autodocs", "a11y"],
  args: timeInputDefaultArgs,
} satisfies Meta<typeof TimeInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
