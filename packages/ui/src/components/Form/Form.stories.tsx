import type { Meta, StoryObj } from "@storybook/react";

import { Form } from "./Form";
import { formDefaultArgs } from "./Form.mocks";

const meta = {
  title: "Components/Form",
  component: Form,
  tags: ["autodocs", "a11y"],
  args: formDefaultArgs,
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
