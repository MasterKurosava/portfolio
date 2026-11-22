// city: the night city that is the world of the Whitewill chapter; its lit windows are the
// listings the sync updates every day. The element is an empty box under the whole chapter. The
// plane spans the full width of the screen and the height of the box, and the shader draws the
// city in screen space, so the skyline holds still while the chapter scrolls over it.
// The story follows the chapter's own parts, measured from the page (`data-city-part`):
// - as the heading comes up, the camera comes down out of the night and a distant skyline rises;
// - behind the list it stays low, and a soft dark haze sits under the text ("text" parts);
// - the globe hangs in the sky like a planet, rising behind the towers (the box comes after it in
//   the page, so the city draws in front of it): a faint warm halo and a thin orbit ("moon");
// - for the 100 000+ ("peak") the camera descends to the waterfront, the windows light in a sweep
//   from the right, where the stream runs, and the lights shimmer in the water;
// - under the quote the camera lifts over the roofs and the city sinks back into the dark.
// The box's edges fade softly and the sky is transparent, so there is never a seam against the
// page; the stream and the dust drawn under the city show above the roofs. Under reduced motion
// the city is a still picture standing under the peak and scrolls with the page.
// Cost: each row is skipped above its highest possible roof, the halo outside its reach.
import { effect } from "@dioramajs/diorama";
import { abs, atan, clamp, cos, dot, exp, float, floor, Fn, fract, If, max, min, mix, sin, smoothstep, step, uniform, uv, vec2, vec3, vec4 } from "three/tsl";
import type { Node } from "three/webgpu";
import { Color, Mesh, MeshBasicNodeMaterial, PlaneGeometry, Vector2, Vector3, Vector4 } from "three/webgpu";

type F = Node<"float">;
type V2 = Node<"vec2">;
type V3 = Node<"vec3">;

/** Hash without sine (Dave Hoskins), stable in fp32 for the ids used here. */
const hash = (p: V2): F => {
  const a = fract(vec3(p.x, p.y, p.x).mul(0.1031));
  const b = a.add(dot(a, a.yzx.add(33.33)));
  return fract(b.x.add(b.y).mul(b.z));
};

/** Three hashes for the price of one. */
const hash3 = (p: V2): V3 => {
  const a = fract(vec3(p.x, p.y, p.x).mul(vec3(0.1031, 0.103, 0.0973)));
  const b = a.add(dot(a, a.yxz.add(33.33)));
  return fract(vec3(b.x, b.x, b.y).add(vec3(b.y, b.z, b.z)).mul(vec3(b.z, b.y, b.x)));
};

const smooth = (t: number): number => {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
};

/** A row of buildings in depth. Sizes are CSS px at a 1440 px wide screen, heights in screen heights. */
interface Row {
  seed: number;
  /** Slot a building stands in, px. */
  slot: number;
  /** Width as a share of the slot. */
  width: [number, number];
  /** Height as a share of the screen height. */
  height: [number, number];
  /** How far the row moves with the camera: 1 is the near row. */
  depth: number;
  /** Window cell, px. */
  cell: [number, number];
  /** Facade colour. */
  body: string;
  /** Brightness of the lit windows. */
  bright: number;
  /** Share of the haze in front of the row. */
  fog: number;
  /** Soft halos around lit windows (the near row only). */
  halo: boolean;
}

const ROWS: Row[] = [
  // Distant districts: a low band of tiny lights on the horizon.
  { seed: 5, slot: 18, width: [0.55, 1], height: [0.02, 0.085], depth: 0.4, cell: [3, 3.5], body: "#171411", bright: 0.7, fog: 0.34, halo: false },
  { seed: 11, slot: 44, width: [0.5, 0.94], height: [0.2, 0.58], depth: 0.82, cell: [3.6, 5], body: "#15120f", bright: 0.6, fog: 0.16, halo: false },
  { seed: 23, slot: 64, width: [0.52, 0.95], height: [0.16, 0.45], depth: 1.02, cell: [5, 7], body: "#100e0c", bright: 0.8, fog: 0.05, halo: false },
  { seed: 37, slot: 94, width: [0.6, 0.96], height: [0.11, 0.34], depth: 1.3, cell: [7, 10], body: "#0a0908", bright: 1, fog: 0, halo: true },
];

