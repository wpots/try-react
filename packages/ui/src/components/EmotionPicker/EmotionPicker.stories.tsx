import type { Meta, StoryObj } from "@storybook/react";

import { EmotionPicker } from "./EmotionPicker";
import { emotionPickerDefaultArgs } from "./EmotionPicker.mocks";

const meta = {
  title: "Components/EmotionPicker",
  component: EmotionPicker,
  tags: ["autodocs", "a11y"],
  args: emotionPickerDefaultArgs,
} satisfies Meta<typeof EmotionPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
