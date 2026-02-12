import "./globals.css";
import { Dawning_of_a_New_Day, Fraunces, Nunito } from "next/font/google";
import { getLocale } from "next-intl/server";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const dawningOfANewDay = Dawning_of_a_New_Day({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning className={`${nunito.variable} ${fraunces.variable} ${dawningOfANewDay.variable}`}>
        {children}
      </body>
    </html>
  );
}
