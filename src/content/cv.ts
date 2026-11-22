import { SITE } from "./site";
import type { Locale } from "./types";

/** One row of a two-column list: a label and its value. */
export interface CvRow {
  label: string;
  value: string;
  /** Short remark after the value, in spot ink on screen. */
  note?: string;
  href?: string;
}

export interface CvJob {
  company: string;
  role: string;
  period: string;
  length: string;
  place: string;
  field?: string;
  about?: string;
  points: string[];
}

export interface CvProject {
  name: string;
  text: string;
  links: { label: string; href: string }[];
}

export interface CvContent {
  meta: { title: string; description: string };
  /** Desired position, as on hh.ru. */
  position: string;
  download: string;
  /** Name of the document in the title block. */
  doc: string;
  format: string;
  contacts: { title: string; rows: CvRow[] };
  terms: { title: string; rows: CvRow[] };
  summary: { title: string; text: string };
  experience: { title: string; total: string; jobs: CvJob[] };
  skills: { title: string; rows: CvRow[] };
  languages: { title: string; rows: CvRow[] };
  education: { title: string; rows: CvRow[] };
  projects: { title: string; items: CvProject[] };
  references: { title: string; note: string };
}

/** Contact rows share their values with the rest of the site; only the labels are translated. */
function contactRows(l: { phone: string; preferred: string; email: string; site: string; siteHref: string }): CvRow[] {
  return [
    { label: l.phone, value: SITE.phone, note: l.preferred, href: SITE.phoneHref },
    { label: l.email, value: SITE.email, href: `mailto:${SITE.email}` },
    { label: "Telegram", value: SITE.telegram, href: SITE.telegramHref },
    { label: l.site, value: "kalachev.dev", href: l.siteHref },
    { label: "GitHub", value: SITE.github.replace("https://", ""), href: SITE.github },
  ];
}

