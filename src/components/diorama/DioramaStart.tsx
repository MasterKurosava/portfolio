"use client";

import { useEffect } from "react";
import { start } from "@dioramajs/diorama";

/** Starts the one Diorama app of the site after hydration. */
export function DioramaStart() {
  useEffect(() => {
    const app = start({
      // The canvas lives under the page: text stays on top, and the stream and the scenes draw
      // through the transparent page background.
      canvas: "behind",
      background: "#121110",
      transitions: { cover: { name: "curtain", color: "#121110", accent: "#f2b45a", duration: 0.7 } },
      // Photos, plates and type are drawn on the canvas, so its pixel ratio is their sharpness.
      // The library's bounds (1 on low, 1.5 on medium) turn them soft on a scaled screen, and on a
      // 144 Hz monitor a 10 ms frame already counts as slow and steps the tier down. The tiers
      // still cut particle counts; the pixel ratio stays at the screen's, up to 2.
      quality: { pixelRatio: { low: 1.5, medium: 2, high: 2 } },
      // The library's default budget of 4 million device pixels renders a 2560×1440 screen at 150%
      // at about 1×: everything drawn on the canvas goes soft. 9 million covers 4K at 200%.
      render: { maxPixels: 9_000_000 },
    });
    return () => void app;
  }, []);
  return null;
}
