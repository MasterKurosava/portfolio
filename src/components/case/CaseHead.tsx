/**
 * The opening section of a case page: the same container as `Sheet`, but its heading is the
 * page's h1. `titleClassName` sets the size, so a short name can stand at display scale.
 */
export function CaseHead({
  id,
  title,
  titleClassName,
  children,
}: {
  id: string;
  title: string;
  titleClassName: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className="sheet scroll-mt-16">
      <h1 id={headingId} className={`m-0 max-w-full font-[780] text-balance [overflow-wrap:anywhere] ${titleClassName}`}>
        {title}
      </h1>
      {children}
    </section>
  );
}
