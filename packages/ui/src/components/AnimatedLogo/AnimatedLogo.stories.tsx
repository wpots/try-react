import type { Meta, StoryObj } from "@storybook/react";

import { animatedLogoDefaultArgs } from "./AnimatedLogo.mocks";
import { AnimatedLogo } from "./AnimatedLogo";

const meta = {
  title: "Components/AnimatedLogo",
  component: AnimatedLogo,
  tags: ["autodocs", "a11y"],
  args: animatedLogoDefaultArgs,
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["default", "strong"],
    },
    motionMode: {
      control: "inline-radio",
      options: ["auto", "always", "never"],
    },
  },
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AnimatedLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Strong: Story = {
  args: {
    variant: "strong",
  },
};

export const ReducedMotion: Story = {
  args: {
    motionMode: "never",
  },
};
