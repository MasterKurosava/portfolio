import type { MetadataRoute } from "next";
import { routing } from "@/lib/i18n/routing";
import { localeUrl } from "@/lib/site";

/** Every indexable page, by its locale-neutral href. */
const PAGES = [
  { href: "/", priority: 1 },
  { href: "/cv", priority: 0.9 },
  { href: "/work/whitewill", priority: 0.8 },
  { href: "/projects/diorama", priority: 0.8 },
] as const;

const LAST_MODIFIED = new Date("2026-11-22T00:00:00Z");

function languages(href: string): Record<string, string> {
  return {
    ...Object.fromEntries(routing.locales.map((l) => [l, localeUrl(l, href)])),
    "x-default": localeUrl(routing.defaultLocale, href),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.flatMap(({ href, priority }) =>
    routing.locales.map((locale) => ({
      url: localeUrl(locale, href),
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: languages(href) },
    })),
  );
}
