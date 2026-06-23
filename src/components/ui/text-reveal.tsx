"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
}

export function TextReveal({ text, className }: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = text;
      return;
    }

    const chars = text.split("");
    el.innerHTML = chars
      .map((c) => `<span class="inline-block opacity-0 translate-y-4">${c === " " ? "&nbsp;" : c}</span>`)
      .join("");

    const spans = el.querySelectorAll("span");
    spans.forEach((span, i) => {
      setTimeout(() => {
        span.classList.remove("opacity-0", "translate-y-4");
        span.classList.add("opacity-100", "translate-y-0", "transition-all", "duration-500");
      }, i * 30);
    });
  }, [text]);

  return <span ref={ref} className={cn(className)} />;
}
