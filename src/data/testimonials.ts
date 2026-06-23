import type { LocalizedString } from "./career";

export interface Testimonial {
  id: string;
  stationId: "teknolab" | "whitewill" | "voton";
  author: string;
  role: LocalizedString;
  company: string;
  photo: string;
  text: LocalizedString;
  contactLink?: string;
  isPlaceholder?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "t-whitewill",
    stationId: "whitewill",
    author: "Konstantin Sakharov",
    role: { ru: "Техлид", en: "Tech Lead" },
    company: "Whitewill",
    photo: "/images/konstantin.png",
    text: {
      ru: "Михаил — один из тех редких разработчиков, которому можно доверить не только задачу, но и целый кусок архитектуры продукта. На Whitewill он участвовал в развитии поиска, каталогов, автоматизации данных и миграции на современный стек — всегда с пониманием бизнес-контекста и последствий своих решений. С ним можно обсуждать техдолг, масштабирование на новые рынки и сложные компромиссы — и получать взвешенные, рабочие ответы.",
      en: "Mikhail is one of those rare developers you can trust not just with a task, but with an entire slice of product architecture. At Whitewill he helped evolve search, catalogs, data automation, and migration to a modern stack — always with business context and awareness of the consequences of his decisions. You can discuss tech debt, scaling to new markets, and tough trade-offs with him and get balanced, practical answers.",
    },
  },
  {
    id: "t-voton",
    stationId: "voton",
    author: "Nikita Khavronin",
    role: { ru: "Техлид", en: "Tech Lead" },
    company: "VOTON",
    photo: "/images/nikita.png",
    text: {
      ru: "Когда мы строили VOTON с нуля, Михаил заложил frontend-архитектуру, на которой команда спокойно росла. Он умеет совмещать скорость разработки с качеством: типизация, процессы, интеграция с backend — всё на уровне, который редко встретишь на раннем этапе продукта. Рекомендую как сильного инженера для сложных продуктов, где важны и скорость, и фундамент.",
      en: "When we built VOTON from scratch, Mikhail laid the frontend architecture the team could grow on confidently. He balances delivery speed with quality: typing, processes, backend integration — all at a level you rarely see in an early-stage product. I recommend him as a strong engineer for complex greenfield products where both speed and foundation matter.",
    },
  },
  {
    id: "t-teknolab",
    stationId: "teknolab",
    author: "Nuraly Shohanovich",
    role: { ru: "CEO", en: "CEO" },
    company: "Teknolab",
    photo: "/images/nuraly.png",
    text: {
      ru: "Михаил пришёл к нам как разработчик и быстро вырос в человека, который отвечает за результат целиком. Он делал продукт для продавцов Kaspi.kz, автоматизацию данных, fullstack-решения для наших клиентов — и каждый раз приносил не просто код, а рабочий инструмент для бизнеса. Именно такие специалисты становятся основой сильных команд и долгосрочных продуктов.",
      en: "Mikhail joined us as a developer and quickly grew into someone who owns the full outcome. He built a product for Kaspi.kz sellers, data automation, and fullstack solutions for our clients — each time delivering not just code, but a tool that actually worked for the business. That's the kind of specialist strong teams and lasting products are built on.",
    },
  },
];

export function getTestimonialForStation(stationId: string) {
  return testimonials.find((t) => t.stationId === stationId);
}
