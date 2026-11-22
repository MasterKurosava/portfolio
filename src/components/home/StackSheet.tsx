import type { Content } from "@/content";
import { Sheet } from "@/components/sheet/Sheet";

/**
 * The stack in four layers. In layout the four plates stand in the right column next to their
 * descriptions; the `assembly` effect draws them as an isometric deck low in that column and
 * lands each plate in its slot, with its description, as its row comes up to the middle of the
 * screen. The stream runs down through the plates, clear of the copy on the left; the caption
 * keeps to the left column, out of the stream's way.
 *
 * The plates are 2400 px wide for 2x screens (the column is at most 616 px), with a 1200 px file
 * for 1x screens and phones. The GL copy reads the file the browser picked.
 */
export function StackSheet({ content: c }: { content: Content }) {
  const s = c.stack;
  return (
    <Sheet id="stack" no={3} title={s.title} intro={s.intro} content={c}>
      <figure className="m-0">
        <i aria-hidden data-stream="edge" className="block h-px w-px" />
        <ol className="stack-list m-0 grid list-none gap-6 p-0 max-md:gap-7 md:gap-8" data-dio="assembly">
          {s.parts.map((part, i) => (
            <li key={part.pos} className="stack-row grid items-center gap-4 max-md:gap-3 md:grid-cols-12 md:gap-x-12">
              <div
                className="md:col-span-6 md:col-start-7 md:row-start-1"
                data-stream={i === 0 || i === s.parts.length - 1 ? "" : undefined}
                data-stream-width="50"
              >
                <img
                  src={`/media/plate-${i + 1}-1200.webp`}
                  srcSet={`/media/plate-${i + 1}-800.webp 800w, /media/plate-${i + 1}-1200.webp 1200w, /media/plate-${i + 1}-1600.webp 1600w, /media/plate-${i + 1}.webp 2400w`}
                  sizes="(min-width: 768px) min(616px, calc(50vw - 64px)), calc(50vw - 26px)"
                  alt={part.plateAlt}
                  width={1200}
                  height={640}
                  loading="lazy"
                  className="plate aspect-[1200/640] w-full"
                  data-dio="crisp"
                />
              </div>
              <div className="stack-label md:col-span-6 md:col-start-1 md:row-start-1">
                <div className="grid gap-1.5 max-md:gap-1">
                  <h3 className="m-0 text-[clamp(1.25rem,2vw,1.625rem)] font-[680] leading-tight tracking-[-0.02em]">
                    {part.title}
                  </h3>
                  <p className="m-0 text-ink-soft max-md:text-[0.9375rem] max-md:leading-[1.5]">{part.text}</p>
                  <p className="m-0 font-medium max-md:text-[0.9375rem] max-md:leading-[1.5]">{part.items}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <figcaption className="caption md:max-w-[calc(50%-24px)]">{s.figure}</figcaption>
      </figure>
    </Sheet>
  );
}
