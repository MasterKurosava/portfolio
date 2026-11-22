// chain: a live blockchain for the VOTON chapter, the Web3 startup whose frontend Mikhail built
// from scratch, real-time data over REST and WebSocket included. It does not show their product
// (the site is gone): it is a quiet render of data being confirmed.
// The scene: a horizontal chain of glass blocks threaded on one hairline of light. The newest
// block stands at the right, close to the viewer; the older ones recede to the left and dissolve
// into the dark. Every `period` seconds a new block forms in the empty slot at the right end:
// packets of light arrive along the wire from the right edge, like messages over a socket, and
// settle on the edges of the coming block; a scan plane rises through it and leaves solid glass
// behind; the block locks in with a soft flash, its hash types itself onto the front face, a pulse
// of confirmation runs back along the chain, and the whole chain eases left by one block.
// Look: violet and cyan light on the warm black page. The light lives on the edges of the glass,
// on the wire and in the packets; the faces stay clear, so nothing reads as a flat fill. A faint
// reflection on an unseen glossy floor grounds the chain.
// Motion: the camera turns a little after the pointer, and the scroll tilts the chain. Under
// reduced motion the chain stands still and complete. On a phone it carries fewer blocks.
// Cost: one instanced draw for the blocks, one for their reflection, one for the hashes, one quad
// for the wire and its reflection, and a few hundred sprites. Frames at 60 fps only while on screen.
import { effect } from "@dioramajs/diorama";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import {
  abs,
  clamp,
  dot,
  exp,
  float,
  fract,
  frontFacing,
  instancedBufferAttribute,
  max,
  min,
  mix,
  normalGeometry,
  normalViewGeometry,
  positionGeometry,
  positionViewDirection,
  pow,
  reflect,
  screenUV,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
} from "three/tsl";
import type { Node } from "three/webgpu";
import {
  AdditiveBlending,
  CanvasTexture,
  DoubleSide,
  DynamicDrawUsage,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  LinearMipmapLinearFilter,
  Matrix4,
  Mesh,
  MeshBasicNodeMaterial,
  PlaneGeometry,
  Quaternion,
  Sprite,
  SpriteNodeMaterial,
  Vector3,
} from "three/webgpu";

type F = Node<"float">;

// The timeline of one block, in seconds at the default period of 2.5 s; a different period scales
// all of it. A cycle starts when the slot at the right end is free.
/** Packets reach the slot from here on (the first ones leave the right edge a little earlier). */
const FEED_END = 1.0;
/** Time a packet takes along the wire, from the right edge to the block. */
const TRAVEL = 0.42;
/** Time a packet takes from the socket on the block's face to its place on an edge. */
const SPREAD = 0.34;
/** The scan plane rises through the block between these two times. */
const BUILD_START = 0.55;
const BUILD_END = 1.6;
/** The block locks in as the scan reaches the top. */
const LOCK = BUILD_END;
/** The chain eases left by one block between these times. */
const SHIFT_START = 1.72;
const SHIFT_END = 2.42;
/** The default period, which the times above are written for. */
const BASE = 2.5;

/** Atlas of the hashes: cells of 512 x 128 px, 2 columns by 6 rows. */
const CELL_W = 512;
const CELL_H = 128;
const COLS = 2;
const ROWS = 6;
const CELLS = COLS * ROWS;
/** The first block's height: an ordinary block number of the period, nothing more. */
const HEIGHT0 = 16_408_217;

/** Distance of the stage camera, px (the render plugin's default). */
const EYE = 1000;

function seeded(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
};
const easeInOut = (x: number) => {
  const t = clamp01(x);
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
};
const easeOut = (x: number) => 1 - (1 - clamp01(x)) ** 3;

/** The ellipsis and the thin space of the labels, named so the source stays plain ASCII. */
const ELLIPSIS = String.fromCharCode(0x2026);
const THIN = String.fromCharCode(0x2009);

/** A short hash for block `n`, the same every time: 0x and four hex digits, an ellipsis, four more. */
function hashOf(n: number): string {
  const r = seeded(n * 7919 + 17);
  const hex = (count: number) => {
    let s = "";
    for (let i = 0; i < count; i++) s += Math.floor(r() * 16).toString(16);
    return s;
  };
  return `0x${hex(4)}${ELLIPSIS}${hex(4)}`;
}

/** Block height in groups of three split by thin spaces: 16 408 217. */
const heightOf = (n: number) => String(HEIGHT0 + n).replace(/\B(?=(\d{3})+(?!\d))/g, THIN);

