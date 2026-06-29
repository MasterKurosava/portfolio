"use client";

import { useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const sections = [
  { id: "impact", href: "#impact" },
  { id: "journey", href: "#roadmap" },
  { id: "expertise", href: "#expertise" },
  { id: "tech", href: "#tech" },
  { id: "contact", href: "#finale" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressTrackRef = useRef<HTMLDivElement>(null);
  const docHeightRef = useRef(0);

  const switchLocale = locale === "ru" ? "en" : "ru";

  useEffect(() => {
    let rafId = 0;

    const measureDocHeight = () => {
      docHeightRef.current = document.documentElement.scrollHeight - window.innerHeight;
    };

    const update = () => {
      rafId = 0;
      const docHeight = docHeightRef.current;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      const bar = progressBarRef.current;
      const track = progressTrackRef.current;

      if (bar) bar.style.width = `${progress * 100}%`;
      if (track) track.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    measureDocHeight();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    const resizeObserver = new ResizeObserver(() => {
      measureDocHeight();
      if (!rafId) rafId = requestAnimationFrame(update);
    });
    resizeObserver.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/75 backdrop-blur-md">
      <div className="section-padding relative flex h-14 items-center justify-between">
        <Link href="/" className="font-mono text-sm tracking-widest uppercase">
          MK
        </Link>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
          <ThemeToggle />
        </div>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {sections.map((s) => (
            <a
              key={s.id}
              href={s.href}
              className="font-mono text-xs tracking-wider text-muted uppercase transition-colors hover:text-foreground"
            >
              {t(s.id)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            ref={progressTrackRef}
            className="hidden h-1 w-16 overflow-hidden rounded-full bg-elevated-strong sm:block"
            role="progressbar"
            aria-valuenow={0}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div ref={progressBarRef} className="h-full w-0 bg-accent" />
          </div>
          <Link
            href={pathname}
            locale={switchLocale}
            className={cn(
              "font-mono text-xs tracking-wider uppercase",
              "rounded-full border border-border px-3 py-1.5 transition-colors hover:bg-elevated"
            )}
            onClick={() => sessionStorage.setItem("scrollY", String(window.scrollY))}
          >
            {switchLocale.toUpperCase()}
          </Link>
        </div>
      </div>
    </header>
  );
}
