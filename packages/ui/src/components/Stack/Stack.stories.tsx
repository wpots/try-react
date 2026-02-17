import type { Meta, StoryObj } from "@storybook/react";

import { Stack } from "./Stack";
import { stackDefaultArgs } from "./Stack.mocks";

const meta = {
  title: "Components/Stack",
  component: Stack,
  tags: ["autodocs", "a11y"],
  args: stackDefaultArgs,
} satisfies Meta<typeof Stack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
