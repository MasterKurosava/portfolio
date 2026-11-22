import { FileDown, Phone, Send } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import { SITE, mailHref, whatsappHref } from "@/content/site";
import type { Content } from "@/content";
import { Sheet } from "@/components/sheet/Sheet";

export function ContactSheet({ content: c }: { content: Content }) {
  const k = c.contact;
  const cv = `/cv/kalachev-cv-${c.locale}.pdf`;
  return (
    <Sheet id="contact" no={5} title={k.title} intro={k.intro} content={c}>
      <div className="grid gap-10 md:grid-cols-12 md:gap-x-12">
        <div className="figure-field grid content-start gap-6 md:col-span-6 md:col-start-7 md:row-start-1 md:pl-6">
          <a
            href={SITE.phoneHref}
            data-dio="scramble"
            data-dio-chars="digits"
            data-dio-duration="1.1"
            className="num block whitespace-nowrap text-[clamp(1.85rem,7.6vw,3.75rem)] font-[800] leading-none tracking-[-0.035em] text-spot no-underline hover:text-ink"
          >
            {SITE.phone}
          </a>
          <div className="grid justify-items-start gap-3">
            {/* Alone on its row: the line of light comes in from the right, runs once around it
                and stays there, circling. */}
            <a className="btn btn-primary btn-end" href={SITE.phoneHref} data-stream data-stream-end data-stream-width="4">
              <Phone aria-hidden />
              {c.ui.actions.call}
            </a>
            <div className="flex flex-wrap gap-3">
              <a className="btn" href={SITE.telegramHref} target="_blank" rel="noopener">
                <Send aria-hidden />
                {c.ui.actions.telegram}
              </a>
              <a className="btn" href={cv} download>
                <FileDown aria-hidden />
                {c.ui.actions.cv}
              </a>
            </div>
          </div>
        </div>
        <table className="spec md:col-span-6 md:col-start-1 md:row-start-1">
          <tbody>
            <tr>
              <th scope="row">{k.rows.telegram}</th>
              <td>
                <a className="link" href={SITE.telegramHref} target="_blank" rel="noopener">
                  {SITE.telegram}
                </a>
              </td>
            </tr>
            <tr>
              <th scope="row">{k.rows.whatsapp}</th>
              <td>
                <a className="link num" href={whatsappHref(c.ui.whatsappText)} target="_blank" rel="noopener">
                  {SITE.phone}
                </a>
              </td>
            </tr>
            <tr>
              <th scope="row">{k.rows.email}</th>
              <td>
                <a className="link [overflow-wrap:anywhere]" href={mailHref(c.ui.mailSubject)}>
                  {SITE.email}
                </a>
              </td>
            </tr>
            <tr>
              <th scope="row">{k.rows.cv}</th>
              <td>
                <a className="link" href={cv} download>
                  {k.cvPdf}
                </a>
                <span className="text-ink-mute"> · </span>
                <Link className="link" href="/cv">
                  {k.cvHtml}
                </Link>
              </td>
            </tr>
            {SITE.hh ? (
              <tr>
                <th scope="row">{k.rows.hh}</th>
                <td>
                  <a className="link" href={SITE.hh} target="_blank" rel="noopener">
                    hh.ru
                  </a>
                </td>
              </tr>
            ) : null}
            <tr>
              <th scope="row">{k.rows.github}</th>
              <td>
                <a className="link" href={SITE.github} target="_blank" rel="noopener">
                  {SITE.githubHandle}
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Sheet>
  );
}
