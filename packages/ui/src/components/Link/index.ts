import type React from "react";

export interface NextLinkLikeProps extends React.ComponentProps<"a"> {
  href: string;
}

export interface LinkProps
  extends Omit<React.ComponentProps<"a">, "href" | "children"> {
  href: string;
  children: React.ReactNode;
  nextLinkComponent?: React.ComponentType<NextLinkLikeProps>;
  isExternal?: boolean;
}

export { Link } from "./Link";
