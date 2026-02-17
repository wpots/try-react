import type { Meta, StoryObj } from "@storybook/react";

import { Container } from "./Container";
import { containerDefaultArgs } from "./Container.mocks";

const meta = {
  title: "Components/Container",
  component: Container,
  tags: ["autodocs", "a11y"],
  args: containerDefaultArgs,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Container>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
