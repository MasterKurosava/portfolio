"use client";

import { useLocale, useTranslations } from "next-intl";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const sections = [
  { id: "journey", href: "#roadmap" },
  { id: "expertise", href: "#expertise" },
  { id: "impact", href: "#impact" },
  { id: "tech", href: "#tech" },
  { id: "contact", href: "#finale" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const progress = useScrollProgress();

  const switchLocale = locale === "ru" ? "en" : "ru";

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
            className="hidden h-1 w-16 overflow-hidden rounded-full bg-elevated-strong sm:block"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-accent transition-[width] duration-150"
              style={{ width: `${progress * 100}%` }}
            />
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
