import type { Meta, StoryObj } from "@storybook/react";

import { Typography } from "./Typography";
import { typographyDefaultArgs } from "./Typography.mocks";

const meta = {
  title: "Components/Typography",
  component: Typography,
  tags: ["autodocs", "a11y"],
  args: typographyDefaultArgs,
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
