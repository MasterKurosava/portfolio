export type LocalizedString = { ru: string; en: string };

export function t(loc: LocalizedString, locale: string): string {
  return locale === "en" ? loc.en : loc.ru;
}

export interface CareerProject {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
}

export interface PartnerPortal {
  title: LocalizedString;
  subtitle: LocalizedString;
  narrative: LocalizedString;
  highlights: LocalizedString[];
  stack: string[];
}

export interface CareerStation {
  id: string;
  company: string;
  period: LocalizedString;
  role: LocalizedString;
  theme: "blueprint" | "ecosystem" | "neon";
  summary: LocalizedString;
  narrative: LocalizedString;
  highlights: LocalizedString[];
  stack: string[];
  projects?: CareerProject[];
  partnerPortal?: PartnerPortal;
}

export const careerStations: CareerStation[] = [
  {
    id: "whitewill",
    company: "Whitewill",
    period: { ru: "2024.05 — 2026.06", en: "2024.05 — 2026.06" },
    role: { ru: "Frontend / Fullstack Developer", en: "Frontend / Fullstack Developer" },
    theme: "ecosystem",
    summary: {
      ru: "За 4 года прошёл путь от UI-задач до ключевых модулей международной платформы: поиск, каталоги, автоматизация данных и миграция на Vue 3 — без остановки бизнеса.",
      en: "Over 4 years, grew from UI tasks to owning key modules of an international platform: search, catalogs, data automation, and Vue 3 migration — all without business downtime.",
    },
    narrative: {
      ru: "Отвечал за frontend и fullstack в продукте, который обслуживал 7+ рынков одновременно. Спроектировал поиск и фильтрацию под разные страны и типы недвижимости, настроил полностью автоматическую выгрузку каталога, автоматизировал генерацию контента и переводов, участвовал в переносе критичных разделов на Inertia.js + Vue 3. Моя работа сняла с команды ручной труд десятков людей и сделала релизы предсказуемыми для конверсии.",
      en: "Owned frontend and fullstack work on a product serving 7+ markets at once. Designed search and filtering for different countries and property types, built fully automated catalog export, automated content and translation generation, and helped migrate critical sections to Inertia.js + Vue 3. My work eliminated manual labor that dozens of people did daily and made releases predictable for conversion.",
    },
    highlights: [
      {
        ru: "Спроектировал единый поиск с мультирегиональной логикой, типизированным контрактом backend ↔ frontend и Playwright E2E — релизы в разные рынки без поломки конверсии",
        en: "Designed unified search with multi-region logic, typed backend ↔ frontend contracts, and Playwright E2E — releases across markets without breaking conversion",
      },
      {
        ru: "Запустил автовыгрузку каталога: 3 синхронизации в день, цепочка обработчиков, пересчёт цен в 7 валютах — на 7 рынках без ручного ввода",
        en: "Shipped automated catalog export: 3 daily syncs, handler chains, price recalculation in 7 currencies — across 7 markets with zero manual input",
      },
      {
        ru: "Автоматизировал тексты, SEO и переводы карточек объектов — менеджеры перешли от ручного заполнения к проверке и публикации",
        en: "Automated property card text, SEO, and translations — managers went from manual entry to review and publish",
      },
    ],
    stack: ["Vue 3", "TypeScript", "Laravel", "Inertia.js", "PHP", "MySQL", "SSR", "Playwright"],
    projects: [
      {
        id: "catalogs",
        title: { ru: "Каталоги недвижимости", en: "Real estate catalogs" },
        description: {
          ru: "Вёл миграцию центральных каталогов на Laravel + Inertia.js + Vue 3: сервисный слой, типизированные DTO, lazy props и SSR для индексации. Критичные разделы переехали без остановки бизнеса, страницы остались полноценными SEO-единицами.",
          en: "Led migration of core catalogs to Laravel + Inertia.js + Vue 3: service layer, typed DTOs, lazy props, and SSR for indexing. Critical sections moved without business downtime; pages remained full SEO units.",
        },
      },
      {
        id: "search",
        title: { ru: "Поиск и фильтрация", en: "Search and filtering" },
        description: {
          ru: "Собрал единый механизм фильтрации под разные страны и бизнес-правила. Настроил автогенерацию TypeScript из PHP и Playwright E2E на критичных сценариях — после моих изменений релизы перестали ломать поиск и конверсию.",
          en: "Built one filtering engine for different countries and business rules. Set up TypeScript autogen from PHP and Playwright E2E on critical flows — after my changes, releases stopped breaking search and conversion.",
        },
      },
      {
        id: "dataset-import",
        title: { ru: "Импорт данных (DS)", en: "Data import (DS)" },
        description: {
          ru: "Настроил полностью автоматическую выгрузку каталога: сайт сам забирает данные из внутренней системы и обновляет всё без ручного ввода. Расписание — 3 синхронизации в день плюс полная выгрузка каждое утро. После каждой выгрузки цепочка обработчиков пересчитывает цены в 7 валютах, цену за м², подтягивает фото, опции, метро, застройщиков, создаёт страницы в админке и обновляет переводы. То, что раньше делали десятки людей вручную, работает по расписанию на 7 рынках.",
          en: "Built fully automated catalog export: the site pulls data from the internal system and updates everything without manual input. Schedule — 3 syncs daily plus a full export every morning. After each run, a handler chain recalculates prices in 7 currencies, price per m², pulls photos, options, metro, developers, creates admin pages, and updates translations. Work that dozens did manually now runs on schedule across 7 markets.",
        },
      },
      {
        id: "content-automation",
        title: { ru: "Автоматизация контента", en: "Content automation" },
        description: {
          ru: "Спроектировал и внедрил цепочку обработчиков, которая автоматически формирует текстовые поля карточек объектов: описания, параметры, SEO-блоки и переводы на несколько языков. Подключил и настроил пакеты blocks_constructor и multilang, связал их с пайплайном выгрузки данных. До этого менеджеры заполняли всё вручную — после моей работы им осталось только проверить результат и нажать «опубликовать».",
          en: "Designed and implemented a handler chain that auto-generates property card text fields: descriptions, parameters, SEO blocks, and translations across multiple languages. Integrated and configured blocks_constructor and multilang packages, wired them into the data export pipeline. Before this, managers filled everything manually — after my work, they only had to review and hit publish.",
        },
      },
    ],
    partnerPortal: {
      title: { ru: "Партнёрский портал", en: "Partner portal" },
      subtitle: {
        ru: "partners.whitewill.ru — B2B-экосистема с интеграцией amoCRM",
        en: "partners.whitewill.ru — B2B ecosystem with amoCRM integration",
      },
      narrative: {
        ru: "Развивал partners.whitewill.ru — отдельный продукт, за который отвечал на backend и в интеграциях. Участвовал в системе баллов и публичного рейтинга, двусторонней синхронизации с amoCRM, админ-дашборде с 20+ фильтрами и асинхронном экспорте в Excel, персональных отчётах PDF/PPT и SSO-доступе партнёров в каталог Whitelist.",
        en: "Evolved partners.whitewill.ru — a separate product where I owned backend and integration work. Contributed to the points and public ranking system, bidirectional amoCRM sync, admin dashboard with 20+ filters and async Excel export, personal PDF/PPT reports, and partner SSO access to the Whitelist catalog.",
      },
      highlights: [
        {
          ru: "Участвовал в системе баллов и рейтинга — правила начисления, конвертация валют, агрегация по агентствам; главный мотиватор для партнёров",
          en: "Contributed to points and ranking — accrual rules, currency conversion, agency aggregation; the key partner motivator",
        },
        {
          ru: "Развивал двустороннюю интеграцию с amoCRM — синхронизация клиентов, статусов и брокеров в обе стороны",
          en: "Evolved bidirectional amoCRM integration — client, status, and broker sync both ways",
        },
        {
          ru: "Сделал админ-дашборд с 20+ фильтрами и асинхронный экспорт в Excel — менеджеры выгружают тысячи записей без таймаутов",
          en: "Built admin dashboard with 20+ filters and async Excel export — managers export thousands of rows without timeouts",
        },
        {
          ru: "Участвовал в персональных отчётах партнёрам (PDF/PPT) и SSO-входе в Whitelist",
          en: "Contributed to personal partner reports (PDF/PPT) and SSO login to Whitelist",
        },
        {
          ru: "Дорабатывал реферальную регистрацию, верификацию и мультирегиональные лендинги",
          en: "Extended referral registration, verification, and multi-region landing pages",
        },
      ],
      stack: ["Laravel", "PHP", "Vue", "amoCRM", "MySQL", "Jobs", "Excel Export"],
    },
  },
  {
    id: "voton",
    company: "VOTON",
    period: { ru: "2023.07 — 2024.04", en: "2023.07 — 2024.04" },
    role: { ru: "Frontend Architect", en: "Frontend Architect" },
    theme: "neon",
    summary: {
      ru: "Спроектировал frontend-архитектуру Web3-платформы с нуля: Next.js, real-time, интеграция с Django и процессы для растущей команды.",
      en: "Designed Web3 platform frontend architecture from scratch: Next.js, real-time, Django integration, and processes for a growing team.",
    },
    narrative: {
      ru: "Присоединился на раннем этапе, когда продукт строился practically с нуля. Заложил архитектуру на Next.js с SSR/SSG, настроил WebSocket для данных в реальном времени, спроектировал контракты с Django backend, внедрил типизацию и CI/CD. Строил сложные интерфейсы с GSAP и Three.js, следя за тем, чтобы код оставался масштабируемым по мере роста команды и функциональности.",
      en: "Joined at an early stage when the product was built practically from scratch. Established Next.js architecture with SSR/SSG, set up WebSockets for real-time data, designed contracts with the Django backend, introduced typing and CI/CD. Built complex interfaces with GSAP and Three.js while keeping the codebase scalable as the team and feature set grew.",
    },
    highlights: [
      {
        ru: "Спроектировал frontend-архитектуру Next.js: SSR/SSG, структура модулей, переиспользуемые компоненты — фундамент, на котором выросла команда",
        en: "Designed Next.js frontend architecture: SSR/SSG, module structure, reusable components — the foundation the team grew on",
      },
      {
        ru: "Внедрил WebSocket-слой для real-time данных — пользователи видят актуальную информацию без перезагрузки страницы",
        en: "Implemented WebSocket layer for real-time data — users see live updates without page reloads",
      },
      {
        ru: "Настроил интеграцию с Django, типизацию TypeScript и CI/CD — предсказуемые релизы на раннем этапе продукта",
        en: "Set up Django integration, TypeScript typing, and CI/CD — predictable releases in an early-stage product",
      },
    ],
    stack: ["React", "Next.js", "TypeScript", "WebSockets", "Django", "GSAP", "Three.js"],
  },
  {
    id: "teknolab",
    company: "Teknolab",
    period: { ru: "2022.02 — 2023.05", en: "2022.02 — 2023.05" },
    role: { ru: "Fullstack Developer", en: "Fullstack Developer" },
    theme: "blueprint",
    summary: {
      ru: "Сформировал fullstack-подход: от UI до backend, автоматизации данных и продуктов, которыми ежедневно пользуются реальные клиенты.",
      en: "Built a fullstack mindset: from UI to backend, data automation, and products used daily by real customers.",
    },
    narrative: {
      ru: "Начинал как разработчик и быстро взял на себя задачи end-to-end. Сделал продукт для продавцов Kaspi.kz — контроль товаров, цен и остатков с автоматизацией рутины. Построил систему сбора и обработки больших объёмов данных для крупного e-commerce, разрабатывал решения для автомобильной отрасли и поставщиков топлива. Именно здесь сформировался принцип отвечать за результат целиком, а не только за свой участок кода.",
      en: "Started as a developer and quickly took on end-to-end work. Built a product for Kaspi.kz sellers — tracking products, prices, and stock with routine automation. Created large-scale data collection and processing for major e-commerce, and developed solutions for automotive and fuel industries. This is where I learned to own the full outcome, not just my slice of code.",
    },
    highlights: [
      {
        ru: "Разработал продукт для продавцов Kaspi.kz — личный кабинет, автоматизация ежедневных операций, снял рутину с пользователей",
        en: "Built a product for Kaspi.kz sellers — dashboard, daily workflow automation, removed routine work for users",
      },
      {
        ru: "Собрал pipeline автоматизированного сбора и обработки больших массивов данных для крупного e-commerce",
        en: "Built automated pipeline for collecting and processing large data volumes for major e-commerce",
      },
      {
        ru: "Fullstack на PHP, Laravel, Vue — интерфейсы, бизнес-логика, интеграции и админ-инструменты в коммерческих продуктах",
        en: "Fullstack with PHP, Laravel, Vue — interfaces, business logic, integrations, and admin tools in commercial products",
      },
    ],
    stack: ["PHP", "Laravel", "Vue", "MySQL", "JavaScript", "REST API"],
  },
];
