import type { Meta, StoryObj } from "@storybook/react";

import { Navigation } from "./Navigation";
import { navigationDefaultArgs } from "./Navigation.mocks";

const meta = {
  title: "Components/Navigation",
  component: Navigation,
  tags: ["autodocs", "a11y"],
  args: navigationDefaultArgs,
} satisfies Meta<typeof Navigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
