import type { Meta, StoryObj } from "@storybook/react";

import { HamburgerMenu } from "./HamburgerMenu";
import { hamburgerMenuDefaultArgs } from "./HamburgerMenu.mocks";

const meta = {
  title: "Components/HamburgerMenu",
  component: HamburgerMenu,
  tags: ["autodocs", "a11y"],
  args: hamburgerMenuDefaultArgs,
} satisfies Meta<typeof HamburgerMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
