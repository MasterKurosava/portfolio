"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { applyTheme, getStoredTheme, setTheme, type Theme } from "@/lib/theme";

export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("theme");
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    applyTheme(stored);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    setThemeState(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-elevated",
        className
      )}
      aria-label={mounted ? (theme === "light" ? t("switchToDark") : t("switchToLight")) : t("toggle")}
      title={mounted ? (theme === "light" ? t("switchToDark") : t("switchToLight")) : undefined}
    >
      {mounted && theme === "dark" ? (
        <Sun className="h-3.5 w-3.5 text-foreground" aria-hidden />
      ) : (
        <Moon className="h-3.5 w-3.5 text-foreground" aria-hidden />
      )}
    </button>
  );
}
