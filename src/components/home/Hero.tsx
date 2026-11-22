import { FileDown, Phone, Send } from "lucide-react";
import { SITE } from "@/content/site";
import type { Content } from "@/content";
import { rich } from "@/components/case/rich";

export function Hero({ content: c }: { content: Content }) {
  const h = c.hero;
  const cv = `/cv/kalachev-cv-${c.locale}.pdf`;
  return (
    <section id="spec" aria-labelledby="name" className="relative scroll-mt-16 overflow-hidden">
      <div className="mx-auto grid max-w-[calc(var(--page-max)+2*var(--gutter))] gap-x-12 gap-y-10 px-[var(--gutter)] pb-14 pt-10 md:grid-cols-12 md:gap-y-12 md:pb-16 md:pt-10">
        <div className="md:col-span-7">
          {/* The name gathers out of the stream of light that runs through the page. */}
          <h1
            id="name"
            data-dio="assemble"
            data-dio-style="dashes"
            data-dio-color="var(--ink)"
            data-dio-accent="var(--spot)"
            data-dio-duration="1.6"
            data-dio-load="eager"
            className="m-0 max-w-full text-[clamp(3.1rem,12.5vw,6rem)] font-[800] leading-[0.92] tracking-[-0.04em] text-balance"
          >
            {h.name}
          </h1>
          <p className="mb-0 mt-6 text-[clamp(1.0625rem,1.6vw,1.25rem)] font-[560] text-spot">{h.role}</p>
          <p className="mb-0 mt-5 max-w-[54ch] text-[clamp(1.125rem,1.7vw,1.375rem)] leading-[1.5] text-pretty">{rich(h.lead)}</p>

          <div id="hero-actions" className="mt-7 flex flex-wrap gap-3">
            <a className="btn btn-primary" href={SITE.telegramHref} target="_blank" rel="noopener">
              <Send aria-hidden />
              {c.ui.actions.telegram}
            </a>
            <a className="btn" href={SITE.phoneHref}>
              <Phone aria-hidden />
              <span className="num">{SITE.phone}</span>
            </a>
            <a className="btn" href={cv} download>
              <FileDown aria-hidden />
              {c.ui.actions.cv}
            </a>
          </div>
          <p className="mb-0 mt-6 max-w-[54ch] text-ink-soft">{rich(h.now)}</p>
        </div>

        <figure
          className="m-0 md:col-span-5"
          data-stream="left-edge"
          data-stream-width="44"
          data-stream-z="240"
        >
          <img
            src="/images/profile.webp"
            alt={h.photoAlt}
            width={600}
            height={634}
            fetchPriority="high"
            data-dio="tilt crisp"
            data-dio-tilt="7"
            data-dio-lift="18"
            data-dio-perspective="1400"
            data-dio-glare="0.22"
            data-dio-shadow="0.45"
            className="aspect-[4/5] w-full max-w-[400px] rounded-[20px] object-cover md:ml-auto"
          />
        </figure>

        <dl
          className="m-0 grid grid-cols-2 gap-x-8 gap-y-8 border-t border-[var(--hair)] pt-8 md:col-span-12 md:grid-cols-4"
          data-stream="edge"
          data-stream-dense
          data-stream-width="30"
        >
          {h.numbers.map((n, i) => (
            <div key={n.label}>
              <dd
                className="m-0 whitespace-nowrap text-[clamp(2.5rem,10vw,3.5rem)] font-[800] leading-none tracking-[-0.045em] md:text-[clamp(2.25rem,4.2vw,3.5rem)]"
                data-dio="scramble"
                data-dio-chars="digits"
                data-dio-duration="1"
                data-dio-delay={String(0.4 + i * 0.12)}
              >
                {n.value}
              </dd>
              <dt className="mt-4 max-w-[22ch] text-[0.9375rem] leading-snug text-ink-soft">{n.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      {/* In short: what a recruiter checks first, as facts to scan and the stack as chips. */}
      <div className="mx-auto grid max-w-[calc(var(--page-max)+2*var(--gutter))] gap-x-12 gap-y-8 px-[var(--gutter)] md:grid-cols-12">
        <h2
          className="m-0 text-[clamp(1.75rem,3.2vw,2.5rem)] font-[760] leading-tight tracking-[-0.03em] md:col-span-3"
          data-dio="text-reveal"
          data-dio-by="word"
          data-dio-motion="rise"
        >
          {h.specCaption}
        </h2>
        <div className="grid gap-10 md:col-span-9" data-stream="edge" data-stream-width="26">
          <dl className="m-0 grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
            {h.spec.map((row) => (
              <div key={row.label} className="border-t border-[var(--hair)] pt-4">
                <dt className="text-[0.875rem] text-ink-mute">{row.label}</dt>
                <dd className="m-0 mt-2 text-[1.0625rem] leading-snug text-ink-soft">{rich(row.value)}</dd>
              </div>
            ))}
          </dl>
          <div className="grid gap-5 border-t border-[var(--hair)] pt-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] sm:gap-10">
            <div>
              <p className="m-0 text-[0.875rem] text-ink-mute">{h.stack.label}</p>
              <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                {h.stack.main.map((x) => (
                  <li key={x} className="chip chip-main">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="m-0 text-[0.875rem] text-ink-mute">{h.stack.alsoLabel}</p>
              <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
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
