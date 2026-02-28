import { SkipLink } from "@repo/ui";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { AuthProvider } from "@/contexts/AuthContext";
import { ReactAriaProvider } from "@/contexts/ReactAriaProvider/ReactAriaProvider";
import { locales } from "@/i18n/config";

import type { Metadata } from "next";


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
      <ReactAriaProvider>
        <AuthProvider>
          <SkipLink>{tCommon("skipToContent")}</SkipLink>
          {children}
        </AuthProvider>
      </ReactAriaProvider>
    </NextIntlClientProvider>
  );
}
