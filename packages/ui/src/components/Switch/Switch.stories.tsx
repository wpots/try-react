import type { Meta, StoryObj } from "@storybook/react";

import { Switch } from "./Switch";
import { switchDefaultArgs } from "./Switch.mocks";

const meta = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs", "a11y"],
  args: switchDefaultArgs,
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
