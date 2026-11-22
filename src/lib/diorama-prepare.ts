// Ported from the owner's InTouch Ping landing, where it was written for the same problem.
// Getting the 3D layer ready before it is seen, so that scrolling never waits for it.
//
// An effect is set up when its element nears the viewport (one viewport ahead). Diorama then
// compiles the element's surface ahead of its first frame, but not the objects the effect places
// itself (sprites, meshes, lines): their render pipelines would be built at their first draw, and
// the GPU holds that frame while it compiles their shaders, up to more than half a second on a
// first visit. Setting up an effect also costs its frame some tens of milliseconds.
//
// So, here: every drawable object is compiled ahead, asynchronously, as soon as its instance runs;
// and once the first screen is up, the effects further down are set up one by one while the page
// is idle and not scrolling, nearest first, so they are ready long before they are reached.
import type { App } from "@dioramajs/diorama";
import type { Object3D, WebGPURenderer } from "three/webgpu";

type Drawable = Object3D & {
  readonly isMesh?: boolean;
  readonly isSprite?: boolean;
  readonly isLine?: boolean;
  readonly isPoints?: boolean;
  readonly material?: unknown;
};

const drawable = (object: Object3D): object is Drawable => {
  const o = object as Drawable;
  return o.isMesh === true || o.isSprite === true || o.isLine === true || o.isPoints === true;
};

// ─── One compile at a time ──────────────────────────────────────────────────
//
// `compileAsync` keeps its progress in one field of the renderer (r187): two compiles under way
// at once break each other, and Diorama's own then fails its effect ("does not compile"). Every
// compile of the renderer goes through one queue; Diorama's (and any other caller's) come before
// the warm-up's, so getting ready ahead never delays what is about to be shown.

type Compile = WebGPURenderer["compileAsync"];
type Job = { run: () => Promise<unknown>; done: (value: unknown) => void; fail: (e: unknown) => void };
type Queue = { first: Job[]; later: Job[]; busy: boolean; compile: Compile };

const queues = new WeakMap<WebGPURenderer, Queue>();
/** What Diorama compiles itself (surfaces, veiled copies): objects and materials. */
const compiledElsewhere = new WeakSet<object>();

function enqueue(q: Queue, run: () => Promise<unknown>, later: boolean): Promise<unknown> {
  return new Promise<unknown>((done, fail) => {
    (later ? q.later : q.first).push({ run, done, fail });
    if (q.busy) return;
    q.busy = true;
    void (async () => {
      for (let job = q.first.shift() ?? q.later.shift(); job; job = q.first.shift() ?? q.later.shift()) {
        try {
          job.done(await job.run());
        } catch (error) {
          job.fail(error);
        }
      }
      q.busy = false;
    })();
  });
}

/** Routes the renderer's compiles through its queue, once; before its first compile. */
function serialize(renderer: WebGPURenderer): Queue {
  const known = queues.get(renderer);
  if (known) return known;
  const compile: Compile = renderer.compileAsync.bind(renderer);
  const q: Queue = { first: [], later: [], busy: false, compile };
  queues.set(renderer, q);
  renderer.compileAsync = ((...args: Parameters<Compile>) => {
    const [object] = args;
    compiledElsewhere.add(object);
    const material = (object as Drawable).material;
    if (material && typeof material === "object") compiledElsewhere.add(material);
    return enqueue(q, () => compile(...args), false);
  }) as Compile;
  return q;
}

/**
 * Compiles every drawable object of the scene ahead of its first draw: after each instance starts
 * running, the objects not seen yet are compiled one at a time. `drained()` settles when idle.
 */
export function warmPipelines(app: App): { drained(): Promise<void> } {
  // The renderer is created when the engine boots: its compiles are queued from the start.
  const adopt = () => {
    const render = app.find("render");
    if (render) serialize(render.renderer);
  };
  adopt();
  app.on("plugin:status", ({ name, status }) => {
    if (name === "render" && status === "running") adopt();
  });

  const seen = new WeakSet<Object3D>();
  let queue: Promise<void> = Promise.resolve();
  let queued = false;

  const run = async (): Promise<void> => {
    queued = false;
    const render = app.find("render");
    if (!render) return;
    const { renderer, camera, scene } = render;
    const q = serialize(renderer);
    const fresh: Drawable[] = [];
    scene.traverse((object) => {
      if (!drawable(object) || seen.has(object)) return;
      seen.add(object);
      fresh.push(object);
    });
    for (const object of fresh) {
      // Gone with its instance meanwhile, or compiled by Diorama itself (a surface, whose
      // material Diorama swaps and disposes on its own schedule).
      const material = object.material as object | undefined;
      if (!object.parent || compiledElsewhere.has(object)) continue;
      if (material && compiledElsewhere.has(material)) continue;
      try {
        // A stand-in with the object's geometry and material: the object itself may be hidden
        // or off screen (three skips those), and is never touched while it may be drawn.
        // Pipelines are cached by geometry layout, material and object kind, so the object's
        // first draw finds its own.
        const proxy = object.clone(false);
        proxy.visible = true;
        proxy.frustumCulled = false;
        await enqueue(q, () => q.compile(proxy, camera, scene), true);
      } catch {
        // Not cloneable, or a shader that does not compile: the object is then compiled at its
        // first draw, as before, where Diorama reports a failure.
      }
    }
  };
  // A warm-up never fails: at worst an object compiles at its first draw.
  const step = () => run().catch(() => {});

  app.on("effects:status", ({ status }) => {
    if (status !== "running" || queued) return;
    queued = true;
    queue = queue.then(step);
  });

  // Settles once no run is queued, runs queued meanwhile included.
  const drained = async (): Promise<void> => {
    for (let last = queue; ; last = queue) {
      await last;
      if (queue === last && !queued) return;
    }
  };
  return { drained };
}

