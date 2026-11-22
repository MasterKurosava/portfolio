import type { Content } from "@/content";

/** The career as the revision record of the document: newest change first. */
export function Revisions({ content: c }: { content: Content }) {
  const w = c.work;
  return (
    <div className="overflow-x-auto">
      <table className="revisions w-full border-collapse text-left">
        <caption className="pb-4 text-left text-[1.125rem] font-[650]">{w.tableCaption}</caption>
        <thead>
          <tr>
            <th scope="col">{w.columns.period}</th>
            <th scope="col">{w.columns.company}</th>
            <th scope="col">{w.columns.role}</th>
            <th scope="col">{w.columns.main}</th>
          </tr>
        </thead>
        <tbody>
          {w.rows.map((row) => (
            <tr key={row.rev}>
              <td data-label={w.columns.period} className="num whitespace-nowrap">
                {row.period}
                <span className="block text-[0.875rem] text-ink-mute">{row.length}</span>
              </td>
              <td data-label={w.columns.company}>
                <a href={row.href} className="text-[1.125rem] font-[680] no-underline hover:text-spot">
                  {row.company}
                </a>
                <span className="block text-[0.875rem] text-ink-mute">{row.place}</span>
              </td>
              <td data-label={w.columns.role}>{row.role}</td>
              <td data-label={w.columns.main} className="text-ink-soft">
                {row.main}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
