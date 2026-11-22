// stream: one line of light through the whole page, the data Mikhail moves for a living. It
// enters at the top right and passes the elements marked `data-stream` in page order. The line is
// drawn as far as the reader has got: its head rides at the reading line as a hot comet, and the
// data flows down the drawn part into it. At the end it reaches the contact button, runs once
// around its rim and stays there, circling: the button is lit.
// Layers: the filament (a continuous hairline with a glow and packets of light running down it),
// the thread (streaks flowing along the drawn part), the head (a dense hot cluster), the ring
// (particles circling the button once the line has reached it), a soft glow, and a dim dust of
// data in depth over the whole page. A fast scroll speeds the flow up and draws the dust into
// streaks. `data-stream-width` on an anchor sets the stream's width there in px.
// The element carrying the effect is fixed to the viewport; the path lives in page coordinates
// and the scroll slides it past, so the stream is part of the page rather than an overlay.
import { effect } from "@dioramajs/diorama";
import {
  abs,
  attribute,
  clamp,
  exp,
  float,
  fract,
  instancedBufferAttribute,
  max,
  mix,
  mod,
  positionLocal,
  pow,
  smoothstep,
  time,
  uniform,
  uv,
  vec2,
  vec3,
} from "three/tsl";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  DynamicDrawUsage,
  Group,
  InstancedBufferAttribute,
  Mesh,
  MeshBasicNodeMaterial,
  Sprite,
  SpriteNodeMaterial,
  Vector2,
  Vector3,
} from "three/webgpu";

/** Distance of the stage camera in px. Sprites are scaled by (EYE - z) / EYE, so depth changes
 * what draws in front, never where a particle shows on the page. */
const EYE = 1000;
/** Uniform samples of the path by length. */
const SAMPLES = 2048;

function seeded(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function smooth(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

type Point = { x: number; y: number; w: number; z: number };

/** Catmull-Rom through the points, resampled to equal steps of length: x, y, width, depth. */
function resample(points: Point[], out: Float32Array, marks: number[]): number {
  const dense: number[] = [];
  const at = (i: number) => points[Math.max(0, Math.min(points.length - 1, i))];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const steps = 64;
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const cr = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      const e = t * t * (3 - 2 * t);
      dense.push(cr(p0.x, p1.x, p2.x, p3.x), cr(p0.y, p1.y, p2.y, p3.y), p1.w + (p2.w - p1.w) * e, p1.z + (p2.z - p1.z) * e);
    }
  }
  const last = points[points.length - 1];
  dense.push(last.x, last.y, last.w, last.z);
  const n = dense.length / 4;
  const lengths = new Float32Array(n);
  for (let i = 1; i < n; i++) {
    lengths[i] = lengths[i - 1] + Math.hypot(dense[i * 4] - dense[i * 4 - 4], dense[i * 4 + 1] - dense[i * 4 - 3]);
  }
  const total = lengths[n - 1] || 1;
  marks.length = 0;
  for (let i = 0; i < points.length; i++) marks.push(lengths[Math.min(n - 1, i * 64)] / total);
  let j = 1;
  for (let k = 0; k < SAMPLES; k++) {
    const target = (k / (SAMPLES - 1)) * total;
    while (j < n - 1 && lengths[j] < target) j++;
    const span = lengths[j] - lengths[j - 1] || 1;
    const f = (target - lengths[j - 1]) / span;
    for (let c = 0; c < 4; c++) {
      out[k * 4 + c] = dense[j * 4 - 4 + c] + (dense[j * 4 + c] - dense[j * 4 - 4 + c]) * f;
    }
  }
  return total;
}

/** Points once around a pill (a button), `off` px outside it: from the middle of its right end up
 * and leftward over the top, round the left end, back along the bottom and up to the start. */
