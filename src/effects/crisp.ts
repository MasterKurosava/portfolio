// crisp: a picture drawn on the canvas as sharp as the browser draws it. The copy of an <img> is
// sampled with mipmaps, so a picture shown a little smaller than its file (a 1200 px plate in a
// 924 px slot on a screen at 150%) blends in the half-size level and its small type goes soft.
// Without mipmaps it is sampled from the full picture alone: sharp down to half size, which the
// `srcset` of the page keeps it above. The effect changes nothing else; it sits next to the
// element's other effects (`data-dio="tilt crisp"`) or alone on a picture another effect moves.
import { effect } from "@dioramajs/diorama";
import { LinearFilter } from "three/webgpu";

export default effect({}, { media: true }, ({ map }) => {
  if (map.minFilter !== LinearFilter || map.generateMipmaps) {
    map.minFilter = LinearFilter;
    map.generateMipmaps = false;
    map.needsUpdate = true;
  }
});
