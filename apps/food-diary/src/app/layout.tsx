import "./globals.css";
import { Lato, Rajdhani } from "next/font/google";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${lato.variable} ${rajdhani.variable}`}>{children}</body>
    </html>
  );
}
