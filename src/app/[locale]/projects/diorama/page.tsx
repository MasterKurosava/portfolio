import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getContent } from "@/content";
import { getCases, type PackageRow } from "@/content/cases";
import { SITE } from "@/content/site";
import { Link } from "@/lib/i18n/navigation";
import { localeUrl, resolveSiteOrigin } from "@/lib/site";
import { Sheet } from "@/components/sheet/Sheet";
import { CaseHead } from "@/components/case/CaseHead";
import { SpecTable } from "@/components/case/SpecTable";
import { PackageGraph, SPOT_GROUP, npmUrl } from "@/components/case/PackageGraph";
import { CodeBlock, Comment, Mark } from "@/components/case/CodeBlock";
import { DioPalette } from "@/components/case/DioPalette";
import { JsonLd } from "@/components/case/JsonLd";
import { CAPTION, rich } from "@/components/case/rich";
import { caseMetadata } from "@/components/case/metadata";

const PATH = "/projects/diorama";
const IMAGE = { url: "/media/diorama-reel.webp", width: 1120, height: 700 };

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return caseMetadata(locale, PATH, getCases(locale).diorama.meta, IMAGE);
}

function Out({ href, children, className = "btn" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener" className={className}>
      {children}
      <ArrowUpRight aria-hidden />
    </a>
  );
}

