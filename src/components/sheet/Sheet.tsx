import type { Content } from "@/content";
import { rich } from "@/components/case/rich";

/** One scene of the page: a big heading, an optional intro and its content. */
export function Sheet({
  id,
  title,
  intro,
  children,
  className = "",
  stream,
  introStream,
}: {
  id: string;
  /** Kept for callers; scenes are no longer numbered. */
  no?: number;
  title: string;
  intro?: string;
  content?: Content;
  children: React.ReactNode;
  className?: string;
  /** A `data-stream` anchor mode for the whole section, such as "edge" for text passages. */
  stream?: string;
  /** A `data-stream` anchor mode for the intro, such as "beside" to swing out next to it. */
  introStream?: string;
}) {
  const headingId = `${id}-title`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`sheet scroll-mt-16 ${className}`}
      data-stream={stream}
      data-stream-width={stream ? "30" : undefined}
    >
      <div className="sheet-head">
        <h2
          id={headingId}
          className="sheet-title"
          data-dio="assemble"
          data-dio-phone="off"
          data-dio-style="dashes"
          data-dio-from="edges"
          data-dio-color="var(--ink)"
          data-dio-accent="var(--spot)"
          data-dio-duration="1.3"
        >
          {title}
        </h2>
        {intro ? (
          <p className="sheet-intro" data-stream={introStream}>
            {rich(intro)}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** Kept for callers from the earlier design; renders nothing. */
export function TitleBlock(props: { content: Content; name: string; no: number }) {
  void props;
  return null;
}
