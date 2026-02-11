import "./globals.css";
import {
  Dawning_of_a_New_Day,
  Lato,
  Rajdhani,
} from "next/font/google";
import { getLocale } from "next-intl/server";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
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
      <body
        suppressHydrationWarning
        className={`${lato.variable} ${rajdhani.variable} ${dawningOfANewDay.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
