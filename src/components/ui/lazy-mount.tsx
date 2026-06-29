"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LazyMountProps {
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
  rootMargin?: string;
}

export function LazyMount({
  children,
  className,
  minHeight = "1px",
  rootMargin = "300px 0px",
}: LazyMountProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || mounted) return;

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setMounted(true);
            observer.disconnect();
          }
        },
        { rootMargin }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }

    setMounted(true);
  }, [mounted, rootMargin]);

  return (
    <div ref={ref} className={cn(className)} style={{ minHeight: mounted ? undefined : minHeight }}>
      {mounted ? children : null}
    </div>
  );
}
