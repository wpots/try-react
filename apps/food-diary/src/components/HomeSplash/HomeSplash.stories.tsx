import type { Meta, StoryObj } from "@storybook/react";

import { HomeSplashView } from ".";

const meta = {
  title: "Food Diary/HomeSplash",
  component: HomeSplashView,
  tags: ["autodocs", "a11y"],
  args: {
    title: "Welcome to",
    appName: "The Real You app",
    subtitle: "You can start tracking your food diary right away.",
    accountTitle: "Create account",
    guestTitle: "Continue without account",
    accountFeatureDevice: "Available from any device.",
    accountFeaturePrivacy: "We never post anything on your Google profile.",
    guestFeatureLocal: "Only available locally in this browser.",
    guestFeatureWarning: "Not recommended on a shared computer.",
    accountCta: "Continue with Google",
    guestCta: "Continue without account",
    footerPrefix:
      "This site uses functional cookies required for core functionality.",
    footerLink: <a className="text-ds-text-muted underline">View privacy policy</a>,
    onGoogleClick: () => undefined,
    onGuestClick: () => undefined,
  },
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof HomeSplashView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
