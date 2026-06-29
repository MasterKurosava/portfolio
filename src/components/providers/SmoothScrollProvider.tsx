"use client";

import { useEffect } from "react";

function restoreScrollPosition(scrollTo: (y: number) => void, refresh: () => void) {
  const saved = sessionStorage.getItem("scrollY");
  if (!saved) return;

  const y = parseInt(saved, 10);
  if (Number.isNaN(y)) {
    sessionStorage.removeItem("scrollY");
    return;
  }

  sessionStorage.removeItem("scrollY");

  requestAnimationFrame(() => {
    scrollTo(y);
    refresh();
  });
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let cancelled = false;
    let lenis: InstanceType<typeof import("lenis").default> | null = null;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;

    const init = async () => {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reducedMotion) {
        restoreScrollPosition((y) => window.scrollTo(0, y), () => {});
        return;
      }

      const [{ default: Lenis }, gsapModule, scrollTriggerModule] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) return;

      const gsap = gsapModule.default;
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5,
      });

      lenis.on("scroll", ScrollTrigger.update);

      const raf = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length) {
            lenis!.scrollTo(value!, { immediate: true });
          }
          return lenis!.scroll;
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

      const refresh = () => ScrollTrigger.refresh();

      restoreScrollPosition((y) => lenis!.scrollTo(y, { immediate: true }), refresh);

      const onResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(refresh, 200);
      };
      window.addEventListener("resize", onResize, { passive: true });

      return () => {
        window.removeEventListener("resize", onResize);
        clearTimeout(resizeTimer);
        gsap.ticker.remove(raf);
        lenis?.destroy();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    };

    let cleanup: (() => void) | undefined;

    const start = () => {
      init().then((dispose) => {
        if (!cancelled) cleanup = dispose;
      });
    };

    let idleOrTimerId: number | ReturnType<typeof setTimeout>;

    if ("requestIdleCallback" in window) {
      idleOrTimerId = requestIdleCallback(start, { timeout: 1500 });
    } else {
      idleOrTimerId = setTimeout(start, 1);
    }

    return () => {
      cancelled = true;
      if ("requestIdleCallback" in window) {
        cancelIdleCallback(idleOrTimerId as number);
      } else {
        clearTimeout(idleOrTimerId);
      }
      cleanup?.();
    };
  }, []);

  return <>{children}</>;
}
