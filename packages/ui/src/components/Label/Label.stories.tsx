import type { Meta, StoryObj } from "@storybook/react";

import { Label } from "./Label";
import { labelDefaultArgs } from "./Label.mocks";

const meta = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs", "a11y"],
  args: labelDefaultArgs,
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
