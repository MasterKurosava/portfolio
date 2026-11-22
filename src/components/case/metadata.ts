import type { Metadata } from "next";
import { getContent } from "@/content";
import type { CaseMeta } from "@/content/cases";
import { buildPageAlternates, resolveSiteOrigin } from "@/lib/site";

/** The day the case pages were written: their publication and modification date. */
export const CASE_DATE = "2026-11-22";

export interface ShareImage {
  url: string;
  width: number;
  height: number;
}

/**
 * Metadata of a case page. The layout's Open Graph block describes the home page, so each case
 * page replaces it whole with its own title, URL and picture.
 */
export async function caseMetadata(locale: string, path: string, meta: CaseMeta, image: ShareImage): Promise<Metadata> {
  const c = getContent(locale);
  const origin = await resolveSiteOrigin();
  const alternates = buildPageAlternates(locale, origin, path);
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates,
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.description,
      url: alternates.canonical,
      siteName: c.hero.name,
      locale: locale === "en" ? "en_US" : "ru_RU",
      alternateLocale: [locale === "en" ? "ru_RU" : "en_US"],
      publishedTime: CASE_DATE,
      modifiedTime: CASE_DATE,
      authors: [c.hero.name],
      images: [{ ...image, alt: meta.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [{ url: image.url, alt: meta.imageAlt }],
    },
  };
}
