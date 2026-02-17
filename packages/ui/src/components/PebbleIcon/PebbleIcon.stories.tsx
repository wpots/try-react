import type { Meta, StoryObj } from "@storybook/react";

import { PebbleIcon } from "./PebbleIcon";
import { pebbleIconDefaultArgs } from "./PebbleIcon.mocks";

const meta = {
  title: "Components/PebbleIcon",
  component: PebbleIcon,
  tags: ["autodocs", "a11y"],
  args: pebbleIconDefaultArgs,
} satisfies Meta<typeof PebbleIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
