"use client";

import { useLocale, useTranslations } from "next-intl";
import { impactItems } from "@/data/impact";
import { t } from "@/data/career";
import { TechText } from "@/components/ui/tech-text";

export function ImpactSection() {
  const tr = useTranslations("impact");
  const locale = useLocale();

  return (
    <section id="impact" className="section-padding border-y border-border bg-surface/40 py-14 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] tracking-[0.25em] text-accent uppercase md:text-xs md:tracking-[0.3em]">
          {tr("label")}
        </p>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl md:mt-4 md:text-5xl">{tr("title")}</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted md:mt-4 md:text-base">{tr("subtitle")}</p>

        <div className="mt-8 grid gap-3 md:mt-12 md:grid-cols-2 md:gap-4">
          {impactItems.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-background/50 p-4 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-mono text-[10px] tracking-widest text-accent uppercase">
                    {t(item.context, locale)}
                  </p>
                  <h3 className="mt-1 text-base font-semibold leading-snug md:text-lg">
                    {t(item.title, locale)}
                  </h3>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-3xl font-bold leading-none text-accent md:text-4xl">
                    {t(item.stat, locale)}
                  </p>
                  <p className="mt-1 max-w-[8rem] font-mono text-[9px] leading-tight text-muted md:text-[10px]">
                    {t(item.statLabel, locale)}
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted md:text-[15px]">
                <TechText>{t(item.description, locale)}</TechText>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