const cvRu: CvContent = {
  meta: {
    title: "Резюме: Fullstack-разработчик",
    description:
      "Резюме Михаила Калачёва, fullstack-разработчика из Алматы: 5 лет опыта, Laravel, Vue 3, TypeScript, MySQL, Redis. Опыт работы, навыки, рекомендации и PDF.",
  },
  position: "Fullstack-разработчик",
  download: "Скачать PDF",
  doc: "Резюме",
  format: "Формат",
  contacts: {
    title: "Контакты",
    rows: contactRows({ phone: "Телефон", preferred: "предпочтительный способ связи", email: "Почта", site: "Сайт", siteHref: SITE.origin }),
  },
  terms: {
    title: "Условия",
    rows: [
      { label: "Город", value: "Алматы, Казахстан. Переезд не рассматриваю" },
      { label: "Разрешение на работу", value: "Казахстан, Россия" },
      { label: "Формат", value: "Офис, удалённо или гибрид" },
      { label: "Занятость", value: "Полная" },
    ],
  },
  summary: {
    title: "О себе",
    text:
      "Пять лет пишу на Laravel и Vue: каталоги недвижимости, интеграции с amoCRM, сервис для продавцов Kaspi.kz. Чаще всего переносил старый код на новый стек, ускорял медленные страницы и убирал ручную работу с помощью очередей и синхронизаций.",
  },
  experience: {
    title: "Опыт работы",
    total: "5\u00a0лет 1\u00a0месяц",
    jobs: [
      {
        company: "Whitewill",
        role: "Fullstack-разработчик",
        period: "05.2024 – 06.2026",
        length: "2 года 2 месяца",
        place: "Москва",
        field: "недвижимость",
        about: "Компания продаёт недвижимость в Москве, Дубае, Абу-Даби, Рас-эль-Хайме, Омане, Лондоне и Майами.",
        points: [
          "Перенёс центральные каталоги с Blade и jQuery на Laravel, Inertia.js и Vue 3. Свёл 7\u00a0региональных каталогов в одну архитектуру на TypeScript, DTO, трансформерах, фабриках и сервисном слое. Бизнес во время переезда не останавливался, ключевые страницы стали работать больше чем в 2\u00a0раза быстрее.",
          "Сократил загрузку страниц с 10–15 до 2–4\u00a0секунд: добавил многоуровневый кеш в Redis, переписал тяжёлые запросы к MySQL и убрал N+1.",
          "Написал автоматическую синхронизацию с внешней базой на REST API и Laravel Jobs. За сутки она обрабатывает больше 100\u00a0000\u00a0объектов: обновляет данные, считает производные поля и переводит тексты на 3\u00a0языка.",
          "Интегрировал сайт с amoCRM через REST API. Бонусные баллы начисляются в очередях Laravel Jobs по событиям активности пользователей.",
          "Разворачивал сервисы в Docker, поддерживал CI/CD в GitLab, писал unit- и feature-тесты на PHPUnit, проводил код-ревью.",
        ],
      },
      {
        company: "VOTON",
        role: "Frontend-разработчик",
        period: "01.2023 – 03.2024",
        length: "1 год 3 месяца",
        place: "Канада",
        field: "Web3",
        points: [
          "Спроектировал фронтенд с нуля на React, Next.js и TypeScript: структуру приложения, где SSR, а где SSG.",
          "Сделал сложные интерактивные интерфейсы на GSAP и Three.js.",
          "Подключил данные в реальном времени через REST и WebSocket.",
          "Каждый день общался на английском с международной командой и заказчиками.",
        ],
      },
      {
        company: "Teknolab",
        role: "Fullstack-разработчик",
        period: "05.2021 – 12.2022",
        length: "1 год 8 месяцев",
        place: "Алматы",
        points: [
          "Сделал сервис для продавцов Kaspi.kz на PHP, Laravel, Vue.js и MySQL. Он следил за ценами конкурентов и сам менял цену продавца по выбранной стратегии.",
          "Написал парсер Kaspi.kz, который собирал товары и цены конкурентов.",
          "Сделал админку для управления товарами и настройки демпинга цен.",
          "Инфраструктуру держали в Docker и GitLab CI/CD.",
        ],
      },
    ],
  },
  skills: {
    title: "Навыки",
    rows: [
      { label: "Основной стек", value: "PHP, Laravel, Vue 3, TypeScript, MySQL, Redis" },
      {
        label: "Также работал с",
        value:
          "Inertia.js, React, Next.js, Node.js, PostgreSQL, Elasticsearch, MongoDB, REST API, OpenAPI, WebSocket, SCSS, GSAP, Three.js",
      },
      { label: "Инструменты", value: "Docker, GitLab CI/CD, PHPUnit, Git, Jira, Figma" },
    ],
  },
  languages: {
    title: "Языки",
    rows: [
      { label: "Русский", value: "Родной" },
      { label: "Английский", value: "Хороший рабочий уровень" },
    ],
  },
  education: {
    title: "Образование",
    rows: [
      {
        label: "2023",
        value: "МУИТ, Международный университет информационных технологий, Алматы. Компьютерные технологии и кибербезопасность",
      },
    ],
  },
  projects: {
    title: "Собственные проекты",
    items: [
      {
        name: "Diorama",
        text: "Открытая библиотека эффектов на three.js и WebGPU для обычного HTML. В ней 100\u00a0готовых эффектов. Пишу её один, kalachev.dev собран на ней.",
        links: [
          { label: "dioramajs.dev", href: SITE.diorama.docs },
          { label: SITE.diorama.repo.replace("https://", ""), href: SITE.diorama.repo },
        ],
      },
      {
        name: "InTouch Ping",
        text: "Лендинг сервиса, который выбирает быстрый маршрут от торгового терминала до криптобиржи. Сделал его на Diorama.",
        links: [{ label: "intouchping.com", href: SITE.intouch }],
      },
    ],
  },
  references: {
    title: "Рекомендации",
    note: "Полные тексты рекомендаций есть на kalachev.dev.",
  },
};

