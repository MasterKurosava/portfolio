import type { PackageRow } from "@/content/cases";

export function npmUrl(name: string): string {
  return `https://www.npmjs.com/package/@dioramajs/${name}`;
}

/** The group whose nodes take the spot ink, in the diagram and in the parts list. */
export const SPOT_GROUP = "effects";

/**
 * The packages as a list that Diorama's `graph` lays out radially: `@dioramajs/diorama` in the
 * middle, the rest on a ring around it, coloured by group. Each name links to its npm page.
 * Without WebGL it reads as the list of packages; their contents are in the parts list beside it.
 */
export function PackageGraph({
  label,
  entry,
  groups,
}: {
  label: string;
  entry: PackageRow;
  groups: { id: string; rows: PackageRow[] }[];
}) {
  // The first colour is the middle node's, then one per group in order.
  const palette = ["var(--ink)", ...groups.map((g) => (g.id === SPOT_GROUP ? "var(--spot)" : g.id === "tools" ? "var(--ink-mute)" : "var(--ink)"))].join(" ");
  return (
    <ul
      aria-label={label}
      data-dio="graph"
      data-dio-mode="radial"
      data-dio-motion="spread"
      data-palette={palette}
      data-dio-colors={palette}
      className="m-0 min-h-[400px] list-none p-1 text-[0.9375rem] leading-snug text-ink sm:min-h-[500px]"
    >
      <li className="font-semibold">
        <a className="link" href={npmUrl(entry.name)}>
          @dioramajs/{entry.name}
        </a>
        {groups.map((g) => (
          <ul
            key={g.id}
            data-dio-group={g.id}
            className={`m-0 mt-3 flex list-none flex-wrap gap-x-4 gap-y-1 p-0 font-mono text-[0.875rem] font-normal ${
              g.id === SPOT_GROUP ? "text-spot" : ""
            }`}
          >
            {g.rows.map((r) => (
              <li key={r.name}>
                <a className="underline decoration-[color-mix(in_oklch,currentColor_40%,transparent)] underline-offset-[0.22em] hover:decoration-current" href={npmUrl(r.name)}>
                  {r.name}
                </a>
              </li>
            ))}
          </ul>
        ))}
      </li>
    </ul>
  );
}
