import type { Meta, StoryObj } from "@storybook/react";

import { LanguageSwitcherView } from ".";

const meta = {
  title: "Food Diary/LanguageSwitcher",
  component: LanguageSwitcherView,
  tags: ["autodocs", "a11y"],
  args: {
    ariaLabel: "Language",
    label: "Language",
    locale: "en",
    onLocaleChange: () => undefined,
  },
} satisfies Meta<typeof LanguageSwitcherView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
