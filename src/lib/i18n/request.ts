import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "ru" | "en")) {
    locale = routing.defaultLocale;
  }
  // Copy lives in src/content as typed objects; next-intl only routes.
  return { locale, messages: {} };
});
