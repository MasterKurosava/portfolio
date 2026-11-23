import type { Metadata, Viewport } from "next";
import { Geologica, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/lib/i18n/routing";
import { buildPageAlternates, resolveSiteOrigin } from "@/lib/site";
import { getContent, isLocale } from "@/content";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ActionBar } from "@/components/layout/ActionBar";
import { DioramaStart } from "@/components/diorama/DioramaStart";
import { Loader } from "@/components/layout/Loader";
import { Designations } from "@/components/diorama/Designations";
import { PersonJsonLd } from "@/components/seo/PersonJsonLd";
import "../globals.css";

const geologica = Geologica({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geologica",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: "#121110",
  colorScheme: "dark",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = getContent(locale);
  const origin = await resolveSiteOrigin();
  const alternates = buildPageAlternates(locale, origin);
  const image = { url: `/og/${locale === "en" ? "en" : "ru"}`, width: 1200, height: 630, alt: c.meta.ogAlt };
  return {
    metadataBase: new URL(origin),
    title: { default: c.meta.title, template: `%s · ${c.hero.name}` },
    description: c.meta.description,
    keywords: c.meta.keywords,
    authors: [{ name: c.hero.name, url: origin }],
    creator: c.hero.name,
    alternates,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    // "MK" in the site's face: M in ink, K in the amber light, on the stage.
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
    openGraph: {
      type: "profile",
      firstName: locale === "en" ? "Mikhail" : "Михаил",
      lastName: locale === "en" ? "Kalachev" : "Калачёв",
      title: c.meta.title,
      description: c.meta.description,
      url: alternates.canonical,
      siteName: c.hero.name,
      locale: locale === "en" ? "en_US" : "ru_RU",
      alternateLocale: [locale === "en" ? "ru_RU" : "en_US"],
      images: [image],
    },
    twitter: { card: "summary_large_image", title: c.meta.title, description: c.meta.description, images: [image] },
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
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const c = getContent(locale);
  const origin = await resolveSiteOrigin();

  return (
    <html lang={locale} className={`${geologica.variable} ${jetbrains.variable}`} data-loading="">
      <body>
        <Loader name={c.hero.name} />
        <PersonJsonLd content={c} origin={origin} />
        <NextIntlClientProvider locale={locale} messages={{}}>
          {/* First in the page: the stream under every copy. Last: its lifted part over them. */}
          <div className="stream-field" data-dio="stream" data-dio-load="eager" aria-hidden />
          <a href="#main" className="skip-link">
            {c.ui.skip}
          </a>
          <Header content={c} />
          <main id="main">{children}</main>
          <Footer content={c} />
          <ActionBar content={c} />
          <Designations />
          <div className="stream-field" data-dio="stream" data-dio-front="true" data-dio-load="eager" aria-hidden />
          <DioramaStart />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
