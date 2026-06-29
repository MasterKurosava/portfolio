import { headers } from "next/headers";
import { routing } from "@/lib/i18n/routing";
import { getPathname } from "@/lib/i18n/navigation";

const PRODUCTION_ORIGIN = "https://kalachev.dev";

function isPlaceholderSiteUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "example.com" || hostname === "www.example.com";
  } catch {
    return false;
  }
}

function configuredSiteUrl(): string | undefined {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!fromEnv || isPlaceholderSiteUrl(fromEnv)) return undefined;
  return fromEnv;
}

/** Sync origin for sitemap, robots, and build-time static generation. */
export function getSiteUrl(): string {
  const configured = configuredSiteUrl();
  if (configured) return configured;

  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_ORIGIN;
  }

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

/** Request-aware origin for metadata, JSON-LD, and other per-request SEO output. */
export async function resolveSiteOrigin(): Promise<string> {
  const configured = configuredSiteUrl();
  if (configured) return configured;

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  if (host) {
    const protocol = headerList.get("x-forwarded-proto") ?? "https";
    return `${protocol}://${host.split(",")[0].trim()}`;
  }

  return getSiteUrl();
}

export function localePath(locale: string, href = "/"): string {
  return getPathname({ locale, href });
}

export function absoluteUrl(path = "", origin = getSiteUrl()): string {
  if (!path) return origin;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localeUrl(locale: string, href = "/", origin = getSiteUrl()): string {
  return absoluteUrl(localePath(locale, href), origin);
}

export function buildPageAlternates(locale: string, origin: string, href = "/") {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, localeUrl(l, href, origin)])
  ) as Record<string, string>;

  languages["x-default"] = localeUrl(routing.defaultLocale, href, origin);

  return {
    canonical: localeUrl(locale, href, origin),
    languages,
  };
}
