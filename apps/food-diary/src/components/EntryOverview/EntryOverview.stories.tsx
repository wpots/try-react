import type { Meta, StoryObj } from "@storybook/react";

import { EntryOverviewView } from ".";

const meta = {
  title: "Food Diary/EntryOverview",
  component: EntryOverviewView,
  tags: ["autodocs", "a11y"],
  args: {
    title: "Diary Entries Overview",
    entries: [
      {
        id: "entry-1",
        date: "2026-02-10",
        time: "08:30",
        entryType: "breakfast",
        foodEaten: "Oatmeal with banana",
        description: "Felt energized afterward.",
      },
    ],
  },
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof EntryOverviewView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
