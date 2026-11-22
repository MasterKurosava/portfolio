/**
 * A code listing on a quiet panel, scrollable sideways on a narrow screen. Children are the code
 * with its newlines; spans inside may mark parts of it.
 */
export function CodeBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <pre
      tabIndex={0}
      aria-label={label}
      className="m-0 overflow-x-auto rounded-xl bg-paper-deep px-3 py-4 font-mono text-[0.75rem] leading-[1.7] text-ink sm:px-6 sm:py-5 sm:text-[0.875rem]"
    >
      <code>{children}</code>
    </pre>
  );
}

/** A comment line inside a listing. */
export function Comment({ children }: { children: React.ReactNode }) {
  return <span className="text-ink-mute">{children}</span>;
}

/** The part of a listing the figure is about. */
export function Mark({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-spot">{children}</span>;
}
