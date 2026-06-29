import type { Metadata } from "next";
import { Syne, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/lib/i18n/routing";
import { resolveSiteOrigin, buildPageAlternates } from "@/lib/site";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Header } from "@/components/layout/Header";
import { ThemeScript } from "@/components/layout/ThemeScript";
import { SkipLink } from "@/components/layout/SkipLink";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
import "../globals.css";

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  variable: "--font-syne",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const keywords = t.raw("keywords") as string[];
  const siteOrigin = await resolveSiteOrigin();
  const alternates = buildPageAlternates(locale, siteOrigin);
  const pageUrl = alternates.canonical;
  const ogLocale = locale === "ru" ? "ru_RU" : "en_US";
  const alternateOgLocale = locale === "ru" ? "en_US" : "ru_RU";

  return {
    metadataBase: new URL(siteOrigin),
    title: t("title"),
    description: t("description"),
    keywords,
    authors: [{ name: locale === "ru" ? "Михаил Калачёв" : "Mikhail Kalachev" }],
    creator: locale === "ru" ? "Михаил Калачёв" : "Mikhail Kalachev",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates,
    icons: {
      icon: "/images/icon.ico",
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: pageUrl,
      siteName: t("title"),
      locale: ogLocale,
      alternateLocale: [alternateOgLocale],
      images: [
        {
          url: "/images/profile.png",
          width: 1200,
          height: 1500,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/images/profile.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ru" | "en")) {
    notFound();
  }

  const messages = await getMessages();
  const siteOrigin = await resolveSiteOrigin();

  return (
    <html
      lang={locale}
      className={`dark ${syne.variable} ${jetbrains.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="font-display antialiased">
        <PersonJsonLd locale={locale} siteOrigin={siteOrigin} />
        <NextIntlClientProvider messages={messages}>
          <SmoothScrollProvider>
            <SkipLink />
            <div className="grain" aria-hidden />
            <Header />
            <main id="main">{children}</main>
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
