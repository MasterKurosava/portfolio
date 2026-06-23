"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export function ScrollRestorer() {
  useEffect(() => {
    const saved = sessionStorage.getItem("scrollY");
    if (saved) {
      const y = parseInt(saved, 10);
      sessionStorage.removeItem("scrollY");
      requestAnimationFrame(() => window.scrollTo(0, y));
    }
  }, []);
  return null;
}

export function SkipLink() {
  const t = useTranslations("nav");
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-background"
    >
      {t("skip")}
    </a>
  );
}
