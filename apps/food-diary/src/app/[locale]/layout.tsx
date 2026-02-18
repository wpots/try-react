import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { AuthProvider } from "@/contexts/AuthContext";
import { locales } from "@/i18n/config";

import { SkipLink } from "@repo/ui";

export const metadata: Metadata = {
  title: "Food Diary",
  description: "Track your food diary entries",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AuthProvider>
        <SkipLink>{tCommon("skipToContent")}</SkipLink>
        {children}
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
