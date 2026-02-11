import NextImage from "next/image";
import { Typography } from "@repo/ui";
import { Image } from "@repo/ui";
import { useTranslations } from "next-intl";

import type { PageHeroProps } from "./index";

import classnames from "@/utils/classnames/classnames";

export function PageHero({
  backgroundImage,
  className,
  id = "hero-section",
  ...props
}: PageHeroProps): React.JSX.Element {
  const t = useTranslations("landing.hero");

  return (
    <section
      data-component-type="PageHero"
      id={id}
      className={classnames(
        "relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <Image
        id="home"
        src={backgroundImage}
        alt=""
        fill
        sizes="100vw"
        nextImageComponent={NextImage}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ds-brand-ink/40" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-ds-l py-ds-5xl md:px-ds-xl">
        <Typography
          tag="h1"
          variant="heading"
          size={{ base: "lg", md: "2xl" }}
          className="max-w-3xl text-ds-on-primary"
        >
          {t("title")}
        </Typography>
        <Typography
          tag="p"
          variant="body"
          size={{ base: "lg", md: "xl" }}
          className="mt-ds-m max-w-2xl text-ds-on-primary"
        >
          {t("subtitle")}
        </Typography>
      </div>
    </section>
  );
}
