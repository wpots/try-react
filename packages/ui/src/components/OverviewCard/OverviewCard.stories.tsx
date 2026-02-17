import type { Meta, StoryObj } from "@storybook/react";

import { overviewCardDefaultArgs } from "./OverviewCard.mocks";
import { OverviewCard } from "./OverviewCard";

const meta = {
  title: "Components/OverviewCard",
  component: OverviewCard,
  tags: ["autodocs", "a11y"],
  args: overviewCardDefaultArgs,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof OverviewCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
