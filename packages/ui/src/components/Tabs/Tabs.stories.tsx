import type { Meta, StoryObj } from "@storybook/react";

import { Tabs } from "./Tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs", "a11y"],
  args: {
    "aria-label": "Example tabs",
    items: [
      { id: "settings", label: "Settings", content: <p className="text-sm">Settings panel content.</p> },
      { id: "data", label: "Data & Account", content: <p className="text-sm">Data & Account panel content.</p> },
      {
        id: "affirmations",
        label: "Affirmations",
        content: <p className="text-sm">Affirmations panel content.</p>,
      },
    ],
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDefaultSelection: Story = {
  args: {
    defaultSelectedKey: "data",
  },
};

export const WithDisabledTab: Story = {
  args: {
    items: [
      { id: "settings", label: "Settings", content: <p className="text-sm">Settings panel content.</p> },
      { id: "data", label: "Data & Account", content: <p className="text-sm">Data & Account panel content.</p> },
      {
        id: "affirmations",
        label: "Affirmations",
        content: <p className="text-sm">Affirmations panel content.</p>,
        isDisabled: true,
      },
    ],
  },
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
};
