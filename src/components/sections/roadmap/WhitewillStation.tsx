"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { CareerStation, PartnerPortal } from "@/data/career";
import { t as translate } from "@/data/career";
import { getTestimonialForStation } from "@/data/testimonials";
import { TestimonialCard } from "@/components/career/TestimonialCard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { TechText } from "@/components/ui/tech-text";

gsap.registerPlugin(ScrollTrigger);

interface StationProps {
  station: CareerStation;
  locale: string;
  index: number;
  title: string;
  summary: string;
  narrative: string;
  highlights: string[];
}

function PartnerPortalBlock({
  portal,
  locale,
}: {
  portal: PartnerPortal;
  locale: string;
}) {
  return (
    <div className="ww-reveal mt-10 overflow-hidden rounded-sm border border-amber-800/20 dark:border-[#c9a962]/25 md:mt-20">
      <div className="border-b border-amber-800/15 bg-gradient-to-r from-amber-50 via-stone-100 to-amber-50 px-4 py-4 dark:border-[#c9a962]/20 dark:from-[#14110e] dark:via-[#1a1520] dark:to-[#14110e] sm:px-6 sm:py-5 md:px-8">
        <p className="font-mono text-[10px] tracking-[0.2em] text-amber-800 uppercase dark:text-[#c9a962] sm:tracking-[0.35em]">
          {locale === "ru" ? "Отдельная платформа" : "Separate platform"}
        </p>
        <h4 className="mt-2 font-serif text-2xl font-light text-stone-900 dark:text-[#f5f0e8] sm:text-3xl md:text-4xl">
          {translate(portal.title, locale)}
        </h4>
        <p className="mt-2 font-mono text-xs text-amber-800/70 dark:text-[#c9a962]/70">
          {translate(portal.subtitle, locale)}
        </p>
      </div>

      <div className="grid gap-0 md:grid-cols-[1fr_280px]">
        <div className="bg-white/60 p-4 dark:bg-transparent sm:p-6 md:p-8">
          <p className="text-sm leading-relaxed text-stone-600 dark:text-[#c8bfb0] md:text-base">
            <TechText>{translate(portal.narrative, locale)}</TechText>
          </p>
          <p className="mt-6 font-mono text-[10px] tracking-widest text-amber-800/60 uppercase dark:text-[#c9a962]/60">
            {locale === "ru" ? "Ключевые реализации" : "Key implementations"}
          </p>
          <ul className="mt-3 space-y-3">
            {portal.highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm text-stone-600 dark:text-[#a89f92]">
                <span className="mt-0.5 shrink-0 font-mono text-[10px] text-amber-800 dark:text-[#c9a962]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <TechText>{translate(h, locale)}</TechText>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center border-t border-amber-800/10 bg-amber-50/50 p-6 dark:border-[#c9a962]/15 dark:bg-[rgba(201,169,98,0.04)] md:border-t-0 md:border-l md:p-8">
          <p className="font-mono text-[10px] tracking-widest text-amber-800/60 uppercase dark:text-[#c9a962]/60">
            {locale === "ru" ? "Интеграции" : "Integrations"}
          </p>
          <div className="mt-4 space-y-3">
            <div className="rounded-sm border border-amber-800/20 bg-white px-4 py-3 dark:border-[#c9a962]/30 dark:bg-[#14110e]">
              <p className="font-mono text-xs text-stone-900 dark:text-[#f5f0e8]">amoCRM</p>
              <p className="mt-1 text-[10px] text-stone-500 dark:text-[#a89f92]">
                {locale === "ru" ? "Синхронизация в обе стороны" : "Bidirectional sync"}
              </p>
            </div>
            <div className="rounded-sm border border-amber-800/15 bg-white px-4 py-3 dark:border-[#c9a962]/20 dark:bg-[#14110e]">
              <p className="font-mono text-xs text-stone-900 dark:text-[#f5f0e8]">Whitelist</p>
              <p className="mt-1 text-[10px] text-stone-500 dark:text-[#a89f92]">
                {locale === "ru" ? "Каталог объектов" : "Property catalog"}
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {portal.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-sm border border-amber-800/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-900/80 dark:border-[#c9a962]/20 dark:text-[#c9a962]/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function WhitewillStation({
  station,
  locale,
  index,
  title,
  summary,
  narrative,
  highlights,
}: StationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeProject, setActiveProject] = useState(station.projects?.[0]?.id ?? null);
  const testimonial = getTestimonialForStation(station.id);
  const tr = useTranslations("testimonials");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      section.querySelectorAll(".ww-reveal"),
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.08,
        scrollTrigger: { trigger: section, start: "top 70%", end: "top 30%", scrub: 0.5 },
      }
    );
  }, []);

  const currentProject = station.projects?.find((p) => p.id === activeProject);

  return (
    <article
      ref={sectionRef}
      className="relative bg-gradient-to-br from-stone-50 via-amber-50/40 to-white py-8 dark:from-[#0a0908] dark:via-[#14110e] dark:to-[#050508] md:py-12"
    >
      <div className="pointer-events-none absolute inset-0 hidden opacity-[0.06] md:block dark:opacity-[0.04]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #b8954a 0px, transparent 1px, transparent 80px)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl section-padding">
        <div className="ww-reveal">
          <span className="font-mono text-[10px] tracking-[0.2em] text-amber-800 uppercase dark:text-[#c9a962] sm:tracking-[0.35em]">
            {locale === "ru" ? "Премиальная недвижимость" : "Premium real estate"} · STATION {index + 1}
          </span>
          <h3 className="mt-2 font-serif text-3xl font-light tracking-wide text-stone-900 dark:text-[#f5f0e8] sm:mt-3 sm:text-4xl md:text-6xl">
            {station.company}
          </h3>
          <p className="mt-2 font-mono text-sm text-amber-800/80 dark:text-[#c9a962]/80">{title}</p>
        </div>

        <p className="ww-reveal mt-4 max-w-3xl text-base leading-relaxed text-stone-700 dark:text-[#e8e0d4]/90 md:mt-6 md:text-lg">
          <TechText>{summary}</TechText>
        </p>
        <p className="ww-reveal mt-3 max-w-3xl text-sm leading-relaxed text-stone-600 dark:text-[#a89f92] md:mt-4 md:text-base">
          <TechText>{narrative}</TechText>
        </p>

        {station.projects && station.projects.length > 0 && (
          <div className="ww-reveal mt-8 md:mt-12">
            <p className="font-mono text-[10px] tracking-widest text-amber-800/70 uppercase dark:text-[#c9a962]/70 md:text-xs">
              {locale === "ru" ? "Ключевые направления" : "Key areas"}
            </p>

            <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto border-b border-amber-800/15 px-4 pb-3 scrollbar-none dark:border-[#c9a962]/20 md:mx-0 md:mt-4 md:flex-wrap md:overflow-visible md:px-0 md:pb-4">
              {station.projects.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => setActiveProject(project.id)}
                  className={cn(
                    "shrink-0 rounded-sm px-3 py-2 font-mono text-[10px] transition-all sm:text-[11px] md:text-xs",
                    activeProject === project.id
                      ? "bg-amber-100 text-stone-900 ring-1 ring-amber-800/30 dark:bg-[#c9a962]/15 dark:text-[#f5f0e8] dark:ring-[#c9a962]/40"
                      : "text-stone-500 hover:text-stone-900 dark:text-[#a89f92] dark:hover:text-[#f5f0e8]"
                  )}
                >
                  {translate(project.title, locale)}
                </button>
              ))}
            </div>

            {currentProject && (
              <div className="mt-4 rounded-sm border border-amber-800/15 bg-amber-50/60 p-4 dark:border-[#c9a962]/20 dark:bg-[#c9a962]/5 sm:p-6 md:p-8">
                <h4 className="text-xl font-light text-stone-900 dark:text-[#f5f0e8] md:text-2xl">
                  {translate(currentProject.title, locale)}
                </h4>
                <p className="mt-4 text-sm leading-relaxed text-stone-600 dark:text-[#c8bfb0] md:text-base">
                  <TechText>{translate(currentProject.description, locale)}</TechText>
                </p>
              </div>
            )}
          </div>
        )}

        <div className="ww-reveal mt-8 md:mt-10">
          <p className="mb-4 font-mono text-xs tracking-widest text-amber-800/70 uppercase dark:text-[#c9a962]/70">
            {locale === "ru" ? "Основная платформа" : "Main platform"}
          </p>
          <ul className="space-y-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm text-stone-600 dark:text-[#a89f92]">
                <span className="mt-1.5 h-px w-6 shrink-0 bg-amber-800/40 dark:bg-[#c9a962]/50" />
                <TechText>{h}</TechText>
              </li>
            ))}
          </ul>
        </div>

        {station.partnerPortal && (
          <PartnerPortalBlock portal={station.partnerPortal} locale={locale} />
        )}

        <div className="ww-reveal mt-8 flex flex-wrap gap-2">
          {station.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-sm border border-amber-800/25 px-3 py-1 font-mono text-[11px] font-semibold text-amber-900/90 dark:border-[#c9a962]/25 dark:text-[#c9a962]/90"
            >
              {tech}
            </span>
          ))}
        </div>

        {testimonial && (
          <TestimonialCard
            testimonial={testimonial}
            locale={locale}
            placeholderLabel={tr("placeholder")}
            className="ww-reveal mt-8 border-amber-200 bg-white/85 dark:border-[#c9a962]/20 dark:bg-[#14110e]/80 md:mt-12"
          />
        )}
      </div>
    </article>
  );
}
