import type { LocalizedString } from "./career";

export interface ArchNode {
  id: string;
  label: string;
  experience: LocalizedString;
  projects?: LocalizedString[];
}

export const architectureNodes: ArchNode[] = [
  {
    id: "frontend",
    label: "Frontend",
    experience: {
      ru: "React, Next.js, Vue 3, TypeScript, Inertia.js — SPA, SSR и сложные интерфейсы с анимацией и real-time обновлениями.",
      en: "React, Next.js, Vue 3, TypeScript, Inertia.js — SPA, SSR, and complex interfaces with animation and real-time updates.",
    },
    projects: [
      { ru: "Whitewill", en: "Whitewill" },
      { ru: "VOTON", en: "VOTON" },
      { ru: "Teknolab", en: "Teknolab" },
    ],
  },
  {
    id: "backend",
    label: "Backend integration",
    experience: {
      ru: "Интеграция с Laravel, Django, Node.js: проектирование контрактов, DTO-слой, WebSockets, безопасная передача данных.",
      en: "Integration with Laravel, Django, Node.js: contract design, DTO layer, WebSockets, secure data transfer.",
    },
    projects: [
      { ru: "Whitewill", en: "Whitewill" },
      { ru: "VOTON", en: "VOTON" },
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    experience: {
      ru: "Сервисный слой, фабрики по регионам, миграция legacy без остановки бизнеса, снижение технического долга.",
      en: "Service layer, regional factories, legacy migration without downtime, reducing technical debt.",
    },
    projects: [{ ru: "Whitewill", en: "Whitewill" }],
  },
  {
    id: "performance",
    label: "Performance & SEO",
    experience: {
      ru: "SSR, lazy props, кэширование тяжёлых страниц, оптимизация каталогов и поиска для органического трафика.",
      en: "SSR, lazy props, caching heavy pages, catalog and search optimization for organic traffic.",
    },
    projects: [{ ru: "Whitewill", en: "Whitewill" }],
  },
  {
    id: "testing",
    label: "Quality & Testing",
    experience: {
      ru: "Playwright E2E для критичных пользовательских сценариев, code review, контроль регрессий перед релизом.",
      en: "Playwright E2E for critical user flows, code review, regression control before release.",
    },
    projects: [{ ru: "Whitewill", en: "Whitewill" }],
  },
  {
    id: "devops",
    label: "CI/CD & Infrastructure",
    experience: {
      ru: "Docker, автоматизация релизов, процессы разработки для растущих команд и продуктов.",
      en: "Docker, release automation, development processes for growing teams and products.",
    },
    projects: [
      { ru: "VOTON", en: "VOTON" },
      { ru: "Whitewill", en: "Whitewill" },
    ],
  },
];
