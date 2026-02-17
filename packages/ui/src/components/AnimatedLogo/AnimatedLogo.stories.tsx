import type { Meta, StoryObj } from "@storybook/react";

import { animatedLogoDefaultArgs } from "./AnimatedLogo.mocks";
import { AnimatedLogo } from "./AnimatedLogo";

const meta = {
  title: "Components/AnimatedLogo",
  component: AnimatedLogo,
  tags: ["autodocs", "a11y"],
  args: animatedLogoDefaultArgs,
} satisfies Meta<typeof AnimatedLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
