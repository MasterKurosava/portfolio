import type { CasePart } from "@/content/cases";

/** Size of a key number inside a part: the scale of `.key-number`, held to a narrower column. */
export const KEY_NUMBER = "num font-[800] text-[clamp(2.75rem,7vw,5rem)] leading-[0.9] tracking-[-0.04em]";

/**
 * A part of a case: the title and its key number on the left, the text on
 * the right. On a phone the key number follows the text.
 */
export function PartSection({ part, aside }: { part: CasePart; aside?: React.ReactNode }) {
  const titleId = `${part.id}-title`;
  return (
    <section
      id={part.id}
      aria-labelledby={titleId}
      className="grid scroll-mt-20 gap-5 border-t border-[var(--hair)] pt-8 md:grid-cols-12 md:gap-x-12 md:gap-y-8 md:pt-10"
    >
      <h3
        id={titleId}
        className="m-0 flex items-baseline gap-3 text-[clamp(1.25rem,2.1vw,1.625rem)] font-[680] leading-[1.15] tracking-[-0.02em] text-balance md:col-span-5 md:row-start-1"
      >
        <span>{part.title}</span>
      </h3>
      <div className="grid content-start gap-4 md:col-span-7 md:col-start-6 md:row-span-2 md:row-start-1">
        {part.text.map((t, i) => (
          <p key={i} className="m-0 max-w-[62ch] text-ink-soft first:text-ink">
            {t}
          </p>
        ))}
      </div>
      {aside ? <div className="mt-2 md:col-span-5 md:row-start-2 md:mt-0">{aside}</div> : null}
    </section>
  );
}
