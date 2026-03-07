import type { Meta, StoryObj } from "@storybook/react";

import { CookieConsentBanner } from "./CookieConsentBanner";

const meta = {
  title: "Components/CookieConsentBanner",
  component: CookieConsentBanner,
  tags: ["autodocs", "a11y"],
  args: {
    heading: "Cookie preferences",
    body: "We use optional cookies (Google Analytics) to understand how the app is used. You can accept or reject non-essential cookies at any time.",
    acceptLabel: "Accept all",
    rejectLabel: "Reject non-essential",
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CookieConsentBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
