import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { MARKETS } from "@/content/site";
import type { Content } from "@/content";
import { Sheet } from "@/components/sheet/Sheet";
import { Revisions } from "./Revisions";
import { QuoteBlock } from "./QuoteBlock";
import { PriceBoard } from "./PriceBoard";
import { CityBackdrop, CityStage } from "./CityStage";
import { VotonChain } from "./VotonChain";
import { plain, rich } from "@/components/case/rich";

type Theme = "whitewill" | "voton" | "teknolab";

/**
 * Each company's heading in the manner of its trade: the real estate one rises over its city,
 * hashes decoding into the name of the Web3 startup, a flip board of prices for the marketplace tool.
 */
const HEAD_EFFECT: Record<Theme, Record<string, string>> = {
  whitewill: {
    "data-dio": "text-reveal",
    "data-dio-by": "word",
    "data-dio-motion": "rise",
    "data-dio-stagger": "0.06",
    "data-dio-duration": "0.9",
  },
  voton: {
    "data-dio": "scramble",
    "data-dio-motion": "decode",
    "data-dio-chars": "hex",
    "data-dio-trigger": "view",
    "data-dio-duration": "0.9",
    "data-dio-stagger": "0.025",
  },
  teknolab: {
    "data-dio": "split-flap",
    "data-dio-style": "plain",
    "data-dio-motion": "random",
    "data-dio-trigger": "view",
    "data-dio-flips": "8",
    "data-dio-stagger": "0.02",
  },
};

/** A company heading. Dates, role and city are in the table above, so the heading stands alone. */
function CompanyHead({ id, title, theme }: { id: string; title: string; theme: Theme }) {
  return (
    <header className="border-t border-[var(--hair)] pt-8">
      <h3
        id={`${id}-title`}
        className="m-0 max-w-[24ch] text-[clamp(2rem,4.6vw,3.5rem)] font-[780] leading-[1.02] tracking-[-0.035em] text-balance"
        {...HEAD_EFFECT[theme]}
      >
        {plain(title)}
      </h3>
    </header>
  );
}

