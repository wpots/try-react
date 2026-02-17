import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "./Text";
import { textDefaultArgs } from "./Text.mocks";

const meta = {
  title: "Components/Text",
  component: Text,
  tags: ["autodocs", "a11y"],
  args: textDefaultArgs,
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
