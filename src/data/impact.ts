import type { LocalizedString } from "./career";

export interface ImpactItem {
  id: string;
  stat: LocalizedString;
  statLabel: LocalizedString;
  title: LocalizedString;
  description: LocalizedString;
  context: LocalizedString;
}

export const impactItems: ImpactItem[] = [
  {
    id: "catalog-automation",
    stat: { ru: "7", en: "7" },
    statLabel: {
      ru: "рынков без ручной выгрузки",
      en: "markets with zero manual export",
    },
    title: {
      ru: "Автоматический каталог вместо ручного труда",
      en: "Automated catalog instead of manual labor",
    },
    description: {
      ru: "4 цикла обновления в сутки (3 синхронизации + полная выгрузка утром), пересчёт цен в 7 валютах, фото, переводы и страницы в админке. То, что раньше делали вручную десятки сотрудников, стало работать по расписанию на всех рынках.",
      en: "4 update cycles daily (3 syncs + full morning export), price recalculation in 7 currencies, photos, translations, and admin pages. Work dozens of employees did manually now runs on schedule across all markets.",
    },
    context: { ru: "Whitewill", en: "Whitewill" },
  },
  {
    id: "content-time",
    stat: { ru: "1", en: "1" },
    statLabel: {
      ru: "клик вместо часов ручного ввода",
      en: "click instead of hours of manual entry",
    },
    title: {
      ru: "Публикация объектов для менеджеров",
      en: "Property publishing for managers",
    },
    description: {
      ru: "Описания, параметры, SEO-блоки и переводы на несколько языков формируются автоматически после выгрузки. Менеджеры перешли от заполнения карточек вручную к проверке и публикации — на каждый объект уходит минуты, а не часы.",
      en: "Descriptions, parameters, SEO blocks, and multi-language translations are generated automatically after each export. Managers went from manually filling cards to review and publish — minutes per property, not hours.",
    },
    context: { ru: "Whitewill", en: "Whitewill" },
  },
  {
    id: "partner-export",
    stat: { ru: "20+", en: "20+" },
    statLabel: {
      ru: "фильтров и тысячи строк в отчёте",
      en: "filters and thousands of rows per report",
    },
    title: {
      ru: "Аналитика партнёрского канала",
      en: "Partner channel analytics",
    },
    description: {
      ru: "Админ-дашборд с гибкой фильтрацией и асинхронный экспорт в Excel — менеджеры выгружают тысячи партнёров и клиентов без таймаутов. Двусторонняя синхронизация с amoCRM: партнёрка и CRM работают как единая система.",
      en: "Admin dashboard with flexible filtering and async Excel export — managers export thousands of partners and clients without timeouts. Bidirectional amoCRM sync keeps the partner portal and CRM as one system.",
    },
    context: { ru: "Whitewill", en: "Whitewill" },
  },
  {
    id: "search-stability",
    stat: { ru: "7+", en: "7+" },
    statLabel: {
      ru: "рынков — один поиск",
      en: "markets — one search engine",
    },
    title: {
      ru: "Единый поиск без регрессий при релизах",
      en: "Unified search without release regressions",
    },
    description: {
      ru: "Один механизм фильтрации для разных стран, типов недвижимости и бизнес-правил. После внедрения E2E-тестов критичных сценариев поиск перестал ломаться при выкатках — конверсия на релизах стала предсказуемой.",
      en: "One filtering engine for different countries, property types, and business rules. After E2E tests on critical flows, search stopped breaking on releases — conversion became predictable with each deploy.",
    },
    context: { ru: "Whitewill", en: "Whitewill" },
  },
  {
    id: "migration",
    stat: { ru: "0", en: "0" },
    statLabel: {
      ru: "дней простоя бизнеса",
      en: "days of business downtime",
    },
    title: {
      ru: "Миграция каталогов на современный стек",
      en: "Catalog migration to a modern stack",
    },
    description: {
      ru: "Критичные разделы переехали на Inertia.js + Vue 3 с SSR при тысячах ежедневных пользователей. Платформа продолжала работать, SEO-страницы остались полноценными единицами для органического трафика.",
      en: "Critical sections migrated to Inertia.js + Vue 3 with SSR while thousands used the platform daily. The business kept running; SEO pages remained full units for organic traffic.",
    },
    context: { ru: "Whitewill", en: "Whitewill" },
  },
  {
    id: "kaspi",
    stat: { ru: "100%", en: "100%" },
    statLabel: {
      ru: "рутины продавцов — автоматически",
      en: "seller routine — automated",
    },
    title: {
      ru: "Продукт для продавцов Kaspi.kz",
      en: "Product for Kaspi.kz sellers",
    },
    description: {
      ru: "Личный кабинет для контроля товаров, цен и остатков: рутинные операции, которые продавцы делали вручную каждый день, автоматизированы. Продукт стал ежедневным рабочим инструментом, а не разовой задачей в Excel.",
      en: "Dashboard for tracking products, prices, and stock: daily routine operations sellers did manually are now automated. The product became a daily work tool, not a one-off Excel task.",
    },
    context: { ru: "Teknolab", en: "Teknolab" },
  },
];
