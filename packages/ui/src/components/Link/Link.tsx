import { Link as ReactAriaLink } from "react-aria-components";

import type { LinkProps } from "./index";

function isExternalHref(href: string): boolean {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function isInternalHref(href: string): boolean {
  return href.startsWith("/") || href.startsWith("#");
}

export function Link({
  href,
  children,
  nextLinkComponent: NextLinkComponent,
  isExternal,
  target,
  rel,
  ...props
}: LinkProps): React.JSX.Element {
  const external = isExternal ?? isExternalHref(href);
  const internal = isInternalHref(href);
  const safeRel =
    target === "_blank"
      ? [rel, "noopener", "noreferrer"].filter(Boolean).join(" ")
      : rel;

  if (internal && NextLinkComponent) {
    return (
      <NextLinkComponent href={href} target={target} rel={safeRel} {...props}>
        {children}
      </NextLinkComponent>
    );
  }

  return (
    <ReactAriaLink
      href={href}
      isExternal={external}
      target={target}
      rel={safeRel}
      {...props}
    >
      {children}
    </ReactAriaLink>
  );
}
