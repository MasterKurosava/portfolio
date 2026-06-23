import type { LocalizedString } from "./career";

export interface ExpertiseCardData {
  id: string;
  title: LocalizedString;
  technologies: string[];
  description: LocalizedString;
  results: LocalizedString[];
  accent: string;
  glow: string;
}

export const expertiseCards: ExpertiseCardData[] = [
  {
    id: "backend",
    title: { ru: "Enterprise Backend", en: "Enterprise Backend" },
    technologies: ["Laravel", "PHP", "REST API", "MySQL", "WebSockets"],
    description: {
      ru: "Проектировал и развивал серверную часть крупных продуктов: выстраивал сервисный слой вместо монолитных контроллеров, типизированные контракты между backend и frontend, мультирегиональную бизнес-логику и интеграции с внешними системами. Настраивал автоматические пайплайны обработки каталогов, real-time через WebSockets и backend для партнёрских платформ — всё это в production, под реальной нагрузкой и с требованием стабильности при ежедневных обновлениях данных.",
      en: "Designed and evolved the server side of large products: service layers instead of monolithic controllers, typed contracts between backend and frontend, multi-region business logic, and external integrations. Built automated catalog processing pipelines, real-time via WebSockets, and backend for partner platforms — all in production, under real load, with stability required for daily data updates.",
    },
    results: [
      {
        ru: "Мультирегиональная платформа недвижимости — единый продукт для 7+ рынков с разной логикой, валютами и языками",
        en: "Multi-region real estate platform — one product for 7+ markets with distinct logic, currencies, and languages",
      },
      {
        ru: "Полностью автоматическая выгрузка каталога: расписание синхронизаций, цепочка обработчиков после импорта, пересчёт цен и переводов",
        en: "Fully automated catalog export: sync schedules, post-import handler chains, price and translation recalculation",
      },
      {
        ru: "Поисковая и фильтрационная система с разными правилами для стран и типов недвижимости",
        en: "Search and filtering system with different rules per country and property type",
      },
      {
        ru: "Парсинг и автоматизация данных для e-commerce и коммерческих продуктов в Teknolab",
        en: "Data parsing and automation for e-commerce and commercial products at Teknolab",
      },
    ],
    accent: "#00d4ff",
    glow: "rgba(0, 212, 255, 0.25)",
  },
  {
    id: "frontend",
    title: { ru: "Modern Frontend", en: "Modern Frontend" },
    technologies: ["Vue 3", "React", "Next.js", "TypeScript", "Inertia.js"],
    description: {
      ru: "Разрабатывал клиентские приложения, которые остаются быстрыми и поддерживаемыми по мере роста продукта: публичные каталоги, сложные формы поиска, админ-панели и Web3-интерфейсы. Вёл миграцию legacy на Inertia.js + Vue 3, внедрял SSR для SEO, типизацию на TypeScript и архитектуру компонентов, где бизнес-логика не размазана по UI. Для меня frontend — не вёрстка страниц, а слой, через который пользователь взаимодействует со всей системой.",
      en: "Built client applications that stay fast and maintainable as products grow: public catalogs, complex search UIs, admin panels, and Web3 interfaces. Led legacy migration to Inertia.js + Vue 3, shipped SSR for SEO, TypeScript typing, and component architecture where business logic isn't scattered across the UI. For me, frontend isn't page markup — it's the layer through which users interact with the entire system.",
    },
    results: [
      {
        ru: "Миграция критичных разделов Whitewill на Inertia.js + Vue 3 без остановки бизнеса",
        en: "Migrated critical Whitewill sections to Inertia.js + Vue 3 without business downtime",
      },
      {
        ru: "SSR-каталоги: каждая страница недвижимости — полноценная SEO-единица для органического трафика",
        en: "SSR catalogs: every property page as a full SEO unit for organic traffic",
      },
      {
        ru: "Единый интерфейс для разных стран — одна кодовая база, региональная логика под капотом",
        en: "Single UI across countries — one codebase, regional logic under the hood",
      },
      {
        ru: "Архитектура Next.js для Web3-платформы VOTON: SSR/SSG, real-time, масштабируемые интерфейсы",
        en: "Next.js architecture for VOTON Web3 platform: SSR/SSG, real-time, scalable interfaces",
      },
    ],
    accent: "#7c3aed",
    glow: "rgba(124, 58, 237, 0.25)",
  },
  {
    id: "platform",
    title: { ru: "Platform Architecture", en: "Platform Architecture" },
    technologies: ["Service Layer", "DTO", "Multi-region", "amoCRM", "Playwright"],
    description: {
      ru: "Проектировал архитектуру платформ целиком: как разделить ответственность между слоями, как запускать новые рынки и направления без дублирования кода, как связать frontend, backend, CRM и потоки данных в одну предсказуемую систему. Участвовал в глубоких трансформациях живых продуктов — миграция с legacy, автоматизация контента, партнёрские экосистемы и снижение технического долга, когда продукт уже обслуживает тысячи пользователей.",
      en: "Designed platform architecture end to end: how to split responsibility across layers, launch new markets without code duplication, and connect frontend, backend, CRM, and data flows into one predictable system. Led deep transformations of live products — legacy migration, content automation, partner ecosystems, and reducing tech debt while the product already serves thousands of users.",
    },
    results: [
      {
        ru: "Фабричная архитектура сервисов: одна кодовая база, разная бизнес-логика для каждого региона",
        en: "Service factory architecture: one codebase, different business logic per region",
      },
      {
        ru: "Партнёрский портал partners.whitewill.ru — CRM-экосистема с двусторонней синхронизацией amoCRM",
        en: "Partner portal partners.whitewill.ru — CRM ecosystem with bidirectional amoCRM sync",
      },
      {
        ru: "Автоматизация контента: тексты, параметры и переводы формируются системой — менеджеры только публикуют",
        en: "Content automation: texts, parameters, and translations generated by the system — managers only publish",
      },
      {
        ru: "E2E-тестирование критичных сценариев поиска на Playwright перед релизами в разные рынки",
        en: "Playwright E2E testing of critical search flows before releases across markets",
      },
    ],
    accent: "#10b981",
    glow: "rgba(16, 185, 129, 0.25)",
  },
];
