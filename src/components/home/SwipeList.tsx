"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A list that becomes a sideways row of cards on phones (`.swipe-row` in globals.css: native
 * scrolling with scroll snap, the next card peeking in). Wider screens lay the list out as before
 * and never see the counter. Script only follows the scroll for the "2 / 6" counter and makes the
 * row focusable while it actually scrolls, so arrow keys move it; it never moves the row itself.
 */
export function SwipeList({
  count,
  labelledBy,
  className = "",
  children,
}: {
  count: number;
  /** Id of the heading that names the list, for the focusable row. */
  labelledBy?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [scrolls, setScrolls] = useState(false);

  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      const max = row.scrollWidth - row.clientWidth;
      setScrolls(max > 1);
      if (max <= 1) return setIndex(0);
      const first = row.firstElementChild as HTMLElement | null;
      const second = first?.nextElementSibling as HTMLElement | null;
      const step = first && second ? second.offsetLeft - first.offsetLeft : row.clientWidth;
      const at = row.scrollLeft >= max - 2 ? count - 1 : Math.round(row.scrollLeft / Math.max(1, step));
      setIndex(Math.min(count - 1, Math.max(0, at)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    row.addEventListener("scroll", schedule, { passive: true });
    const resize = new ResizeObserver(schedule);
    resize.observe(row);
    read();
    return () => {
      row.removeEventListener("scroll", schedule);
      resize.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [count]);

  return (
    <div className="swipe md:contents" style={{ "--swipe-i": index, "--swipe-n": count } as React.CSSProperties}>
      <ul
        ref={ref}
        className={`swipe-row ${className}`}
        tabIndex={scrolls ? 0 : undefined}
        aria-labelledby={scrolls ? labelledBy : undefined}
      >
        {children}
      </ul>
      <div className="swipe-meter md:hidden" aria-hidden>
        <span className="swipe-track">
          <span className="swipe-thumb" />
        </span>
        <span className="num swipe-count">
          {index + 1} / {count}
        </span>
      </div>
    </div>
  );
}
