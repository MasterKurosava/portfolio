import { routing } from "@/lib/i18n/routing";

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

export function localePath(locale: string): string {
  return locale === routing.defaultLocale ? "" : `/${locale}`;
}

export function absoluteUrl(path = ""): string {
  const base = getSiteUrl();
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localeUrl(locale: string): string {
  return absoluteUrl(localePath(locale) || "/");
}
