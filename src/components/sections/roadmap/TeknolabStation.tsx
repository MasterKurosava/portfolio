"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { CareerStation } from "@/data/career";
import { getTestimonialForStation } from "@/data/testimonials";
import { TestimonialCard } from "@/components/career/TestimonialCard";
import { TechText } from "@/components/ui/tech-text";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

export function TeknolabStation({
  station,
  locale,
  index,
  title,
  summary,
  narrative,
  highlights,
}: StationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<SVGSVGElement>(null);
  const testimonial = getTestimonialForStation(station.id);
  const tr = useTranslations("testimonials");

  useEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    if (!section) return;

    if (grid) {
      const lines = grid.querySelectorAll("line");
      gsap.fromTo(
        lines,
        { strokeDashoffset: 200 },
        {
          strokeDashoffset: 0,
          stagger: 0.02,
          scrollTrigger: { trigger: section, start: "top 60%", end: "center center", scrub: 1 },
        }
      );
    }
  }, []);

  return (
    <article
      ref={sectionRef}
      className="relative bg-gradient-to-b from-slate-50 via-cyan-50/60 to-slate-50 py-8 dark:from-[#050508] dark:via-[#0a1628] dark:to-[#050508] md:py-12"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20 md:opacity-30 dark:opacity-20">
        <svg ref={gridRef} className="h-full w-full text-cyan-600/40 dark:text-cyan-400" aria-hidden>
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1="0"
              y1={`${i * 5}%`}
              x2="100%"
              y2={`${i * 5}%`}
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="200"
              strokeDashoffset="200"
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={`${i * 5}%`}
              y1="0"
              x2={`${i * 5}%`}
              y2="100%"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeDasharray="200"
              strokeDashoffset="200"
            />
          ))}
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-8 section-padding lg:grid-cols-2 lg:items-start lg:gap-12">
        <div className="order-2 lg:order-1">
          <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400 md:text-xs">STATION {index + 1}</span>
          <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-cyan-100 sm:text-4xl md:text-5xl">
            {station.company}
          </h3>
          <p className="mt-2 font-mono text-xs text-cyan-700/80 dark:text-cyan-400/70 sm:text-sm">{title}</p>
          <p className="mt-4 text-base text-slate-700 dark:text-cyan-100/80 md:mt-6 md:text-lg">
            <TechText>{summary}</TechText>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-cyan-200/60 md:mt-4 md:text-base">
            <TechText>{narrative}</TechText>
          </p>
          <ul className="mt-6 space-y-2.5 md:mt-8 md:space-y-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600 dark:text-cyan-200/70">
                <span className="font-mono text-cyan-700 dark:text-cyan-400">[{String(i + 1).padStart(2, "0")}]</span>
                <TechText>{h}</TechText>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-1.5 md:mt-8 md:gap-2">
            {station.stack.map((tech) => (
              <span
                key={tech}
                className="rounded border border-cyan-700/25 px-2.5 py-1 font-mono text-[10px] font-semibold text-cyan-800 dark:border-cyan-500/30 dark:text-cyan-300 md:px-3 md:text-xs"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="relative order-1 w-full max-w-md justify-self-center lg:order-2 lg:aspect-square lg:max-w-none">
          <svg
            viewBox="0 0 400 400"
            className="mx-auto h-48 w-48 text-cyan-600/50 dark:text-cyan-400 sm:h-56 sm:w-56 lg:absolute lg:inset-0 lg:h-full lg:w-full"
            aria-hidden
          >
            <rect x="50" y="50" width="300" height="300" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3" />
            <rect x="100" y="100" width="200" height="200" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <circle cx="200" cy="200" r="60" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="200" y1="50" x2="200" y2="350" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
            <line x1="50" y1="200" x2="350" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
          </svg>

          {testimonial && (
            <div className="mt-4 lg:absolute lg:inset-0 lg:mt-0 lg:flex lg:items-center lg:justify-center lg:p-8 xl:p-12">
              <TestimonialCard
                testimonial={testimonial}
                locale={locale}
                placeholderLabel={tr("placeholder")}
                className="w-full border-cyan-200 bg-white/95 backdrop-blur-sm dark:border-cyan-500/30 dark:bg-[#0a1628]/90 lg:max-w-[280px] xl:max-w-xs"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
