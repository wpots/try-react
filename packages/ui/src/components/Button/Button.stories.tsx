import type { Meta, StoryObj } from "@storybook/react";

import { buttonDefaultArgs } from "./Button.mocks";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs", "a11y"],
  args: buttonDefaultArgs,
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