export function WorkSheet({ content: c }: { content: Content }) {
  const w = c.work;
  const ww = w.whitewill;
  const p = ww.parts;
  return (
    <Sheet id="work" title={w.title} intro={w.intro} introStream="beside" content={c}>
      <div data-stream="edge">
        <Revisions content={c} />
      </div>

      {/* Whitewill: real estate. Gold for the company, a globe of its markets, and the night city
          of its listings as the chapter's backdrop. What he did is one short list. */}
      <article
        id="whitewill"
        aria-labelledby="whitewill-title"
        className="theme-whitewill city-world mt-20 grid scroll-mt-20 gap-12 md:mt-32 md:gap-16"
      >
        <CompanyHead id="whitewill" title={ww.title} theme="whitewill" />
        <div className="grid gap-12 md:grid-cols-12 md:gap-x-12">
          <div className="grid content-start gap-8 md:col-span-7" data-city-part="text">
            <p className="m-0 max-w-[62ch] text-[clamp(1.0625rem,1.4vw,1.25rem)] leading-[1.55]">{rich(ww.context)}</p>
            <ul className="m-0 grid list-none p-0">
              {ww.points.map((point) => (
                <li key={point.title} className="grid gap-1 border-t border-[var(--hair)] py-4 last:border-b">
                  <h4 className="m-0 text-[1.125rem] font-[680] leading-snug tracking-[-0.01em]">{rich(point.title)}</h4>
                  <p className="m-0 text-ink-soft">{rich(point.text)}</p>
                </li>
              ))}
            </ul>
          </div>
          <figure className="m-0 md:col-span-5 md:self-center" data-stream="edge">
            <div
              className="aspect-square w-full"
              data-dio="globe"
              data-dio-markers="#markets li"
              data-dio-motion="flow"
              data-dio-lat="38"
              data-dio-lng="22"
              data-dio-spin="5"
              data-dio-scale="0.9"
              data-dio-color="#1b1917"
              data-dio-land="#8f8a80"
              data-dio-marker="var(--spot)"
              data-dio-arc="var(--spot)"
              data-dio-atmosphere="#f2b45a"
              data-dio-glow="0.45"
              data-city-part="moon"
              aria-hidden
            />
            <ul id="markets" className="m-0 mt-4 flex list-none flex-wrap gap-x-5 gap-y-2 p-0 text-[0.9375rem]" data-city-part="label">
              {MARKETS.map((m, i) => (
                <li
                  key={m.id}
                  id={`market-${m.id}`}
                  data-dio-lat={m.lat}
                  data-dio-lng={m.lng}
                  data-dio-to={i === 0 ? MARKETS.slice(1).map((o) => `market-${o.id}`).join(" ") : undefined}
                  className="flex items-center gap-2"
                >
                  <span aria-hidden className={`h-1.5 w-1.5 flex-none rounded-full ${i === 0 ? "bg-spot" : "bg-[var(--ink-mute)]"}`} />
                  {p.sync.markers[m.id]}
                </li>
              ))}
            </ul>
            <figcaption className="caption" data-city-part="label">{p.sync.figure}</figcaption>
          </figure>
        </div>

        {/* The night city under the whole chapter (absolute over all of it): it rises as the
            heading comes up, stays low and hazed behind the text, comes down to the lit waterfront
            for the 100 000+ and sinks away under the quote. It sits after the globe in the markup,
            so its towers draw in front of the globe: the planet rises behind the skyline. */}
        <CityBackdrop alt={p.sync.cityAlt} />

        {/* The chapter's peak: the camera comes down to the city, one window per listing. */}
        <CityStage value={p.sync.key} label={p.sync.keyLabel} text={p.sync.cityCaption} alt={p.sync.cityAlt} />

        <p className="m-0" data-city-part="quote">
          <Link href="/work/whitewill" className="btn">
            {ww.link}
            <ArrowRight aria-hidden />
          </Link>
        </p>

        <div className="md:w-8/12" data-stream="beside" data-city-part="quote">
          <QuoteBlock quote={w.quotes.whitewill} content={c} />
        </div>
      </article>

      {/* VOTON: Web3. A cool violet light, the heading decodes out of hashes. */}
      <article id="voton" aria-labelledby="voton-title" className="theme-voton mt-24 grid scroll-mt-20 gap-12 md:mt-36">
        <CompanyHead id="voton" title={w.voton.title} theme="voton" />
        {/* A live chain: data arrives over the wire, a block forms and locks in, the chain moves on. */}
        <VotonChain />
        <div className="grid gap-10 md:grid-cols-12 md:gap-x-12">
          <div className="grid content-start gap-4 md:col-span-6">
            {w.voton.text.map((t, i) => (
              <p key={i} className="m-0 text-ink-soft first:text-ink">
                {rich(t)}
              </p>
            ))}
          </div>
          <div className="grid content-start gap-6 md:col-span-6" data-stream="edge">
            <dl className="m-0 grid grid-cols-2 gap-6 border-y border-[var(--hair)] py-6">
              <div>
                <dt className="text-ink-soft">{w.voton.years.fromLabel}</dt>
                <dd className="key-number m-0 mt-3" data-dio="scramble" data-dio-chars="digits" data-dio-duration="0.9">
                  {w.voton.years.from}
                </dd>
              </div>
              <div>
                <dt className="text-ink-soft">{w.voton.years.toLabel}</dt>
                <dd className="key-number m-0 mt-3 text-spot" data-dio="scramble" data-dio-chars="digits" data-dio-duration="1.2" data-dio-delay="0.35">
                  {w.voton.years.to}
                </dd>
              </div>
            </dl>
            <p className="m-0">
              <a href="#projects" className="link inline-flex items-center gap-2 font-medium">
                {w.voton.link}
                <ArrowRight aria-hidden className="h-[1em] w-[1em]" />
              </a>
            </p>
          </div>
        </div>
        <div className="md:w-8/12" data-stream="beside">
          <QuoteBlock quote={w.quotes.voton} content={c} />
        </div>
      </article>

      {/* Teknolab: a marketplace price war. Price-tag red and a flip board. */}
      <article id="teknolab" aria-labelledby="teknolab-title" className="theme-teknolab mt-24 grid scroll-mt-20 gap-12 md:mt-36">
        <CompanyHead id="teknolab" title={w.teknolab.title} theme="teknolab" />
        <div className="grid gap-10 md:grid-cols-12 md:gap-x-12">
          <div className="grid content-start gap-4 md:col-span-5">
            {w.teknolab.text.map((t, i) => (
              <p key={i} className="m-0 text-ink-soft first:text-ink">
                {rich(t)}
              </p>
            ))}
          </div>
          <figure className="m-0 md:col-span-7" data-stream="edge">
            <PriceBoard
              rows={w.teknolab.chart.rows}
              locale={c.locale}
              competitor={w.teknolab.chart.competitor}
              seller={w.teknolab.chart.seller}
              caption={w.teknolab.chart.caption}
            />
            <figcaption className="caption">{w.teknolab.figure}</figcaption>
          </figure>
        </div>
        <div className="md:w-8/12" data-stream="beside">
          <QuoteBlock quote={w.quotes.teknolab} content={c} />
        </div>
      </article>
    </Sheet>
  );
}
