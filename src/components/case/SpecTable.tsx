import type { SpecRow } from "@/content/types";
import { rich } from "./rich";

/** A spec table (`.spec`) with a caption: label in the first column, value in the second. */
export function SpecTable({ caption, rows, className = "" }: { caption: string; rows: SpecRow[]; className?: string }) {
  return (
    <table className={`spec ${className}`}>
      <caption>{caption}</caption>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            <td>{rich(row.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
