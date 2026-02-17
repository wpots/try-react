import type { Meta, StoryObj } from "@storybook/react";

import { Section } from "./Section";
import { sectionDefaultArgs } from "./Section.mocks";

const meta = {
  title: "Components/Section",
  component: Section,
  tags: ["autodocs", "a11y"],
  args: sectionDefaultArgs,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Section>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