const cvEn: CvContent = {
  meta: {
    title: "CV: Fullstack developer",
    description:
      "CV of Mikhail Kalachev, a fullstack developer in Almaty: 5 years with Laravel, Vue 3, TypeScript, MySQL and Redis. Experience, skills, references and a PDF.",
  },
  position: "Fullstack developer",
  download: "Download PDF",
  doc: "CV",
  format: "Format",
  contacts: {
    title: "Contact",
    rows: contactRows({ phone: "Phone", preferred: "preferred", email: "Email", site: "Website", siteHref: `${SITE.origin}/en` }),
  },
  terms: {
    title: "Availability",
    rows: [
      { label: "Location", value: "Almaty, Kazakhstan. Not relocating" },
      { label: "Work permit", value: "Kazakhstan, Russia" },
      { label: "Format", value: "Office, remote or hybrid" },
      { label: "Employment", value: "Full-time" },
    ],
  },
  summary: {
    title: "Summary",
    text:
      "For five years I have built products on Laravel and Vue: real estate catalogs, amoCRM integrations, a repricing service for Kaspi.kz sellers. Most of that work was moving old code to a modern stack, making slow pages fast and replacing manual work with queues and data syncs.",
  },
  experience: {
    title: "Experience",
    total: "5\u00a0years 1\u00a0month",
    jobs: [
      {
        company: "Whitewill",
        role: "Fullstack developer",
        period: "05.2024 – 06.2026",
        length: "2 years 2 months",
        place: "Moscow",
        field: "real estate",
        about: "The company sells property in Moscow, Dubai, Abu Dhabi, Ras Al Khaimah, Oman, London and Miami.",
        points: [
          "Moved the central catalogs from Blade and jQuery to Laravel, Inertia.js and Vue 3. Merged 7\u00a0regional catalogs into one architecture built on TypeScript, DTOs, transformers, factories and a service layer. The business kept running during the move, and key pages became more than 2×\u00a0faster.",
          "Cut page load time from 10–15 to 2–4\u00a0seconds: added a multi-level Redis cache, rewrote heavy MySQL queries and removed N+1 queries.",
          "Wrote an automatic sync from an external database on a REST API and Laravel Jobs. It processes more than 100,000\u00a0listings a day: updates data, computes derived fields and translates texts into 3\u00a0languages.",
          "Integrated the site with amoCRM over its REST API. Bonus points are accrued in Laravel Jobs queues on user activity events.",
          "Ran services in Docker, maintained CI/CD in GitLab, wrote PHPUnit unit and feature tests and reviewed code.",
        ],
      },
      {
        company: "VOTON",
        role: "Frontend developer",
        period: "01.2023 – 03.2024",
        length: "1 year 3 months",
        place: "Canada",
        field: "Web3",
        points: [
          "Designed the frontend from scratch on React, Next.js and TypeScript: the app structure and where to use SSR or SSG.",
          "Built complex interactive interfaces with GSAP and Three.js.",
          "Brought real-time data into the interface over REST and WebSocket.",
          "Worked in English every day with an international team and clients.",
        ],
      },
      {
        company: "Teknolab",
        role: "Fullstack developer",
        period: "05.2021 – 12.2022",
        length: "1 year 8 months",
        place: "Almaty",
        points: [
          "Built a service for Kaspi.kz sellers on PHP, Laravel, Vue.js and MySQL. It tracked competitors' prices and changed the seller's price on its own, following the strategy the seller picked.",
          "Wrote a Kaspi.kz parser that collected competitors' products and prices.",
          "Built an admin panel for managing products and repricing settings.",
          "The infrastructure ran on Docker and GitLab CI/CD.",
        ],
      },
    ],
  },
  skills: {
    title: "Skills",
    rows: [
      { label: "Main stack", value: "PHP, Laravel, Vue 3, TypeScript, MySQL, Redis" },
      {
        label: "Also worked with",
        value:
          "Inertia.js, React, Next.js, Node.js, PostgreSQL, Elasticsearch, MongoDB, REST API, OpenAPI, WebSocket, SCSS, GSAP, Three.js",
      },
      { label: "Tools", value: "Docker, GitLab CI/CD, PHPUnit, Git, Jira, Figma" },
    ],
  },
  languages: {
    title: "Languages",
    rows: [
      { label: "Russian", value: "Native" },
      { label: "English", value: "Good working level" },
    ],
  },
  education: {
    title: "Education",
    rows: [
      { label: "2023", value: "International IT University, Almaty. Computer technology and cybersecurity" },
    ],
  },
  projects: {
    title: "Own projects",
    items: [
      {
        name: "Diorama",
        text: "An open-source library of three.js and WebGPU effects for plain HTML, with 100\u00a0ready-made effects. I write it alone, and kalachev.dev is built with it.",
        links: [
          { label: "dioramajs.dev", href: SITE.diorama.docs },
          { label: SITE.diorama.repo.replace("https://", ""), href: SITE.diorama.repo },
        ],
      },
      {
        name: "InTouch Ping",
        text: "A landing page for a service that picks a fast route from a trading terminal to a crypto exchange. I built it with Diorama.",
        links: [{ label: "intouchping.com", href: SITE.intouch }],
      },
    ],
  },
  references: {
    title: "References",
    note: "The full recommendations are on kalachev.dev.",
  },
};

export function getCv(locale: Locale | string): CvContent {
  return locale === "en" ? cvEn : cvRu;
}
