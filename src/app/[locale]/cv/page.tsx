import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getContent, isLocale } from "@/content";
import { getCv } from "@/content/cv";
import { buildPageAlternates, resolveSiteOrigin } from "@/lib/site";
import { CvDocument } from "@/components/cv/CvDocument";

/**
 * Print rules for this page only: A4 portrait, black ink on white paper whatever the
 * on-screen colours, and no site chrome. globals.css already hides
 * the header, the action bar and .no-print.
 */
const PRINT_CSS = `
@page { size: A4; margin: 14mm; }
@media print {
  html:root, html.dark {
    --paper: #fff;
    --paper-deep: #fff;
    --ink: #000;
    --ink-soft: #1f1f22;
    --ink-mute: #4b4b50;
    --hair: rgb(0 0 0 / 0.2);
    --rule: #000;
    --spot: #000;
    --spot-ink: #fff;
    color-scheme: light;
  }
  html, body { background: #fff !important; }
  body { min-height: 0; }
  body > footer, .skip-link, .designation, .designation-frame { display: none !important; }
  .link { text-decoration: none; }
}
`;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = getContent(locale);
  const cv = getCv(locale);
  const origin = await resolveSiteOrigin();
  const alternates = buildPageAlternates(locale, origin, "/cv");
  const title = `${cv.meta.title} · ${c.hero.name}`;
  // A page-level openGraph replaces the layout's, file-based image included, so the image is named again.
  const image = { url: `/og/${locale === "en" ? "en" : "ru"}`, width: 1200, height: 630, alt: c.meta.ogAlt };
  return {
    title: cv.meta.title,
    description: cv.meta.description,
    alternates,
    openGraph: {
      type: "profile",
      firstName: locale === "en" ? "Mikhail" : "Михаил",
      lastName: locale === "en" ? "Kalachev" : "Калачёв",
      title,
      description: cv.meta.description,
      url: alternates.canonical,
      siteName: c.hero.name,
      locale: locale === "en" ? "en_US" : "ru_RU",
      alternateLocale: [locale === "en" ? "ru_RU" : "en_US"],
      images: [image],
    },
    twitter: { card: "summary_large_image", title, description: cv.meta.description, images: [image] },
  };
}

export default async function CvPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = isLocale(locale) ? locale : "ru";
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <CvDocument locale={lang} content={getContent(lang)} cv={getCv(lang)} />
    </>
  );
}
