import { isValidElement } from "react";

const BLOCK_ELEMENTS = [
  "div",
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "section",
  "article",
  "header",
  "footer",
  "main",
  "aside",
  "nav",
];

function isTypographyElement(
  childType: unknown,
): childType is { name?: string; displayName?: string } {
  if (!childType || typeof childType !== "function") {
    return false;
  }

  if (childType.name === "Typography") {
    return true;
  }

  const displayName = getDisplayName(childType);
  return displayName === "Typography";
}

function getTagName(childType: unknown): string | null {
  if (typeof childType === "string") {
    return childType;
  }

  const displayName = getDisplayName(childType);
  if (displayName) {
    return displayName;
  }

  return null;
}

function getDisplayName(value: unknown): string | null {
  if (
    !value ||
    (typeof value !== "object" && typeof value !== "function") ||
    !("displayName" in value)
  ) {
    return null;
  }

  const displayName = Reflect.get(value, "displayName");
  return typeof displayName === "string" ? displayName : null;
}

function hasVariant(value: unknown): value is {
  variant: "heading" | "body" | "script" | "display" | "label";
} {
  if (!value || typeof value !== "object") {
    return false;
  }

  if (!("variant" in value)) {
    return false;
  }

  return (
    value.variant === "heading" ||
    value.variant === "body" ||
    value.variant === "script" ||
    value.variant === "display" ||
    value.variant === "label"
  );
}

function getTypographyTagFromProps(childProps: unknown): string {
  if (!hasVariant(childProps)) {
    return "p";
  }

  if ("tag" in childProps && typeof childProps.tag === "string") {
    return childProps.tag;
  }

  if (childProps.variant === "heading") return "h3";
  if (childProps.variant === "script" || childProps.variant === "display") return "p";
  return "p";
}

export function validateNesting(
  parentTag: string,
  children: React.ReactNode,
  variant: "heading" | "body" | "script" | "display" | "label",
): void {
  // eslint-disable-next-line no-process-env -- NODE_ENV is a special build-time constant in Next.js
  if (process.env.NODE_ENV === "production") {
    return;
  }

  const childNodes = Array.isArray(children) ? children : [children];

  for (const child of childNodes) {
    if (!isValidElement(child)) {
      continue;
    }

    const childType = child.type;
    const childTag = getTagName(childType);

    if (childTag && BLOCK_ELEMENTS.includes(childTag)) {
      console.warn(
        `⚠️ Typography: Invalid HTML nesting detected!\n` +
          `Block element <${childTag}> should not be nested inside <${parentTag}>.\n` +
          `This creates invalid HTML and may cause accessibility issues.\n\n` +
          `Valid children for ${variant === "heading" ? "headings" : variant === "script" || variant === "display" ? "script/display" : "paragraphs"}: ` +
          `<span>, <a>, <strong>, <em>, <code>, text, or inline elements.\n\n` +
          `Consider:\n` +
          `- Use <span> for inline styling\n` +
          `- Move block elements outside the Typography component\n` +
          `- Use semantic HTML structure`,
      );
    }

    if (!isTypographyElement(childType)) {
      continue;
    }

    const childProps = child.props;
    if (!hasVariant(childProps)) {
      continue;
    }

    const childTagName = getTypographyTagFromProps(childProps);

    if (BLOCK_ELEMENTS.includes(childTagName)) {
      console.warn(
        `⚠️ Typography: Nested Typography with block-level tag detected!\n` +
          `<${childTagName}> (Typography ${childProps.variant}) nested inside <${parentTag}> (Typography ${variant}).\n` +
          `This creates invalid HTML structure.\n\n` +
          `Solution: Use tag="span" for the nested Typography component.`,
      );
    }
  }
}
