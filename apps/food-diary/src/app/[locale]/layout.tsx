import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { locales } from "@/i18n/config";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Food Diary",
  description: "Track your food diary entries",
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
  const t = await getTranslations("nav");
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <main style={{ padding: "2rem", maxWidth: "56rem", margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <nav style={{ display: "flex", gap: "1rem" }}>
            <Link href="/">{t("home")}</Link>
            <Link href="/entry/create">{t("createEntry")}</Link>
            <Link href="/auth-test">{t("authTest")}</Link>
          </nav>
          <LanguageSwitcher />
        </header>
        {children}
      </main>
    </NextIntlClientProvider>
  );
}
