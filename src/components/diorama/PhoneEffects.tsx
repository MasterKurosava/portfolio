"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * On a phone, takes the effect off every element marked `data-dio-phone="off"` before Diorama
 * sees it. Those are the text effects that play as their element scrolls into view (headings,
 * numbers): each builds its material and draws its glyphs in the frame it starts, a stall of a
 * tenth of a second and more on a phone, in the middle of a scroll. The text stays as it is.
 * Runs in the commit, before Diorama's start and before it reads a new page's elements.
 */
export function PhoneEffects() {
  const pathname = usePathname();
  useLayoutEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    for (const el of document.querySelectorAll('[data-dio-phone="off"]')) el.removeAttribute("data-dio");
  }, [pathname]);
  return null;
}