function PackageTable({ caption, rows, spot = false }: { caption: string; rows: PackageRow[]; spot?: boolean }) {
  return (
    <table className="spec">
      <caption>
        {/* The same mark as the highlighted nodes of the diagram. */}
        {spot ? <span aria-hidden className="mr-2 inline-block h-[0.6em] w-[0.6em] rounded-full bg-spot" /> : null}
        {caption}
      </caption>
      <tbody>
        {rows.map((r) => (
          <tr key={r.name}>
            <th scope="row">
              <a className="link font-mono text-[0.875rem]" href={npmUrl(r.name)} target="_blank" rel="noopener">
                {r.name}
              </a>
            </th>
            <td>{rich(r.text)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** A link shown by its address without the scheme. */
function Address({ href }: { href: string }) {
  return (
    <a className="link [overflow-wrap:anywhere]" href={href} target="_blank" rel="noopener">
      {href.replace(/^https:\/\/(www\.)?/, "")}
    </a>
  );
}

export default async function DioramaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);
  const k = getCases(locale).diorama;
  const d = c.projects.diorama;
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
        // Same id as the node in the layout's graph: this page adds the details.
        "@type": "SoftwareSourceCode",
        "@id": `${origin}/#diorama`,
        name: "Diorama",
        description: k.meta.description,
        codeRepository: SITE.diorama.repo,
        url: SITE.diorama.docs,
        sameAs: [SITE.diorama.npm],
        programmingLanguage: "TypeScript",
        runtimePlatform: "Web browser",
        version: "0.1.1",
        license: "https://opensource.org/licenses/MIT",
        author: { "@id": person },
        mainEntityOfPage: url,
        inLanguage: locale,
      },
    ],
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <DioPalette />

      <CaseHead id="case" title={k.headline} titleClassName="text-[clamp(3.25rem,15vw,6rem)] leading-[0.95] tracking-[-0.04em]">
        <div className="mt-8 grid gap-x-12 gap-y-10 md:mt-12 md:grid-cols-12">
          <div className="grid content-start gap-5 md:col-span-5">
            {k.lead.map((t, i) => (
              <p key={i} className="m-0 max-w-[60ch] text-ink-soft first:text-[clamp(1.125rem,1.6vw,1.375rem)] first:leading-[1.5] first:text-ink">
                {t}
              </p>
            ))}
            <div id="hero-actions" className="mt-2 flex flex-wrap gap-3">
              <Out href={SITE.diorama.docs}>{d.links.docs}</Out>
              <Out href={SITE.diorama.repo}>{d.links.repo}</Out>
              <Out href={SITE.diorama.npm}>{d.links.npm}</Out>
            </div>
          </div>
          <figure className="m-0 md:col-span-7 md:col-start-6 md:row-span-2 md:row-start-1" data-stream data-stream-width="70">
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
              data-dio-color="var(--ink)"
              data-dio-yaw="-10"
              data-dio-pitch="6"
              data-dio-turn="20"
              aria-label={d.figure}
            >
              <source src="/media/diorama-reel.webm" type="video/webm" />
              <source src="/media/diorama-reel.mp4" type="video/mp4" />
            </video>
            <figcaption className={CAPTION}>{d.figure}</figcaption>
          </figure>
          <SpecTable caption={k.spec.caption} rows={k.spec.rows} className="md:col-span-5 md:row-start-2" />
        </div>
      </CaseHead>

      <Sheet id="how" no={2} title={k.how.title} intro={k.how.intro} content={c} stream="edge">
        <div className="grid gap-12 md:grid-cols-12 md:gap-x-12">
          <ol className="m-0 grid list-none content-start gap-6 p-0 md:col-span-6">
            {k.how.steps.map((step, i) => (
              <li key={i} className="grid grid-cols-[2.25rem_1fr] items-baseline gap-2">
                <span className="num text-[1.125rem] font-[680] text-ink-mute">{i + 1}</span>
                <p className="m-0 max-w-[52ch]">{rich(step)}</p>
              </li>
            ))}
          </ol>
          <SpecTable caption={k.how.hood.caption} rows={k.how.hood.rows} className="md:col-span-6" />
        </div>
      </Sheet>

      <Sheet id="packages" no={3} title={k.packages.title} intro={k.packages.intro.replace(/`/g, "")} content={c} stream="edge">
        <div className="grid gap-12 md:grid-cols-12 md:gap-x-12">
          <figure className="m-0 md:sticky md:top-20 md:col-span-7 md:self-start">
            <PackageGraph label={k.packages.label} entry={k.packages.entry.row} groups={k.packages.groups} />
            <figcaption className={CAPTION}>{rich(k.packages.figure)}</figcaption>
          </figure>
          <div className="grid content-start gap-10 md:col-span-5">
            <PackageTable caption={k.packages.entry.caption} rows={[k.packages.entry.row]} />
            {k.packages.groups.map((g) => (
              <PackageTable key={g.id} caption={g.caption} rows={g.rows} spot={g.id === SPOT_GROUP} />
            ))}
          </div>
        </div>
      </Sheet>

      <Sheet id="code" no={4} title={k.code.title} intro={k.code.intro} content={c}>
        <div className="grid gap-14 md:grid-cols-12 md:gap-x-12">
          <div className="grid content-start gap-5 md:col-span-5">
            <figure className="m-0">
              <CodeBlock label={k.code.listing.markup}>
                {`<img\n  src="/harbour.jpg"\n  alt="${k.code.attribute.alt}"\n  `}
                <Mark>data-dio=&quot;ripple&quot;</Mark>
                {`\n/>`}
              </CodeBlock>
              <figcaption className={CAPTION}>{rich(k.code.attribute.figure)}</figcaption>
            </figure>
            <p className="m-0 max-w-[60ch]">{rich(k.code.attribute.text)}</p>
          </div>
          <div className="grid content-start gap-5 md:col-span-7">
            <figure className="m-0 grid gap-3" data-stream data-stream-end data-stream-width="8">
              <CodeBlock label={k.code.listing.file}>
                <Comment>{"// src/effects/brighten.ts"}</Comment>
                {`\nimport { effect } from '@dioramajs/diorama'\n\nexport default effect(\n  { strength: 1 },\n  ({ surface, u }) => {\n    surface.color((color) =>\n      color.mul(u.strength.add(1)),\n    )\n  },\n)`}
              </CodeBlock>
              <CodeBlock label={k.code.listing.markup}>
                {`<img\n  src="/cover.jpg"\n  alt=""\n  data-dio="brighten"\n  data-dio-strength="2"\n/>`}
              </CodeBlock>
              <figcaption className={`${CAPTION} !mt-0`}>{rich(k.code.custom.figure)}</figcaption>
            </figure>
            {k.code.custom.text.map((t, i) => (
              <p key={i} className="m-0 max-w-[60ch]">
                {rich(t)}
              </p>
            ))}
            <p className="m-0 max-w-[60ch] text-ink-soft">{rich(k.code.glsl)}</p>
          </div>
        </div>
      </Sheet>

      <Sheet id="site" no={5} title={k.site.title} content={c}>
        <div className="grid gap-12 md:grid-cols-12 md:gap-x-12">
          <div className="grid content-start gap-5 md:col-span-6">
            {k.site.text.map((t, i) => (
              <p key={i} className="m-0 max-w-[60ch] first:text-[clamp(1.125rem,1.6vw,1.375rem)] first:leading-[1.5]">
                {rich(t)}
              </p>
            ))}
            <p className="m-0 mt-4">
              <Link href="/#projects" className="link inline-flex min-h-11 items-center gap-2 font-medium">
                <ArrowLeft aria-hidden className="h-[1em] w-[1em]" />
                {k.site.back}
              </Link>
            </p>
          </div>
          <table className="spec md:col-span-6">
            <caption>{k.site.links.caption}</caption>
            <tbody>
              <tr>
                <th scope="row">{k.site.links.docs}</th>
                <td>
                  <Address href={SITE.diorama.docs} />
                </td>
              </tr>
              <tr>
                <th scope="row">{k.site.links.repo}</th>
                <td>
                  <Address href={SITE.diorama.repo} />
                </td>
              </tr>
              <tr>
                <th scope="row">{k.site.links.npm}</th>
                <td>
                  <a className="link font-mono text-[0.9375rem]" href={SITE.diorama.npm} target="_blank" rel="noopener">
                    @dioramajs/diorama
                  </a>
                </td>
              </tr>
              <tr>
                <th scope="row">{k.site.links.source}</th>
                <td>
                  <Address href={SITE.source} />
                </td>
              </tr>
              <tr>
                <th scope="row">{k.site.links.author}</th>
                <td>
                  {c.hero.name},{" "}
                  <a className="link" href={SITE.telegramHref} target="_blank" rel="noopener">
                    Telegram {SITE.telegram}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Sheet>
    </>
  );
}
