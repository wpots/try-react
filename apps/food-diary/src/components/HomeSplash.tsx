"use client";

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button, Text } from "@repo/ui";
import { mergeGuestEntries } from "@/app/actions";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { signInAnonymously, signInWithGoogle } from "@/lib/auth";

interface FeatureItemProps {
  icon: string;
  text: string;
}

interface SplashPanelProps {
  title: string;
  cta: ReactNode;
  tone: "account" | "guest";
  children: ReactNode;
}

function FeatureItem({ icon, text }: FeatureItemProps): React.JSX.Element {
  return (
    <li className="flex items-start gap-3 border-t border-border/35 px-4 py-3 text-xs leading-5 text-foreground-strong">
      <span
        aria-hidden
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground-strong/10 text-xs font-semibold text-foreground-strong/55"
      >
        {icon}
      </span>
      <span>{text}</span>
    </li>
  );
}

function SplashPanel({
  title,
  cta,
  tone,
  children,
}: SplashPanelProps): React.JSX.Element {
  const toneClasses =
    tone === "account"
      ? "bg-gradient-to-br from-panel-account-start to-panel-account-end"
      : "bg-gradient-to-br from-panel-guest-start to-panel-guest-end";

  return (
    <article className={`flex min-h-80 flex-col overflow-hidden rounded-md shadow-lg ${toneClasses}`}>
      <h2 className="px-4 pt-4 text-center text-2xl font-semibold text-surface/60">
        {title}
      </h2>
      <div className="grid min-h-44 grow place-items-end px-3 py-3 sm:place-items-center">
        {cta}
      </div>
      <ul className="m-0 list-none bg-surface p-0">{children}</ul>
    </article>
  );
}

export function HomeSplash(): React.JSX.Element {
  const t = useTranslations("home.splash");
  const router = useRouter();
  const { isGuest, loading, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submittingMethod, setSubmittingMethod] = useState<
    "guest" | "google" | null
  >(null);

  const handleGuestLogin = async () => {
    setError(null);
    setSubmittingMethod("guest");

    try {
      await signInAnonymously();
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("guestError");
      setError(message);
    } finally {
      setSubmittingMethod(null);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setSubmittingMethod("google");

    try {
      const result = await signInWithGoogle(user);
      if (result.mergedFromGuestId) {
        const mergeResult = await mergeGuestEntries(
          result.mergedFromGuestId,
          result.user.uid,
        );
        if (!mergeResult.success) {
          throw new Error(mergeResult.error ?? t("mergeError"));
        }
      }
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : t("googleError");
      setError(message);
    } finally {
      setSubmittingMethod(null);
    }
  };

  const isBusy = loading || submittingMethod !== null;
  const isGoogleDisabled = isBusy || Boolean(user && !isGuest);
  const isGuestDisabled = isBusy || Boolean(user);

  return (
    <section className="grid pb-16 pt-4 sm:pb-8 sm:pt-2">
      <div className="mx-auto w-full max-w-4xl rounded-lg border border-border/35 bg-surface shadow-2xl">
        <header className="px-6 pt-6 text-center sm:px-4 sm:pt-4">
          <h1 className="m-0 text-4xl leading-none font-light text-foreground-strong sm:text-3xl">
            {t("title")} {" "}
            <strong className="font-display font-semibold text-foreground-muted">
              {t("appName")}
            </strong>
          </h1>
          <p className="mb-6 mt-3 text-xl text-foreground-strong/85 sm:mb-4 sm:text-base">
            {t("subtitle")}
          </p>
        </header>

        <div className="grid gap-3 px-3 pb-1 md:grid-cols-2">
          <SplashPanel
            tone="account"
            title={t("accountTitle")}
            cta={
              <Button
                type="button"
                className="w-56"
                onClick={handleGoogleLogin}
                disabled={isGoogleDisabled}
              >
                {submittingMethod === "google"
                  ? t("googleLoading")
                  : t("googleCta")}
              </Button>
            }
          >
            <FeatureItem icon="A" text={t("accountFeatureDevice")} />
            <FeatureItem icon="S" text={t("accountFeaturePrivacy")} />
          </SplashPanel>

          <SplashPanel
            tone="guest"
            title={t("guestTitle")}
            cta={
              <Button
                type="button"
                variant="secondary"
                className="w-56"
                onClick={handleGuestLogin}
                disabled={isGuestDisabled}
              >
                {submittingMethod === "guest"
                  ? t("guestLoading")
                  : t("guestCta")}
              </Button>
            }
          >
            <FeatureItem icon="L" text={t("guestFeatureLocal")} />
            <FeatureItem icon="W" text={t("guestFeatureWarning")} />
          </SplashPanel>
        </div>

        {error ? (
          <Text tone="danger" className="mt-3 text-center">
            {error}
          </Text>
        ) : null}

        <footer className="px-4 py-4 text-center text-xs leading-5 text-foreground-strong/82">
          {t("footerPrefix")} {" "}
          <Link className="text-foreground-muted underline" href="/auth/login">
            {t("footerLink")}
          </Link>
        </footer>
      </div>
    </section>
  );
}
