"use client";

import { Card, Container, Label, Section, Typography } from "@repo/ui";

import type { ProductFeaturesProps } from "./index";
import { PageIndicator } from "@/components/PageIndicator";
import { ActivePreviewWrapper } from "./partials/ActivePreviewWrapper";
import { FeatureItemContent } from "./partials/FeatureItemContent";
import { DesktopPhoneFrame, MobilePhoneFrame } from "./partials/Phoneframe";
import { useActiveFeatureIndex } from "./hooks/useActiveFeatureIndex";
import { getFeatureOption, hasAnyPreview } from "./utils/featureOptions";

import classnames from "@/utils/classnames/classnames";

export function ProductFeatures({
  eyebrow,
  heading,
  description,
  items,
  className,
  id = "product-features",
  ...props
}: ProductFeaturesProps): React.JSX.Element {
  const [activeIdx, setRef, isLg] = useActiveFeatureIndex(items.length);
  const itemIds = items.map(i => i.id);
  const showPhoneColumn = hasAnyPreview(itemIds);

  return (
    <Section
      data-component-type="ProductFeatures"
      id={id}
      variant="neutral"
      spacing="default"
      className={classnames(className)}
      {...props}
    >
      <Container size="wide" className="flex flex-col gap-ds-4xl">
        <div className="flex flex-col gap-ds-xl">
          {eyebrow ? <Label className="mx-auto">{eyebrow}</Label> : null}
          <Typography tag="h2" variant="heading" size={{ base: "lg", md: "xl" }} className="text-center">
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
        </div>

        {/* Desktop: two-column scrollytelling when previews exist */}
        <div className="hidden lg:flex lg:gap-ds-xl">
          {showPhoneColumn ? (
            <div className="w-[340px] shrink-0">
              <div className="sticky top-24">
                <DesktopPhoneFrame>
                  {items.map((item, idx) => {
                    const option = getFeatureOption(item.id);
                    const Preview = option.Preview;
                    return (
                      <div
                        key={item.id}
                        className={classnames(
                          "absolute inset-0 px-ds-m py-ds-m transition-opacity duration-500",
                          activeIdx === idx ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                        )}
                      >
                        {Preview ? <ActivePreviewWrapper Preview={Preview} isActive={activeIdx === idx} /> : null}
                      </div>
                    );
                  })}
                </DesktopPhoneFrame>
                <PageIndicator count={items.length} activeIndex={activeIdx} />
              </div>
            </div>
          ) : null}

          <div className="flex-1">
            <div className="flex flex-col gap-ds-m">
              {items.map((item, idx) => {
                const option = getFeatureOption(item.id);
                return (
                  <Card
                    key={item.id}
                    ref={isLg ? setRef(idx) : undefined}
                    className={classnames(
                      activeIdx === idx ? "shadow-ds-elevation-2 -translate-x-ds-xxs -translate-y-ds-xxs" : "",
                    )}
                  >
                    <FeatureItemContent item={item} option={option} isActive={activeIdx === idx} variant="desktop" />
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: stacked cards with optional inline preview */}
        <div className="flex flex-col gap-ds-xl lg:hidden">
          {items.map((item, idx) => {
            const option = getFeatureOption(item.id);
            const Preview = option.Preview;
            return (
              <div
                key={item.id}
                ref={!isLg ? setRef(idx) : undefined}
                className="rounded-ds-2xl border border-ds-border/50 bg-ds-surface p-ds-m"
              >
                <FeatureItemContent item={item} option={option} variant="mobile" />
                {Preview ? (
                  <div className="mt-ds-m">
                    <MobilePhoneFrame>
                      <Preview />
                    </MobilePhoneFrame>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
