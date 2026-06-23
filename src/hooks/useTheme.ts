"use client";

import { useEffect, useState } from "react";
import type { Theme } from "@/lib/theme";

export function useTheme(): Theme {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const read = () => setThemeState(document.documentElement.classList.contains("dark") ? "dark" : "light");
    read();

    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return theme;
}
