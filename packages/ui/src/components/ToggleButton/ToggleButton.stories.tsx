import type { Meta, StoryObj } from "@storybook/react";

import { ToggleButton } from "./ToggleButton";
import { toggleButtonDefaultArgs } from "./ToggleButton.mocks";

const meta = {
  title: "Components/ToggleButton",
  component: ToggleButton,
  tags: ["autodocs", "a11y"],
  args: toggleButtonDefaultArgs,
} satisfies Meta<typeof ToggleButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
