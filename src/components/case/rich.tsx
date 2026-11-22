/** Classes of a plain figure caption under a picture or a diagram. */
export const CAPTION = "mt-3 max-w-[70ch] text-[0.9375rem] leading-normal text-ink-soft";

/**
 * Copy with light markup, so the main thing in a sentence stands out:
 * `**words**` in the accent light, `__words__` in full white over softer text, `code` in backticks
 * in the code face. Everything else stays plain text.
 */
export function rich(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`)/);
  if (parts.length === 1) return text;
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-[inherit] text-spot">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("__") && part.endsWith("__")) {
      return (
        <strong key={i} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={i} className="font-mono text-[0.88em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

/** The same copy as plain text, for meta tags, alt text and JSON-LD. */
export function plain(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*|__([^_]+)__|`([^`]+)`/g, (_m, a, b, c) => a ?? b ?? c);
}
