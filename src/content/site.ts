/** Facts shared by every locale: contacts, links and asset paths. */
export const SITE = {
  origin: "https://kalachev.dev",
  phone: "+7 777 307 84 05",
  phoneHref: "tel:+77773078405",
  telegram: "@MasterKurosava",
  telegramHref: "https://t.me/MasterKurosava",
  whatsappNumber: "77773078405",
  email: "mihailkalchiov@gmail.com",
  github: "https://github.com/MasterKurosava",
  githubHandle: "MasterKurosava",
  /** hh.ru resume link; empty until the user provides it, and the link is hidden while empty. */
  hh: "",
  source: "https://github.com/MasterKurosava/portfolio",
  diorama: {
    repo: "https://github.com/MasterKurosava/diorama",
    docs: "https://dioramajs.dev",
    npm: "https://www.npmjs.com/package/@dioramajs/diorama",
  },
  intouch: "https://intouchping.com/",
  photo: "/images/profile.webp",
} as const;

export function whatsappHref(text: string): string {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export function mailHref(subject: string): string {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;
}

/** Whitewill markets, with the head office first: arcs run from it. */
export const MARKETS = [
  { id: "msk", lat: 55.7558, lng: 37.6173 },
  { id: "dxb", lat: 25.2048, lng: 55.2708 },
  { id: "auh", lat: 24.4539, lng: 54.3773 },
  { id: "rak", lat: 25.8007, lng: 55.9762 },
  { id: "omn", lat: 23.588, lng: 58.3829 },
  { id: "lon", lat: 51.5072, lng: -0.1276 },
  { id: "mia", lat: 25.7617, lng: -80.1918 },
] as const;

export type MarketId = (typeof MARKETS)[number]["id"];
