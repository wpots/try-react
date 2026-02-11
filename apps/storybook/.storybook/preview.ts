import type { Preview } from "@storybook/react";
import * as React from "react";

import "../../../packages/ui/src/styles/globals.css";

if (typeof globalThis.React === "undefined") {
  Reflect.set(globalThis, "React", React);
}

if (typeof window !== "undefined" && typeof (window as any).process === "undefined") {
  (window as any).process = {
    env: {
      NODE_ENV: "development",
      STORYBOOK: "true",
    },
  };
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
    a11y: {
      test: "error",
      options: {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
      },
    },
  },
};

export default preview;
