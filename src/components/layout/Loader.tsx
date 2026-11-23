/**
 * The stage before the page: a beam of light draws the "MK" monogram while a thin line fills with
 * the real loading progress (Diorama's assets wave, written to `--p` by DioramaStart). It is
 * rendered by the server, so it covers the page from the first paint, and `<html data-loading>`
 * holds the scroll meanwhile. Once the first screen is drawn it rises like a curtain, its lower
 * edge a line of light, and the portrait and the name start their intros. Without a script it
 * leaves on its own (CSS).
 */
export function Loader({ name }: { name: string }) {
  return (
    <div className="loader" data-loader aria-hidden>
      <svg className="loader-mark" viewBox="0 0 142 82" role="presentation">
        <path pathLength={1} d="M14 68 V14 L44 50 L74 14 V68" />
        <path pathLength={1} d="M98 14 V68 M128 14 L99 43 L128 68" />
      </svg>
      <div className="loader-line">
        <span />
      </div>
      <p className="loader-name">{name}</p>
    </div>
  );
}
