import type { Meta, StoryObj } from "@storybook/react";

import { SkipLink } from "./SkipLink";
import { skipLinkDefaultArgs } from "./SkipLink.mocks";

const meta = {
  title: "Components/SkipLink",
  component: SkipLink,
  tags: ["autodocs", "a11y"],
  args: skipLinkDefaultArgs,
} satisfies Meta<typeof SkipLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
