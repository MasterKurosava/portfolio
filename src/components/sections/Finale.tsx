"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Phone, Send, MessageCircle } from "lucide-react";

const FinaleAssembly = dynamic(
  () => import("@/components/canvas/FinaleAssembly").then((m) => m.FinaleAssembly),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

export function Finale() {
  const t = useTranslations("finale");
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const links = t.raw("links") as {
    phone: string;
    telegram: string;
    whatsapp: string;
  };

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    gsap.fromTo(
      content.children,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        scrollTrigger: { trigger: section, start: "top 60%", end: "center center", scrub: 1 },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="finale"
      className="relative min-h-[60vh] section-padding py-20 md:min-h-screen md:py-32"
    >
      <div className="absolute inset-0 hidden md:block">
        <FinaleAssembly />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex min-h-[50vh] max-w-4xl flex-col items-center justify-center px-2 text-center md:min-h-[70vh]"
      >
        <p className="font-mono text-[10px] tracking-[0.25em] text-accent uppercase md:text-xs md:tracking-[0.3em]">
          {t("label")}
        </p>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl md:mt-4 md:text-7xl">{t("title")}</h2>
        <p className="mt-4 max-w-xl text-base text-muted md:mt-6 md:text-xl">{t("subtitle")}</p>

        <div className="pointer-events-auto mt-8 flex flex-col items-center gap-4 md:mt-12">
          <a
            href={links.phone}
            className="font-mono text-lg tracking-wide text-foreground transition-colors hover:text-accent md:text-xl"
          >
            {t("phone")}
          </a>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            <Button asChild size="lg">
              <a href={links.telegram} target="_blank" rel="noopener noreferrer">
                <Send className="h-4 w-4" />
                {t("telegram")}
              </a>
            </Button>
            <Button variant="outline" asChild size="lg">
              <a href={links.whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" />
                {t("whatsapp")}
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={links.phone} aria-label={t("phone")}>
                <Phone className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <p className="mt-10 font-mono text-xs text-muted md:mt-16">
          © {new Date().getFullYear()} Mikhail Kalachev
        </p>
      </div>
    </section>
  );
}
