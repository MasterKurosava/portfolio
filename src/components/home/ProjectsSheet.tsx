import { ArrowUpRight } from "lucide-react";
import { SITE } from "@/content/site";
import type { Content } from "@/content";
import { Sheet } from "@/components/sheet/Sheet";
import { rich } from "@/components/case/rich";

function Out({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener" className="link inline-flex min-h-11 items-center gap-1.5 font-medium">
      {children}
      <ArrowUpRight aria-hidden className="h-[1em] w-[1em]" />
    </a>
  );
}

export function ProjectsSheet({ content: c }: { content: Content }) {
  const p = c.projects;
  const d = p.diorama;
  return (
    <Sheet id="projects" no={4} title={p.title} intro={p.intro} content={c}>
      <i aria-hidden data-stream="edge" className="block h-px w-px" />
      <article aria-labelledby="diorama-title" className="grid gap-10 max-md:gap-6">
        <div className="grid gap-10 max-md:gap-6 md:grid-cols-12 md:gap-x-12">
          <div className="grid content-start gap-5 max-md:gap-4 md:col-span-5">
            <h3
              id="diorama-title"
              className="m-0 text-[clamp(2.5rem,5.4vw,4rem)] font-[800] leading-none tracking-[-0.04em]"
            >
              {d.title}
            </h3>
            {d.text.map((t, i) => (
              <p key={i} className="m-0 text-ink-soft first-of-type:text-ink">
                {rich(t)}
              </p>
            ))}
            <dl className="m-0 grid grid-cols-3 gap-4 border-y border-[var(--hair)] py-5 max-md:py-4">
              {d.numbers.map((n) => (
                <div key={n.label}>
                  <dd className="m-0 text-[clamp(2rem,4.6vw,3.25rem)] font-[800] leading-none tracking-[-0.04em]">
                    {n.value}
                  </dd>
                  <dt className="mt-2 text-[0.875rem] leading-snug text-ink-soft max-md:text-[0.9375rem]">{n.label}</dt>
                </div>
              ))}
            </dl>
            {/* Two plain links: this is a portfolio, not the library's landing. */}
            <p className="m-0 flex flex-wrap gap-x-8 gap-y-3">
              <Out href={SITE.diorama.docs}>dioramajs.dev</Out>
              <Out href={SITE.diorama.repo}>GitHub</Out>
            </p>
          </div>
          <figure className="m-0 md:col-span-7">
            <div className="figure-field p-2 max-md:px-0 md:p-4" data-stream="edge">
              <video
                className="aspect-[16/10] w-full"
                width={1120}
                height={700}
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                poster="/media/diorama-reel.webp"
                data-dio="device"
                data-dio-frame="browser"
                data-dio-color="#2b2926"
                data-dio-yaw="-10"
                data-dio-pitch="6"
                data-dio-turn="20"
                aria-label={d.figure}
              >
                <source src="/media/diorama-reel.webm" type="video/webm" />
                <source src="/media/diorama-reel.mp4" type="video/mp4" />
              </video>
            </div>
            <figcaption className="caption"> {d.figure}
            </figcaption>
          </figure>
        </div>

      </article>

      <article aria-labelledby="intouch-title" className="mt-20 grid gap-10 max-md:mt-12 max-md:gap-6 md:mt-28 md:grid-cols-12 md:gap-x-12">
        <div className="grid content-start gap-5 max-md:gap-4 md:col-span-5">
          <h3
            id="intouch-title"
            className="m-0 text-[clamp(2rem,4.4vw,3.25rem)] font-[780] leading-none tracking-[-0.035em] max-md:text-[1.75rem]"
          >
            {p.intouch.title}
          </h3>
          <p className="m-0">{rich(p.intouch.text)}</p>
          <p className="m-0">
            <Out href={SITE.intouch}>{p.intouch.link}</Out>
          </p>
        </div>
        <figure className="m-0 md:col-span-7">
          <div className="figure-field grid grid-cols-[1fr_auto] items-end gap-4 p-2 max-md:px-0 md:gap-8 md:p-4" data-stream="edge">
            {/* The live landing on a laptop and a phone, captured at 2× and 3×. */}
            <img
              src="/media/intouch-desktop.webp"
              alt={p.intouch.desktopAlt}
              width={2000}
              height={1250}
              loading="lazy"
              className="aspect-[16/10] w-full"
              data-dio="device"
              data-dio-frame="laptop"
              data-dio-color="#3a3835"
              data-dio-yaw="12"
              data-dio-pitch="6"
              data-dio-scale="1.18"
            />
            <img
              src="/media/intouch-mobile.webp"
              alt={p.intouch.mobileAlt}
              width={900}
              height={1948}
              loading="lazy"
              className="relative aspect-[900/1948] w-[24vw] max-w-[170px] max-md:w-[21vw] md:-ml-16 md:w-[11vw]"
              data-dio="device"
              data-dio-frame="phone"
              data-dio-color="#3a3835"
              data-dio-yaw="-14"
            />
          </div>
          <figcaption className="caption"> {p.intouch.figure}
          </figcaption>
        </figure>
      </article>
    </Sheet>
  );
}
