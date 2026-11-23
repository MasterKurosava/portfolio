// light-portrait: the portrait develops under a line of light, the same amber line that runs
// through the page and closes the loader. The line passes from the top down; behind it the photo
// comes out of the dark warm and slightly overexposed, as if the light had just touched it, while
// the whole picture pulls into focus and settles from a slight zoom to its size. It plays once,
// after the loader has gone (or as the picture scrolls in). Under reduced motion, or for a picture
// already seen as DOM, it shows the photo at once.
import { effect } from "@dioramajs/diorama";
import { ease, inView } from "@dioramajs/diorama/kit";
import { exp, max, mix, smoothstep, uniform, vec2, vec3, vec4 } from "three/tsl";
import type { Node } from "three/webgpu";
import { Vector3 } from "three/webgpu";

type F = Node<"float">;
type V2 = Node<"vec2">;

/** Veiled on the first screen until it draws, so the photo never shows before its reveal. */
export const intro = true;

/** Share of the picture in view, above the bottom tenth of the viewport, before it plays. */
const THRESHOLD = 0.2;
/** Taps of the focus blur: a centre and two rings at the golden angle. */
const TAPS = (() => {
  const taps: [number, number, number][] = [[0, 0, 1]];
  for (let i = 1; i <= 12; i++) {
    const r = Math.sqrt(i / 12);
    const a = i * 2.39996;
    taps.push([Math.cos(a) * r, Math.sin(a) * r, 1 - 0.5 * r]);
  }
  return taps;
})();
const WEIGHT = TAPS.reduce((sum, [, , w]) => sum + w, 0);

export default effect(
  {
    /** Seconds the line takes from the top to the bottom. */
    sweep: 1.5,
    /** Seconds the picture takes to come into focus, from the start. */
    focus: 2.1,
    /** Blur radius at the start, CSS px. */
    blur: 14,
    /** Scale at the start, settling to 1. */
    zoom: 1.06,
    /** Seconds after the picture comes into view before it starts. */
    delay: 0.1,
  },
  { media: true },
  ({ surface, u, params, element, app, showDom, invalidate, signal }) => {
    // (line 0 above the top .. 1 below the bottom, focus 0 blurred .. 1 sharp, unused).
    const look = uniform(new Vector3(0, 0, 0));

    surface.color((color, { box, sample }) => {
      const size = max(u.size as unknown as V2, vec2(1, 1));
      // Zoom about the centre, settling as it focuses.
      const zoom = mix(u.zoom as unknown as F, 1, look.y);
      const at = box.sub(0.5).div(zoom).add(0.5);
      // Focus: a disc of taps whose radius shrinks to nothing.
      const radius = vec2(mix(u.blur as unknown as F, 0, look.y)).div(size);
      let sum = sample(at as unknown as V2).mul(TAPS[0]?.[2] ?? 1);
      for (const [x, y, w] of TAPS.slice(1)) {
        sum = sum.add(sample(at.add(vec2(x, y).mul(radius)) as unknown as V2).mul(w));
      }
      const photo = sum.div(WEIGHT);
      // The line, in box units from the top; it starts above the box and ends below it.
      const line = mix(1.12, -0.12, look.x);
      const soft = max(vec2(48, 48).div(size).y, 0.02);
      const shown = smoothstep(line.sub(soft), line.add(soft), box.y);
      // Light just behind the line: warm and overexposed, fading as the line moves on.
      const behind = box.y.sub(line).div(soft.mul(4));
      const burn = exp(behind.mul(behind).negate()).mul(shown);
      const amber = vec3(0.95, 0.55, 0.18);
      const developed = photo.rgb.mul(mix(1, 1.6, burn)).add(amber.mul(burn.mul(0.35)));
      // The line itself, a thin bright core in a soft halo, across the whole width.
      const across = box.y.sub(line).mul(size.y);
      const core = exp(across.div(1.4).mul(across.div(1.4)).negate());
      const halo = exp(across.div(16).mul(across.div(16)).negate()).mul(0.45);
      const beam = core.add(halo).mul(smoothstep(0, 0.04, look.x)).mul(smoothstep(1, 0.96, look.x));
      const rgb = developed.add(vec3(1, 0.82, 0.55).mul(beam));
      const alpha = max(photo.a.mul(shown), beam.mul(0.9));
      return vec4(mix(rgb, color.rgb, look.z), mix(alpha, color.a, look.z));
    });

    const { stage } = app;
    const value = look.value as Vector3;
    const onScreen = (): boolean => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.bottom > 0 && rect.top < stage.height.peek();
    };
    // Under the site's loader the picture waits; the loader's leave wakes it.
    const covered = (): boolean => document.documentElement.hasAttribute("data-loading");
    window.addEventListener("portfolio:ready", () => invalidate(), { signal });
    // A picture seen as DOM stays a photo; a veiled or covered one has not been seen yet.
    const veiled = element.getAttribute("data-dio-state") === "entering" || covered();
    let done = onScreen() && !veiled;
    // At rest the plain copy draws: look.z blends the reveal out entirely.
    if (done) value.set(1, 1, 1);
    let elapsed = -1;
    let dom = false;

    return (input): boolean => {
      if (input.reducedMotion || done) {
        if (input.reducedMotion !== dom) {
          dom = input.reducedMotion;
          showDom(dom);
        }
        value.set(1, 1, 1);
        return false;
      }
      if (elapsed < 0) {
        if (covered()) return false;
        if (!inView(input.y, input.height, stage.height.peek(), THRESHOLD)) return false;
        elapsed = 0;
      } else elapsed += input.delta;
      const t = Math.max(0, elapsed - params.delay);
      const line = ease("cubicInOut", Math.min(1, t / Math.max(params.sweep, 1e-3)));
      const focus = ease("quartOut", Math.min(1, t / Math.max(params.focus, 1e-3)));
      done = line >= 1 && focus >= 1;
      value.set(line, focus, done ? 1 : 0);
      return !done;
    };
  },
);
