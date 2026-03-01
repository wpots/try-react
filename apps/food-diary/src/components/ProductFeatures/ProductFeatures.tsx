"use client";

import { Card, Container, Label, Section, cn } from "@repo/ui";

import { PageIndicator } from "@/components/PageIndicator";
import { SectionHeader } from "@/components/SectionHeader";

import { useActiveFeatureIndex } from "./hooks/useActiveFeatureIndex";
import { ActivePreviewWrapper } from "./partials/ActivePreviewWrapper";
import { FeatureItemContent } from "./partials/FeatureItemContent";
import { DesktopPhoneFrame, MobilePhoneFrame } from "./partials/Phoneframe";
import { getFeatureOption, hasAnyPreview } from "./utils/featureOptions";

import type { ProductFeaturesProps } from "./index";

export function ProductFeatures({
  eyebrow,
  heading,
  description,
  items,
  className,
  id = "product-features",
  ...props
}: ProductFeaturesProps): React.JSX.Element {
  const [activeIdx, setRef, isDesktop] = useActiveFeatureIndex(items.length);
  const itemIds = items.map(i => i.id);
  const showPhoneColumn = hasAnyPreview(itemIds);

  return (
    <Section
      data-component-type="ProductFeatures"
      id={id}
      variant="neutral"
      spacing="default"
      className={cn(className)}
      {...props}
    >
      <Container size="wide" className="flex flex-col gap-ds-4xl">
        <SectionHeader
          eyebrow={<Label className="mx-auto">{eyebrow}</Label>}
          heading={heading}
          description={description}
        />

        {/* Desktop: two-column scrollytelling when previews exist */}
        <div className="hidden md:flex md:items-start md:gap-ds-xl">
          {showPhoneColumn ? (
            <div className="h-fit w-[340px] shrink-0 self-start md:sticky md:top-24">
              <DesktopPhoneFrame>
                {items.map((item, idx) => {
                  const option = getFeatureOption(item.id);
                  const Preview = option.Preview;
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "absolute inset-0 px-ds-m py-ds-m transition-opacity duration-500",
                        activeIdx === idx ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
                      )}
                    >
                      {Preview ? <ActivePreviewWrapper Preview={Preview} isActive={activeIdx === idx} /> : null}
                    </div>
                  );
                })}
              </DesktopPhoneFrame>
              <PageIndicator count={items.length} activeIndex={activeIdx} aria-label={heading} />
            </div>
          ) : null}

          <div className="flex-1">
            <div className="flex flex-col gap-ds-m">
              {items.map((item, idx) => {
                const option = getFeatureOption(item.id);
                return (
                  <div key={item.id} ref={isDesktop ? setRef(idx) : undefined}>
                    <Card
                      className={cn(
                        activeIdx === idx ? "shadow-ds-elevation-2 -translate-x-ds-xxs -translate-y-ds-xxs" : "",
                      )}
                    >
                      <FeatureItemContent item={item} option={option} isActive={activeIdx === idx} variant="desktop" />
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: stacked cards with optional inline preview */}
        <div className="flex flex-col gap-ds-xl md:hidden">
          {items.map((item, idx) => {
            const option = getFeatureOption(item.id);
            const Preview = option.Preview;
            return (
              <div key={item.id} ref={!isDesktop ? setRef(idx) : undefined}>
                <Card>
                  <FeatureItemContent item={item} option={option} variant="mobile" />
                  {Preview ? (
                    <div className="mt-ds-m w-full">
                      <MobilePhoneFrame>
                        <Preview />
                      </MobilePhoneFrame>
                    </div>
                  ) : null}
                </Card>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
