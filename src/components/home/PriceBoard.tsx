"use client";

import { useEffect, useRef, useState } from "react";

const STEP_MS = 2600;

/**
 * Repricing on a split-flap board: the competitor's price changes and the seller's price lands
 * one step under it. The prices are illustrative; the board runs only while it is on screen.
 */
export function PriceBoard({
  rows,
  locale,
  competitor,
  seller,
  caption,
}: {
  rows: [string, number, number][];
  locale: "ru" | "en";
  competitor: string;
  seller: string;
  caption: string;
}) {
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (entry.isIntersecting) timer = window.setInterval(() => setIndex((i) => (i + 1) % rows.length), STEP_MS);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [rows.length]);

  const format = (n: number) => `${n.toLocaleString(locale === "en" ? "en-US" : "ru-RU").replace(/ |,/g, " ")} ${locale === "en" ? "KZT" : "₸"}`;
  const [time, a, b] = rows[index];

  return (
    <div ref={ref} className="figure-field grid gap-5 p-6 md:p-8">
      <p className="m-0 flex items-baseline justify-between gap-4 text-[0.9375rem] text-ink-soft">
        <span>{caption}</span>
        <span className="num whitespace-nowrap text-ink-mute">{time}</span>
      </p>
      <dl className="m-0 grid gap-4">
        <div className="grid gap-1.5">
          <dt className="text-[0.875rem] text-ink-mute">{competitor}</dt>
          <dd
            className="num m-0 text-[clamp(1.75rem,4.4vw,3rem)] font-[760] leading-none tracking-[-0.02em] text-ink-soft"
            data-dio="split-flap"
            data-dio-trigger="change"
            data-dio-chars="digits"
            data-dio-tile="#1d1b19"
          >
            {format(a)}
          </dd>
        </div>
        <div className="grid gap-1.5">
          <dt className="text-[0.875rem] text-ink-mute">{seller}</dt>
          <dd
            className="num m-0 text-[clamp(1.75rem,4.4vw,3rem)] font-[760] leading-none tracking-[-0.02em] text-spot"
            data-dio="split-flap"
            data-dio-trigger="change"
            data-dio-chars="digits"
            data-dio-tile="#1d1b19"
            data-dio-delay="0.5"
          >
            {format(b)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
