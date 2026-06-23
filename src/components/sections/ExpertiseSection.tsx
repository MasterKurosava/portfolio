"use client";

import { useLocale, useTranslations } from "next-intl";
import { architectureNodes } from "@/data/architecture";
import { t } from "@/data/career";
import { TechText } from "@/components/ui/tech-text";

export function ExpertiseSection() {
  const tr = useTranslations("expertise");
  const locale = useLocale();

  return (
    <section id="expertise" className="section-padding py-14 md:py-28">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] tracking-[0.25em] text-accent uppercase md:text-xs md:tracking-[0.3em]">
          {tr("label")}
        </p>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl md:mt-4 md:text-5xl">{tr("title")}</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted md:mt-4 md:text-base">{tr("subtitle")}</p>

        <div className="mt-8 grid gap-3 md:mt-12 md:gap-4 md:grid-cols-2">
          {architectureNodes.map((node, i) => (
            <article
              key={node.id}
              className="group rounded-xl border border-border bg-surface/40 p-4 transition-colors hover:border-accent/30 hover:bg-surface/70 sm:p-6"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-2xl font-bold text-accent/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{node.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    <TechText>{t(node.experience, locale)}</TechText>
                  </p>
                  {node.projects && (
                    <p className="mt-3 font-mono text-[11px] text-accent/70">
                      {node.projects.map((p) => t(p, locale)).join(" · ")}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
