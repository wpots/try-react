import type { Meta, StoryObj } from "@storybook/react";

import { TextArea } from "./TextArea";
import { textAreaDefaultArgs } from "./TextArea.mocks";

const meta = {
  title: "Components/TextArea",
  component: TextArea,
  tags: ["autodocs", "a11y"],
  args: textAreaDefaultArgs,
} satisfies Meta<typeof TextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
