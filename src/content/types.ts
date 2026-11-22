import type { MarketId } from "./site";

export type Locale = "ru" | "en";

export interface SpecRow {
  label: string;
  value: string;
}

export interface Quote {
  name: string;
  role: string;
  company: string;
  photo: string;
  telegram: string;
  telegramHref: string;
  /** Verbatim sentences from the recommendation, shown on the home page. */
  excerpt: string[];
  /** The whole recommendation, verbatim. */
  full: string;
}

export interface Part {
  title: string;
  text: string;
}

export interface Content {
  locale: Locale;
  meta: {
    title: string;
    description: string;
    ogAlt: string;
    keywords: string[];
  };
  ui: {
    skip: string;
    nav: { spec: string; work: string; stack: string; projects: string; contact: string };
    menu: string;
    lang: { label: string; other: string; otherName: string };
    designations: { show: string; hide: string; hint: string };
    of: string;
    doc: string;
    developer: string;
    revision: string;
    more: string;
    full: string;
    opens: string;
    actions: { telegram: string; call: string; cv: string; email: string; whatsapp: string; write: string };
    whatsappText: string;
    mailSubject: string;
  };
  hero: {
    name: string;
    role: string;
    lead: string;
    now: string;
    numbers: { value: string; from?: string; label: string }[];
    specCaption: string;
    spec: SpecRow[];
    /** The stack as chips: the main one lit, the rest quiet. */
    stack: { label: string; main: string[]; alsoLabel: string; also: string[] };
    contactLabel: string;
    photoAlt: string;
    photoCaption: string;
  };
  work: {
    title: string;
    intro: string;
    tableCaption: string;
    columns: { rev: string; period: string; company: string; role: string; main: string };
    rows: { rev: string; period: string; length: string; company: string; place: string; role: string; main: string; href: string }[];
    whitewill: {
      title: string;
      meta: string;
      context: string;
      /** What he did there, one short point each. */
      points: Part[];
      parts: {
        sync: { figure: string; key: string; keyLabel: string; cityAlt: string; cityCaption: string; markers: Record<MarketId, string> };
      };
      link: string;
    };
    voton: {
      title: string;
      meta: string;
      text: string[];
      years: { from: string; fromLabel: string; to: string; toLabel: string };
      link: string;
    };
    teknolab: {
      title: string;
      meta: string;
      text: string[];
      figure: string;
      chart: { caption: string; time: string; competitor: string; seller: string; rows: [string, number, number][] };
    };
    quotes: { whitewill: Quote; voton: Quote; teknolab: Quote };
  };
  stack: {
    title: string;
    intro: string;
    figure: string;
    parts: { pos: string; title: string; text: string; items: string; plateAlt: string }[];
  };
  projects: {
    title: string;
    intro: string;
    diorama: {
      title: string;
      text: string[];
      numbers: { value: string; label: string }[];
      figure: string;
      links: { docs: string; repo: string; npm: string; page: string };
    };
    intouch: { title: string; text: string; figure: string; desktopAlt: string; mobileAlt: string; link: string };
  };
  contact: {
    title: string;
    intro: string;
    rows: { phone: string; telegram: string; whatsapp: string; email: string; cv: string; github: string; hh: string };
    cvHtml: string;
    cvPdf: string;
    referees: string;
  };
  footer: { made: string; source: string; diorama: string };
}
