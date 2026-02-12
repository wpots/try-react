/** Hash-only anchors should use native <a> in the current page context. */
export function isHashHref(href: string): boolean {
  return href.startsWith("#");
}
