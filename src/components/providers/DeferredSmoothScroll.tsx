"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SmoothScrollProvider = dynamic(
  () =>
    import("@/components/providers/SmoothScrollProvider").then((m) => m.SmoothScrollProvider),
  { ssr: false }
);

export function DeferredSmoothScroll({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) return;

    const activate = () => setEnabled(true);

    window.addEventListener("scroll", activate, { once: true, passive: true });
    window.addEventListener("wheel", activate, { once: true, passive: true });
    window.addEventListener("touchstart", activate, { once: true, passive: true });

    let idleOrTimerId: number | ReturnType<typeof setTimeout>;
    if ("requestIdleCallback" in window) {
      idleOrTimerId = requestIdleCallback(activate, { timeout: 3500 });
    } else {
      idleOrTimerId = setTimeout(activate, 3500);
    }

    return () => {
      window.removeEventListener("scroll", activate);
      window.removeEventListener("wheel", activate);
      window.removeEventListener("touchstart", activate);
      if ("requestIdleCallback" in window) {
        cancelIdleCallback(idleOrTimerId as number);
      } else {
        clearTimeout(idleOrTimerId);
      }
    };
  }, [enabled]);

  if (!enabled) return <>{children}</>;
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
