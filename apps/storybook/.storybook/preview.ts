import type { Preview } from "@storybook/react";
import * as React from "react";

import "../../../packages/ui/src/globals.css";

if (typeof globalThis.React === "undefined") {
  Reflect.set(globalThis, "React", React);
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
