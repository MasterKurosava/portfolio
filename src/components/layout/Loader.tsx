/**
 * The stage before the page: a beam of light passes over the "MK" monogram and leaves it drawn,
 * while a thin line fills with the real loading progress (Diorama's assets wave, written to `--p`
 * by DioramaStart). It is rendered by the server, so it covers the page from the first paint, and
 * `<html data-loading>` holds the scroll meanwhile. Once the first screen is drawn it rises like a
 * curtain, its lower edge a line of light, and the portrait and the name start their intros.
 * Without a script it leaves on its own (CSS).
 *
 * Everything here moves by transform and opacity only, so the compositor plays it while the main
 * thread is busy hydrating the page and starting the 3D.
 */
export function Loader({ name }: { name: string }) {
  return (
    <div className="loader" data-loader aria-hidden>
      <div className="loader-mark">
        <span className="loader-halo" />
        {/* A window that opens left to right over a monogram that stays put. */}
        <span className="loader-wipe">
          <span className="loader-wipe-in">
            <svg viewBox="0 0 142 82" role="presentation">
              <path d="M14 68 V14 L44 50 L74 14 V68" />
              <path d="M98 14 V68 M128 14 L99 43 L128 68" />
            </svg>
          </span>
        </span>
        <span className="loader-beam" />
      </div>
      <div className="loader-line">
        <span />
      </div>
      <p className="loader-name">{name}</p>
    </div>
  );
}
