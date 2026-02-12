import NextImage from "next/image";
import { Container, Section, Typography, Label } from "@repo/ui";
import { Image } from "@repo/ui";

import type { ProductFeaturesProps } from "./index";

import classnames from "@/utils/classnames/classnames";

const FEATURE_PREVIEW_BY_ID: Record<string, string> = {
  "feature-moments": "/img/slide_moments.png",
  "feature-without-triggers": "/img/slide_empty.png",
  "feature-feelings": "/img/slide_emotions.png",
  "feature-behaviors": "/img/slide_behaviour.png",
  "feature-export": "/img/slide_export.png",
  "feature-saved": "/img/slide_overview.png",
};

export function ProductFeatures({
  heading,
  description,
  items,
  className,
  id = "product-features",
  ...props
}: ProductFeaturesProps): React.JSX.Element {
  return (
    <Section
      data-component-type="ProductFeatures"
      id={id}
      spacing="default"
      className={classnames("bg-ds-surface-subtle", className)}
      {...props}
    >
      <Container size="wide" className="flex flex-col gap-ds-l">
        <Label>The Real You</Label>
        <Typography tag="h2" variant="heading" size={{ base: "md", md: "xl" }}>
          {heading}
        </Typography>
        <Typography
          tag="p"
          variant="body"
          size={{ base: "base", md: "lg" }}
          className="mt-ds-s text-ds-on-surface-muted [&>span+span]:mt-ds-s"
        >
          {description.split("\n").map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </Typography>

        <div className="grid gap-ds-m md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => {
            const previewSrc =
              FEATURE_PREVIEW_BY_ID[item.id] ?? "/img/slide_moment.png";

            return (
              <article
                key={item.id}
                className="rounded-ds-lg border border-ds-border bg-ds-surface-elevated p-ds-m"
              >
                <Typography
                  tag="p"
                  variant="body"
                  size="sm"
                  className="text-ds-on-surface-muted"
                >
                  {String(index + 1).padStart(2, "0")}
                </Typography>
                <Typography
                  tag="h3"
                  variant="heading"
                  size="sm"
                  className="mt-ds-xs text-ds-on-surface-strong"
                >
                  {item.title}
                </Typography>
                <Typography
                  tag="p"
                  variant="body"
                  size="base"
                  className="mt-ds-xs text-ds-on-surface"
                >
                  {item.description}
                </Typography>

                <div className="mt-ds-m overflow-hidden rounded-ds-md border border-ds-border bg-ds-surface">
                  <Image
                    src={previewSrc}
                    alt={item.title}
                    width={680}
                    height={420}
                    nextImageComponent={NextImage}
                    className="h-auto w-full"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
