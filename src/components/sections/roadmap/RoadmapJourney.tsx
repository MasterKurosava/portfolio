"use client";

import { useLocale, useTranslations } from "next-intl";
import { careerStations, t } from "@/data/career";
import { TeknolabStation } from "./TeknolabStation";
import { WhitewillStation } from "./WhitewillStation";
import { VotonStation } from "./VotonStation";

function TimelineDate({ period }: { period: string }) {
  const [from, to] = period.includes(" — ") ? period.split(" — ") : [period, ""];

  return (
    <div className="hidden pt-8 text-right sm:block">
      <p className="font-mono text-sm tabular-nums tracking-tight text-foreground/90">{from}</p>
      {to && (
        <>
          <div className="my-2 flex justify-end">
            <span className="block h-4 w-px bg-accent/35" aria-hidden />
          </div>
          <p className="font-mono text-sm tabular-nums tracking-tight text-foreground/60">{to}</p>
        </>
      )}
    </div>
  );
}

export function RoadmapJourney() {
  const tr = useTranslations("roadmap");
  const locale = useLocale();

  return (
    <section id="roadmap" className="relative scroll-mt-14">
      <div className="section-padding pb-8 pt-4 text-center md:pb-12 md:pt-8">
        <p className="font-mono text-[10px] tracking-[0.25em] text-accent uppercase md:text-xs md:tracking-[0.3em]">
          {tr("label")}
        </p>
        <h2 className="mt-3 text-2xl font-bold sm:text-3xl md:mt-4 md:text-5xl">{tr("title")}</h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted md:mt-4 md:text-base">{tr("subtitle")}</p>
      </div>

      <div className="relative pb-8 md:pb-12">
        <div className="space-y-6 md:space-y-8">
          {careerStations.map((station, index) => {
            const StationComponent =
              station.theme === "blueprint"
                ? TeknolabStation
                : station.theme === "ecosystem"
                  ? WhitewillStation
                  : VotonStation;

            const period = t(station.period, locale);

            return (
              <div
                key={station.id}
                className="grid grid-cols-1 gap-0 sm:grid-cols-[5.5rem_1.25rem_1fr] md:grid-cols-[6.5rem_1.5rem_1fr]"
              >
                <TimelineDate period={period} />

                {/* Timeline rail: dot on the line, separate from date text */}
                <div className="relative hidden sm:block">
                  <div
                    className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-accent/25"
                    aria-hidden
                  />
                  <div
                    className="absolute left-1/2 top-9 z-10 h-3 w-3 -translate-x-1/2 rounded-full border-[3px] border-background bg-accent shadow-[0_0_14px_rgba(0,212,255,0.35)]"
                    aria-hidden
                  />
                </div>

                <div className="min-w-0">
                  <p className="mb-3 font-mono text-xs tabular-nums text-accent sm:hidden">{period}</p>
                  <StationComponent
                    station={station}
                    locale={locale}
                    index={index}
                    title={t(station.role, locale)}
                    summary={t(station.summary, locale)}
                    narrative={t(station.narrative, locale)}
                    highlights={station.highlights.map((h) => t(h, locale))}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
