import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, Phone, Send } from "lucide-react";
import { getContent } from "@/content";
import { getCases } from "@/content/cases";
import { SITE } from "@/content/site";
import { Link } from "@/lib/i18n/navigation";
import { absoluteUrl, localeUrl, resolveSiteOrigin } from "@/lib/site";
import { Sheet } from "@/components/sheet/Sheet";
import { QuoteBlock } from "@/components/home/QuoteBlock";
import { CaseHead } from "@/components/case/CaseHead";
import { PartSection, KEY_NUMBER } from "@/components/case/PartSection";
import { SpecTable } from "@/components/case/SpecTable";
import { JsonLd } from "@/components/case/JsonLd";
import { CASE_DATE, caseMetadata } from "@/components/case/metadata";

const PATH = "/work/whitewill";
const IMAGE = { url: "/media/ww-cover-d.webp", width: 1680, height: 1001 };

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return caseMetadata(locale, PATH, getCases(locale).whitewill.meta, IMAGE);
}

export default async function WhitewillPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);
  const k = getCases(locale).whitewill;
  const ww = c.work.whitewill;
  const w = k.work;
  const origin = await resolveSiteOrigin();
  const url = localeUrl(locale, PATH, origin);
  const person = `${origin}/#person`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c.hero.name, item: localeUrl(locale, "/", origin) },
          { "@type": "ListItem", position: 2, name: k.meta.crumb, item: url },
        ],
      },
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: k.headline,
        description: k.meta.description,
        inLanguage: locale,
        url,
        mainEntityOfPage: url,
        image: absoluteUrl(IMAGE.url, origin),
        datePublished: CASE_DATE,
        dateModified: CASE_DATE,
        author: { "@id": person },
        publisher: { "@id": person },
        isPartOf: { "@id": `${origin}/#website` },
        about: { "@type": "Organization", name: "Whitewill" },
        keywords: k.meta.keywords.join(", "),
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <CaseHead id="case" title={k.headline} titleClassName="text-[clamp(2rem,6vw,4.75rem)] leading-[1.02] tracking-[-0.03em]">
        <div className="mt-6 grid gap-x-12 gap-y-10 md:mt-10 md:grid-cols-12">
          <div className="grid content-start gap-4 md:col-span-6">
            {/* The mobile action bar shows once this line has scrolled away. */}
            <p id="hero-actions" className="m-0 text-ink-mute">
              {ww.meta}
            </p>
            <p className="m-0 max-w-[60ch] text-[clamp(1.125rem,1.6vw,1.375rem)] leading-[1.5] text-pretty">{k.lead}</p>
          </div>
          <div className="md:col-span-5 md:col-start-8" data-stream="edge">
            <SpecTable caption={k.facts.caption} rows={k.facts.rows} />
          </div>
        </div>
      </CaseHead>

      <Sheet id="done" no={2} title={w.title} content={c} stream="edge">
        <div className="grid gap-12 md:gap-16">
          <PartSection
            part={w.catalog}
            aside={
              <p className="m-0">
                <span className={KEY_NUMBER}>
                  7<span className="mx-[0.12em] text-ink-mute">→</span>
                  <span className="text-spot">1</span>
                </span>
                <span className="mt-3 block max-w-[26ch] text-ink-soft">{w.catalog.keyLabel}</span>
              </p>
            }
          />
          <PartSection part={w.pages} />
          <PartSection
            part={w.speed}
            aside={
              <p className="m-0 flex flex-nowrap items-end gap-x-[0.25em] whitespace-nowrap text-[0.78em] sm:text-[1em]" aria-hidden>
                <span className={`${KEY_NUMBER} text-ink-mute`}>
                  <span className="strike">{w.speed.from}</span>
                  <span className="text-[0.45em] tracking-normal"> {w.speed.unit}</span>
                </span>
                <span className={`${KEY_NUMBER} text-ink-mute`}>→</span>
                <span className={`${KEY_NUMBER} text-spot`}>
                  {w.speed.to}
                  <span className="text-[0.45em] tracking-normal"> {w.speed.unit}</span>
                </span>
              </p>
            }
          />
          <PartSection
            part={w.sync}
            aside={
              <p className="m-0">
                <span className={`${KEY_NUMBER} block text-spot`}>
                  {w.sync.key}
                </span>
                <span className="mt-3 block text-ink-soft">{w.sync.keyLabel}</span>
              </p>
            }
          />
          <PartSection part={w.crm} />
          <PartSection part={w.devops} />
        </div>
      </Sheet>

      <Sheet id="recommendation" no={4} title={k.quote.title} intro={k.quote.intro} content={c}>
        <div className="md:w-8/12" data-stream="beside">
          <QuoteBlock quote={c.work.quotes.whitewill} content={c} />
        </div>
      </Sheet>

      <Sheet id="contact" no={5} title={k.contact.title} intro={k.contact.intro} content={c}>
        <div className="flex flex-wrap gap-3">
          <a className="btn w-full sm:w-auto" href={SITE.phoneHref}>
            <Phone aria-hidden />
            <span className="num">{SITE.phone}</span>
          </a>
          {/* Last in the row: the stream comes in from the right and ends on it. */}
          <a className="btn btn-primary w-full sm:w-auto" href={SITE.telegramHref} target="_blank" rel="noopener" data-stream data-stream-end data-stream-width="4">
            <Send aria-hidden />
            {c.ui.actions.telegram}
          </a>
        </div>
        <ul className="m-0 mt-10 flex list-none flex-wrap gap-x-8 gap-y-4 p-0">
          <li>
            <Link href="/#work" className="link inline-flex min-h-11 items-center gap-2 font-medium">
              <ArrowLeft aria-hidden className="h-[1em] w-[1em]" />
              {k.contact.back}
            </Link>
          </li>
          <li>
            <Link href="/projects/diorama" className="link inline-flex min-h-11 items-center gap-2 font-medium">
              {c.projects.diorama.links.page}
              <ArrowRight aria-hidden className="h-[1em] w-[1em]" />
            </Link>
          </li>
        </ul>
      </Sheet>
    </>
  );
}
