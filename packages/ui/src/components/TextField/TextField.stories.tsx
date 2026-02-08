import type { Meta, StoryObj } from "@storybook/react";

import { TextField } from "./TextField";

const meta = {
  title: "Components/TextField",
  component: TextField,
  tags: ["autodocs", "a11y"],
  args: {
    label: "Meal name",
    placeholder: "e.g. Chicken salad",
    description: "Use a short name so entries stay readable.",
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: "Lunch",
  },
};

export const WithError: Story = {
  args: {
    errorMessage: "Meal name is required.",
    "aria-invalid": true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Dinner",
  },
};
