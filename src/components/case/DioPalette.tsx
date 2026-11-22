"use client";

import { useEffect } from "react";

/**
 * `graph` (and `chart`) read `data-dio-colors` as literal CSS colours: a `var()` there is not
 * resolved and falls back to grey. Elements keep their palette as variables in `data-palette`;
 * this writes the resolved colours into `data-dio-colors`, and again when the print switches
 * on a style change. The change of a string param rebuilds the effect in the new colours.
 */
export function DioPalette() {
  useEffect(() => {
    const apply = () => {
      document.querySelectorAll<HTMLElement>("[data-palette]").forEach((el) => {
        const style = getComputedStyle(el);
        const resolved = (el.dataset.palette ?? "")
          .trim()
          .split(/\s+(?![^(]*\))/)
          .map((token) => {
            const name = /^var\((--[\w-]+)\)$/.exec(token)?.[1];
            return (name && style.getPropertyValue(name).trim()) || token;
          })
          .join(" ");
        if (resolved && el.getAttribute("data-dio-colors") !== resolved) el.setAttribute("data-dio-colors", resolved);
      });
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return null;
}
