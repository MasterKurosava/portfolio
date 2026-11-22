// assembly: the stack as a deck of plates. The layout is the plain list: a plate in the right
// column of each row, its description on the left. While the list comes up the screen the plates
// are drawn as one isometric pile in the plates' column: the pile rides just under the top of the
// list, then holds still low on the screen, under the place where the rows land. As a row comes up
// towards the middle of the screen its plate lifts off the top of the deck, stands up, grows to
// size and settles into its slot, and the row's description fades in with it. By the time a row
// reaches the middle its plate is upright and in place and its text fully shown; the next plate
// leaves the deck only after that. On a narrow screen there is no room for a deck: each plate
// tilts back in its own slot and stands up before it reaches the middle, and the copy never fades.
import { effect } from "@dioramajs/diorama";

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

function smooth(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

function smoother(t: number): number {
  const x = clamp01(t);
  return x * x * x * (x * (x * 6 - 15) + 10);
}

/** max(a, b) with the corner rounded over `k` px, so the deck eases into its hold. */
function softMax(a: number, b: number, k: number): number {
  return (a + b + Math.sqrt((a - b) * (a - b) + k * k)) / 2;
}

export default effect(
  { items: "img", row: "li", deck: 0.46, gap: 0.16, tilt: 56, turn: 38, lift: 40 },
  (ctx) => {
    const { layers, params, pose, onDispose } = ctx;
    const plates = layers(params.items);
    const written = new Map<HTMLElement, string>();

    // `--away` on a plate's row: 1 while the plate is in the deck, 0 once it is in its slot. The
    // row's description fades with it (globals.css); without the effect it stays 0.
    const setAway = (element: Element, value: number) => {
      const row = element.closest<HTMLElement>(params.row);
      if (!row) return;
      const text = value.toFixed(3);
      if (written.get(row) === text) return;
      written.set(row, text);
      row.style.setProperty("--away", text);
    };
    onDispose(() => {
      for (const row of written.keys()) row.style.removeProperty("--away");
      written.clear();
    });

    return (input) => {
      const viewWidth = window.innerWidth;
      const viewHeight = window.innerHeight;
      const middle = viewHeight / 2;
      const tilt = (-params.tilt * Math.PI) / 180;
      const turn = (params.turn * Math.PI) / 180;

      if (input.reducedMotion) {
        plates.forEach((plate) => setAway(plate.element, 0));
        return;
      }

      if (viewWidth < 768) {
        plates.forEach((plate) => {
          setAway(plate.element, 0);
          const box = plate.input;
          // Lying back while low on the screen, upright once its middle is at 60% of the height.
          const w = smooth((box.y + box.height / 2 - viewHeight * 0.6) / (viewHeight * 0.4));
          if (w > 0) pose(plate, { rotateX: tilt * 0.7, scale: 0.92 }, w);
        });
        return;
      }

      const first = plates[0];
      if (!first) return;
      const { width, height } = first.input;
      const scale = params.deck;
      // A plate settles a little under the middle, so it is in place before its row gets there.
      const land = middle + viewHeight * 0.025;
      // Half the height a turned, tilted plate covers on screen in the deck.
      const half = scale * (width / 2 * Math.sin(turn) + height / 2 * Math.cos(turn)) * Math.cos(tilt);
      // The deck holds just under a plate that has landed, so the two never overlap.
      const hold = land + height / 2 + viewHeight * 0.02 + half;
      const travel = hold - land;
      const step = height * scale * params.gap;
      // The top of the deck follows the first slot while the list is low, then stays at the hold.
      const top = softMax(first.input.y + height / 2, hold, 90);
      const deckX = first.input.x + width / 2;

      // Plates gone from the deck so far, fractional while one is in flight: the rest move up.
      let gone = 0;
      plates.forEach((plate, i) => {
        const box = plate.input;
        const slotX = box.x + box.width / 2;
        const slotY = box.y + box.height / 2;
        // 0 in the deck, 1 in the slot: the flight runs while the slot climbs from the hold to the
        // landing line.
        const p = clamp01((hold - slotY) / travel);
        const spot = i - gone;
        gone += p;
        setAway(plate.element, 1 - smooth((p - 0.45) / 0.55));
        if (p >= 1) return;

        const move = smoother(p);
        const stand = smooth(p / 0.85);
        const grow = smooth(p / 0.9);
        const deckY = top + spot * step;
        const x = deckX + (slotX - deckX) * move;
        const y = deckY + (slotY - deckY) * move;
        pose(
          plate,
          {
            x: x - viewWidth / 2,
            y: middle - y,
            // Lifts towards the viewer on the way and settles back into the page.
            z: params.lift * Math.sin(Math.PI * move),
            rotateX: tilt * (1 - stand),
            rotateZ: turn * (1 - stand),
            scale: scale + (1 - scale) * grow,
            // Copies draw in page order; lifted the other way round, the deck is a pile with the
            // next plate on top, and a plate in flight passes over the rest. Back to the page's
            // level once it has landed, where nothing overlaps it.
            above: plates.length - i,
          },
          1,
        );
      });
    };
  },
);
