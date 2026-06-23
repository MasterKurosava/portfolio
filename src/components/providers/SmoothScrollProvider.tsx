"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function restoreScrollPosition(scrollTo: (y: number) => void) {
  const saved = sessionStorage.getItem("scrollY");
  if (!saved) return;

  const y = parseInt(saved, 10);
  if (Number.isNaN(y)) {
    sessionStorage.removeItem("scrollY");
    return;
  }

  sessionStorage.removeItem("scrollY");

  const apply = () => {
    scrollTo(y);
    ScrollTrigger.refresh();
    requestAnimationFrame(() => ScrollTrigger.update());
  };

  requestAnimationFrame(apply);
  window.setTimeout(apply, 100);
  window.setTimeout(() => ScrollTrigger.refresh(), 300);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      restoreScrollPosition((y) => window.scrollTo(0, y));
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value!, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    ScrollTrigger.defaults({ scroller: document.documentElement });

    restoreScrollPosition((y) => lenis.scrollTo(y, { immediate: true }));

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return <>{children}</>;
}
