"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { type App, ready, start } from "@dioramajs/diorama";
import { prepareAhead, warmPipelines } from "@/lib/diorama-prepare";

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
    // Effects further down get ready ahead, in idle time while the page is not being scrolled, and
    // their shaders compile before their first frame: otherwise a section stalls the scroll for up
    // to half a second as it comes into view (more on a phone). After the first screen has
    // arrived, so the name's assembly is not disturbed.
    const loaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });
    prepareAhead(
      app,
      loaded.then(() => new Promise((resolve) => setTimeout(resolve, 2200))),
      warmPipelines(app),
    );
    lift(app);
    return () => void app;
  }, []);
  return null;
}

/** The loader stays at least this long, ms since the navigation started: no flash on a fast load. */
const SHORTEST = 1300;
/** And at most this long, then the page shows whatever is ready. */
const LONGEST = 8000;
/** States after which an intro element has drawn, or will not. */
const SETTLED = new Set(["drawn", "off", "failed"]);

/**
 * Lifts the loader (components/layout/Loader) once the first screen is ready: the fonts are in and
 * every intro picture (`data-dio-intro` with an effect) has drawn its first frame, or the 3D is off
 * or unavailable. The loader's line follows the assets wave meanwhile. Then the portrait plays and
 * the name's `assemble` is attached, so both start in front of the reader.
 */
function lift(app: App): void {
  const root = document.documentElement;
  const loader = document.querySelector<HTMLElement>("[data-loader]");
  if (!loader || !root.hasAttribute("data-loading")) return;
  let gone = false;
  const finish = (): void => {
    if (gone) return;
    gone = true;
    observer.disconnect();
    setTimeout(
      () => {
        loader.style.setProperty("--p", "1");
        root.removeAttribute("data-loading");
        window.dispatchEvent(new Event("portfolio:ready"));
        if (document.getElementById("name")) app.attach("#name", "assemble");
        // React owns the loader's node: hidden, never removed, or the next render would break.
        setTimeout(() => loader.setAttribute("data-done", ""), 1600);
      },
      Math.max(0, SHORTEST - performance.now()),
    );
  };
  setTimeout(finish, Math.max(0, LONGEST - performance.now()));
  const pictures = [...document.querySelectorAll("[data-dio-intro][data-dio]")];
  const drawn = (): boolean =>
    pictures.every((el) => SETTLED.has(el.getAttribute("data-dio-state") ?? ""));
  const fonts = document.fonts?.ready ?? Promise.resolve();
  const observer = new MutationObserver(() => {
    if (drawn()) void fonts.then(finish);
  });
  for (const el of pictures) observer.observe(el, { attributeFilter: ["data-dio-state"] });
  if (drawn()) void fonts.then(finish);
  void ready(app)
    .then((started) => {
      started.effects.status.subscribe((status) => {
        if (status === "off" || status === "unavailable") finish();
      });
      started.assets.progress.subscribe((value) => loader.style.setProperty("--p", String(value)));
    })
    .catch(finish);
}
