import "./globals.css";
import { Allura, Merriweather, Nunito } from "next/font/google";
import { getLocale } from "next-intl/server";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-display",
  display: "swap",
});

const allura = Allura({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  const fontVariables = [nunito.variable, merriweather.variable, allura.variable].join(" ");

  return (
    <html lang={locale} suppressHydrationWarning className={fontVariables}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
