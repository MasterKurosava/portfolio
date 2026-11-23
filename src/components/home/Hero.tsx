import { FileDown, Phone, Send } from "lucide-react";
import { SITE } from "@/content/site";
import type { Content } from "@/content";
import { rich } from "@/components/case/rich";

/**
 * The first screen. On wide screens the name, the copy and the actions stand on the left and the
 * portrait on the right. On phones the portrait is the cover: it opens the page edge to edge, its
 * lower half fades into the stage (a cut of the photo made for phones, profile-cover.webp) and
 * the name stands on that fade; the role, the lead and one row of actions follow. The text block
 * dissolves into the grid there (max-md:contents), so the name and the photo share one cell.
 */
export function Hero({ content: c }: { content: Content }) {
  const h = c.hero;
  const cv = `/cv/kalachev-cv-${c.locale}.pdf`;
  const [roleTitle, ...roleRest] = h.role.split(" · ");
  const roleStack = roleRest.join(" · ");
  return (
    <section id="spec" aria-labelledby="name" className="relative scroll-mt-16 overflow-hidden">
      <div className="mx-auto grid max-w-[calc(var(--page-max)+2*var(--gutter))] gap-x-12 gap-y-10 px-[var(--gutter)] pb-14 pt-10 max-md:gap-y-0 max-md:pb-10 max-md:pt-0 md:grid-cols-12 md:gap-y-12 md:pb-16 md:pt-10">
        <div className="max-md:contents md:col-span-7">
          {/* The name gathers out of the stream of light that runs through the page. */}
          <h1
            id="name"
            data-dio="assemble"
            data-dio-style="dashes"
            data-dio-color="var(--ink)"
            data-dio-accent="var(--spot)"
            data-dio-duration="1.6"
            data-dio-load="eager"
            className="m-0 max-w-full text-[clamp(3.1rem,12.5vw,6rem)] font-[800] leading-[0.92] tracking-[-0.04em] text-balance max-md:relative max-md:z-[1] max-md:col-start-1 max-md:row-start-1 max-md:self-end max-md:pb-1 max-md:text-[clamp(2.75rem,12.5vw,3.25rem)]"
          >
            {h.name}
          </h1>
          <p className="mb-0 mt-6 text-[clamp(1.0625rem,1.6vw,1.25rem)] font-[560] text-spot max-md:mt-3 max-md:leading-snug">
            {roleTitle}
            {roleStack ? (
              <>
                <span className="max-md:hidden"> · </span>
                <span className="max-md:block max-md:font-[500] max-md:text-ink">{roleStack}</span>
              </>
            ) : null}
          </p>
          <p className="mb-0 mt-5 max-w-[54ch] text-[clamp(1.125rem,1.7vw,1.375rem)] leading-[1.5] text-pretty max-md:mt-2.5 max-md:text-[0.9375rem] max-md:leading-[1.55]">
            {rich(h.lead)}
          </p>

          <div id="hero-actions" className="mt-7 flex flex-wrap gap-3 max-md:mt-4 max-md:flex-nowrap max-md:gap-2.5">
            <a className="btn btn-primary btn-tight max-md:flex-1" href={SITE.telegramHref} target="_blank" rel="noopener">
              <Send aria-hidden />
              {c.ui.actions.telegram}
            </a>
            {/* On phones these two are round icon buttons; their labels stay for screen readers. */}
            <a
              className="btn btn-icon"
              href={SITE.phoneHref}
              aria-label={`${c.ui.actions.call}: ${SITE.phone}`}
            >
              <Phone aria-hidden />
              <span className="num max-md:sr-only">{SITE.phone}</span>
            </a>
            <a className="btn btn-icon" href={cv} download>
              <FileDown aria-hidden />
              <span className="max-md:sr-only">{c.ui.actions.cv}</span>
            </a>
          </div>
          <p className="mb-0 mt-6 max-w-[54ch] text-ink-soft max-md:mt-5 max-md:text-[0.9375rem] max-md:leading-[1.5]">
            {rich(h.now)}
          </p>
        </div>

        <figure
          className="m-0 max-md:col-start-1 max-md:row-start-1 max-md:mx-[calc(-1*var(--gutter))] md:col-span-5"
          data-stream="left-edge"
          data-stream-width="44"
          data-stream-z="240"
        >
          <picture className="contents">
            <source media="(max-width: 767px)" srcSet="/images/profile-cover.webp" width={600} height={530} />
            <img
              src="/images/profile.webp"
              alt={h.photoAlt}
              width={600}
              height={634}
              fetchPriority="high"
              data-dio="pixel-portrait tilt crisp"
              data-dio-tilt="7"
              data-dio-lift="18"
              data-dio-perspective="1400"
              data-dio-glare="0.22"
              data-dio-shadow="0.45"
              className="aspect-[4/5] w-full max-w-[400px] rounded-[20px] object-cover max-md:mx-auto max-md:aspect-[600/530] max-md:max-w-[390px] max-md:rounded-none md:ml-auto"
            />
          </picture>
        </figure>

        <dl
          className="m-0 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[var(--hair)] pt-8 max-md:mt-7 max-md:gap-x-5 max-md:gap-y-5 max-md:pt-5 md:col-span-12 md:grid-cols-4"
          data-stream="edge"
          data-stream-dense
          data-stream-width="30"
        >
          {h.numbers.map((n, i) => (
            <div key={n.label}>
              <dd
                className="m-0 whitespace-nowrap text-[clamp(2.5rem,10vw,3.5rem)] font-[800] leading-none tracking-[-0.045em] md:text-[clamp(2.25rem,4.2vw,3.5rem)]"
                data-dio="scramble"
                data-dio-when="(min-width: 768px)"
                data-dio-chars="digits"
                data-dio-duration="1"
                data-dio-delay={String(0.4 + i * 0.12)}
              >
                {n.value}
              </dd>
              <dt className="mt-4 max-w-[22ch] text-[0.9375rem] leading-snug text-ink-soft max-md:mt-2">{n.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* In short: what a recruiter checks first, as facts to scan and the stack as chips. */}
      <div className="mx-auto grid max-w-[calc(var(--page-max)+2*var(--gutter))] gap-x-12 gap-y-8 px-[var(--gutter)] max-md:gap-y-5 md:grid-cols-12">
        <h2
          className="m-0 text-[clamp(1.75rem,3.2vw,2.5rem)] font-[760] leading-tight tracking-[-0.03em] md:col-span-3"
          data-dio="text-reveal"
          data-dio-when="(min-width: 768px)"
          data-dio-by="word"
          data-dio-motion="rise"
        >
          {h.specCaption}
        </h2>
        <div className="grid gap-10 max-md:gap-6 md:col-span-9" data-stream="edge" data-stream-width="26">
          {/* Phones: two columns of short facts; the last one takes the whole row. */}
          <dl className="m-0 grid gap-x-10 gap-y-7 max-md:gap-x-5 max-md:gap-y-5 max-sm:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
            {h.spec.map((row) => (
              <div key={row.label} className="border-t border-[var(--hair)] pt-4 max-md:pt-3 max-md:last:col-span-2">
                <dt className="text-[0.875rem] text-ink-mute max-md:text-[0.9375rem]">{row.label}</dt>
                <dd className="m-0 mt-2 text-[1.0625rem] leading-snug text-ink-soft max-md:mt-1 max-md:text-[0.9375rem]">
                  {rich(row.value)}
                </dd>
              </div>
            ))}
          </dl>
          <div className="grid gap-5 border-t border-[var(--hair)] pt-6 max-md:gap-4 max-md:pt-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] sm:gap-10">
            <div>
              <p className="m-0 text-[0.875rem] text-ink-mute max-md:text-[0.9375rem]">{h.stack.label}</p>
              <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0 max-md:mt-2.5">
                {h.stack.main.map((x) => (
                  <li key={x} className="chip chip-main">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="m-0 text-[0.875rem] text-ink-mute max-md:text-[0.9375rem]">{h.stack.alsoLabel}</p>
              <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0 max-md:mt-2.5">
                {h.stack.also.map((x) => (
                  <li key={x} className="chip">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
