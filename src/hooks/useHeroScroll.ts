"use client";

import { useEffect, useRef, type RefObject } from "react";

export function useHeroScroll(
  sectionRef: RefObject<HTMLElement | null>,
  heroMainRef: RefObject<HTMLDivElement | null>
) {
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;

    const update = () => {
      rafId = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      const progress =
        sectionHeight > 0 ? Math.min(1, Math.max(0, -rect.top / sectionHeight)) : 0;
      scrollProgressRef.current = progress;

      const heroMain = heroMainRef.current;
      if (!heroMain || reducedMotion) return;

      heroMain.style.opacity = String(1 - progress);
      heroMain.style.transform = `translate3d(0, ${-40 * progress}px, 0)`;
    };

    const onScroll = () => {
      if (!rafId) rafId = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [sectionRef, heroMainRef]);

  return scrollProgressRef;
}
