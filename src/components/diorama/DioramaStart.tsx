"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { start } from "@dioramajs/diorama";

/** Starts the one Diorama app of the site after hydration. */
export function DioramaStart() {
  useEffect(() => {
    // With a mouse or a trackpad the page scrolls through Lenis, so the scroll and the 3D are
    // stepped in one frame and nothing on the canvas lags behind the page. Phones keep native
    // scrolling: everything drawn there is tied to the page, so the browser running a touch
    // ahead of the frame shows nothing out of place. Header links jump natively (scroll-padding
    // and scroll-margin place the section); Lenis picks the new position up.
    const smooth =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = smooth ? new Lenis({ autoRaf: false }) : undefined;
    const app = start({
      // The canvas lives under the page: text stays on top, and the stream and the scenes draw
      // through the transparent page background.
      canvas: "behind",
      background: "#121110",
      lenis,
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
