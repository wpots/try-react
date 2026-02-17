import type { Meta, StoryObj } from "@storybook/react";

import { Link } from "./Link";
import { linkDefaultArgs } from "./Link.mocks";

const meta = {
  title: "Components/Link",
  component: Link,
  tags: ["autodocs", "a11y"],
  args: linkDefaultArgs,
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
