import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "../Button";
import { OverviewCard } from "./OverviewCard";

const meta = {
  title: "Components/OverviewCard",
  component: OverviewCard,
  tags: ["autodocs", "a11y"],
  args: {
    title: "Daily overview",
    subtitle: "Sunday",
    description: "You logged 3 meals and reached your hydration target.",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof OverviewCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithContent: Story = {
  args: {
    children: <p className="text-sm text-ds-text-muted">Calories: 1,840 kcal</p>,
    footer: <Button size="sm">View details</Button>,
  },
};
