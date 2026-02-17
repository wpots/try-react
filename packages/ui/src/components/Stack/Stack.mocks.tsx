import type { StackProps } from "./index";

export const stackDefaultArgs = {
  direction: "row",
  children: [
    <span key="one">One</span>,
    <span key="two">Two</span>,
    <span key="three">Three</span>,
  ],
} satisfies StackProps;