// ─── Setting up ahead ───────────────────────────────────────────────────────

/** Statuses an instance passes through on its way to running. */
const PENDING = new Set(["waiting", "loading"]);
/**
 * Scrolling (wheel, touch, keys, the smooth scroll itself) holds the next setup back this long.
 * A phone reader flicks, pauses a moment and flicks again: a setup in that moment lands in the
 * next flick, so only a real stop counts as quiet.
 */
const QUIET = 600;

const idle = (timeout: number): Promise<void> =>
  new Promise((resolve) => {
    if (typeof requestIdleCallback === "function") requestIdleCallback(() => resolve(), { timeout });
    else setTimeout(resolve, 50);
  });

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * An image or video effect reads its element's pixels: one not loaded yet (a lazy image far
 * below) is left to load when near, as it would be anyway.
 */
const mediaReady = (el: Element): boolean => {
  if (el instanceof HTMLImageElement) return el.complete && el.naturalWidth > 0;
  if (el instanceof HTMLVideoElement) return el.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
  return true;
};

/**
 * Sets up the effects that are still waiting for their elements to near the viewport, one element
 * at a time, nearest first, in idle time while the page is not being scrolled. Starts after
 * `after`; elements that appear later (a route change, a section rendered later) are picked up too.
 */
export function prepareAhead(
  app: App,
  after: Promise<unknown>,
  warm: { drained(): Promise<void> },
): void {
  let scrolled = 0;
  const stamp = () => {
    scrolled = performance.now();
  };
  for (const type of ["scroll", "wheel", "touchmove", "keydown"] as const) {
    window.addEventListener(type, stamp, { passive: true, capture: true });
  }

  // The effects plugin may be missing (failed to start): then there is nothing to prepare.
  const instances = () => app.effects?.instances() ?? [];

  // Each element is set up ahead once; one that stays waiting is left to the observer.
  const tried = new WeakSet<Element>();

  const waiting = (): Element[] => {
    const elements = new Set<Element>();
    for (const instance of instances()) {
      if (instance.status.peek() !== "waiting") continue;
      const el = instance.element;
      if (tried.has(el) || !mediaReady(el)) continue;
      // Not laid out (display: none): it may never be shown, so it waits for the observer.
      if (!el.isConnected || el.getClientRects().length === 0) continue;
      elements.add(el);
    }
    return [...elements];
  };

  const distance = (el: Element): number => {
    const box = el.getBoundingClientRect();
    if (box.bottom < 0) return -box.bottom;
    if (box.top > innerHeight) return box.top - innerHeight;
    return 0;
  };

  const settled = async (el: Element): Promise<void> => {
    const since = performance.now();
    // An element whose media never loads (a lazy image far below) must not hold the rest.
    while (performance.now() - since < 2500) {
      const pending = instances().some((i) => i.element === el && PENDING.has(i.status.peek()));
      if (!pending) break;
      await wait(50);
    }
    await warm.drained();
  };

  let running = false;
  let again = false;
  const pump = async (): Promise<void> => {
    if (running) {
      again = true;
      return;
    }
    running = true;
    try {
      do {
        again = false;
        for (;;) {
          await idle(1000);
          if (performance.now() - scrolled < QUIET) {
            await wait(QUIET);
            continue;
          }
          const next = waiting().sort((a, b) => distance(a) - distance(b))[0];
          if (!next) break;
          tried.add(next);
          // Diorama's own switch: an eager element is set up without waiting for the observer.
          // Diorama notices it on the elements it watches already; on the others (an effect that
          // another effect attached) a scan makes it look.
          next.setAttribute("data-dio-load", "eager");
          app.effects?.scan(next);
          await settled(next);
        }
      } while (again);
    } finally {
      running = false;
    }
  };

  void Promise.all([after, app.start()])
    .then(() => {
      app.on("effects:status", ({ status }) => {
        if (status === "waiting") void pump();
      });
      void pump();
    })
    // The app did not start: the page stays as it is, in 2D.
    .catch(() => {});
}
