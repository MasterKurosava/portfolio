"use client";

import { useEffect, useState } from "react";

export type DeviceTier = "high" | "medium" | "low";

export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>("high");

  useEffect(() => {
    const width = window.innerWidth;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const isMobile = width < 768;
    const isTablet = width < 1024;

    if (reducedMotion || isMobile || (lowMemory !== undefined && lowMemory < 4)) {
      setTier("low");
    } else if (isTablet) {
      setTier("medium");
    } else {
      setTier("high");
    }
  }, []);

  return tier;
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    setIsMobile(mq.matches);
    const handler = () => setIsMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);

  return isMobile;
}
