// pixel-portrait: the portrait first assembles as pixel art, square by square from the bottom up
// in a small palette, then the squares split in half, step by step, while the palette melts into
// the colours of the photo, until the photo itself is there. It plays once, as the page opens
// (the intro keeps the DOM picture hidden until the first frame) or as the picture scrolls in.
// Under reduced motion, or for a picture already seen as DOM, it shows the photo at once.
import { effect } from "@dioramajs/diorama";
import { ease, inView } from "@dioramajs/diorama/kit";
import { abs, ceil, clamp, dot, exp2, floor, fract, log2, max, mix, pow, smoothstep, step, uniform, vec2, vec3, vec4 } from "three/tsl";
import type { Node } from "three/webgpu";
import { Vector2 } from "three/webgpu";

type F = Node<"float">;
type V2 = Node<"vec2">;

/** Veiled on the first screen until it draws, so the photo never shows before the pixel art. */
export const intro = true;

/** Share of the picture in view, above the bottom tenth of the viewport, before it plays. */
const THRESHOLD = 0.2;

/** Hash without sine (Dave Hoskins), stable in fp32 for the cell ids used here. */
const hash = (p: V2): F => {
  const a = fract(vec3(p.x, p.y, p.x).mul(0.1031));
  const b = a.add(dot(a, a.yzx.add(33.33)));
  return fract(b.x.add(b.y).mul(b.z)) as unknown as F;
};

export default effect(
  {
    /** Side of the pixel-art squares, CSS px; a power of two halves evenly to the photo. */
    cell: 16,
    /** Tones per colour channel of the pixel-art palette. */
    levels: 6,
    /** Seconds the squares take to assemble. */
    assemble: 1.4,
    /** Seconds the finished pixel art holds before it resolves. */
    hold: 0.35,
    /** Seconds from pixel art to the photo. */
    resolve: 1.3,
    /** Seconds after the picture comes into view before it starts. */
    delay: 0.15,
  },
  { media: true },
  ({ surface, u, params, element, app, showDom }) => {
    // (assembled 0..1, resolved 0..1), from the CPU.
    const look = uniform(new Vector2(0, 0));

    surface.color((color, { box, sample }) => {
      const size = u.size as unknown as V2;
      const cell = max(u.cell as unknown as F, 2);
      // CSS px from the centre of the box, y up.
      const point = box.sub(0.5).mul(size);
      // Assembly: each square pops in at its own moment, the lower rows first, with some scatter.
      const grid = point.div(cell);
      const id = floor(grid);
      const order = hash(id).mul(0.55).add(box.y.mul(0.45));
      const start = order.mul(0.85);
      const pop = smoothstep(start, start.add(0.12), look.x);
      // A square fades in as it grows from three quarters to its full size.
      const reach = mix(0.375, 0.5, pop);
      const local = abs(fract(grid).sub(0.5));
      const inside = step(local.x, reach).mul(step(local.y, reach)).mul(pop);
      // Resolve: the squares halve, cell, cell / 2 ... 2 px, then the photo.
      const maxLevel = log2(cell);
      const levels = max(ceil(maxLevel), 1);
      const level = ceil(look.y.oneMinus().mul(levels)).div(levels);
      const side = exp2(level.mul(maxLevel)) as unknown as F;
      const center = floor(point.div(side)).add(0.5);
      const at = (dx: number, dy: number) =>
        sample(center.add(vec2(dx, dy)).mul(side).div(max(size, 1)).add(0.5) as unknown as V2);
      const block = at(-0.25, -0.25).add(at(0.25, -0.25)).add(at(-0.25, 0.25)).add(at(0.25, 0.25)).mul(0.25);
      // The pixel-art palette: a few tones per channel, melting into the photo's own colours.
      // Quantized in sRGB, as the eye sees the steps; in linear light the darks fall to black.
      const tones = max(u.levels as unknown as F, 2);
      const srgb = clamp(pow(block.rgb, vec3(1 / 2.2)).sub(0.5).mul(1.12).add(0.5), 0, 1);
      const art = pow(floor(srgb.mul(tones).add(0.5)).div(tones), vec3(2.2));
      const tone = mix(art, block.rgb, smoothstep(0, 0.7, look.y));
      // Below two px a square is about a pixel: the photo itself takes over.
      const blocky = smoothstep(1, 2, side);
      const rgb = mix(color.rgb, tone, blocky);
      const alpha = mix(color.a, block.a, blocky).mul(inside);
      return vec4(rgb, alpha);
    });

    const { stage } = app;
    const value = look.value as Vector2;
    const onScreen = (): boolean => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.bottom > 0 && rect.top < stage.height.peek();
    };
    // A picture seen as DOM stays a photo; a veiled one (the intro) has not been seen yet.
    const veiled = element.getAttribute("data-dio-state") === "entering";
    let done = onScreen() && !veiled;
    if (done) value.set(1, 1);
    let elapsed = -1;
    let dom = false;

    return (input): boolean => {
      if (input.reducedMotion || done) {
        if (input.reducedMotion !== dom) {
          dom = input.reducedMotion;
          showDom(dom);
        }
        value.set(1, 1);
        return false;
      }
      if (elapsed < 0) {
        if (!inView(input.y, input.height, stage.height.peek(), THRESHOLD)) return false;
        elapsed = 0;
      } else elapsed += input.delta;
      const t = elapsed - params.delay;
      const built = Math.min(1, Math.max(0, t / Math.max(params.assemble, 1e-3)));
      const after = (t - params.assemble - params.hold) / Math.max(params.resolve, 1e-3);
      const resolved = ease("cubicInOut", Math.min(1, Math.max(0, after)));
      value.set(built, resolved);
      if (resolved >= 1) done = true;
      return !done;
    };
  },
);
