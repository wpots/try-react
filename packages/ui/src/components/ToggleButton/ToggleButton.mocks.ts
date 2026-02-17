import type { ToggleButtonProps } from "./index";

export const toggleButtonDefaultArgs = {
  children: "Toggle",
  defaultSelected: true,
  className:
    "rounded-ds-full border border-ds-border px-ds-m py-ds-xs text-ds-on-surface",
} satisfies ToggleButtonProps;
