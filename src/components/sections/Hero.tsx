"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useHeroScroll } from "@/hooks/useHeroScroll";
import { HeroParticles2D } from "./HeroParticles2D";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { FocusTechLine } from "@/components/ui/tech-text";
import { Phone, Send, MessageCircle } from "lucide-react";

const HeroCore = dynamic(
  () => import("@/components/canvas/HeroCore").then((m) => m.HeroCore),
  { ssr: false, loading: () => null }
);

export function Hero() {
  const t = useTranslations("hero");
  const m = useTranslations("manifesto");
  const f = useTranslations("finale");
  const sectionRef = useRef<HTMLElement>(null);
  const heroMainRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useHeroScroll(sectionRef, heroMainRef);
  const [showCanvas, setShowCanvas] = useState(false);
  const tier = useDeviceTier();
  const bio = t.raw("bio") as string[];
  const focus = t.raw("focus") as string[];
  const manifestoParagraphs = m.raw("paragraphs") as string[];
  const links = f.raw("links") as {
    phone: string;
    telegram: string;
    whatsapp: string;
  };

  useEffect(() => {
    if (tier === "low") {
      setShowCanvas(false);
      return;
    }

    let idleOrTimerId: number | ReturnType<typeof setTimeout>;

    if ("requestIdleCallback" in window) {
      idleOrTimerId = requestIdleCallback(() => setShowCanvas(true), { timeout: 2500 });
    } else {
      idleOrTimerId = setTimeout(() => setShowCanvas(true), 100);
    }

    return () => {
      if ("requestIdleCallback" in window) {
        cancelIdleCallback(idleOrTimerId as number);
      } else {
        clearTimeout(idleOrTimerId);
      }
    };
  }, [tier]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-0 w-full flex-col overflow-hidden md:h-[calc(100svh-10rem)]"
      aria-label="Hero"
    >
      <div className="pointer-events-none fixed left-1/2 top-[3.25rem] z-[60] hidden -translate-x-1/2 justify-center md:flex md:top-14">
        <ThemeToggle className="pointer-events-auto border-border bg-background/85 shadow-sm backdrop-blur-sm" />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-[20%] top-1/2 hidden h-[120%] w-[80%] -translate-y-1/2 scale-90 hero-canvas-wrap md:block">
          {tier === "low" ? (
            <HeroParticles2D scrollProgressRef={scrollProgressRef} />
          ) : showCanvas ? (
            <HeroCore scrollProgressRef={scrollProgressRef} />
          ) : null}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/40" />
        <div className="absolute inset-x-0 top-0 bottom-24 bg-gradient-to-t from-transparent via-transparent to-background/60" />
      </div>

      <div ref={heroMainRef} className="relative z-10 will-change-[transform,opacity] md:min-h-0 md:flex-1 md:overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl section-padding pb-4 pt-16 md:pb-4 md:pt-24">
          <div className="flex w-full flex-col gap-5 sm:grid sm:grid-cols-[130px_1fr] sm:items-start lg:grid-cols-[200px_1fr] lg:gap-12 xl:grid-cols-[220px_1fr]">
            <div className="mx-auto sm:mx-0">
              <div className="relative aspect-[4/5] w-[130px] overflow-hidden rounded-2xl border border-border shadow-lg sm:w-[140px] md:shadow-2xl lg:w-[180px] xl:w-[200px]">
                <Image
                  src="/images/profile.png"
                  alt="Михаил Калачёв"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 180px, 200px"
                />
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border" />
              </div>

              <div className="mx-auto mt-4 flex w-full max-w-[240px] flex-col gap-2.5 sm:mx-0 sm:mt-3 sm:w-[140px] sm:max-w-none sm:gap-1.5 lg:w-[180px] xl:w-[200px]">
                <a
                  href={links.phone}
                  className="inline-flex items-center gap-2 py-0.5 font-mono text-sm text-foreground/80 transition-colors hover:text-accent sm:gap-1.5 sm:py-0 sm:text-[11px]"
                >
                  <Phone className="h-4 w-4 shrink-0 sm:h-3 sm:w-3" />
                  <span>{f("phone")}</span>
                </a>
                <a
                  href={links.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-0.5 font-mono text-sm text-foreground/80 transition-colors hover:text-accent sm:gap-1.5 sm:py-0 sm:text-[11px]"
                >
                  <Send className="h-4 w-4 shrink-0 sm:h-3 sm:w-3" />
                  {f("telegram")}
                </a>
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-0.5 font-mono text-sm text-foreground/80 transition-colors hover:text-accent sm:gap-1.5 sm:py-0 sm:text-[11px]"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 sm:h-3 sm:w-3" />
                  {f("whatsapp")}
                </a>
              </div>
            </div>

            <div className="min-w-0 text-left">
              <p className="font-mono text-[10px] tracking-[0.2em] text-accent uppercase sm:text-xs sm:tracking-[0.25em]">
                {t("role")}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                Михаил Калачёв
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/85 md:text-lg">
                {t("summary")}
              </p>

              <ul className="mt-4 space-y-1.5">
                {bio.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm text-foreground/70 md:text-[15px]"
                  >
                    <span className="shrink-0 text-accent" aria-hidden>
                      —
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {focus.map((item) => (
                  <div
                    key={item}
                    className="rounded border border-border bg-elevated px-3 py-2 font-mono text-[10px] leading-relaxed text-foreground/80 md:text-[11px]"
                  >
                    <FocusTechLine>{item}</FocusTechLine>
                  </div>
                ))}
              </div>

              <p className="mt-4 font-mono text-[11px] text-foreground/60">{t("location")}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        id="manifesto"
        className="relative z-20 shrink-0 border-t border-border bg-background section-padding py-4 md:py-4"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:gap-10">
          <div className="shrink-0 md:w-48">
            <p className="font-mono text-[10px] tracking-[0.3em] text-accent uppercase">{m("label")}</p>
            <h2 className="mt-1 text-lg font-bold text-foreground md:text-xl">{m("title")}</h2>
          </div>
          <div className="space-y-2 md:border-l md:border-border md:pl-8">
            {manifestoParagraphs.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground/80 md:text-base">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
