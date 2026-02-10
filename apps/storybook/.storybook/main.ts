import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const configDir = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    "../../../packages/ui/src/**/*.stories.@(ts|tsx|mdx)",
    "../../../apps/food-diary/src/components/**/*.stories.@(ts|tsx|mdx)",
  ],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(viteConfig) {
    viteConfig.server ??= {};
    viteConfig.server.fs ??= {};
    viteConfig.server.fs.allow = [
      ...(viteConfig.server.fs.allow ?? []),
      resolve(configDir, "../../../packages/ui"),
      resolve(configDir, "../../../apps/food-diary"),
    ];

    viteConfig.resolve ??= {};
    viteConfig.resolve.alias ??= {};

    if (!Array.isArray(viteConfig.resolve.alias)) {
      viteConfig.resolve.alias["@"] = resolve(
        configDir,
        "../../../apps/food-diary/src",
      );
    }

    return viteConfig;
  },
};

export default config;
