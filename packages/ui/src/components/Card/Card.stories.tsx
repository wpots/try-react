import type { Meta, StoryObj } from "@storybook/react";

import { cardDefaultArgs } from "./Card.mocks";
import { Card } from "./Card";
import type { CardProps, CardVariant } from "./index";

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

export const Soft: Story = {
  args: {
    variant: "soft",
  },
};

export const Strong: Story = {
  args: {
    variant: "strong",
  },
};

export const Knockout: Story = {
  args: {
    variant: "knockout",
  },
};

const cardVariants: CardVariant[] = [
  "default",
  "soft",
  "strong",
  "knockout",
];

export const VariantExamples: Story = {
  args: {
    variant: "default",
  },
  render: (args: CardProps) => (
    <div className="grid gap-ds-l sm:grid-cols-2">
      {cardVariants.map((variant) => (
        <div key={variant} className="flex flex-col gap-ds-s">
          <p className="text-sm text-ds-on-surface-secondary capitalize">
            {variant}
          </p>
          <Card {...args} variant={variant} />
        </div>
      ))}
    </div>
  ),
};
