import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";

import { buttonDefaultArgs } from "./Button.mocks";
import { Button } from "./Button";

const buttonVariantOptions = [
  "default",
  "secondary",
  "strong",
  "outline",
  "destructive",
  "link",
] as const;

const buttonSizeOptions = ["default", "sm", "lg", "icon", "link"] as const;

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs", "a11y"],
  args: buttonDefaultArgs,
  argTypes: {
    variant: {
      control: "select",
      options: buttonVariantOptions,
    },
    size: {
      control: "select",
      options: buttonSizeOptions,
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Strong: Story = {
  args: {
    variant: "strong",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    size: "link",
    children: "Edit entry",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const Icon: Story = {
  args: {
    size: "icon",
    variant: "secondary",
    "aria-label": "Add entry",
    children: <Plus aria-hidden="true" />,
  },
};
