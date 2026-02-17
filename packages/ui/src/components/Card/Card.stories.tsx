import type { Meta, StoryObj } from "@storybook/react";

import { cardDefaultArgs } from "./Card.mocks";
import { Card } from "./Card";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs", "a11y"],
  args: cardDefaultArgs,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
