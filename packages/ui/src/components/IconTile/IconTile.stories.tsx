import type { Meta, StoryObj } from "@storybook/react";

import { IconTile } from "./IconTile";
import { iconTileDefaultArgs } from "./IconTile.mocks";

const meta = {
  title: "Components/IconTile",
  component: IconTile,
  tags: ["autodocs", "a11y"],
  args: iconTileDefaultArgs,
} satisfies Meta<typeof IconTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
