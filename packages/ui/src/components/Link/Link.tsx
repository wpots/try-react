"use client";

import type { LinkProps } from "./index";
import {
  buttonBaseClasses,
  buttonDisabledClasses,
  buttonFocusClasses,
  buttonIconClasses,
  buttonSizeClasses,
  buttonTransitionClasses,
  buttonVariantClasses,
} from "../Button/Button";
import { cn } from "../../lib/utils";
import { isExternalHref } from "./utils/isExternalHref";
import { isHashHref } from "./utils/isHashHref";
import { isInternalHref } from "./utils/isInternalHref";

export function Link({
  href,
  children,
  as: LinkComponent,
  isExternal,
  target,
  rel,
  variant = "link",
  size = "default",
  className,
  ...props
}: LinkProps): React.JSX.Element {
  const external = isExternal ?? isExternalHref(href);
  const hashLink = isHashHref(href);
  const internal = !external && isInternalHref(href) && !hashLink;
  const safeRel = target === "_blank" ? [rel, "noopener", "noreferrer"].filter(Boolean).join(" ") : rel;

  const baseClasses = cn(
    buttonBaseClasses,
    buttonFocusClasses,
    buttonDisabledClasses,
    buttonTransitionClasses,
    buttonIconClasses,
    buttonVariantClasses[variant],
    buttonSizeClasses[size],
    className,
  );

  if (internal && LinkComponent) {
    return (
      <LinkComponent href={href} target={target} rel={safeRel} className={baseClasses} {...props}>
        {children}
      </LinkComponent>
    );
  }

  /* Hash links: always use native <a> so #section resolves on current page. */
  return (
    <a href={href} target={target} rel={safeRel} className={baseClasses} {...props}>
      {children}
    </a>
  );
}
