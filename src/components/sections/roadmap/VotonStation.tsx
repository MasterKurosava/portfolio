"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import type { CareerStation } from "@/data/career";
import { getTestimonialForStation } from "@/data/testimonials";
import { TestimonialCard } from "@/components/career/TestimonialCard";
import { TechText } from "@/components/ui/tech-text";
import { useIsMobile } from "@/hooks/useDeviceTier";
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

export function VotonStation({
  station,
  locale,
  index,
  title,
  summary,
  narrative,
  highlights,
}: StationProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const testimonial = getTestimonialForStation(station.id);
  const tr = useTranslations("testimonials");
  const isMobile = useIsMobile();

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section) return;

    gsap.fromTo(
      section.querySelector(".voton-content"),
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: { trigger: section, start: "top 65%", end: "top 35%", scrub: 0.5 },
      }
    );

    if (isMobile || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const candles = Array.from({ length: 14 }, () => ({
      bodyRatio: 0.12 + Math.random() * 0.78,
      wickTop: 0.04 + Math.random() * 0.42,
      wickBottom: 0.04 + Math.random() * 0.42,
      bull: Math.random() > 0.45,
    }));

    const resize = (width: number, height: number) => {
      canvas.width = width;
      canvas.height = height;
    };

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    observer.observe(canvas);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const marginY = h * 0.04;
      const availableH = h * 0.92;
      const spacing = availableH / candles.length;
      const centerX = w * 0.5;
      const bodyW = Math.max(6, w * 0.22);

      candles.forEach((c, i) => {
        const centerY = marginY + i * spacing + spacing * 0.5;
        const bodyH = c.bodyRatio * spacing * 0.72;
        const wickTop = c.wickTop * spacing;
        const wickBottom = c.wickBottom * spacing;
        const color = c.bull ? "rgba(0, 180, 120, 0.6)" : "rgba(220, 60, 60, 0.55)";

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.fillRect(centerX - bodyW / 2, centerY - bodyH / 2, bodyW, bodyH);
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - bodyH / 2 - wickTop);
        ctx.lineTo(centerX, centerY + bodyH / 2 + wickBottom);
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, [isMobile]);

  return (
    <article ref={sectionRef} className="relative bg-background py-8 md:py-12">
      <div className="relative mx-auto flex max-w-6xl items-stretch gap-6 section-padding md:gap-10 lg:gap-14">
        <div className="voton-content min-w-0 flex-1">
          <span className="font-mono text-[10px] text-amber-600 md:text-xs dark:text-[#f7931a]">
            WEB3 · CRYPTO · STATION {index + 1}
          </span>
          <h3 className="mt-2 text-3xl font-bold text-emerald-950 dark:text-emerald-100 sm:text-4xl md:text-5xl">
            {station.company}
          </h3>
          <p className="mt-2 font-mono text-xs text-emerald-700/80 dark:text-emerald-400/70 sm:text-sm">{title}</p>
          <p className="mt-4 max-w-3xl text-base text-emerald-900/85 dark:text-emerald-100/80 md:mt-6 md:text-lg">
            <TechText>{summary}</TechText>
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-emerald-800/75 dark:text-emerald-200/60 md:mt-4 md:text-base">
            <TechText>{narrative}</TechText>
          </p>

          <ul className="mt-6 space-y-2.5 md:mt-8 md:space-y-3">
            {highlights.map((h, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-emerald-800/80 dark:text-emerald-200/70">
                <span className="shrink-0 font-mono text-amber-600 dark:text-[#f7931a]">◆</span>
                <TechText>{h}</TechText>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-1.5 md:mt-8 md:gap-2">
            {station.stack.map((tech) => (
              <span
                key={tech}
                className="rounded border border-emerald-700/20 bg-emerald-50 px-2.5 py-1 font-mono text-[10px] font-semibold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/5 dark:text-emerald-300 md:px-3 md:text-xs"
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
              className="mt-8 border-emerald-200 bg-white/80 dark:border-emerald-500/20 dark:bg-emerald-500/5 md:mt-12"
            />
          )}
        </div>

        <div className="relative hidden w-16 shrink-0 self-stretch md:block lg:w-20" aria-hidden>
          <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-80" />
        </div>
      </div>
    </article>
  );
}