export default effect(
  { color: "#8b7bff", color2: "#4fe3ff", period: 2.5, hash: true, reflection: true },
  {
    rebuild: ["hash", "reflection"],
    // Time frames only while the chain is on screen, none under reduced motion: it stands still.
    animate: { fps: (ctx) => (ctx.input.reducedMotion ? 0 : 60) },
  },
  ({ u, params, place, app, quality, onDispose }) => {
    const phone = window.matchMedia("(max-width: 767px)").matches;
    const low = quality === "low";
    const random = seeded(20230116);

    /** Block instances: the forming one, the locked ones, and one leaving at the left. */
    const MAX = phone ? 6 : 9;
    /** Packets per block. */
    const PACKETS = Math.round((phone ? 110 : 190) * (low ? 0.6 : 1));
    /** Motes of dust in the air around the chain. */
    const MOTES = phone ? 26 : low ? 30 : 56;
    const showHash = params.hash;
    const showReflection = params.reflection && !low;

    // The outer group sits at the centre of the box; the rig inside it turns like a camera would.
    const root = new Group();
    const rig = new Group();
    rig.rotation.order = "YXZ";
    root.add(rig);

    // Layout, in px of the rig, set from the box size (see `layout`).
    const blockPx = uniform(120);
    const spacing = uniform(220);
    /** x of the slot where blocks form, and of the newest locked block, in rig px. */
    const formX = uniform(300);
    const newestX = uniform(80);
    /** 0..1 how much of the forming block is there: the wire inside it dims as it fills. */
    const formShown = uniform(0);
    /** The wire's ends in rig px. */
    const wireL = uniform(-900);
    const wireR = uniform(900);
    /** 0..1 while packets run in: the incoming wire glows a little. */
    const feed = uniform(0);
    /** The pulse of confirmation running back along the wire: its x, its strength. */
    const pulseX = uniform(0);
    const pulseAmp = uniform(0);
    const clock = uniform(0);
    /** Where the reflection band crosses the faces; it follows the camera's turn. */
    const sheen = uniform(0);
    // The box on screen, CSS px, for the soft ends: the scene fades out before the box does.
    const boxL = uniform(0);
    const boxR = uniform(1440);
    const boxB = uniform(900);
    const stageW = uniform(1440);
    const stageH = uniform(900);
    const featherL = uniform(240);
    const featherR = uniform(120);

    /** Soft ends of the box: the chain dissolves at the left and the wire comes in from the right. */
    const sx = screenUV.x.mul(stageW);
    const sy = screenUV.y.mul(stageH);
    const ends = smoothstep(boxL, boxL.add(featherL), sx)
      .mul(smoothstep(boxR, boxR.sub(featherR), sx))
      .mul(smoothstep(boxB, boxB.sub(24), sy));

    // ---- Blocks ---------------------------------------------------------------------------------
    // A unit rounded cube; the instance matrix scales it to the block size and moves it.
    const blockGeometry = new RoundedBoxGeometry(1, 1, 1, 4, 0.045);
    /** Per block: x reveal 0..1 (the scan plane), y flash, z age in blocks, w visibility. */
    const stateData = new Float32Array(MAX * 4);
    const stateAttr = new InstancedBufferAttribute(stateData, 4);
    stateAttr.setUsage(DynamicDrawUsage);
    /** Per block: x the pulse of confirmation passing through; y, z, w unused. */
    const extraData = new Float32Array(MAX * 4);
    const extraAttr = new InstancedBufferAttribute(extraData, 4);
    extraAttr.setUsage(DynamicDrawUsage);

    /** The glass, three ways: the block itself, its reflection in the floor, and its inner edges. */
    type Glass = "block" | "mirror" | "core";
    const blockMaterial = (kind: Glass) => {
      const material = new MeshBasicNodeMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: AdditiveBlending,
        side: DoubleSide,
      });
      const state = instancedBufferAttribute<"vec4">(stateAttr, "vec4");
      const extra = instancedBufferAttribute<"vec4">(extraAttr, "vec4");
      const reveal = state.x;
      const flash = state.y;
      const age = max(state.z, 0);
      const seen = state.w;
      const p = positionGeometry;
      const n = normalGeometry;
      // On the rounded edges the normal turns between two faces: 0 on a flat face, ~0.3 along the
      // middle of an edge, ~0.42 at a corner. That band is where glass catches the light.
      const an = abs(n);
      const bevel = float(1).sub(max(max(an.x, an.y), an.z));
      const rim = smoothstep(0.05, 0.27, bevel);
      // Distance across a face to its nearest edge, in px: a soft glow inside the borders. Older
      // blocks stand further off and go a little out of focus: a wider, fainter glow.
      const ap = abs(p);
      const big = max(max(ap.x, ap.y), ap.z);
      const small = min(min(ap.x, ap.y), ap.z);
      const mid = ap.x.add(ap.y).add(ap.z).sub(big).sub(small);
      const toEdge = max(float(0.5).sub(mid).mul(blockPx), 0);
      const soft = age.mul(0.28).add(1);
      const inner = exp(toEdge.div(soft.mul(-2.4))).mul(float(0.5).div(soft));
      const wide = exp(toEdge.div(-14)).mul(0.035);
      // View-dependent terms: grazing faces brighten (fresnel), and one key light from the upper
      // right, fixed to the camera, slides along the edges as the chain turns.
      const v = positionViewDirection;
      const nv = normalViewGeometry;
      const facing = abs(dot(nv, v));
      const fres = pow(float(1).sub(facing), 4);
      const key = vec3(0.55, 0.75, 0.38).normalize();
      const lit = dot(nv, key).mul(0.5).add(0.5);
      const lit2 = lit.mul(lit);
      const spec = pow(max(dot(reflect(v.negate(), nv), key), 0), 24);
      // Corners catch the light from every side: a small sparkle on each.
      const corner = smoothstep(0.33, 0.41, bevel);
      // Fresh blocks run cool and bright; older ones settle to violet and dim.
      const fresh = exp(age.mul(-0.55));
      const white = vec3(1, 1, 1);
      // Like light split by the glass: the edge itself runs white-cyan, its glow on the faces
      // violet; the lit side cooler than the shade.
      const hot = mix(u.color2, white, lit2.mul(0.5).add(0.1));
      // Along the chain the light cools with age: cyan-white at the new end, violet in the past.
      const lineColor = mix(mix(u.color, u.color2, fresh.mul(0.5).add(0.12)), hot, clamp(lit2.mul(0.55).add(fresh.mul(0.6)).sub(0.1), 0, 1));
      const glowColor = mix(u.color, u.color2, clamp(lit2.mul(0.5).add(fresh.mul(0.35)).sub(0.2), 0, 1));
      const light = lit2.mul(1.05).add(0.14);
      // A faint reflection runs diagonally across the faces and slides as the camera turns.
      const band = p.x.mul(0.8).add(p.y).sub(p.z.mul(0.6)).sub(sheen);
      const reflection = exp(band.mul(band).div(-0.018)).mul(float(1).sub(rim)).mul(0.03).add(fres.mul(0.06));
      // The far side of the glass shows through, dimmer.
      const side = frontFacing.select(float(1), float(0.42));
      let rgb = lineColor
        .mul(rim.mul(light))
        .add(glowColor.mul(inner.add(wide).mul(lit2.mul(0.6).add(0.16))))
        .add(u.color.mul(reflection.add(0.002)))
        .add(mix(u.color2, white, 0.65).mul(spec.mul(rim.mul(0.8).add(0.05)).add(corner.mul(lit2).mul(0.45))));
      // The pulse of confirmation passing through, then the flash of the lock: light on the
      // edges only, the faces stay clear.
      rgb = rgb.mul(float(1).add(extra.x.mul(0.9)));
      rgb = rgb.add(mix(u.color2, white, 0.55).mul(rim.add(inner.mul(0.6)).mul(flash.mul(1.2)).add(fres.mul(flash).mul(0.06))));
      // The scan plane: below it the glass is built; at it a bright line of light cuts the block.
      const ly = p.y.add(0.5);
      const built = smoothstep(reveal.add(0.006), reveal.sub(0.006), ly);
      const building = smoothstep(0, 0.02, reveal).mul(smoothstep(1, 0.985, reveal));
      // Only where the plane cuts the sides: the floor and the lid never light up as a plate.
      const upright = float(1).sub(an.y.mul(an.y));
      const scan = exp(ly.sub(reveal).div(0.01).pow(2).negate()).mul(building).mul(upright);
      const brightness = mix(float(0.4), float(1), fresh).mul(seen);
      let shown: F = brightness.mul(built).mul(side);
      if (kind === "core") {
        // The inner edges of thick glass: the back of the block seen through its front, a faint
        // second outline inside the first. Lines only.
        rgb = glowColor.mul(rim.mul(0.16).add(inner.mul(0.06)));
        shown = shown.mul(frontFacing.select(float(0.35), float(1)));
      }
      rgb = rgb.mul(shown);
      if (kind === "block") rgb = rgb.add(mix(u.color2, white, 0.4).mul(scan.mul(seen).mul(1.2)));
      if (kind === "mirror") {
        // Seen in the floor: dim, and gone a little way below the block.
        rgb = rgb.mul(exp(p.y.add(0.5).mul(-4.2)).mul(0.09));
      }
      material.colorNode = rgb;
      material.opacityNode = ends.mul(u.opacity);
      return material;
    };

    const blocks = new InstancedMesh(blockGeometry, blockMaterial("block"), MAX);
    blocks.instanceMatrix.setUsage(DynamicDrawUsage);
    blocks.frustumCulled = false;
    blocks.renderOrder = 3;
    rig.add(blocks);
    const mirrored = showReflection ? new InstancedMesh(blockGeometry, blockMaterial("mirror"), MAX) : null;
    // The inner outline, a little smaller than the block.
    const cores = low ? null : new InstancedMesh(blockGeometry, blockMaterial("core"), MAX);
    if (cores) {
      cores.instanceMatrix.setUsage(DynamicDrawUsage);
      cores.frustumCulled = false;
      cores.renderOrder = 2;
      rig.add(cores);
    }
    if (mirrored) {
      mirrored.instanceMatrix.setUsage(DynamicDrawUsage);
      mirrored.frustumCulled = false;
      mirrored.renderOrder = 1;
      rig.add(mirrored);
    }

    // ---- The wire ---------------------------------------------------------------------------------
    // One hairline through the centres of all the blocks and on to the right edge, where the data
    // comes from. A single quad: the shader draws the line, its glow, the sockets where it meets
    // the glass, the glow of the feed and the pulse of confirmation.
    const HALF = 16;
    const wireMaterial = (mirror: boolean) => {
      const material = new MeshBasicNodeMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: AdditiveBlending,
        side: DoubleSide,
      });
      const at = uv();
      const x = mix(wireL, wireR, at.x);
      const d = abs(at.y.sub(0.5)).mul(HALF * 2);
      const core = exp(d.mul(d).div(-0.32));
      const halo = exp(d.mul(d).div(-16));
      const half = blockPx.mul(0.5);
      // Position relative to the nearest locked block: slot 0 is the newest, negative to the left.
      const rel = x.sub(newestX);
      const slot = rel.div(spacing).add(0.5).floor();
      const local = rel.sub(slot.mul(spacing));
      const locked = smoothstep(0.6, 0.4, slot);
      const inBlock = smoothstep(half.add(1.5), half.sub(1.5), abs(local)).mul(locked);
      const inForm = smoothstep(half.add(1.5), half.sub(1.5), abs(x.sub(formX))).mul(formShown);
      // Sockets: a small point where the line enters and leaves each face.
      const face = abs(abs(local).sub(half));
      const socket = exp(face.mul(face).div(-3)).mul(locked).mul(0.55);
      // The incoming side, right of the newest block: while the packets run in, the line warms
      // up, brightest toward the right edge where the data comes from.
      const incoming = smoothstep(half.sub(2), half.add(10), rel);
      const packets = incoming.mul(feed).mul(smoothstep(formX.sub(half), wireR, x).mul(0.3).add(0.12));
      const pulse = exp(x.sub(pulseX).div(spacing.mul(0.32)).pow(2).negate()).mul(pulseAmp).mul(float(1).sub(incoming));
      // Older links dim toward the left.
      const fade = mix(float(0.35), float(1), smoothstep(newestX.sub(spacing.mul(4.5)), newestX, x));
      const dim = float(1).sub(inBlock.mul(0.55)).sub(inForm.mul(0.45));
      const base = core.mul(0.62).add(halo.mul(0.13)).mul(dim).mul(fade).mul(float(0.75).add(incoming.mul(0.25)));
      const hot = packets.mul(core.mul(1.2).add(halo.mul(0.3))).add(pulse.mul(core.mul(1.1).add(halo.mul(0.35))));
      const white = vec3(1, 1, 1);
      let rgb = mix(u.color, u.color2, core.mul(0.7).add(0.15)).mul(base);
      rgb = rgb.add(mix(u.color2, white, 0.5).mul(hot)).add(mix(u.color2, white, 0.3).mul(socket.mul(core.add(halo.mul(0.4))).mul(0.9).mul(fade)));
      if (mirror) rgb = rgb.mul(0.09);
      material.colorNode = rgb;
      material.opacityNode = ends.mul(u.opacity);
      return material;
    };
    const wireGeometry = new PlaneGeometry(1, 1);
    const wire = new Mesh(wireGeometry, wireMaterial(false));
    wire.frustumCulled = false;
    wire.renderOrder = 2;
    rig.add(wire);
    const wireMirror = showReflection ? new Mesh(wireGeometry, wireMaterial(true)) : null;
    if (wireMirror) {
      wireMirror.frustumCulled = false;
      wireMirror.renderOrder = 0;
      rig.add(wireMirror);
    }

    // ---- Hashes -----------------------------------------------------------------------------------
    // Each block carries its height and a short hash on the front face, drawn into a canvas atlas
    // at four to five times the size it shows at, mipmapped, so it stays crisp at DPR 2.
    let atlas: CanvasTexture | null = null;
    let labels: InstancedMesh | null = null;
    const labelData = new Float32Array(MAX * 4);
    const labelAttr = new InstancedBufferAttribute(labelData, 4);
    labelAttr.setUsage(DynamicDrawUsage);
    /** Which block each cell holds; EMPTY before the first draw (block numbers can be negative). */
    const EMPTY = -0x7fffffff;
    const cellOf = new Int32Array(CELLS).fill(EMPTY);
    const canvas = showHash ? document.createElement("canvas") : null;
    const g = canvas?.getContext("2d") ?? null;
    let mono = "ui-monospace, monospace";
    const drawCell = (n: number) => {
      if (!g || !atlas) return;
      const cell = ((n % CELLS) + CELLS) % CELLS;
      const x = (cell % COLS) * CELL_W;
      const y = Math.floor(cell / COLS) * CELL_H;
      g.clearRect(x, y, CELL_W, CELL_H);
      g.textBaseline = "alphabetic";
      g.fillStyle = "rgba(255,255,255,0.5)";
      g.font = `500 34px ${mono}`;
      g.fillText(heightOf(n), x + 8, y + 48);
      g.fillStyle = "rgba(255,255,255,1)";
      g.font = `500 40px ${mono}`;
      g.fillText(hashOf(n), x + 8, y + 104);
      cellOf[cell] = n;
      atlas.needsUpdate = true;
    };
    if (canvas && g) {
      canvas.width = CELL_W * COLS;
      canvas.height = CELL_H * ROWS;
      atlas = new CanvasTexture(canvas);
      // Rows are read from the top of the canvas.
      atlas.flipY = false;
      atlas.anisotropy = 8;
      atlas.minFilter = LinearMipmapLinearFilter;
      atlas.generateMipmaps = true;
      const material = new MeshBasicNodeMaterial({
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: AdditiveBlending,
      });
      const look = instancedBufferAttribute<"vec4">(labelAttr, "vec4");
      const at = uv();
      const ink = texture(atlas, vec2(look.x.add(at.x).div(COLS), look.y.add(float(1).sub(at.y)).div(ROWS))).a;
      // The hash types itself on, left to right, once the block has locked.
      const typed = smoothstep(look.w.mul(1.08), look.w.mul(1.08).sub(0.05), at.x);
      material.colorNode = mix(u.color, u.color2, 0.72).mul(1.15);
      material.opacityNode = ink.mul(typed).mul(look.z).mul(ends).mul(u.opacity);
      labels = new InstancedMesh(new PlaneGeometry(1, 1), material, MAX);
      labels.instanceMatrix.setUsage(DynamicDrawUsage);
      labels.frustumCulled = false;
      labels.renderOrder = 4;
      rig.add(labels);
      // The page's mono face, once it has loaded; redraw every cell then.
      const family = getComputedStyle(document.documentElement).getPropertyValue("--font-jetbrains").trim();
      if (family) {
        mono = `${family}, ui-monospace, monospace`;
        void document.fonts
          ?.load(`500 40px ${family}`, `0x9f${ELLIPSIS}`)
          .then(() => {
            cellOf.fill(EMPTY);
          })
          .catch(() => undefined);
      }
    }

    // ---- Packets ----------------------------------------------------------------------------------
    // Each packet has a place on an edge of the coming block. They come in bursts, like frames
    // over a socket, and the bursts carry the bottom first, so the scan plane that follows them up
    // always finds them in place.
    const target = new Float32Array(PACKETS * 3);
    const delay = new Float32Array(PACKETS);
    const size = new Float32Array(PACKETS);
    const wobble = new Float32Array(PACKETS);
    for (let i = 0; i < PACKETS; i++) {
      const edge = Math.floor(random() * 12);
      const axis = Math.floor(edge / 4);
      const sa = edge & 1 ? 0.49 : -0.49;
      const sb = edge & 2 ? 0.49 : -0.49;
      const along = random() - 0.5;
      const pt = axis === 0 ? [along, sa, sb] : axis === 1 ? [sa, along, sb] : [sa, sb, along];
      target.set(pt, i * 3);
      const h = pt[1] + 0.5;
      delay[i] = 0.08 + 0.9 * (h * 0.74 + random() * 0.26);
      size[i] = 0.85 + random() ** 2 * 1.25;
      wobble[i] = random() * Math.PI * 2;
    }
    {
      // Group the packets into bursts in the order they were due.
      const BURSTS = phone ? 7 : 9;
      const order = [...delay.keys()].sort((a, b) => delay[a] - delay[b]);
      order.forEach((i, rank) => {
        const burst = Math.floor((rank * BURSTS) / PACKETS);
        delay[i] = 0.08 + (0.9 * (burst + 0.5)) / BURSTS + (random() - 0.5) * 0.035;
      });
    }
    const packetPos = new Float32Array(PACKETS * 4);
    const packetLook = new Float32Array(PACKETS * 4);
    const packetPosAttr = new InstancedBufferAttribute(packetPos, 4);
    packetPosAttr.setUsage(DynamicDrawUsage);
    const packetLookAttr = new InstancedBufferAttribute(packetLook, 4);
    packetLookAttr.setUsage(DynamicDrawUsage);
    {
      // look: x angle on screen, y alpha, z heat (white-hot in flight), w stretch.
      const pos = instancedBufferAttribute<"vec4">(packetPosAttr, "vec4");
      const look = instancedBufferAttribute<"vec4">(packetLookAttr, "vec4");
      const material = new SpriteNodeMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending });
      material.positionNode = pos.xyz;
      // The visible dot is about a third of the sprite: the gaussian falls to zero at its edge.
      material.scaleNode = vec2(pos.w.mul(look.w), pos.w).mul(2.8);
      material.rotationNode = look.x;
      const r = uv().sub(0.5).mul(2);
      const rr = dot(r, r);
      const edge = clamp(float(1).sub(rr), 0, 1);
      material.colorNode = mix(u.color2, vec3(1, 1, 1), look.z.mul(0.55));
      material.opacityNode = exp(rr.mul(-4.5)).mul(edge).mul(look.y).mul(ends).mul(u.opacity);
      const sprite = new Sprite(material);
      sprite.count = PACKETS;
      sprite.frustumCulled = false;
      sprite.renderOrder = 5;
      rig.add(sprite);
    }

    // ---- Light ------------------------------------------------------------------------------------
    // The soft flash of a lock, and its reflection in the floor.
    const flashAt = uniform(new Vector3());
    const flashSize = uniform(200);
    const flashAmount = uniform(0);
    /** The unseen glossy floor the chain stands over, rig px. */
    const floorY = uniform(-100);
    const glow = (mirror: boolean) => {
      const material = new SpriteNodeMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending });
      material.positionNode = mirror ? flashAt.mul(vec3(1, -1, 1)).add(vec3(0, floorY.mul(2), 0)) : flashAt;
      material.scaleNode = vec2(flashSize, mirror ? flashSize.mul(0.5) : flashSize);
      const r = uv().sub(0.5).mul(2);
      const rr = dot(r, r);
      material.colorNode = mix(u.color2, vec3(1, 1, 1), 0.25);
      material.opacityNode = exp(rr.mul(-4)).mul(clamp(float(1).sub(rr), 0, 1)).mul(flashAmount).mul(mirror ? 0.25 : 1).mul(ends).mul(u.opacity);
      const sprite = new Sprite(material);
      sprite.frustumCulled = false;
      sprite.renderOrder = 6;
      return sprite;
    };
    rig.add(glow(false));
    if (showReflection) rig.add(glow(true));

    // Dust in the air around the chain: a few dim motes drifting left with the history.
    {
      const data = new Float32Array(MOTES * 4);
      for (let i = 0; i < MOTES; i++) data.set([random(), random(), random(), 0.6 + random() ** 3 * 1.6], i * 4);
      const mote = instancedBufferAttribute<"vec4">(new InstancedBufferAttribute(data, 4), "vec4");
      const material = new SpriteNodeMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending });
      const spanX = spacing.mul(7);
      const x = fract(mote.x.sub(clock.mul(0.006).mul(mote.w))).sub(0.5).mul(spanX).add(formX.sub(spacing.mul(2.5)));
      const y = mote.y.sub(0.5).mul(blockPx.mul(2.6)).add(clock.mul(1.2).add(mote.x.mul(40)).sin().mul(4));
      const z = mote.z.sub(0.55).mul(blockPx.mul(4));
      material.positionNode = vec3(x, y, z);
      material.scaleNode = vec2(mote.w, mote.w).mul(3.4);
      const r = uv().sub(0.5).mul(2);
      const rr = dot(r, r);
      material.colorNode = mix(u.color, u.color2, mote.y);
      material.opacityNode = exp(rr.mul(-3.5)).mul(clamp(float(1).sub(rr), 0, 1)).mul(0.28).mul(ends).mul(u.opacity);
      const sprite = new Sprite(material);
      sprite.count = MOTES;
      sprite.frustumCulled = false;
      sprite.renderOrder = 0;
      rig.add(sprite);
    }

    place(root, { fit: "none", replace: true });

    onDispose(() => {
      atlas?.dispose();
      blockGeometry.dispose();
      wireGeometry.dispose();
    });

    // ---- Layout -----------------------------------------------------------------------------------
    /** Rest pose of the rig: the chain turned so its right end comes toward the viewer. */
    const YAW = phone ? -0.36 : -0.46;
    const PITCH = phone ? 0.16 : 0.2;
    let lastW = 0;
    let lastH = 0;
    let B = 120;
    let S = 220;
    let xForm = 300;
    let xStart = 900;
    let lift = 0;
    const v3 = new Vector3();
    /** Screen x (CSS px from the box centre) of a point on the chain's axis, at the rest pose. */
    const screenX = (x: number) => {
      v3.set(x, 0, 0).applyEuler(rig.rotation);
      return (v3.x * EYE) / (EYE - v3.z);
    };
    const layout = (W: number, H: number) => {
      lastW = W;
      lastH = H;
      // Block size from the height of the box, held back on narrow boxes.
      B = Math.max(28, Math.min(H * (phone ? 0.25 : 0.22), W * (phone ? 0.19 : 0.105)));
      S = B * 2.15;
      // The forming slot stands right of centre; the wire leaves it to the right edge.
      rig.rotation.set(PITCH, YAW, 0);
      const goal = W * (phone ? 0.25 : 0.27);
      let lo = 0;
      let hi = W;
      for (let i = 0; i < 24; i++) {
        const m = (lo + hi) / 2;
        if (screenX(m) < goal) lo = m;
        else hi = m;
      }
      xForm = lo;
      lo = xForm;
      hi = xForm + W * 2;
      for (let i = 0; i < 24; i++) {
        const m = (lo + hi) / 2;
        if (screenX(m) < W / 2 + 12) lo = m;
        else hi = m;
      }
      xStart = lo;
      // The chain sits a little above the middle; its reflection fills the space below.
      lift = showReflection ? H * 0.07 : 0;
      blockPx.value = B;
      spacing.value = S;
      formX.value = xForm;
      wireL.value = xForm - S * (MAX + 1);
      wireR.value = xStart + 40;
      wire.scale.set(wireR.value - wireL.value, HALF * 2, 1);
      wire.position.set((wireR.value + wireL.value) / 2, 0, 0);
      floorY.value = -B * 0.5 - B * 0.3;
      if (wireMirror) {
        wireMirror.scale.set(wireR.value - wireL.value, -HALF * 2, 1);
        wireMirror.position.set((wireR.value + wireL.value) / 2, floorY.value * 2, 0);
      }
      flashSize.value = B * 3.4;
      featherL.value = W * (phone ? 0.16 : 0.22);
      featherR.value = W * 0.12;
    };

    const m4 = new Matrix4();
    const q = new Quaternion();
    const scl = new Vector3();
    const pos3 = new Vector3();
    const dir = new Vector3();
    let lookX = 0;
    let lookY = 0;
    // Start a little into a cycle, so the first frame already has packets in flight.
    const START = 0.25;

    return (inp) => {
      const W = inp.width;
      const H = inp.height;
      if (W < 2 || H < 2) return false;
      if (W !== lastW || H !== lastH) layout(W, H);
      const reduced = inp.reducedMotion;
      const k = Math.max(0.5, params.period) / BASE;
      const T = BASE * k;
      // Under reduced motion: the moment after a lock, before the shift, with the flash gone.
      const t = reduced ? LOCK * k + 0.06 : START * k + inp.time;
      const c = Math.floor(t / T);
      const tau = t - c * T;
      const shift = easeInOut((tau - SHIFT_START * k) / ((SHIFT_END - SHIFT_START) * k));
      const reveal = reduced ? 1 : easeInOut((tau - BUILD_START * k) / ((BUILD_END - BUILD_START) * k));
      clock.value = reduced ? 0 : inp.time;

      // The box on screen, for the soft ends.
      const sw = app.stage.width.peek();
      const sh = app.stage.height.peek();
      stageW.value = sw;
      stageH.value = sh;
      boxL.value = inp.x;
      boxR.value = inp.x + W;
      boxB.value = inp.y + H;

      // The camera turns a little after the pointer, and the scroll tilts the chain.
      const pw = inp.pointerWorld;
      const px = reduced || !Number.isFinite(pw.x) ? 0 : Math.max(-1, Math.min(1, pw.x / (sw / 2)));
      const py = reduced || !Number.isFinite(pw.y) ? 0 : Math.max(-1, Math.min(1, pw.y / (sh / 2)));
      const ease = reduced ? 1 : Math.min(1, (inp.delta || 0.016) * 2.4);
      lookX += (px - lookX) * ease;
      lookY += (py - lookY) * ease;
      const scroll = reduced ? 0 : Math.max(-1, Math.min(1, inp.progress * 2 - 1));
      rig.rotation.set(PITCH + lookY * 0.05 - scroll * 0.07, YAW - lookX * 0.08 + scroll * 0.05, 0);
      root.position.set(0, lift, 0);
      sheen.value = 0.15 + (rig.rotation.y - YAW) * 4 + (rig.rotation.x - PITCH) * 3;

      // Blocks: the forming one (sequence c) and the locked ones before it.
      const lockOf = (n: number) => n * T + LOCK * k;
      const flashOf = (n: number) => {
        const since = t - lockOf(n);
        return since > 0 && !reduced ? (1 - Math.exp(-since / 0.035)) * Math.exp(-since / 0.42) : 0;
      };
      // The pulse of confirmation from the newest lock: it runs back along the chain.
      const newest = tau >= LOCK * k ? c : c - 1;
      const since = t - lockOf(newest);
      const pulseSlots = since * 3.1;
      const pulseLife = reduced ? 0 : Math.exp(-since * 0.9) * smooth(since / 0.12);
      const xOf = (n: number) => xForm + (n - c - shift) * S;
      newestX.value = xOf(newest);
      pulseX.value = xOf(newest) - pulseSlots * S;
      pulseAmp.value = pulseLife * 1.1;
      formShown.value = newest === c ? 0 : reveal;
      // Packets run in the wire while the block is being fed.
      feed.value = reduced ? 0 : smooth((tau + 0.3 * k) / (0.3 * k)) * (1 - smooth((tau - FEED_END * k) / (0.4 * k)));

      for (let i = 0; i < MAX; i++) {
        const n = c - i;
        const x = xOf(n);
        const age = (xForm - x) / S;
        const r = n === c ? reveal : 1;
        const fl = flashOf(n);
        const ripple = n < newest ? Math.exp(-(((pulseSlots - (newest - n)) / 0.6) ** 2)) * pulseLife : 0;
        // The block about to leave at the left fades as it goes; the soft ends of the box do the rest.
        const leaving = 1 - smooth((age - (MAX - 2.2)) / 1.0);
        const visible = r > 0 ? leaving : 0;
        const pop = 1 + 0.018 * fl;
        stateData.set([r, fl, age, visible], i * 4);
        extraData[i * 4] = ripple;
        m4.compose(pos3.set(x, 0, 0), q.identity(), scl.set(B * pop, B * pop, B * pop));
        blocks.setMatrixAt(i, m4);
        if (cores) {
          const inset = B * pop * 0.84;
          m4.compose(pos3.set(x, 0, 0), q.identity(), scl.set(inset, inset, inset));
          cores.setMatrixAt(i, m4);
        }
        if (mirrored) {
          m4.compose(pos3.set(x, floorY.value * 2, 0), q.identity(), scl.set(B * pop, -B * pop, B * pop));
          mirrored.setMatrixAt(i, m4);
        }
        if (labels) {
          const cell = ((n % CELLS) + CELLS) % CELLS;
          if (cellOf[cell] !== n) drawCell(n);
          const typed = reduced ? 1 : n < c ? clamp01((t - lockOf(n) - 0.12) / 0.55) : 0;
          labelData.set([cell % COLS, Math.floor(cell / COLS), visible * (0.55 + 0.45 * Math.exp(-Math.max(0, age) * 0.4)), typed], i * 4);
          m4.compose(pos3.set(x - B * 0.08, -B * 0.315, B * 0.5 + 0.4), q.identity(), scl.set(B * 0.6, B * 0.15, 1));
          labels.setMatrixAt(i, m4);
        }
      }
      // The block that has just locked only types its hash after the flash.
      if (labels && newest === c) {
        const typed = reduced ? 1 : clamp01((t - lockOf(c) - 0.12) / 0.55);
        labelData[3] = typed;
      }
      stateAttr.needsUpdate = true;
      extraAttr.needsUpdate = true;
      blocks.instanceMatrix.needsUpdate = true;
      if (mirrored) mirrored.instanceMatrix.needsUpdate = true;
      if (cores) cores.instanceMatrix.needsUpdate = true;
      if (labels) {
        labelAttr.needsUpdate = true;
        labels.instanceMatrix.needsUpdate = true;
      }

      // The flash of the newest lock, at the block as it starts to move.
      const fl = flashOf(newest);
      flashAt.value.set(xOf(newest), 0, 0);
      flashAmount.value = fl * 0.07;

      // Packets of the coming block: the next cycle's start before the slot is free.
      const lead = 0.5 * k;
      const ahead = tau >= T - lead;
      const tp = ahead ? tau - T : tau;
      const cycle = ahead ? c + 1 : c;
      const revealP = ahead || reduced ? 0 : reveal;
      // Directions on screen: the wire's, and the rotation for the spread to the edges.
      rig.updateMatrixWorld();
      const rot = rig.rotation;
      dir.set(1, 0, 0).applyEuler(rot);
      const wireAngle = Math.atan2(dir.y, dir.x);
      const sock = xForm + B * 0.5;
      const travel = TRAVEL * k;
      const spread = SPREAD * k;
      const jit = seeded(cycle * 131 + 7);
      for (let i = 0; i < PACKETS; i++) {
        const o = i * 4;
        const ja = jit();
        const jb = jit();
        const arrive = delay[i] * k + (ja - 0.5) * 0.06 * k;
        const leave = arrive - travel;
        if (reduced || tp < leave) {
          packetLook[o + 1] = 0;
          continue;
        }
        const tx = xForm + target[i * 3] * B;
        const ty = target[i * 3 + 1] * B;
        const tz = target[i * 3 + 2] * B;
        let x: number;
        let y: number;
        let z: number;
        let angle = wireAngle;
        let stretch = 1;
        let heat = 0.35;
        let alpha = 1;
        if (tp < arrive) {
          // In the wire: a streak running in from the right edge.
          const s = (tp - leave) / travel;
          const off = (1 - s) * 0.07 * B;
          x = xStart + (sock - xStart) * s;
          y = Math.sin(wobble[i]) * off * (jb - 0.5) * 2;
          z = Math.cos(wobble[i]) * off;
          stretch = 4.5;
          heat = 1;
          alpha = 0.9;
        } else if (tp < arrive + spread) {
          // From the socket out to its place on an edge, slowing as it lands.
          const s = (tp - arrive) / spread;
          const e = easeOut(s);
          x = sock + (tx - sock) * e;
          y = ty * e + Math.sin(s * Math.PI) * B * 0.06 * (jb - 0.5);
          z = tz * e;
          dir.set(tx - sock, ty, tz).applyEuler(rot);
          angle = Math.atan2(dir.y, dir.x);
          stretch = 1 + 1.3 * (1 - e);
          heat = 1 - 0.6 * e;
        } else {
          // In place: a point of light on the edge, twinkling until the scan plane takes it.
          x = tx;
          y = ty;
          z = tz;
          heat = 0.4 + 0.25 * Math.sin(inp.time * 9 + wobble[i] * 3);
        }
        alpha *= 1 - smooth((revealP - (target[i * 3 + 1] + 0.5)) / 0.05);
        if (!ahead) alpha *= 1 - smooth((tp - LOCK * k) / (0.12 * k));
        packetPos[o] = x;
        packetPos[o + 1] = y;
        packetPos[o + 2] = z;
        packetPos[o + 3] = size[i] * (phone ? 0.9 : 1);
        packetLook[o] = angle;
        packetLook[o + 1] = alpha;
        packetLook[o + 2] = heat;
        packetLook[o + 3] = stretch;
      }
      packetPosAttr.needsUpdate = true;
      packetLookAttr.needsUpdate = true;
      // With the animate policy driving the frames, settle only the pointer here.
      return !reduced && (Math.abs(px - lookX) > 0.002 || Math.abs(py - lookY) > 0.002);
    };
  },
);
