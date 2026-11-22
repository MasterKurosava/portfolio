"use client";

import { useEffect, useState } from "react";

interface Mark {
  key: string;
  label: string;
  top: number;
  left: number;
  width: number;
  height: number;
}

const ATTR = "data-designations";
const SHOWN = ["data-dio-style", "data-dio-frame", "data-dio-mode", "data-dio-motion", "data-dio-from"];

function describe(el: Element): string {
  const parts = [`data-dio="${el.getAttribute("data-dio")}"`];
  for (const name of SHOWN) {
    const value = el.getAttribute(name);
    if (value) parts.push(`${name.replace("data-dio-", "")}="${value}"`);
  }
  return parts.join(" ");
}

/** Labels every element Diorama draws with its markup, like designations on a drawing. */
export function Designations() {
  const [marks, setMarks] = useState<Mark[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!root.hasAttribute(ATTR)) {
          setMarks([]);
          return;
        }
        const list: Mark[] = [];
        document.querySelectorAll("main [data-dio]").forEach((el, i) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          list.push({
            key: `${i}`,
            label: describe(el),
            top: r.top + window.scrollY,
            left: r.left + window.scrollX,
            width: r.width,
            height: r.height,
          });
        });
        setMarks(list);
      });
    };
    const observer = new MutationObserver(measure);
    observer.observe(root, { attributes: true, attributeFilter: [ATTR] });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (marks.length === 0) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-0 w-full">
      {marks.map((m) => (
        <div key={m.key}>
          <div className="designation-frame" style={{ top: m.top, left: m.left, width: m.width, height: m.height }} />
          <div className="designation" style={{ top: m.top - 4, left: Math.max(4, m.left) }}>
            {m.label}
          </div>
        </div>
      ))}
    </div>
  );
}
