"use client";

import { useTranslations } from "next-intl";
import { Image, cn } from "@repo/ui";

import type { LogoProps } from "./index.ts";

const IMAGE_SIZE_CLASSNAMES: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

const TEXT_SIZE_CLASSNAMES: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-xl",
};

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function Logo({
  size = "md",
  showText = true,
  scrollProgress,
  className,
  id = "logo",
  href = "#home",
  component: ImageComponent,
  ...props
}: LogoProps): React.JSX.Element {
  const t = useTranslations("landing.brand");
  const progress = scrollProgress !== undefined ? easeOutCubic(scrollProgress) : undefined;

  const isAnimated = progress !== undefined;

  if (isAnimated) {
    const expandedScale = 1 - progress * 0.85;
    const expandedOpacity = 1 - progress;
    const collapsedScale = 0.4 + 0.6 * progress;
    const collapsedOpacity = progress;

    return (
      <a
        data-component-type="Logo"
        id={id}
        href={href}
        className={cn(
          "relative inline-flex h-ds-xl items-center  no-underline md:h-ds-3xl",
          "min-w-[theme(spacing.24)] shrink-0 overflow-visible transition-[min-width] duration-300 ease-out",
          className,
        )}
        style={{ minWidth: progress < 1 ? "22rem" : undefined }}
        {...props}
      >
        {/* Expanded: large "The Real You" — shrinks and fades as user scrolls */}
        <span
          className="absolute left-ds-xl top-ds-xxl inline-block whitespace-nowrap font-ds-script-2xl origin-top-left will-change-transform text-ds-on-surface"
          style={{
            transform: `scale(${expandedScale})`,
            opacity: expandedOpacity,
          }}
          aria-hidden={progress > 0.5}
        >
          {t("wordmark")}
        </span>
        {/* Collapsed: small pebble + "Try" — fades in and scales up */}
        <span
          className="absolute left-0 top-1/2 flex -translate-y-1/2 origin-top-left items-center gap-ds-s will-change-transform"
          style={{
            transform: `scale(${collapsedScale})`,
            opacity: collapsedOpacity,
          }}
          aria-hidden={progress < 0.5}
        >
          <Image
            src="/img/pebblesgreen.png"
            alt=""
            width={48}
            height={48}
            component={ImageComponent}
            className="h-8 w-8 shrink-0 md:size-ds-4xl"
            aria-hidden
          />
          <span className="font-ds-script-base">{t("wordmarkShort")}</span>
        </span>
        {/* Accessible label: always the full brand name */}
        <span className="sr-only">{t("wordmark")}</span>
      </a>
    );
  }

  return (
    <a
      data-component-type="Logo"
      id={id}
      href={href}
      className={cn("inline-flex items-center gap-ds-s text-inherit no-underline", className)}
      {...props}
    >
      <Image
        src="/img/pebblesblue.png"
        alt={t("logoAlt")}
        width={48}
        height={48}
        component={ImageComponent}
        className={IMAGE_SIZE_CLASSNAMES[size]}
      />
      {showText ? <span className={cn("font-display", TEXT_SIZE_CLASSNAMES[size])}>{t("wordmark")}</span> : null}
    </a>
  );
}