/** Highest value of the skyline envelope below, with a margin. */
const SKYLINE_MAX = 1.32;
/** Mast height in screen heights. */
const MAST = 0.045;
/** Camera height behind the list: a distant skyline low on the screen. */
const READING = 0.32;

/** Page parts the city follows, as offsets from the top left of the box in CSS px. */
interface Parts {
  /** Rectangles of text that get a dark haze under them (left, top, right, bottom): the column
   * of text ("text"), the labels under the globe ("label"), the link and the quote ("quote"). */
  text: ([number, number, number, number] | null)[];
  /** The globe: centre x, centre y, radius of the sphere. */
  moon: [number, number, number] | null;
  /** The 100 000+ stretch: top and bottom. */
  peak: [number, number] | null;
}

export default effect(
  { lit: "#efbb62", warm: "#fff0d4", haze: "#201a14", night: "#121110" },
  { animate: { fps: 30 } },
  ({ u, place, app, quality, element, onDispose, invalidate }) => {
    // Driven from the scroll in the update, in CSS px unless noted. Screen y counts from the bottom.
    const view = uniform(new Vector2(1440, 900));
    /** Screen y of the box's bottom edge. */
    const base = uniform(0);
    /** Screen y of the street at rest: 0, or under the peak with reduced motion. */
    const street = uniform(0);
    /** Height of the water in front of the city, px. */
    const water = uniform(0);
    /** 0 at rest, 1 with the camera a screen height above the roofs. */
    const cam = uniform(1);
    /** 0 dark city, 1 every window that will light is lit. */
    const light = uniform(0);
    /** Sideways camera move, px at the near row. */
    const pan = uniform(0);
    /** Fades the city in the first time it draws. */
    const reveal = uniform(0);
    /** Half a device pixel in CSS px, for edges that stay sharp at any pixel ratio. */
    const aa = uniform(0.5);
    /** Building sizes for the width of the screen. */
    const scale = uniform(1);
    /** Building heights for the shape of the screen. */
    const tall = uniform(1);
    /** 1 the downtown stands out on the right; less on tall screens, where the copy spans the width. */
    const shape = uniform(1);
    /** Text rectangles in screen px: left, bottom, right, top. Empty ones are far off screen. */
    const textA = uniform(new Vector4(-1e5, -1e5, -1e5, -1e5));
    const textB = uniform(new Vector4(-1e5, -1e5, -1e5, -1e5));
    const textC = uniform(new Vector4(-1e5, -1e5, -1e5, -1e5));
    /** The held copy of the peak, read every frame because sticky moves it without a layout change. */
    const textD = uniform(new Vector4(-1e5, -1e5, -1e5, -1e5));
    /** How dark the haze under the text gets: less on a phone, where the text spans the screen. */
    const hazeK = uniform(0.8);
    /** The globe in screen px: centre x, centre y, radius; z 0 hides the halo. */
    const moon = uniform(new Vector3(-1e5, -1e5, 0));

    const tier = quality;
    const rows = tier === "low" ? ROWS.slice(1) : ROWS;

    const city = Fn(() => {
      // Declared before any branch, so the code inside the branches can read them.
      const at = uv().toVar();
      const vw = view.x;
      const vh = view.y;
      const sx = at.x.mul(vw).toVar();
      const sy = at.y.mul(u.size.y).add(base).toVar();
      const lit = vec3(u.lit.r, u.lit.g, u.lit.b).toVar();
      const warm = vec3(u.warm.r, u.warm.g, u.warm.b).toVar();
      const haze = vec3(u.haze.r, u.haze.g, u.haze.b).toVar();
      const night = vec3(u.night.r, u.night.g, u.night.b).toVar();
      const time = u.time.toVar();

      /** Coverage of a signed distance in px, positive inside, anti-aliased over one device pixel. */
      const inside = (d: F): F => clamp(d.div(aa.mul(2)).add(0.5), 0, 1);
      // Downtown stands right of centre, where the stream comes down; the left, under the copy, is low.
      const skyline = (xn: F): F =>
        mix(
          float(0.95),
          smoothstep(0.08, 0.7, xn)
            .mul(0.42)
            .add(0.6)
            .add(exp(xn.sub(0.74).div(0.11).pow(2).negate()).mul(0.28))
            .sub(smoothstep(0.9, 1.05, xn).mul(0.18)),
          shape,
        );

      const groundOf = (row: Row): F => street.add(water).sub(cam.mul(row.depth).mul(vh));

      /** One row at screen point (X, Y). `lean` drops the details a reflection would not show. */
      const drawRow = (row: Row, X: F, Y: F, lean = false) => {
        const ground = groundOf(row);
        const x = X.add(pan.mul(row.depth)).add(row.seed * 131);
        const y = Y.sub(ground);
        const slot = scale.mul(row.slot);
        const id = floor(x.div(slot));
        const lx = x.sub(id.mul(slot));
        const ha = hash3(vec2(id, row.seed));
        const hb = hash3(vec2(id, row.seed + 19.7));
        const r1 = ha.x;
        const r2 = ha.y;
        const r3 = ha.z;
        const r4 = hb.x;
        const r5 = hb.y;
        const r6 = hb.z;
        const w = slot.mul(mix(row.width[0], row.width[1], r1)).floor();
        const x0 = slot.sub(w).mul(r2).floor();
        const bx = lx.sub(x0);
        // Where the building stands on the screen, for the skyline and the sweep of light.
        const centre = id.mul(slot).add(x0).add(w.mul(0.5)).sub(pan.mul(row.depth)).sub(row.seed * 131);
        const xn = centre.div(vw);
        const h = vh.mul(tall).mul(mix(row.height[0], row.height[1], r3.mul(r3))).mul(skyline(xn)).floor();
        // Crowns: a setback for some towers, a second one for a few, a tapering spire on some of
        // the tall far ones.
        const step1 = step(0.55, r4).mul(step(h.mul(0.86), y));
        const step2 = step(0.82, r4).mul(step(h.mul(0.93), y));
        const spire = row.depth < 1.1 ? step(r4, 0.16).mul(step(0.35, r3)) : float(0);
        const taper = spire.mul(clamp(y.sub(h.mul(0.88)).div(h.mul(0.12)), 0, 1)).mul(0.42);
        const inset = w.mul(step1.mul(float(1).sub(spire)).mul(0.15).add(step2.mul(0.14)).add(taper)).floor();
        // Below the street the blocks dissolve into the mist (seen only when the street is on screen).
        const footing = smoothstep(vh.mul(-0.1), 0, y);
        const body = min(min(inside(bx.sub(inset)), inside(w.sub(inset).sub(bx))), inside(h.sub(y))).mul(footing);

        // Windows: a grid of panes, or ribbons of glass on some office blocks. The grid varies a
        // little from block to block.
        const cw = scale.mul(row.cell[0]).mul(r6.mul(0.4).add(0.85));
        const ch = scale.mul(row.cell[1]).mul(r1.mul(0.3).add(0.88));
        const side = max(w.mul(0.08), scale.mul(2)).floor();
        const lobby = ch.mul(1.3);
        const gx = bx.sub(side).div(cw);
        const gy = y.sub(lobby).div(ch);
        const wx = floor(gx);
        const wy = floor(gy);
        const fx = fract(gx).mul(cw);
        const fy = fract(gy).mul(ch);
        const ribbon = step(0.8, r2.mul(0.5).add(r4.mul(0.5)));
        const paneX = mix(min(inside(fx.sub(cw.mul(0.22))), inside(cw.mul(0.7).sub(fx))), float(1), ribbon);
        const paneY = min(inside(fy.sub(ch.mul(0.26))), inside(ch.mul(0.76).sub(fy)));
        const area = min(
          min(inside(bx.sub(side).sub(inset)), inside(w.sub(side).sub(inset).sub(bx))),
          min(inside(y.sub(lobby)), inside(h.sub(ch.mul(0.9)).sub(y))),
        );
        const pane = paneX.mul(paneY).mul(area);
        // Which windows light: offices light by floors, homes one by one; a ribbon lights per bay.
        const bay = mix(wx, floor(wx.div(4)), ribbon);
        const kWin = hash(vec2(id.mul(7.13).add(bay), wy.add(row.seed)));
        const kFloor = hash(vec2(id.add(row.seed * 3.1), wy.mul(1.7)));
        const key = mix(kWin, kFloor, r5.mul(0.5).add(0.15));
        // How full the block gets: a few stay nearly dark, most end up about half lit.
        const full = mix(float(0.06), mix(float(0.3), float(row.depth < 0.9 ? 0.5 : 0.7), r6), step(0.08, r3.mul(0.7).add(r1.mul(0.3))));
        // The sweep runs from the right edge to the left; each window waits for its turn.
        const winX = centre.add(bx.sub(w.mul(0.5))).div(vw);
        const turn = float(1).sub(winX).mul(0.55).add(kWin.mul(0.45));
        const swept = step(turn, light.mul(1.18).sub(0.04)).mul(step(key, full));
        let on: F = max(step(key, full.mul(0.2)), swept);
        // Mostly gold, some warm white, many dimmer behind curtains.
        const tone = fract(kWin.mul(17.3).add(kFloor.mul(4.1)));
        const shade = tone.mul(tone).mul(0.6).add(0.4);
        const glass = mix(lit, warm, step(0.78, tone).mul(0.75)).mul(shade).mul(row.bright);

        // Facade: the right face of each block turns from the city glow, and the street lights
        // warm the lower floors.
        const facade = new Color(row.body);
        const bodyRGB = vec3(facade.r, facade.g, facade.b);
        const turned = mix(float(1), float(0.7), step(w.mul(0.62), bx));
        const street0 = exp(max(y, 0).div(vh.mul(0.12)).negate()).mul(light.mul(0.5).add(0.25));
        let rgb: V3 = bodyRGB.mul(turned).add(lit.mul(street0.mul(0.05)));
        if (lean) {
          rgb = mix(rgb, glass, pane.mul(on));
          return { cover: body, rgb: mix(rgb, haze, row.fog) };
        }
        // A few windows change now and then, as listings update.
        const alt = fract(kWin.mul(91.7).add(kFloor.mul(13.3)));
        const change = step(0.97, alt).mul(step(0.5, hash(vec2(alt.mul(57.1), floor(time.mul(0.3).add(alt.mul(11)))))));
        on = mix(on, float(1).sub(on), change);
        // A mast with a slow light on a few tall towers.
        const mastOn = step(0.9, r5).mul(step(0.45, r3));
        const mastH = vh.mul(MAST).mul(tall);
        const mastX = bx.sub(w.mul(0.5)).abs();
        const mast = mastOn.mul(inside(scale.mul(0.7).sub(mastX))).mul(inside(y.sub(h))).mul(inside(h.add(mastH).sub(y)));
        const tipD = vec2(mastX, y.sub(h.add(mastH))).length();
        const blink = step(0.55, fract(time.mul(0.45).add(r5.mul(7))));
        const tip = mastOn.mul(blink).mul(clamp(float(1).sub(tipD.div(scale.mul(2.2))), 0, 1));
        // Floodlights wash the crowns of some towers from below; a few residential towers wear a
        // thin lit band under the roof.
        const wash = float(1).sub(y.sub(h.mul(0.86)).div(h.mul(0.14))).clamp(0, 1);
        rgb = rgb.add(lit.mul(step1.mul(step(0.7, r6)).mul(wash).mul(wash).mul(0.03).mul(light)));
        const band = step(0.86, r6).mul(step(0.3, r3)).mul(inside(y.sub(h.sub(ch.mul(0.75))))).mul(inside(h.sub(ch.mul(0.45)).sub(y)));
        rgb = mix(rgb, lit.mul(0.55), band.mul(light).mul(0.5));
        // Unlit glass catches a little of the glow.
        rgb = mix(rgb, rgb.mul(1.3).add(haze.mul(0.05)), pane.mul(float(1).sub(on)));
        rgb = mix(rgb, glass, pane.mul(on));
        if (row.halo && tier !== "low") {
          const cx = fx.sub(cw.mul(0.46)).div(cw);
          const cy = fy.sub(ch.mul(0.51)).div(ch);
          const halo = clamp(float(1).sub(vec2(cx, cy).length().mul(1.6)), 0, 1).mul(on).mul(area).mul(float(1).sub(pane));
          rgb = rgb.add(glass.mul(halo.mul(0.16)));
        }
        rgb = mix(rgb, haze, row.fog);
        rgb = mix(rgb, lit.mul(0.6), mast.mul(0.2));
        rgb = rgb.add(lit.mul(tip.mul(1.4)));
        return { cover: max(max(body, mast), tip), rgb };
      };

      // The sky stays transparent but for the glow the lit windows throw up over the city.
      // Premultiplied "over" from far to near.
      const glowH = sy.sub(groundOf(rows[0]));
      const glowX = exp(at.x.sub(0.74).div(0.3).pow(2).negate()).mul(0.6).add(0.5);
      const glow = exp(max(glowH, 0).div(vh.mul(0.16)).negate())
        .mul(light.mul(0.05).add(0.02))
        .mul(glowX)
        .mul(smoothstep(vh.mul(-0.04), vh.mul(0.04), glowH));
      const pre = lit.mul(0.7).mul(glow).toVar();
      const alpha = glow.toVar();

      // The globe as a planet in the night sky: a warm halo and a thin orbit with one travelling
      // light, all behind the globe, which draws over them.
      const toMoon = vec2(sx, sy).sub(moon.xy);
      const md = toMoon.length().toVar();
      const R = moon.z;
      If(md.lessThan(R.mul(2.8)), () => {
        // Blending is in linear light, so a little alpha over the dark page shows a lot: the halo
        // stays faint and reaches exactly zero well inside the branch.
        const halo = exp(max(md.sub(R.mul(0.96)), 0).div(R.mul(0.3)).negate())
          .mul(0.075)
          .mul(smoothstep(R.mul(0.97), R.mul(1.03), md))
          .mul(float(1).sub(smoothstep(R.mul(1.5), R.mul(2.4), md)));
        const orbitR = min(R.mul(1.34), vw.mul(0.5).sub(6));
        const angle = atan(toMoon.y, toMoon.x);
        const sweep = time.mul(0.11).add(1.2);
        const arc = cos(angle.sub(sweep)).mul(0.5).add(0.5);
        const ring = clamp(float(1).sub(abs(md.sub(orbitR)).div(aa.mul(2.4))), 0, 1).mul(arc.mul(0.16).add(0.05));
        const sat = vec2(cos(sweep), sin(sweep)).mul(orbitR).add(moon.xy);
        const satD = vec2(sx, sy).sub(sat).length();
        const point = exp(satD.div(scale.mul(2.2)).negate()).mul(0.9).add(exp(satD.div(scale.mul(9)).negate()).mul(0.06));
        const a = clamp(halo.add(ring).add(point), 0, 1).mul(step(1, R));
        pre.assign(mix(lit, warm, point.clamp(0, 1)).mul(a).add(pre.mul(float(1).sub(a))));
        alpha.assign(a.add(alpha.mul(float(1).sub(a))));
      });

      // Rows, each skipped above its highest possible roof (and mast) and in the water.
      const shore = street.add(water).toVar();
      for (const row of rows) {
        const roof = groundOf(row).add(vh.mul(tall).mul(row.height[1] * SKYLINE_MAX + MAST)).add(8);
        If(sy.lessThan(roof).and(sy.greaterThanEqual(shore.sub(1))), () => {
          const r = drawRow(row, sx, sy);
          pre.assign(r.rgb.mul(r.cover).add(pre.mul(float(1).sub(r.cover))));
          alpha.assign(r.cover.add(alpha.mul(float(1).sub(r.cover))));
        });
      }
      // The water in front of the city: dark, with the lights of the two near rows broken up by
      // ripples, fading with depth.
      If(sy.lessThan(shore).and(water.greaterThan(0.5)), () => {
        const depth = shore.sub(sy);
        const wave = sin(depth.mul(0.9).add(time.mul(1.4))).mul(sin(depth.mul(0.23).sub(time.mul(0.6)).add(sx.mul(0.013))));
        const band = floor(depth.div(scale.mul(2.2)));
        const rx = sx.add(wave.mul(depth.mul(0.05).add(1.5)));
        const ry = shore.add(band.mul(scale.mul(2.2)).mul(1.35));
        const deep = exp(depth.div(water.mul(0.55)).negate());
        let wet: V3 = night.mul(0.82);
        let reflected: F = float(0);
        for (const row of rows.slice(-2)) {
          const r = drawRow(row, rx, ry, true);
          wet = mix(wet, r.rgb.mul(0.42), r.cover.mul(deep));
          reflected = max(reflected, r.cover);
        }
        // The water itself is a shade darker than the night, so the shore line reads.
        const a = mix(float(0.55), float(0.92), reflected.mul(deep))
          .mul(smoothstep(0, scale.mul(6), water))
          .mul(float(1).sub(smoothstep(water.mul(0.8), water.mul(1.6), depth)));
        pre.assign(wet.mul(a));
        alpha.assign(a);
      });
      // A low warm mist along the shore.
      const mist = exp(abs(sy.sub(shore)).div(vh.mul(0.04)).negate())
        .mul(light.mul(0.07).add(0.025))
        .mul(float(1).sub(cam));
      pre.addAssign(lit.mul(0.5).mul(mist));
      alpha.addAssign(mist.mul(float(1).sub(alpha)));

      // A soft dark haze under the text, so every line reads over the city.
      const scrim = (r: Node<"vec4">): F => {
        const d = vec2(max(max(r.x.sub(sx), sx.sub(r.z)), 0), max(max(r.y.sub(sy), sy.sub(r.w)), 0)).length();
        return float(1).sub(smoothstep(0, scale.mul(150), d));
      };
      const hazed = max(max(scrim(textA), scrim(textB)), max(scrim(textC), scrim(textD))).mul(hazeK);
      pre.assign(mix(pre, night.mul(alpha), hazed));

      // Soft edges where the box meets the page above and below.
      const feather = vh.mul(0.32);
      const top = base.add(u.size.y);
      const edges = smoothstep(0, feather, top.sub(sy)).mul(smoothstep(0, feather.mul(0.6), sy.sub(base)));
      // A static dither of a fraction of a level keeps the dark glow from banding.
      const dither = hash(floor(vec2(sx, sy).div(aa.mul(2)))).sub(0.5).mul(0.006);
      const shown = clamp(alpha.add(dither.mul(smoothstep(0, 0.2, alpha))), 0, 1).mul(edges).mul(reveal).mul(u.opacity);
      return vec4(pre.div(max(alpha, 0.0001)), shown);
    });

    const material = new MeshBasicNodeMaterial({ transparent: true, depthWrite: false });
    // The alpha of the colour is the coverage; the material's opacity multiplies it.
    material.colorNode = city();
    const mesh = new Mesh(new PlaneGeometry(1, 1), material);
    place(mesh, { fit: "none", replace: true });

    // The chapter's parts, measured when the layout changes, never in the frame.
    const host = element as HTMLElement;
    const world = host.parentElement ?? host;
    const parts: Parts = { text: [null, null, null], moon: null, peak: null };
    let held: HTMLElement | null = null;
    const GROUPS = ["text", "label", "quote"];
    const measure = () => {
      const box = host.getBoundingClientRect();
      const rel = (r: DOMRect): [number, number, number, number] => [r.left - box.left, r.top - box.top, r.right - box.left, r.bottom - box.top];
      // Each group is one rectangle around all of its elements.
      parts.text = GROUPS.map((group) => {
        const rects = [...world.querySelectorAll<HTMLElement>(`[data-city-part="${group}"]`)].map((el) => rel(el.getBoundingClientRect()));
        return rects.length
          ? rects.reduce((a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])])
          : null;
      });
      const globe = world.querySelector<HTMLElement>('[data-city-part="moon"]');
      if (globe) {
        const r = rel(globe.getBoundingClientRect());
        const k = Number(globe.dataset.dioScale) || 0.8;
        parts.moon = [(r[0] + r[2]) / 2, (r[1] + r[3]) / 2, 0.5 * k * Math.min(r[2] - r[0], r[3] - r[1])];
      } else parts.moon = null;
      const peak = world.querySelector<HTMLElement>('[data-city-part="peak"]');
      held = world.querySelector<HTMLElement>('[data-city-part="held"]');
      parts.peak = peak ? ((r) => [r[1], r[3]] as [number, number])(rel(peak.getBoundingClientRect())) : null;
      invalidate();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    for (const el of world.querySelectorAll("[data-city-part]")) observer.observe(el);
    void document.fonts?.ready.then(measure);
    measure();
    onDispose(() => observer.disconnect());

    // The city is drawn in screen space. While the browser scrolls ahead of the frame (touch,
    // keyboard, the scrollbar) the canvas would move with the page and the skyline jump back at
    // the next frame; while the box is on screen the canvas holds still instead.
    const release = app.stage.hold(() => {
      const r = host.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    });
    onDispose(release);

    let shown = 0;
    let lean = 0;
    return (input) => {
      const width = app.stage.width.peek();
      const height = app.stage.height.peek();
      const boxH = input.height;
      // The plane: the whole width of the screen, the height of the box.
      mesh.scale.set(width, boxH, 1);
      mesh.position.x = width / 2 - (input.x + input.width / 2);
      view.value.set(width, height);
      const ratio = app.stage.pixelRatio.peek() || 1;
      aa.value = 0.5 / ratio;
      scale.value = Math.min(1.15, Math.max(0.72, width / 1440));
      // Landscape screens keep the city low on the left under the copy; portrait ones, where the
      // copy spans the width, get a taller, flatter city.
      const wide = smooth((width / height - 0.6) / 0.7);
      tall.value = 1.1 - 0.12 * wide;
      shape.value = 0.3 + 0.7 * wide;
      base.value = height - input.y - boxH;
      /** Box offset y to screen y from the bottom. */
      const up = (y: number) => height - (input.y + y);

      for (const [i, target] of [textA, textB, textC].entries()) {
        const r = parts.text[i];
        if (r) target.value.set(input.x + r[0], up(r[3]), input.x + r[2], up(r[1]));
        else target.value.set(-1e5, -1e5, -1e5, -1e5);
      }
      if (held) {
        const r = held.getBoundingClientRect();
        textD.value.set(r.left, height - r.bottom, r.right, height - r.top);
      }
      hazeK.value = width < 768 ? 0.62 : 0.8;
      if (parts.moon) moon.value.set(input.x + parts.moon[0], up(parts.moon[1]), parts.moon[2]);
      else moon.value.set(-1e5, -1e5, 0);

      // How far the top of the screen is into the box, and where the peak is.
      const s = -input.y;
      const reduced = input.reducedMotion;
      const peakTop = parts.peak?.[0] ?? boxH * 0.5;
      const peakEnd = parts.peak?.[1] ?? boxH * 0.8;
      // The camera comes down out of the night as the heading comes up and holds a distant
      // skyline behind the list; descends to the waterfront as the peak comes; lifts over the
      // roofs as the quote comes, so the city has sunk by the end of the box.
      const rise = smooth((s + height * 0.95) / (height * 0.75));
      const descend = smooth((s - (peakTop - height * 1.05)) / (height * 0.95));
      const lift = smooth((s - (peakEnd - height * 0.95)) / (height * 0.9));
      const camera = Math.max(1 - rise * (1 - READING * (1 - descend)), lift);
      cam.value = reduced ? 0 : camera;
      // The windows: a few on the far skyline while the list reads, all of them for the peak.
      light.value = reduced ? 1 : Math.max(0.4 * rise, smooth((s - (peakTop - height * 0.95)) / (height * 1.05)));
      water.value = (reduced ? 1 : 1 - Math.min(1, camera / 0.35)) * height * (width < 768 ? 0.15 : 0.1);
      // Under reduced motion the city stands under the peak and scrolls with the page.
      street.value = reduced ? up(peakEnd) : 0;
      const px = Number.isFinite(input.pointer.x) ? input.pointer.x : 0.5;
      const target = reduced ? 0 : Math.max(-0.6, Math.min(0.6, px - 0.5));
      lean += (target - lean) * Math.min(1, (input.delta || 0.016) * 3);
      pan.value = reduced ? 0 : -(s / height) * 30 - lean * 30;
      if (shown < 1) {
        shown = reduced ? 1 : Math.min(1, shown + (input.delta || 0.016) / 0.9);
        reveal.value = shown * shown * (3 - 2 * shown);
      }
      return shown < 1 || Math.abs(lean - target) > 0.002;
    };
  },
);
