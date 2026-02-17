import type { Meta, StoryObj } from "@storybook/react";

import { Select } from "./Select";
import { selectDefaultArgs } from "./Select.mocks";

const meta = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs", "a11y"],
  args: selectDefaultArgs,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
