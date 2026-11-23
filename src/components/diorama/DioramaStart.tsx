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
    // Before start(), so every effect reads its held threshold when it is created.
    const held = hold();
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
    // to half a second as it comes into view (more on a phone). Only once the intros of the first
    // screen have played: a compile holds the GPU, and every frame of the page with it, for up to
    // a few tenths of a second, which froze the name and the portrait mid-flight.
    const warm = warmPipelines(app);
    const lifted = lift(app, held);
    prepareAhead(app, lifted.then(() => wait(INTROS)), warm);
    return () => void app;
  }, []);
  return null;
}

/** The loader stays at least this long, ms since the navigation started: no flash on a fast load. */
const SHORTEST = 1300;
/** And at most this long, then the page shows whatever is ready. */
const LONGEST = 8000;
/**
 * States after which an intro element has drawn, or will not: drawn, showing its DOM (`live`: the
 * effect plays nothing over it, e.g. a font it cannot draw), or without its effect.
 */
const SETTLED = new Set(["drawn", "live", "off", "failed"]);
/** ms from the loader's leave until the intros have played: the name takes about 2.8 s. */
const INTROS = 3200;
/**
 * A threshold no element reaches: the share of the box in view that starts a text intro, and a
 * share above 1 never shows. The text effects' own default is 0.2.
 */
const HELD = "2";
const PLAY = "0.2";

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Holds the text intros of the first screen (`data-loader-hold`) while the loader is up. They are
 * set up and their shaders compile under it, but none plays where no one sees it: each waits on a
 * threshold it cannot reach until the loader goes. Pages reached later, without the loader, play
 * as usual. Returns the held elements.
 */
function hold(): Element[] {
  if (!document.documentElement.hasAttribute("data-loading")) return [];
  const held = [...document.querySelectorAll("[data-loader-hold]")];
  for (const el of held) el.setAttribute("data-dio-threshold", HELD);
  return held;
}

/**
 * Lifts the loader (components/layout/Loader) once the first screen is ready: the fonts are in and
 * every intro element (`data-dio-intro` with an effect: the portrait and the name) has drawn its
 * first frame, or the 3D is off or unavailable. The loader's line follows the assets wave
 * meanwhile. Then the held intros are let go, so they start in front of the reader with nothing
 * left to set up or compile. Resolves when the loader starts to leave (at once without one).
 */
function lift(app: App, held: readonly Element[]): Promise<void> {
  const root = document.documentElement;
  const loader = document.querySelector<HTMLElement>("[data-loader]");
  if (!loader || !root.hasAttribute("data-loading")) return Promise.resolve();
  let left: () => void = () => {};
  const leaving = new Promise<void>((resolve) => (left = resolve));
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
        for (const el of held) el.setAttribute("data-dio-threshold", PLAY);
        // A held intro sleeps without frames: one frame lets it see the new threshold.
        if (app.state.value === "running") app.invalidate();
        // React owns the loader's node: hidden, never removed, or the next render would break.
        setTimeout(() => loader.setAttribute("data-done", ""), 1600);
        left();
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
  return leaving;
}
