import type React from "react";
import type { ButtonProps } from "../Button";

export interface NextLinkLikeProps extends React.ComponentProps<"a"> {
  href: string;
}

export interface LinkProps
  extends Omit<React.ComponentProps<"a">, "href" | "children"> {
  href: string;
  children: React.ReactNode;
  /** Custom link component (e.g. Next.js Link, I18n link). Renders <a> when not set. */
  as?: React.ComponentType<NextLinkLikeProps>;
  isExternal?: boolean;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

export { Link } from "./Link";
