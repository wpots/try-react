import type { Meta, StoryObj } from "@storybook/react";

import { ToggleButtonGroup } from "./ToggleButtonGroup";
import { toggleButtonGroupDefaultArgs } from "./ToggleButtonGroup.mocks";

const meta = {
  title: "Components/ToggleButtonGroup",
  component: ToggleButtonGroup,
  tags: ["autodocs", "a11y"],
  args: toggleButtonGroupDefaultArgs,
} satisfies Meta<typeof ToggleButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
