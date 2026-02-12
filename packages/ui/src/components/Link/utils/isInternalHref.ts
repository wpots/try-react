export function isInternalHref(href: string): boolean {
  return href.startsWith("/") || href.startsWith("#");
}