function aroundPill(box: DOMRect, top: number, off: number, w: number): Point[] {
  const r0 = Math.min(box.height / 2, box.width / 2);
  const rr = r0 + off;
  const cy = box.top + top + box.height / 2;
  const left = box.left + r0;
  const right = box.right - r0;
  const out: Point[] = [];
  const step = 10;
  for (let a = 0; a > -Math.PI / 2; a -= step / rr) out.push({ x: right + Math.cos(a) * rr, y: cy + Math.sin(a) * rr, w, z: 0 });
  for (let x = right; x > left; x -= step) out.push({ x, y: cy - rr, w, z: 0 });
  for (let a = -Math.PI / 2; a > -Math.PI * 1.5; a -= step / rr) {
    out.push({ x: left + Math.cos(a) * rr, y: cy + Math.sin(a) * rr, w, z: 0 });
  }
  for (let x = left; x < right; x += step) out.push({ x, y: cy + rr, w, z: 0 });
  for (let a = Math.PI / 2; a > 0; a -= step / rr) out.push({ x: right + Math.cos(a) * rr, y: cy + Math.sin(a) * rr, w, z: 0 });
  out.push({ x: right + rr, y: cy, w, z: 0 });
  return out;
}

export default effect(
  { color: "#f2b45a", hot: "#fff0d2", density: 1, speed: 0.012, width: 34, front: false },
  { rebuild: ["density", "front"], animate: { fps: 60 } },
  ({ app, params, u, input, place, onDispose }) => {
    const random = seeded(20260522);
    const phone = window.matchMedia("(max-width: 767px)").matches;
    const group = new Group();

    // Particles that follow the path: the flows share the motion, not the look.
    const makeFlow = (count: number, size: [number, number], packetShare: number, spreadMul: number) => {
      const phase = new Float32Array(count);
      const offset = new Float32Array(count);
      const depth = new Float32Array(count);
      const pace = new Float32Array(count);
      const heat = new Float32Array(count);
      const posData = new Float32Array(count * 4);
      const lookData = new Float32Array(count * 4);
      for (let i = 0; i < count; i++) {
        phase[i] = random();
        offset[i] = ((random() + random() + random()) / 3 - 0.5) * 2.2 * spreadMul;
        depth[i] = -420 + random() * 560;
        pace[i] = 0.7 + random() * 0.6;
        const packet = random() < packetShare;
        posData[i * 4 + 3] = packet ? size[1] : size[0] + random() * (size[1] - size[0]) * 0.45;
        lookData[i * 4 + 2] = packet ? 1 : 0.3 + random() * 0.5;
        heat[i] = packet ? 1 : random() * 0.2;
        lookData[i * 4 + 3] = heat[i];
      }
      const posAttr = new InstancedBufferAttribute(posData, 4);
      posAttr.setUsage(DynamicDrawUsage);
      const lookAttr = new InstancedBufferAttribute(lookData, 4);
      lookAttr.setUsage(DynamicDrawUsage);
      return { count, phase, offset, depth, pace, heat, posData, lookData, posAttr, lookAttr };
    };
    type Flow = ReturnType<typeof makeFlow>;

    const thread = makeFlow(Math.round((phone ? 1800 : 5200) * params.density), [1.1, 4.4], 0.07, 1);
    // The head: a dense hot cluster just behind the drawing point, narrowing into it like a comet.
    const local = makeFlow(Math.round((phone ? 420 : 1100) * params.density), [1.1, 4.8], 0.12, 1);
    // On a phone the glow would spill over the text along the edge: the thread alone there.
    const glow = makeFlow(phone ? 0 : Math.round(220 * params.density), [36, 110], 0, 0.6);
    // Circling the button once the line has reached it.
    const ring = makeFlow(Math.round((phone ? 120 : 220) * params.density), [0.8, 2.6], 0.15, 0.2);

    // Copies of page elements draw layer by layer in page order, not by depth. So the stream runs
    // as two instances computing the same deterministic flow: one first in the page draws the dust,
    // the glow, the filament, the thread and the ring under every copy; one last in the page
    // (`front`) draws only the part of the head an anchor lifts (`data-stream-z`), over the copies.
    const streakMaterial = (flow: Flow, soft: boolean, front: boolean) => {
      const pos = instancedBufferAttribute<"vec4">(flow.posAttr, "vec4");
      const look = instancedBufferAttribute<"vec4">(flow.lookAttr, "vec4");
      const material = new SpriteNodeMaterial({ transparent: true, depthWrite: false, blending: AdditiveBlending });
      const scale = float(EYE).sub(pos.z).div(EYE);
      material.positionNode = vec3(pos.x.mul(scale), pos.y.mul(scale), pos.z);
      const r = uv().sub(0.5).mul(2);
      // Falls to exactly zero at the sprite's edge, so no square ever shows.
      const edge = clamp(float(1).sub(r.dot(r)), 0, 1);
      const lifted = smoothstep(70, 150, pos.z);
      const share = front ? lifted : float(1).sub(lifted);
      if (soft) {
        material.scaleNode = vec2(pos.w.mul(1.6), pos.w).mul(scale);
        material.rotationNode = look.x;
        material.colorNode = u.color;
        material.opacityNode = exp(r.dot(r).mul(-2.2)).mul(edge, look.y, u.opacity, 0.08);
      } else {
        // look: x = angle of the flow, y = visibility along the path, z = brightness, w = heat.
        const stretch = float(1).add(look.w.mul(1.8)).add(u.velocity.abs().mul(10));
        material.scaleNode = vec2(pos.w.mul(stretch).mul(3.4), pos.w.mul(1.5)).mul(scale);
        material.rotationNode = look.x;
        material.colorNode = mix(u.color, u.hot, look.w);
        material.opacityNode = exp(r.dot(r).mul(-3.2)).mul(edge, look.y, look.z, u.opacity, share, 0.95);
      }
      const sprite = new Sprite(material);
      sprite.count = flow.count;
      sprite.frustumCulled = false;
      return sprite;
    };
    const front = params.front;
    const glowSprite = streakMaterial(glow, true, false);
    glowSprite.renderOrder = 1;
    const threadSprite = streakMaterial(thread, false, front);
    threadSprite.renderOrder = 3;
    const localSprite = streakMaterial(local, false, front);
    localSprite.renderOrder = 4;
    const ringSprite = streakMaterial(ring, false, false);
    ringSprite.renderOrder = 5;

    const view = uniform(new Vector2(input.width, input.height));
    const scrollY = uniform(0);

    // The filament: a hairline strip along the whole path, drawn down to the head. Its vertices are
    // in page px, set when the layout changes; the shader slides them by the scroll.
    const HALF = phone ? 8 : 14;
    const filamentPos = new Float32Array(SAMPLES * 2 * 3);
    const filamentInfo = new Float32Array(SAMPLES * 2 * 2);
    const filamentIndex: number[] = [];
    for (let k = 0; k < SAMPLES - 1; k++) {
      const a = k * 2;
      filamentIndex.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    const filamentGeometry = new BufferGeometry();
    const filamentPosAttr = new BufferAttribute(filamentPos, 3);
    filamentGeometry.setAttribute("position", filamentPosAttr);
    filamentGeometry.setAttribute("info", new BufferAttribute(filamentInfo, 2));
    filamentGeometry.setIndex(filamentIndex);
    const headS = uniform(0);
    const totalU = uniform(1);
    const lit = uniform(0);
    const info = attribute<"vec2">("info", "vec2");
    const filamentMaterial = new MeshBasicNodeMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
      side: DoubleSide,
    });
    filamentMaterial.positionNode = vec3(
      positionLocal.x.sub(view.x.mul(0.5)),
      positionLocal.y.sub(scrollY).sub(view.y.mul(0.5)).negate(),
      0,
    );
    {
      const behind = headS.sub(info.x).mul(totalU); // px behind the head; negative past it
      const drawn = smoothstep(-1, 4, behind);
      const d = abs(info.y).mul(HALF);
      const core = exp(d.mul(d).div(phone ? -0.8 : -1.1));
      const halo = exp(d.mul(d).div(phone ? -14 : -30));
      const edgeFade = float(1).sub(abs(info.y)).clamp(0, 1);
      // Packets of light running down the drawn line, one every ~520 px, a bright front and a tail.
      const packet = pow(fract(info.x.mul(totalU).div(520).sub(time.mul(0.42))), 14);
      const tip = exp(max(behind, 0).div(-170));
      const start = smoothstep(0, 0.012, info.x);
      const glowAmount = core.mul(0.6).add(halo.mul(0.22)).mul(edgeFade);
      filamentMaterial.colorNode = mix(u.color, u.hot, clamp(packet.add(tip.mul(0.8)).add(core.mul(0.25)), 0, 1));
      // Once the button is lit the head's heat leaves the rim: a fine line, not a white outline.
      const heat = tip.mul(float(1.8).sub(lit.mul(1.45)));
      filamentMaterial.opacityNode = glowAmount.mul(float(0.32).add(packet.mul(1.5)).add(heat), drawn, start, u.opacity);
    }
    const filament = new Mesh(filamentGeometry, filamentMaterial);
    filament.frustumCulled = false;
    filament.renderOrder = 2;

    // Two soft lights: the head of the line, and the lit button at the end.
    const headAmount = uniform(0);
    const headAt = uniform(new Vector3());
    const headSize = uniform(new Vector2(phone ? 70 : 120, phone ? 70 : 120));
    const haloAmount = uniform(0);
    const haloAt = uniform(new Vector3());
    const haloSize = uniform(new Vector2(200, 120));
    const softSprite = (amount: typeof headAmount, at: typeof headAt, size: typeof headSize, hot: number) => {
      const material = new SpriteNodeMaterial({ transparent: true, depthWrite: false, blending: AdditiveBlending });
      material.positionNode = at;
      material.scaleNode = size;
      const r = uv().sub(0.5).mul(2);
      const edge = clamp(float(1).sub(r.dot(r)), 0, 1);
      material.colorNode = mix(u.color, u.hot, hot);
      material.opacityNode = exp(r.dot(r).mul(-3.4)).mul(edge, amount, u.opacity);
      const sprite = new Sprite(material);
      sprite.frustumCulled = false;
      return sprite;
    };
    const headGlow = softSprite(headAmount, headAt, headSize, 0.55);
    headGlow.renderOrder = 6;
    const halo = softSprite(haloAmount, haloAt, haloSize, 0.25);
    halo.renderOrder = 0;

    // Dust of data over the whole page, in depth: computed in the shader from the scroll.
    const dustCount = phone ? 220 : 650;
    const dustData = new Float32Array(dustCount * 4);
    for (let i = 0; i < dustCount; i++) {
      dustData.set([random() - 0.5, random(), -1600 + random() * 1500, 0.7 + random() ** 3 * 2.2], i * 4);
    }
    const dust = instancedBufferAttribute<"vec4">(new InstancedBufferAttribute(dustData, 4), "vec4");
    const dustMaterial = new SpriteNodeMaterial({ transparent: true, depthWrite: false, blending: AdditiveBlending });
    const dustScale = float(EYE).sub(dust.z).div(EYE);
    const span = view.y.mul(1.4);
    // Dust drifts slower than the page on a big screen. On a phone it moves with the page: the
    // browser scrolls a touch ahead of the frame, and only page-fixed content stays put meanwhile.
    const travel = scrollY.mul(phone ? 1 : 0.35).div(dustScale);
    const dy = mod(dust.y.mul(span).add(travel), span).sub(span.mul(0.5));
    dustMaterial.positionNode = vec3(dust.x.mul(view.x.mul(1.3)).mul(dustScale), dy.mul(dustScale), dust.z);
    const dustStreak = smoothstep(0.1, 0.9, abs(u.velocity)).mul(14);
    dustMaterial.scaleNode = vec2(dust.w, dust.w.add(dustStreak)).mul(dustScale).mul(2.2);
    const dr = uv().sub(0.5).mul(2);
    dustMaterial.colorNode = mix(vec3(1, 0.93, 0.82), u.color, 0.35);
    dustMaterial.opacityNode = exp(dr.dot(dr).mul(-3.5)).mul(clamp(float(1).sub(dr.dot(dr)), 0, 1), 0.22, u.opacity);
    const dustSprite = new Sprite(dustMaterial);
    dustSprite.count = dustCount;
    dustSprite.frustumCulled = false;
    dustSprite.renderOrder = 0;

    if (front) group.add(localSprite);
    else group.add(dustSprite, halo, glowSprite, filament, threadSprite, localSprite, ringSprite, headGlow);
    place(group, { fit: "none", replace: true });

    // The path in page px with its width, measured when the layout changes, never in the frame.
    const path = new Float32Array(SAMPLES * 4);
    let total = 1;
    let ready = false;
    const marks: number[] = [];
    /** Where the loop around the end button starts, as s; 1 when the end is not a button. */
    let loopS = 1;
    let endEl: HTMLElement | null = null;
    let pageHeight = 0;
    const measure = () => {
      const top0 = window.scrollY;
      // Down the page in order of height, whatever the order of the markup.
      const anchors = [...document.querySelectorAll<HTMLElement>("[data-stream]")]
        .map((el) => ({ el, y: el.getBoundingClientRect().top + top0 }))
        // The end anchor closes the stream wherever it sits.
        .sort((a, b) => Number("streamEnd" in a.el.dataset) - Number("streamEnd" in b.el.dataset) || a.y - b.y)
        .map(({ el }) => el);
      if (anchors.length === 0) {
        ready = false;
        return;
      }
      const top = window.scrollY;
      const width = document.documentElement.clientWidth;
      pageHeight = document.documentElement.scrollHeight;
      // A wide mouth above the screen; on a phone it must not spill over the text column.
      const points: Point[] = [{ x: phone ? width - 4 : width * 0.96, y: -360, w: params.width * (phone ? 0.5 : 4), z: 0 }];
      // The right margin, inside the screen: past the text column on every width.
      const edge = width - (phone ? 4 : 40);
      let loopAt = -1;
      endEl = null;
      anchors.forEach((el, index) => {
        const box = el.getBoundingClientRect();
        if (box.width === 0 && box.height === 0) return;
        const end = "streamEnd" in el.dataset || index === anchors.length - 1;
        // On a phone the stream keeps to the right margin and turns in only for the last anchor.
        const side = phone && !end ? "edge" : el.dataset.stream;
        const width0 = Number(el.dataset.streamWidth) || params.width;
        const w = phone ? width0 * 0.3 : side === "edge" ? Math.min(width0, 30) : width0;
        const z = phone ? 0 : Number(el.dataset.streamZ) || 0;
        const y = box.top + top + box.height / 2;
        if (side === "left-edge") {
          // Around a portrait: down the gap on its left, in front of the page, then under its
          // bottom edge back at the page depth.
          const media = el.querySelector("img")?.getBoundingClientRect() ?? box;
          const x = media.left - 64;
          points.push({ x, y: media.top + top + 30, w, z });
          points.push({ x, y: media.bottom + top - 110, w, z });
          points.push({ x: media.left + media.width * 0.45, y: media.bottom + top + 36, w: w * 0.6, z: 0 });
        } else if (end && (el.tagName === "A" || el.tagName === "BUTTON")) {
          // A button at the end: down the right margin to its centre line, in along it, narrowing,
          // then once around it.
          const off = phone ? 6 : 8;
          const bend = phone ? 40 : 90;
          points.push({ x: edge, y: y - bend * 1.8, w: Math.max(Math.min(w, 30), 10), z: 0 });
          points.push({ x: edge - bend * 0.35, y: y - bend * 0.35, w: 10, z: 0 });
          points.push({ x: edge - bend, y, w: 6, z: 0 });
          points.push({ x: Math.min(edge - bend - 30, box.right + 60), y, w: 4, z: 0 });
          loopAt = points.length;
          points.push(...aroundPill(box, top, off, 3));
          endEl = el;
        } else if (end) {
          // Any other last anchor is met head on from the right margin along its centre line.
          points.push({ x: edge, y, w: Math.max(Math.min(w, 30), 10), z: 0 });
          points.push({ x: box.left + box.width / 2, y, w, z: 0 });
        } else {
          const x =
            side === "left"
              ? box.left + box.width * 0.12
              : side === "right"
                ? box.right - box.width * 0.12
                : side === "gutter"
                  ? Math.max(18, box.left - 36)
                  : side === "edge"
                    ? edge
                    : side === "beside"
                      ? // Out into the empty half of the screen beside a short column.
                        Math.min(edge, box.right + (width - box.right) * 0.5)
                      : box.left + box.width / 2;
          points.push({ x, y, w, z });
        }
      });
      total = resample(points, path, marks);
      loopS = loopAt >= 0 ? (marks[loopAt] ?? 1) : 1;
      totalU.value = total;

      // The filament strip: two vertices per sample, across the path.
      for (let k = 0; k < SAMPLES; k++) {
        const a = Math.max(0, k - 1);
        const b = Math.min(SAMPLES - 1, k + 1);
        let tx = path[b * 4] - path[a * 4];
        let ty = path[b * 4 + 1] - path[a * 4 + 1];
        const len = Math.hypot(tx, ty) || 1;
        tx /= len;
        ty /= len;
        const s = k / (SAMPLES - 1);
        for (let side = 0; side < 2; side++) {
          const sign = side === 0 ? -1 : 1;
          const v = k * 2 + side;
          filamentPos[v * 3] = path[k * 4] - ty * HALF * sign;
          filamentPos[v * 3 + 1] = path[k * 4 + 1] + tx * HALF * sign;
          filamentPos[v * 3 + 2] = 0;
          filamentInfo[v * 2] = s;
          filamentInfo[v * 2 + 1] = sign;
        }
      }
      filamentPosAttr.needsUpdate = true;
      ready = true;
    };
    const observer = new ResizeObserver(() => measure());
    observer.observe(document.body);
    const timer = window.setInterval(measure, 2500);
    void document.fonts?.ready.then(measure);
    measure();
    onDispose(() => {
      observer.disconnect();
      window.clearInterval(timer);
      filamentGeometry.dispose();
      filamentMaterial.dispose();
    });

    let flow = 0;
    let ringFlow = 0;
    /** Path length the full particle count is made for, px: shorter paths use a share of it. */
    const REFERENCE = 14000;
    /** The head's distance along the path, px, eased toward the reading line. */
    let headPx = 0;
    /** 0 → 1 while the line runs once around the end button, in time rather than scroll. */
    let around = 0;
    let litNow = false;
    // The stretch of the path within reach of the screen, as a range of s; anchors go down the
    // page, so the path does too, give or take the curve's overshoot covered by the margin.
    let lo = 0;
    let hi = 1;
    const reach = (scroll: number, height: number) => {
      const top = scroll - 400;
      const bottom = scroll + height + 400;
      let first = -1;
      let last = -1;
      for (let k = 0; k < SAMPLES; k++) {
        const y = path[k * 4 + 1];
        if (y >= top && y <= bottom) {
          if (first < 0) first = k;
          last = k;
        }
      }
      lo = first < 0 ? 2 : Math.max(0, (first - 8) / (SAMPLES - 1));
      hi = first < 0 ? -1 : Math.min(1, (last + 8) / (SAMPLES - 1));
    };
    /** The point of the path at s, in page px. */
    const pointAt = (s: number) => {
      const at = Math.min(1, Math.max(0, s)) * (SAMPLES - 1);
      const k = Math.min(SAMPLES - 2, Math.floor(at));
      const t = at - k;
      return {
        x: path[k * 4] + (path[k * 4 + 4] - path[k * 4]) * t,
        y: path[k * 4 + 1] + (path[k * 4 + 5] - path[k * 4 + 1]) * t,
        z: path[k * 4 + 3] + (path[k * 4 + 7] - path[k * 4 + 3]) * t,
      };
    };

    type Shape = {
      from: number;
      to: number;
      /** Particles per px of the stretch scale with its length, unless the flow is a fixed cluster. */
      cluster: boolean;
      clock: number;
      visible: (s: number, loop: number) => number;
      narrow?: (loop: number) => number;
      heat?: (loop: number) => number;
    };
    const move = (f: Flow, scroll: number, halfW: number, halfH: number, shape: Shape) => {
      const length = Math.max(1e-6, shape.to - shape.from);
      const step = (params.speed * 9000) / (total * length);
      const active = shape.cluster ? f.count : Math.min(f.count, Math.ceil((f.count * total * length) / REFERENCE));
      for (let i = active; i < f.count; i++) f.lookData[i * 4 + 1] = 0;
      for (let i = 0; i < active; i++) {
        let loop = (f.phase[i] + shape.clock * step * f.pace[i]) % 1;
        if (loop < 0) loop += 1;
        const s = shape.from + loop * length;
        const seen = s >= 0 && s <= 1 ? shape.visible(s, loop) : 0;
        if (s < lo || s > hi || seen <= 0) {
          f.lookData[i * 4 + 1] = 0;
          continue;
        }
        const at = s * (SAMPLES - 1);
        const k = Math.min(SAMPLES - 2, Math.floor(at));
        const t = at - k;
        const x0 = path[k * 4];
        const y0 = path[k * 4 + 1];
        const x1 = path[k * 4 + 4];
        const y1 = path[k * 4 + 5];
        const w = (path[k * 4 + 2] + (path[k * 4 + 6] - path[k * 4 + 2]) * t) * (shape.narrow ? shape.narrow(loop) : 1);
        const lift = path[k * 4 + 3] + (path[k * 4 + 7] - path[k * 4 + 3]) * t;
        let tx = x1 - x0;
        let ty = y1 - y0;
        const len = Math.hypot(tx, ty) || 1;
        tx /= len;
        ty /= len;
        const wobble = Math.sin(flow * 1.6 + f.phase[i] * 60) * 0.22;
        const off = (f.offset[i] + wobble) * w;
        const x = x0 + (x1 - x0) * t - ty * off;
        const y = y0 + (y1 - y0) * t + tx * off;
        const narrow = Math.min(1, w / params.width);
        f.posData[i * 4] = x - halfW;
        f.posData[i * 4 + 1] = -(y - scroll - halfH);
        f.posData[i * 4 + 2] = f.depth[i] * Math.min(1.4, narrow) * (lift > 0 ? 0.35 : 1) + lift;
        f.lookData[i * 4] = Math.atan2(-ty, tx);
        f.lookData[i * 4 + 1] = seen;
        if (shape.heat) f.lookData[i * 4 + 3] = Math.max(f.heat[i], shape.heat(loop));
      }
      f.posAttr.needsUpdate = true;
      f.lookAttr.needsUpdate = true;
    };
    const hide = (f: Flow) => {
      for (let i = 0; i < f.count; i++) f.lookData[i * 4 + 1] = 0;
      f.lookAttr.needsUpdate = true;
    };

    return () => {
      view.value.set(input.width, input.height);
      const scroll = app.scroll.state.y;
      scrollY.value = scroll;
      if (!ready) return;
      const dt = Math.min(0.05, input.delta || 0.016);
      const still = input.reducedMotion;
      if (!still) flow += dt * (1 + Math.abs(input.velocity) * 5);
      const halfW = input.width / 2;
      const halfH = input.height / 2;
      reach(scroll, input.height);

      // The reading line: 62% down the screen, sliding to the bottom over the last screen of the
      // page, so the line always reaches the end.
      const maxScroll = Math.max(1, pageHeight - input.height);
      const readY = scroll + input.height * (0.62 + 0.38 * smooth(maxScroll - input.height * 0.8, maxScroll, scroll));
      let k = 0;
      while (k < SAMPLES && path[k * 4 + 1] < readY) k++;
      // A phone scrolls a touch ahead of the frame (on the compositor), and anything tied to the
      // screen rather than the page would jump meanwhile: there the line is drawn whole, and the
      // button lights up as it comes into view.
      const whole = still || phone;
      const target = whole ? 1 : Math.min(k / (SAMPLES - 1), loopS);
      headPx += (target * total - headPx) * (whole ? 1 : 1 - Math.exp(-dt * 6));
      let inView = false;
      if (phone && endEl) {
        const r = endEl.getBoundingClientRect();
        inView = r.top < input.height * 0.88 && r.bottom > 0;
      }
      const arrived = loopS < 1 && (still || (phone ? inView : headPx >= loopS * total - 3));
      around = still ? (arrived ? 1 : 0) : Math.min(1, Math.max(0, around + (arrived ? dt / 1.1 : -dt / 0.45)));
      const eased = around * around * (3 - 2 * around);
      const head = whole ? 1 : arrived ? loopS + eased * (1 - loopS) : Math.min(1, headPx / total);
      headS.value = head;
      const ignite = smooth(0.82, 1, around);
      lit.value = ignite;

      // The data flows down the drawn part and sinks into the head.
      const tail = 70 / total;
      if (!front) {
        move(thread, scroll, halfW, halfH, {
          from: 0,
          to: head,
          cluster: false,
          clock: flow,
          visible: (s) => smooth(0, 0.015, s) * (1 - smooth(head - tail, head, s)),
        });
        move(glow, scroll, halfW, halfH, {
          from: 0,
          to: head,
          cluster: false,
          clock: flow,
          visible: (s) => smooth(0, 0.015, s) * (1 - smooth(head - tail * 3, head, s)),
        });
      }
      // The head: a comet of hot particles behind the drawing point, gone once the button is lit.
      const comet = (phone ? 420 : 720) / total;
      if (!whole && ignite < 1 && head > 0.002) {
        move(local, scroll, halfW, halfH, {
          from: head - comet,
          to: head,
          cluster: true,
          clock: flow * 1.7,
          visible: (_s, loop) => smooth(0, 0.35, loop) * (1 - smooth(0.94, 1, loop)) * (1 - ignite),
          narrow: (loop) => 0.25 + 0.75 * (1 - loop) ** 1.5,
          heat: (loop) => loop ** 5,
        });
      } else hide(local);

      if (front) return;

      // The head's own light.
      const tip = pointAt(head);
      headAt.value.set(tip.x - halfW, -(tip.y - scroll - halfH), 0);
      headAmount.value = whole ? 0 : (1 - ignite) * smooth(0, 0.01, head) * 0.55;

      // The lit button: particles circling its rim, a soft light under it, faster under the pointer.
      if (endEl && loopS < 1 && ignite > 0) {
        const hot = endEl.matches(":hover, :focus-visible");
        if (!still) ringFlow += dt * (hot ? 3.2 : 1.1) * (1 + Math.abs(input.velocity) * 3);
        move(ring, scroll, halfW, halfH, {
          from: loopS,
          to: 1,
          cluster: true,
          clock: ringFlow,
          visible: () => ignite,
        });
        const box = endEl.getBoundingClientRect();
        haloAt.value.set(box.left + box.width / 2 - halfW, -(box.top + box.height / 2 - halfH), 0);
        haloSize.value.set(box.width * 1.9, box.height * 3.2);
        const breathe = still ? 1 : 0.86 + 0.14 * Math.sin(flow * 1.3);
        haloAmount.value = ignite * breathe * (hot ? 0.75 : 0.42);
      } else {
        hide(ring);
        haloAmount.value = 0;
      }
      const nowLit = ignite > 0.6;
      if (endEl && nowLit !== litNow) {
        litNow = nowLit;
        if (litNow) endEl.dataset.lit = "true";
        else delete endEl.dataset.lit;
      }
    };
  },
);
