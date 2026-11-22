import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getContent } from "@/content";

const COPY = {
  ru: {
    title: "Страница не найдена",
    text: "По этому адресу ничего нет. Возможно, в ссылке опечатка.",
    home: "На главную",
  },
  en: {
    title: "Page not found",
    text: "There is nothing at this address. The link may have a typo.",
    home: "Back to the home page",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: COPY[locale === "en" ? "en" : "ru"].title, robots: { index: false, follow: true } };
}

export default async function NotFound() {
  const locale = await getLocale();
  const c = getContent(locale);
  const t = COPY[c.locale];
  return (
    <section aria-labelledby="not-found-title" className="sheet">
      <div className="sheet-head">
        <p className="key-number m-0 text-spot" aria-hidden data-dio="extrude" data-dio-depth="20" data-dio-tilt="18">
          404
        </p>
        <h1 id="not-found-title" className="sheet-title">
          {t.title}
        </h1>
        <p className="sheet-intro">{t.text}</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/" locale={c.locale} className="btn btn-primary">
          <ArrowLeft aria-hidden />
          {t.home}
        </Link>
      </div>
    </section>
  );
}
