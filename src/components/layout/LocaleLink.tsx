"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";

export function LocaleLink({ locale, label, title }: { locale: "ru" | "en"; label: string; title: string }) {
  const pathname = usePathname();
  return (
    <Link
      href={pathname}
      locale={locale}
      hrefLang={locale}
      lang={locale}
      title={title}
      className="inline-grid min-h-10 min-w-12 place-items-center rounded-full border border-[var(--rule)] px-3 text-[0.8125rem] font-semibold no-underline transition-colors duration-150 hover:bg-[var(--paper-raised)]"
    >
      {label}
    </Link>
  );
}
