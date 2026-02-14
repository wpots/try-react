import NextImage from "next/image";
import { useTranslations } from "next-intl";
import { Image, cn } from "@repo/ui";

import type { LogoProps } from "./index";

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

export function Logo({
  size = "md",
  showText = true,
  className,
  id = "logo",
  href = "#home",
  ...props
}: LogoProps): React.JSX.Element {
  const t = useTranslations("landing.brand");

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
        nextImageComponent={NextImage}
        className={IMAGE_SIZE_CLASSNAMES[size]}
      />
      {showText ? (
        <span className={cn("font-display", TEXT_SIZE_CLASSNAMES[size])}>{t("wordmark")}</span>
      ) : null}
    </a>
  );
}
