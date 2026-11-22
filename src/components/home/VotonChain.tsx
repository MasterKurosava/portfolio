/**
 * A live blockchain for the VOTON chapter: glass blocks on a wire of light, a new one forming every
 * few seconds as packets of data arrive (src/effects/chain.ts). The box is empty; the GL chain
 * draws in it. It is decoration, so it is hidden from assistive tech: the chapter text carries the
 * facts. The stream of the page keeps to the margin beside it. Without WebGL the box stays an
 * empty stretch of the dark page.
 */
export function VotonChain({ className = "" }: { className?: string }) {
  return (
    <figure className={`m-0 w-full ${className}`} aria-hidden>
      <div className="aspect-[4/3] w-full md:aspect-[21/9]" data-dio="chain" data-stream="edge" />
    </figure>
  );
}
