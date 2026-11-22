import { en } from "./en";
import { ru } from "./ru";
import type { Content, Locale } from "./types";

export function getContent(locale: string): Content {
  return locale === "en" ? en : ru;
}

export function isLocale(value: string): value is Locale {
  return value === "ru" || value === "en";
}

export type { Content, Locale, Quote, Part, SpecRow } from "./types";
