"use client";

import { Button, Text } from "@repo/ui";
import type { HomeSplashViewProps } from "./index";
import { FeatureItem, SplashPanel } from "./partials";

export function HomeSplashView({
  title,
  appName,
  subtitle,
  accountTitle,
  guestTitle,
  accountFeatureDevice,
  accountFeaturePrivacy,
  guestFeatureLocal,
  guestFeatureWarning,
  accountCta,
  guestCta,
  footerPrefix,
  footerLink,
  onGoogleClick,
  onGuestClick,
  isGoogleDisabled = false,
  isGuestDisabled = false,
  errorMessage,
}: HomeSplashViewProps): React.JSX.Element {
  return (
    <section className="grid pb-16 pt-4 sm:pb-8 sm:pt-2">
      <div className="mx-auto w-full max-w-4xl rounded-lg border border-border/35 bg-surface shadow-2xl">
        <header className="px-6 pt-6 text-center sm:px-4 sm:pt-4">
          <h1 className="m-0 text-4xl leading-none font-light text-foreground-strong sm:text-3xl">
            {title}{" "}
            <strong className="font-display font-semibold text-foreground-muted">
              {appName}
            </strong>
          </h1>
          <p className="mb-6 mt-3 text-xl text-foreground-strong/85 sm:mb-4 sm:text-base">
            {subtitle}
          </p>
        </header>

        <div className="grid gap-3 px-3 pb-1 md:grid-cols-2">
          <SplashPanel
            cta={
              <Button
                className="w-56"
                disabled={isGoogleDisabled}
                onClick={onGoogleClick}
                type="button"
              >
                {accountCta}
              </Button>
            }
            title={accountTitle}
            tone="account"
          >
            <FeatureItem icon="A" text={accountFeatureDevice} />
            <FeatureItem icon="S" text={accountFeaturePrivacy} />
          </SplashPanel>

          <SplashPanel
            cta={
              <Button
                className="w-56"
                disabled={isGuestDisabled}
                onClick={onGuestClick}
                type="button"
                variant="secondary"
              >
                {guestCta}
              </Button>
            }
            title={guestTitle}
            tone="guest"
          >
            <FeatureItem icon="L" text={guestFeatureLocal} />
            <FeatureItem icon="W" text={guestFeatureWarning} />
          </SplashPanel>
        </div>

        {errorMessage ? (
          <Text className="mt-3 text-center" tone="danger">
            {errorMessage}
          </Text>
        ) : null}

        <footer className="px-4 py-4 text-center text-xs leading-5 text-foreground-strong/82">
          {footerPrefix}{" "}
          {footerLink}
        </footer>
      </div>
    </section>
  );
}
