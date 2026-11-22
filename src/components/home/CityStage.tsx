/**
 * The night city, the world of the Whitewill chapter (src/effects/city.ts, `.city-world` in
 * globals.css). `CityBackdrop` goes first in the chapter: an empty box under all of it, over which
 * the GL city draws across the whole width of the screen. The city follows the chapter's parts,
 * marked with `data-city-part`: "text" gets a dark haze under it, "moon" (the globe) a halo and an
 * orbit in the sky, "peak" is `CityStage`, the stretch where the camera comes down to the lit
 * waterfront under the 100 000+. Without WebGL the stretch closes up around the copy.
 */
export function CityBackdrop({ alt }: { alt: string }) {
  return <div className="city-backdrop" data-dio="city" role="img" aria-label={alt} />;
}

/** The chapter's peak: the number, its label and a line of copy, held in the sky over the full city. */
export function CityStage({ value, label, text }: { value: string; label: string; text: string; alt?: string }) {
  return (
    <div className="city-peak" data-city-part="peak" data-stream="edge">
      <div className="city-copy" data-city-part="held">
        <p className="m-0">
          <span className="city-number block whitespace-nowrap text-spot">{value}</span>
          <span className="mt-4 block text-[clamp(1.125rem,1.6vw,1.375rem)] font-medium text-ink">{label}</span>
        </p>
        <p className="m-0 mt-5 max-w-[34ch] text-ink-soft">{text}</p>
      </div>
    </div>
  );
}
