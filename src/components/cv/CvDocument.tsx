import { FileDown, Send } from "lucide-react";
import { SITE } from "@/content/site";
import type { Content, Locale } from "@/content";
import type { CvContent, CvRow } from "@/content/cv";

/**
 * The CV as one document. On screen it uses the site's dark stage; in print (rules in
 * the cv page) it turns black on white A4, two pages, without the actions and title block.
 */
export function CvDocument({ locale, content: c, cv }: { locale: Locale; content: Content; cv: CvContent }) {
  const pdf = `/cv/kalachev-cv-${locale}.pdf`;
  const quotes = [c.work.quotes.whitewill, c.work.quotes.voton, c.work.quotes.teknolab];

  return (
    <article aria-labelledby="cv-name" className="sheet print:text-[10pt] print:leading-[1.4] print:text-ink">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end print:block">
        <div>
          <h1
            id="cv-name"
            className="m-0 text-[clamp(2.5rem,8vw,5rem)] font-[800] leading-[0.95] tracking-[-0.035em] text-balance print:text-[24pt] print:leading-none print:tracking-[-0.02em]"
          >
            {c.hero.name}
          </h1>
          <p className="mb-0 mt-3 text-[clamp(1.25rem,2.4vw,1.75rem)] font-[650] leading-tight tracking-[-0.01em] text-spot print:mt-[1.5mm] print:text-[13pt]">
            {cv.position}
          </p>
        </div>
        <div className="no-print flex flex-wrap gap-3">
          <a className="btn btn-primary" href={pdf} download>
            <FileDown aria-hidden />
            {cv.download}
          </a>
          <a className="btn" href={SITE.telegramHref} target="_blank" rel="noopener">
            <Send aria-hidden />
            {c.ui.actions.telegram}
          </a>
        </div>
      </div>

      <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2 print:mt-[5mm] print:grid-cols-2 print:gap-x-[8mm] print:gap-y-0">
        <Facts id="cv-contacts" title={cv.contacts.title} rows={cv.contacts.rows} />
        <Facts id="cv-terms" title={cv.terms.title} rows={cv.terms.rows} />
      </div>

      <Part id="cv-summary" title={cv.summary.title}>
        <p className="m-0 max-w-[68ch] text-pretty print:max-w-none">{cv.summary.text}</p>
      </Part>

      <Part id="cv-experience" title={cv.experience.title} aside={cv.experience.total} breakable>
        <div className="grid gap-9 print:gap-[3.5mm]">
          {cv.experience.jobs.map((job) => (
            <div key={job.company} className="max-w-[72ch] print:max-w-none">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 print:break-after-avoid">
                <h3 className="m-0 text-[1.25rem] font-[750] leading-snug tracking-[-0.01em] print:text-[11pt]">
                  {job.company}
                  <span className="font-[500] text-ink-soft">, {job.role}</span>
                </h3>
                <p className="num m-0 text-[0.9375rem] text-ink-soft print:text-[9.5pt]">
                  {job.period} · {job.length}
                </p>
              </div>
              <p className="m-0 mt-0.5 text-[0.9375rem] text-ink-mute print:mt-0 print:text-[9.5pt] print:break-after-avoid">
                {job.field ? `${job.place} · ${job.field}` : job.place}
              </p>
              {job.about ? <p className="mb-0 mt-3 text-ink-soft print:mt-[1mm]">{job.about}</p> : null}
              <ul className="mb-0 mt-3 grid list-[square] gap-2 pl-5 marker:text-ink-mute print:mt-[1.2mm] print:gap-[0.8mm] print:pl-[4.5mm]">
                {job.points.map((point) => (
                  <li key={point} className="pl-1 text-pretty print:break-inside-avoid">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Part>

      <Part id="cv-skills" title={cv.skills.title}>
        <Rows rows={cv.skills.rows} />
      </Part>

      <Part id="cv-languages" title={cv.languages.title}>
        <Rows rows={cv.languages.rows} />
      </Part>

      <Part id="cv-education" title={cv.education.title}>
        <Rows rows={cv.education.rows} />
      </Part>

      <Part id="cv-projects" title={cv.projects.title}>
        <RowList
          items={cv.projects.items.map((p) => ({
            key: p.name,
            label: <span className="font-[650] text-ink">{p.name}</span>,
            value: (
              <>
                {p.text}
                <span className="block">
                  {p.links.map((link, i) => (
                    <span key={link.href}>
                      {i > 0 ? <span className="text-ink-mute"> · </span> : null}
                      <a className="link" href={link.href} target="_blank" rel="noopener">
                        {link.label}
                      </a>
                    </span>
                  ))}
                </span>
              </>
            ),
          }))}
        />
      </Part>

      <Part id="cv-references" title={cv.references.title}>
        <RowList
          items={quotes.map((q) => ({
            key: q.telegram,
            label: <span className="font-[650] text-ink">{q.name}</span>,
            value: (
              <>
                {q.role}, {q.company}
                <a className="link block w-fit" href={q.telegramHref} target="_blank" rel="noopener">
                  {q.telegram}
                </a>
              </>
            ),
          }))}
        />
        <p className="mb-0 mt-3 text-ink-soft print:mt-[1.2mm]">{cv.references.note}</p>
      </Part>

    </article>
  );
}

/**
 * A section of the CV: the heading sits in the left column, like a label on a drawing.
 * Short sections never split across printed pages; only the long ones are breakable.
 */
function Part({
  id,
  title,
  aside,
  breakable = false,
  children,
}: {
  id: string;
  title: string;
  aside?: string;
  breakable?: boolean;
  children: React.ReactNode;
}) {
  const headingId = `${id}-title`;
  return (
    <section
      aria-labelledby={headingId}
      className={`mt-12 grid gap-4 border-t-[1.5px] border-[var(--rule)] pt-5 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-x-10 print:mt-[4.5mm] print:grid-cols-[31mm_minmax(0,1fr)] print:gap-x-[6mm] print:gap-y-0 print:border-t print:pt-[2.2mm] ${
        breakable ? "" : "print:break-inside-avoid"
      }`}
    >
      <div className="print:break-after-avoid">
        <h2 id={headingId} className="m-0 text-[1.125rem] font-[750] leading-snug tracking-[-0.01em] print:text-[11pt]">
          {title}
        </h2>
        {aside ? <p className="num m-0 mt-1 font-[650] text-spot print:mt-[0.5mm] print:text-[10pt]">{aside}</p> : null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** A small titled table for the head of the CV: contacts and work terms. */
function Facts({ id, title, rows }: { id: string; title: string; rows: CvRow[] }) {
  const headingId = `${id}-title`;
  return (
    <section aria-labelledby={headingId} className="min-w-0 print:break-inside-avoid">
      <h2 id={headingId} className="m-0 mb-3 text-[1.0625rem] font-[750] print:mb-[1.2mm] print:text-[11pt]">
        {title}
      </h2>
      <Rows rows={rows} framed />
    </section>
  );
}

/** Text rows: the value links out when the row has an href, and a note goes under it in spot ink. */
function Rows({ rows, framed = false }: { rows: CvRow[]; framed?: boolean }) {
  return (
    <RowList
      framed={framed}
      items={rows.map((row) => ({
        key: row.label,
        label: row.label,
        value: (
          <>
            {row.href ? (
              <a className="link num" href={row.href} {...(row.href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
                {row.value}
              </a>
            ) : (
              row.value
            )}
            {row.note ? <span className="draft block text-[0.875rem] text-spot print:text-[9pt]">{row.note}</span> : null}
          </>
        ),
      }))}
    />
  );
}

/** Label and value pairs on one grid; hairlines between rows when framed, like the spec table. */
function RowList({
  items,
  framed = false,
}: {
  items: { key: string; label: React.ReactNode; value: React.ReactNode }[];
  framed?: boolean;
}) {
  return (
    <dl
      className={`m-0 grid max-w-[72ch] print:max-w-none ${
        framed ? "border-y-[1.5px] border-[var(--rule)] print:border-y" : "gap-3 print:gap-[1mm]"
      }`}
    >
      {items.map((item, i) => (
        <div
          key={item.key}
          className={`grid gap-x-4 gap-y-0.5 sm:grid-cols-[minmax(7.5rem,34%)_minmax(0,1fr)] print:grid-cols-[minmax(24mm,34%)_minmax(0,1fr)] print:gap-x-[3mm] print:break-inside-avoid ${
            framed ? `py-2.5 print:py-[0.9mm] ${i > 0 ? "border-t border-[var(--hair)]" : ""}` : ""
          }`}
        >
          <dt className="text-ink-mute">{item.label}</dt>
          <dd className="m-0 min-w-0 [overflow-wrap:anywhere]">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
