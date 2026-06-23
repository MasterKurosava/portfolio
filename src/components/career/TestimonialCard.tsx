"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import type { Testimonial } from "@/data/testimonials";
import { t } from "@/data/career";
import { TechText } from "@/components/ui/tech-text";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  testimonial: Testimonial;
  locale: string;
  placeholderLabel: string;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  locale,
  placeholderLabel,
  className,
}: TestimonialCardProps) {
  return (
    <aside
      className={cn(
        "rounded-xl border p-6",
        testimonial.isPlaceholder
          ? "border-amber-500/30 bg-amber-500/5"
          : "border-border bg-elevated",
        className
      )}
    >
      <p className="font-mono text-[10px] tracking-widest text-muted uppercase">
        {locale === "ru" ? "Рекомендация" : "Recommendation"}
      </p>

      <div className="mt-4 flex gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-border">
          <Image
            src={testimonial.photo}
            alt={testimonial.author}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div>
          <p className="font-semibold">{testimonial.author}</p>
          <p className="text-sm text-muted">{t(testimonial.role, locale)}</p>
          <p className="font-mono text-xs text-muted/80">{testimonial.company}</p>
        </div>
      </div>

      <blockquote className="mt-4 text-sm leading-relaxed text-foreground/85">
        «<TechText>{t(testimonial.text, locale)}</TechText>»
      </blockquote>

      {testimonial.isPlaceholder && (
        <p className="mt-2 font-mono text-[10px] text-amber-500">{placeholderLabel}</p>
      )}

      {testimonial.contactLink && testimonial.contactLink !== "#" && (
        <a
          href={testimonial.contactLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-accent transition-colors hover:text-accent/80"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          {testimonial.telegram ?? (locale === "ru" ? "Связаться" : "Contact")}
        </a>
      )}
    </aside>
  );
}
