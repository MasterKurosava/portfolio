import type { Content, Quote } from "@/content";

/**
 * A recommendation: verbatim sentences, who said them, and the whole text behind a disclosure.
 * On the home page on phones (globals.css, #work .quote) the sentences are held to about five
 * lines with a soft fade, the disclosure comes right under them, and opening it shows the whole
 * text in their place.
 */
export function QuoteBlock({ quote: q, content: c }: { quote: Quote; content: Content }) {
  return (
    <figure className="quote m-0 border-t border-[var(--hair)] pt-8 max-md:pt-6">
      <blockquote className="quote-text">
        {q.excerpt.map((sentence, i) => (
          <p key={i} className="m-0 [&+p]:mt-3">
            {i === 0 ? "«" : ""}
            {sentence}
            {i === q.excerpt.length - 1 ? "»" : ""}
          </p>
        ))}
      </blockquote>
      <figcaption className="quote-by flex items-center gap-4 max-md:gap-3">
        <img
          src={q.photo}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          className="h-14 w-14 flex-none rounded-full object-cover max-md:h-11 max-md:w-11"
        />
        <div className="quote-who text-[0.9375rem] leading-snug">
          <div className="font-semibold">{q.name}</div>
          <div className="text-ink-soft">
            {q.role}, {q.company}
          </div>
          <a className="link text-ink-soft" href={q.telegramHref} target="_blank" rel="noopener">
            {q.telegram}
          </a>
        </div>
      </figcaption>
      <details className="quote-full group text-[0.9375rem] text-ink-soft">
        <summary className="cursor-pointer list-none font-medium text-ink underline decoration-[color-mix(in_oklch,var(--ink)_40%,transparent)] underline-offset-[0.22em] hover:text-spot max-md:inline-flex max-md:min-h-11 max-md:items-center [&::-webkit-details-marker]:hidden">
          {c.ui.full}
        </summary>
        <p className="mb-0 mt-3 max-w-[70ch] max-md:mt-1">{q.full}</p>
      </details>
    </figure>
  );
}
