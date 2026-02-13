"use client";

import { Container, Label, Section, Typography } from "@repo/ui";

import type { ProductFeaturesProps } from "./index";
import { PageIndicator } from "@/components/PageIndicator";
import { ActivePreviewWrapper } from "./partials/ActivePreviewWrapper";
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
      <Container size="wide" className="flex flex-col gap-ds-l">
        {eyebrow ? <Label>{eyebrow}</Label> : null}
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
                const Icon = option.icon;
                return (
                  <div
                    key={item.id}
                    ref={isLg ? setRef(idx) : undefined}
                    className={classnames(
                      "p-ds-xxl transition-all duration-300 rounded-ds-xl",
                      activeIdx === idx ? "bg-ds-surface/70" : "",
                    )}
                  >
                    <div className="flex items-start gap-ds-m">
                      <div
                        className={classnames(
                          "flex h-12 w-12 shrink-0 items-center justify-center rounded-ds-xl transition-transform duration-300",
                          option.colorClass,
                          activeIdx === idx ? "scale-110" : "",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <Typography tag="h3" variant="heading" size={{ base: "md", md: "xl" }}>
                          {item.title}
                        </Typography>

                        <Typography tag="p" variant="body" size={{ base: "base", md: "lg" }}>
                          {item.description}
                        </Typography>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile: stacked cards with optional inline preview */}
        <div className="flex flex-col gap-ds-xl lg:hidden">
          {items.map((item, idx) => {
            const option = getFeatureOption(item.id);
            const Icon = option.icon;
            const Preview = option.Preview;
            return (
              <div
                key={item.id}
                ref={!isLg ? setRef(idx) : undefined}
                className="rounded-ds-2xl border border-ds-border/50 bg-ds-surface p-ds-m"
              >
                <div className="flex items-start gap-ds-m">
                  <div
                    className={classnames(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-ds-xl",
                      option.colorClass,
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-ds-heading-sm text-ds-on-surface">{item.title}</h3>
                    <p className="mt-ds-xs font-ds-body-sm text-ds-on-surface-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
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
