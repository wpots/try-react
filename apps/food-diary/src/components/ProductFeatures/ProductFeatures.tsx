import NextImage from "next/image";
import { Container, Section, Typography } from "@repo/ui";
import { Image } from "@repo/ui";

import type { ProductFeaturesProps } from "./index";

import classnames from "@/utils/classnames/classnames";

export function ProductFeatures({
  heading,
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
      <Container size="wide">
        <Typography
          tag="h2"
          variant="heading"
          size={{ base: "md", md: "xl" }}
          className="text-ds-on-surface-strong"
        >
          {heading}
        </Typography>

        <div className="mt-ds-xl grid gap-ds-xl lg:grid-cols-2">
          <div className="grid gap-ds-l md:grid-cols-2">
            {items.map((item) => (
              <article key={item.id} className="space-y-ds-xs">
                <Typography
                  tag="h3"
                  variant="heading"
                  size="sm"
                  className="text-ds-on-surface-strong"
                >
                  {item.title}
                </Typography>
                <Typography
                  tag="p"
                  variant="body"
                  size="base"
                  className="text-ds-on-surface"
                >
                  {item.description}
                </Typography>
              </article>
            ))}
          </div>

          <figure className="sticky top-24 self-start">
            <div className="relative mx-auto w-full max-w-sm">
              <Image
                src="/img/phone_mockup.png"
                alt=""
                aria-hidden
                width={420}
                height={860}
                nextImageComponent={NextImage}
                className="h-auto w-full drop-shadow-2xl"
              />
              <Image
                src="/img/slide_moment.png"
                alt=""
                aria-hidden
                width={260}
                height={560}
                nextImageComponent={NextImage}
                className="absolute left-1/2 top-1/2 w-3/4 -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </figure>
        </div>
      </Container>
    </Section>
  );
}
