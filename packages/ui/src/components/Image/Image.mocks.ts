import type { ImageProps } from "./index";

const PLACEHOLDER_IMAGE =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

export const imageDefaultArgs = {
  src: PLACEHOLDER_IMAGE,
  alt: "Preview image",
  width: 320,
  height: 180,
  className: "rounded-ds-md border border-ds-border bg-ds-surface-muted",
} satisfies ImageProps;
