import type { Meta, StoryObj } from "@storybook/react";

import { ChipSelector } from "./ChipSelector";
import { chipSelectorDefaultArgs } from "./ChipSelector.mocks";

const meta = {
  title: "Components/ChipSelector",
  component: ChipSelector,
  tags: ["autodocs", "a11y"],
  args: chipSelectorDefaultArgs,
} satisfies Meta<typeof ChipSelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
