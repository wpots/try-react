import type { Meta, StoryObj } from "@storybook/react";

import { Image } from "./Image";
import { imageDefaultArgs } from "./Image.mocks";

const meta = {
  title: "Components/Image",
  component: Image,
  tags: ["autodocs", "a11y"],
  args: imageDefaultArgs,
} satisfies Meta<typeof Image>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
