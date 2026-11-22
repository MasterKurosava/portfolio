import { en } from "./en";
import { ru } from "./ru";
import { MARKETS } from "./site";
import type { Locale, SpecRow } from "./types";

/** Copy of the two case pages: /work/whitewill and /projects/diorama. */

export interface CaseMeta {
  title: string;
  description: string;
  keywords: string[];
  /** Name of the page in the breadcrumb trail. */
  crumb: string;
  /** Alt text of the share image. */
  imageAlt: string;
}

/** A node of the system diagram: a list item whose link names the node. */
export interface SchemeNode {
  label: string;
  note: string;
  /** The section of the page the node leads to. */
  href: string;
  /** A group colours the node and is reset for its children. */
  group?: string;
  children?: SchemeNode[];
}

export interface CasePart {
  id: string;
  no: string;
  title: string;
  text: string[];
}

export interface WhitewillCase {
  meta: CaseMeta;
  headline: string;
  lead: string;
  facts: { caption: string; rows: SpecRow[] };
  work: {
    title: string;
    catalog: CasePart & { keyLabel: string };
    /** The block constructor of object pages. */
    pages: CasePart;
    speed: CasePart & { from: string; to: string; unit: string };
    sync: CasePart & { key: string; keyLabel: string };
    crm: CasePart;
    devops: CasePart;
  };
  quote: { title: string; intro: string };
  contact: { title: string; intro: string; back: string };
}

export interface PackageRow {
  name: string;
  text: string;
}

export interface DioramaCase {
  meta: CaseMeta;
  headline: string;
  lead: string[];
  spec: { caption: string; rows: SpecRow[] };
  how: { title: string; intro: string; steps: string[]; hood: { caption: string; rows: SpecRow[] } };
  packages: {
    title: string;
    intro: string;
    figure: string;
    label: string;
    entry: { caption: string; row: PackageRow };
    groups: { id: string; caption: string; rows: PackageRow[] }[];
  };
  code: {
    title: string;
    intro: string;
    /** Accessible names of the two kinds of listing. */
    listing: { markup: string; file: string };
    attribute: { figure: string; alt: string; text: string };
    custom: { figure: string; text: string[] };
    glsl: string;
  };
  site: {
    title: string;
    text: string[];
    links: { caption: string; docs: string; repo: string; npm: string; source: string; author: string };
    back: string;
  };
}

export interface Cases {
  whitewill: WhitewillCase;
  diorama: DioramaCase;
}

const marketsRu = MARKETS.map((m) => ru.work.whitewill.parts.sync.markers[m.id]).join(", ");
const marketsEn = MARKETS.map((m) => en.work.whitewill.parts.sync.markers[m.id]).join(", ");

const casesRu: Cases = {
  whitewill: {
    meta: {
      title: "Whitewill: миграция каталога на Laravel и Vue 3 без простоя",
      description:
        "Свёл семь каталогов недвижимости в одно приложение на Laravel, Inertia.js и Vue 3 без простоя. Страницы с 10–15 до 2–4 секунд, 100 000 объектов в сутки.",
      keywords: [
        "миграция каталога на Vue 3",
        "Laravel Inertia.js Vue 3",
        "Laravel Jobs синхронизация",
        "кеш Redis Laravel",
        "интеграция amoCRM Laravel",
        "Whitewill",
        "Михаил Калачёв",
      ],
      crumb: "Whitewill",
      imageAlt: "Страница жилого комплекса на сайте Whitewill",
    },
    headline: "Whitewill: семь каталогов недвижимости на Laravel и Vue 3 без простоя",
    lead:
      "Whitewill продаёт недвижимость на семи рынках, и у каждого был свой каталог на Blade и jQuery. За два года я свёл их в одно приложение на Laravel, Inertia.js и Vue 3 и сделал блок-конструктор для страниц объектов. Объекты загружаются в каталог сами, из внешней базы.",
    facts: {
      caption: "Коротко о проекте",
      rows: [
        { label: "Компания", value: "Whitewill, продажа недвижимости" },
        { label: "Рынки", value: marketsRu },
        { label: "Стек", value: "PHP, Laravel, Inertia.js, Vue 3, TypeScript, MySQL, Redis" },
        { label: "Обмен данными", value: "REST API, очереди Laravel Jobs, amoCRM" },
        { label: "Инфраструктура и тесты", value: "Docker, GitLab CI/CD, PHPUnit, код-ревью" },
      ],
    },
    work: {
      title: "Что я сделал",
      catalog: {
        id: "ww-catalog",
        no: "2.1",
        title: "Миграция каталогов на Vue 3 без простоя",
        text: [
          "Центральные каталоги работали на Blade и jQuery. У каждого из семи рынков был свой.",
          "Я перенёс их на Laravel, Inertia.js и Vue 3 и свёл в одну архитектуру на TypeScript, DTO, трансформерах, фабриках и сервисном слое.",
          "Бизнес за время переезда не простоял ни дня. Главные страницы каталога стали открываться больше чем в два раза быстрее.",
        ],
        keyLabel: "региональных каталогов в одном приложении",
      },
      pages: {
        id: "ww-pages",
        no: "2.2",
        title: "Блок-конструктор страниц объектов",
        text: [
          "Для страниц объектов я сделал блок-конструктор. Страница новостройки или квартиры собирается из блоков, и у каждого объекта свой набор.",
        ],
      },
      speed: {
        id: "ww-speed",
        no: "2.3",
        title: "Загрузка страниц: с 10⁠–⁠15 секунд до 2⁠–⁠4",
        text: [
          "Страницы каталога открывались по 10⁠–⁠15 секунд.",
          "Я добавил многоуровневый кеш в Redis и переписал тяжёлые запросы к MySQL. Нашёл и убрал запросы N+1.",
          "Теперь страница открывается за 2⁠–⁠4 секунды.",
        ],
        from: "10⁠–⁠15",
        to: "2⁠–⁠4",
        unit: "с",
      },
      sync: {
        id: "ww-sync",
        no: "2.4",
        title: "Синхронизация 100 000 объектов в сутки на Laravel Jobs",
        text: [
          "Объекты недвижимости приходят в каталог из внешней базы данных, без ручного ввода.",
          "Я написал синхронизацию на REST API и очередях Laravel Jobs. За сутки она обрабатывает больше 100 000 объектов.",
          "Задачи в очереди обновляют данные, считают производные поля и переводят тексты на три языка.",
        ],
        key: "100 000+",
        keyLabel: "объектов в сутки",
      },
      crm: {
        id: "ww-crm",
        no: "2.5",
        title: "Интеграция с amoCRM и бонусные баллы",
        text: ["Связал Laravel с amoCRM и сделал начисление бонусных баллов через очереди Laravel Jobs."],
      },
      devops: {
        id: "ww-devops",
        no: "2.6",
        title: "Docker, CI/CD, тесты и код-ревью",
        text: [
          "Разворачивал сервисы в Docker и поддерживал пайплайны GitLab CI/CD.",
          "Новый код покрывал unit- и feature-тестами на PHPUnit. Участвовал в код-ревью в GitLab.",
        ],
      },
    },
    quote: {
      title: "Рекомендация",
      intro: "Отзыв руководителя группы разработки Whitewill, без сокращений.",
    },
    contact: {
      title: "Связь",
      intro: "Живу в Алматы, переезд не рассматриваю. Подойдёт офис, гибрид или удалённая работа на полный день.",
      back: "Весь опыт работы",
    },
  },
  diorama: {
    meta: {
      title: "Diorama: библиотека 3D-эффектов на three.js и WebGPU для обычного HTML",
      description:
        "Как устроена Diorama: один атрибут делает элемент WebGL-сценой, а вёрстка остаётся в HTML. 100 эффектов, WebGPU с запасным WebGL 2, 47 КБ на старте.",
      keywords: [
        "Diorama",
        "эффекты three.js",
        "WebGPU",
        "WebGL эффекты для сайта",
        "TSL",
        "@dioramajs/diorama",
        "Михаил Калачёв",
      ],
      crumb: "Diorama",
      imageAlt: "Эффекты Diorama в окне браузера",
    },
    headline: "Diorama",
    lead: [
      "Моя библиотека эффектов three.js для обычного HTML. Ставите атрибут на любой элемент, и он становится WebGL-сценой. Вёрстка и текст остаются в HTML.",
      "Пишу её один, код открыт под лицензией MIT.",
    ],
    spec: {
      caption: "Коротко",
      rows: [
        { label: "Назначение", value: "Эффекты three.js для обычного HTML, один атрибут на элемент" },
        {
          label: "Эффекты",
          value: "100, в восьми группах: картинки и видео, текст, 3D-объекты, фоны, данные, частицы, блоки, звук",
        },
        { label: "Пакеты", value: "19, список ниже" },
        { label: "Размер", value: "`start()` весит 47 КБ в gzip" },
        { label: "three.js", value: "r187" },
        { label: "Переходы", value: "Перелёт элементов по ключу между страницами, шторки curtain, ink и pixel" },
        { label: "Интеграции", value: "Vite, Astro, Nuxt, Next.js или один скрипт с CDN" },
        { label: "Работает с", value: "GSAP и ScrollTrigger, Lenis" },
        { label: "Лицензия", value: "MIT" },
        { label: "Версия", value: "0.1.1" },
      ],
    },
    how: {
      title: "Как это работает",
      intro: "Сцена здесь сама страница. Вёрстка остаётся в HTML и CSS, а canvas следует за ней.",
      steps: [
        "На элемент ставится атрибут `data-dio` с именем эффекта. Параметры эффекта тоже пишутся атрибутами.",
        "Страница рисуется как обычно. three.js загружается уже после первой отрисовки.",
        "Эффект загружается, когда его элемент подходит к экрану. Страница без эффектов на экране за них не платит.",
        "Элемент рисуется в общем canvas и держит своё место, пока страница прокручивается, перестраивается и меняет размер.",
        "Кадры рисуются, только пока на экране что-то меняется.",
        "Если убрать атрибут или сам элемент, его ресурсы на GPU освобождаются.",
      ],
      hood: {
        caption: "Под капотом",
        rows: [
          { label: "Canvas", value: "Один на всю страницу, над ней или под ней" },
          {
            label: "Рендер",
            value: "WebGPU, где он есть, иначе WebGL 2. Без них страница остаётся обычным HTML, и каждый элемент сохраняет содержимое",
          },
          { label: "Текст", value: "Остаётся в DOM. Поисковики и скринридеры читают страницу такой, как она написана" },
          { label: "Движение", value: "`prefers-reduced-motion` учитывается в каждом эффекте" },
          { label: "Сенсорные экраны", value: "Эффекты на наведение там не загружаются" },
          {
            label: "Качество",
            value: "Подстраивается под устройство. На слабой видеокарте или при пропуске кадров снижаются плотность пикселей и цена эффектов",
          },
          { label: "Ресурсы", value: "Общий кеш с предзагрузкой, glTF с Draco, Meshopt и KTX2" },
        ],
      },
    },
    packages: {
      title: "Из чего состоит",
      intro: "19 пакетов. Сайту обычно хватает `@dioramajs/diorama`: остальные он подгружает сам, когда они нужны.",
      figure: "Пакеты вокруг `@dioramajs/diorama`, пакеты эффектов выделены цветом. Каждый пакет ведёт на свою страницу в npm.",
      label: "Пакеты Diorama",
      entry: {
        caption: "Точка входа",
        row: { name: "diorama", text: "`start()`, `effect()`, интеграции для Vite, Astro, Nuxt и Next.js, CDN-версия, CLI" },
      },
      groups: [
        {
          id: "engine",
          caption: "Движок",
          rows: [
            { name: "core", text: "Приложение, плагины, сигналы, цикл кадров, `stage`, прокрутка и указатель" },
            { name: "render", text: "Рендерер WebGPU с запасным WebGL 2" },
            { name: "effects", text: "Эффекты на DOM-элементах, их рантайм и набор помощников `kit`" },
            { name: "assets", text: "Загрузка, кеш и предзагрузка" },
            { name: "quality", text: "Адаптивное качество" },
          ],
        },
        {
          id: "effects",
          caption: "Эффекты и переходы",
          rows: [
            { name: "media", text: "Эффекты для картинок и видео" },
            { name: "text", text: "Эффекты для текста" },
            { name: "model", text: "3D-объекты и модели glTF" },
            { name: "backgrounds", text: "Шейдерные фоны" },
            { name: "data", text: "Графики, графы, тепловые карты и карты" },
            { name: "globe", text: "Глобус" },
            { name: "particles", text: "Частицы" },
            { name: "blocks", text: "Эффекты для карточек и кнопок" },
            { name: "audio", text: "Эффекты, которые слушают звук" },
            { name: "transitions", text: "Переходы между страницами и перелёты элементов по ключу" },
          ],
        },
        {
          id: "tools",
          caption: "Интеграции и инструменты",
          rows: [
            { name: "gsap", text: "GSAP и ScrollTrigger" },
            { name: "lenis", text: "Lenis" },
            { name: "glsl", text: "Перевод GLSL в TSL: плагин Vite, загрузчик webpack и CLI" },
          ],
        },
      ],
    },
    code: {
      title: "Как это выглядит в коде",
      intro: "Готовый эффект ставится атрибутом. Свой пишется отдельным файлом.",
      listing: { markup: "Разметка", file: "Файл эффекта" },
      attribute: {
        figure: "Картинка с эффектом `ripple`.",
        alt: "Гавань в сумерках",
        text: "Картинка становится WebGL-плоскостью. От курсора по ней расходятся круги, а своё место в вёрстке она не теряет.",
      },
      custom: {
        figure: "Свой эффект `brighten`: файл и разметка.",
        text: [
          "Свой эффект пишется одним файлом. Имя эффекта берётся из имени файла, параметры из значений по умолчанию.",
          "Картинку описывают на TSL, языке шейдеров three.js. Встроенные эффекты написаны так же и теми же помощниками.",
        ],
      },
      glsl: "Подойдёт и шейдер на GLSL. `@dioramajs/glsl` переводит `.frag`-файл в TSL при компиляции, а его `uniform`-переменные становятся параметрами.",
    },
    site: {
      title: "На этом сайте",
      text: [
        "Этот сайт собран на Diorama. Схему пакетов выше рисует эффект `graph`, ролик в окне браузера показывает `device`.",
        "Эффект `assembly` в библиотеку не входит. Я написал его для этого сайта так же, как `brighten`: файлом в `src/effects`.",
        "В разделе о стеке на главной он показывает четыре слоя одним изометрическим блоком посреди экрана. При прокрутке слои расходятся по своим местам в списке. Слои он берёт через `layers()`, а двигает через `pose()`.",
      ],
      links: {
        caption: "Ссылки",
        docs: "Документация",
        repo: "Исходный код",
        npm: "npm",
        source: "Код этого сайта",
        author: "Автор",
      },
      back: "К разработкам на главной",
    },
  },
};

const casesEn: Cases = {
  whitewill: {
    meta: {
      title: "Whitewill: moving a real estate catalog to Laravel and Vue 3 with no downtime",
      description:
        "I merged seven real estate catalogs into one Laravel, Inertia.js and Vue 3 app with no downtime. Pages from 10–15 s to 2–4 s, 100,000 listings a day.",
      keywords: [
        "Vue 3 migration",
        "Laravel Inertia.js Vue 3",
        "Laravel Jobs sync",
        "Laravel Redis cache",
        "amoCRM Laravel integration",
        "Whitewill",
        "Mikhail Kalachev",
      ],
      crumb: "Whitewill",
      imageAlt: "A residential complex page on the Whitewill site",
    },
    headline: "Whitewill: seven real estate catalogs moved to Laravel and Vue 3 with no downtime",
    lead:
      "Whitewill sells property in seven markets, and each one had its own catalog on Blade and jQuery. Over two years I merged them into one Laravel, Inertia.js and Vue 3 application and built a block constructor for property pages. Listings arrive in the catalog on their own, from an external database.",
    facts: {
      caption: "Project at a glance",
      rows: [
        { label: "Company", value: "Whitewill, real estate sales" },
        { label: "Markets", value: marketsEn },
        { label: "Stack", value: "PHP, Laravel, Inertia.js, Vue 3, TypeScript, MySQL, Redis" },
        { label: "Data exchange", value: "REST API, Laravel Jobs queues, amoCRM" },
        { label: "Infrastructure and tests", value: "Docker, GitLab CI/CD, PHPUnit, code review" },
      ],
    },
    work: {
      title: "What I did",
      catalog: {
        id: "ww-catalog",
        no: "2.1",
        title: "Moving the catalogs to Vue 3 with no downtime",
        text: [
          "The central catalogs ran on Blade and jQuery, and each of the seven markets had its own.",
          "I moved them to Laravel, Inertia.js and Vue 3 and brought them under one architecture built on TypeScript, DTOs, transformers, factories and a service layer.",
          "The business didn't lose a single day to the move. The main catalog pages became more than twice as fast.",
        ],
        keyLabel: "regional catalogs in one application",
      },
      pages: {
        id: "ww-pages",
        no: "2.2",
        title: "A block constructor for property pages",
        text: [
          "For property pages I built a block constructor. A new-build or apartment page is made of blocks, and each property has its own set.",
        ],
      },
      speed: {
        id: "ww-speed",
        no: "2.3",
        title: "Page load: from 10⁠–⁠15 seconds to 2⁠–⁠4",
        text: [
          "Catalog pages took 10⁠–⁠15 seconds to open.",
          "I added a multi-level Redis cache and rewrote the heavy MySQL queries. I tracked down and removed N+1 queries.",
          "A page now opens in 2⁠–⁠4 seconds.",
        ],
        from: "10⁠–⁠15",
        to: "2⁠–⁠4",
        unit: "s",
      },
      sync: {
        id: "ww-sync",
        no: "2.4",
        title: "Syncing 100,000 listings a day with Laravel Jobs",
        text: [
          "Listings come into the catalog from an external database, with nobody typing them in.",
          "I wrote the sync on a REST API and Laravel Jobs queues. It processes more than 100,000 listings a day.",
          "Queued jobs update the data, compute derived fields and translate the texts into three languages.",
        ],
        key: "100,000+",
        keyLabel: "listings a day",
      },
      crm: {
        id: "ww-crm",
        no: "2.5",
        title: "amoCRM integration and bonus points",
        text: ["I connected Laravel to amoCRM and built bonus point accrual on Laravel Jobs queues."],
      },
      devops: {
        id: "ww-devops",
        no: "2.6",
        title: "Docker, CI/CD, tests and code review",
        text: [
          "I ran services in Docker and kept the GitLab CI/CD pipelines going.",
          "I covered new code with PHPUnit unit and feature tests and took part in code review in GitLab.",
        ],
      },
    },
    quote: {
      title: "Recommendation",
      intro: "From the head of the Whitewill development group, in full.",
    },
    contact: {
      title: "Contact",
      intro: "I live in Almaty and I'm not relocating. Office, hybrid or remote work, full-time.",
      back: "All experience",
    },
  },
  diorama: {
    meta: {
      title: "Diorama: a three.js and WebGPU effects library for plain HTML",
      description:
        "How Diorama works: one attribute turns an element into a WebGL scene while the layout stays in HTML. 100 effects, WebGPU with a WebGL 2 fallback, 47 KB.",
      keywords: [
        "Diorama",
        "three.js effects",
        "WebGPU",
        "WebGL effects for websites",
        "TSL",
        "@dioramajs/diorama",
        "Mikhail Kalachev",
      ],
      crumb: "Diorama",
      imageAlt: "Diorama effects in a browser window",
    },
    headline: "Diorama",
    lead: [
      "My library of three.js effects for plain HTML. Put an attribute on any element and it becomes a WebGL scene, while the layout and the text stay in HTML.",
      "I write it alone, and the code is open under the MIT license.",
    ],
    spec: {
      caption: "In short",
      rows: [
        { label: "Purpose", value: "three.js effects for plain HTML, one attribute per element" },
        {
          label: "Effects",
          value: "100 in eight groups: images and video, text, 3D objects, backgrounds, data, particles, blocks, audio",
        },
        { label: "Packages", value: "19, listed below" },
        { label: "Size", value: "`start()` is 47 KB gzipped" },
        { label: "three.js", value: "r187" },
        { label: "Transitions", value: "Keyed element flights between pages; curtain, ink and pixel covers" },
        { label: "Integrations", value: "Vite, Astro, Nuxt, Next.js, or a single CDN script with no build step" },
        { label: "Works with", value: "GSAP and ScrollTrigger, Lenis" },
        { label: "License", value: "MIT" },
        { label: "Version", value: "0.1.1" },
      ],
    },
    how: {
      title: "How it works",
      intro: "The page is the scene. Layout stays in HTML and CSS, and the canvas follows it.",
      steps: [
        "You put a `data-dio` attribute with the effect's name on an element. The effect's params are attributes too.",
        "The page renders as usual. three.js loads after the first paint.",
        "Each effect loads when its element nears the viewport, so a page with no effects on screen pays for none of them.",
        "The element is drawn on the shared canvas and keeps its place as the page scrolls, reflows and resizes.",
        "Frames are drawn only while something on screen changes.",
        "Remove the attribute or the element, and its GPU resources are released.",
      ],
      hood: {
        caption: "Under the hood",
        rows: [
          { label: "Canvas", value: "One for the whole page, over it or behind it" },
          {
            label: "Rendering",
            value: "WebGPU where the browser has it, WebGL 2 elsewhere. Without either, the page stays plain HTML and every element keeps its content",
          },
          { label: "Text", value: "Stays in the DOM, so search engines and screen readers read the page as written" },
          { label: "Motion", value: "`prefers-reduced-motion` is respected per effect" },
          { label: "Touch screens", value: "Hover-only effects never load" },
          {
            label: "Quality",
            value: "Adapts per device: a weak GPU or missed frames lower the pixel ratio and the cost of each effect",
          },
          { label: "Assets", value: "One cache with preload, glTF with Draco, Meshopt and KTX2" },
        ],
      },
    },
    packages: {
      title: "What's inside",
      intro: "19 packages. Most sites need only `@dioramajs/diorama`, which loads the rest on demand.",
      figure: "The packages around `@dioramajs/diorama`, with the effect packages highlighted. Each package links to its npm page.",
      label: "Diorama packages",
      entry: {
        caption: "Entry point",
        row: { name: "diorama", text: "`start()`, `effect()`, the Vite, Astro, Nuxt and Next.js integrations, the CDN build, the CLI" },
      },
      groups: [
        {
          id: "engine",
          caption: "Engine",
          rows: [
            { name: "core", text: "App, plugins, signals, frame loop, `stage`, scroll and pointer" },
            { name: "render", text: "WebGPU renderer with the WebGL 2 fallback" },
            { name: "effects", text: "Effects on DOM elements, their runtime and the `kit` of helpers" },
            { name: "assets", text: "Loading, cache and preload" },
            { name: "quality", text: "Adaptive quality" },
          ],
        },
        {
          id: "effects",
          caption: "Effects and transitions",
          rows: [
            { name: "media", text: "Image and video effects" },
            { name: "text", text: "Text effects" },
            { name: "model", text: "3D objects and glTF models" },
            { name: "backgrounds", text: "Shader backgrounds" },
            { name: "data", text: "Charts, graphs, heatmaps and maps" },
            { name: "globe", text: "The globe" },
            { name: "particles", text: "Particle effects" },
            { name: "blocks", text: "Effects for cards and buttons" },
            { name: "audio", text: "Audio-reactive effects" },
            { name: "transitions", text: "Page transitions and keyed flights" },
          ],
        },
        {
          id: "tools",
          caption: "Integrations and tools",
          rows: [
            { name: "gsap", text: "GSAP and ScrollTrigger" },
            { name: "lenis", text: "Lenis" },
            { name: "glsl", text: "GLSL to TSL converter: Vite plugin, webpack loader and CLI" },
          ],
        },
      ],
    },
    code: {
      title: "What it looks like in code",
      intro: "A built-in effect is an attribute. Your own effect is a file.",
      listing: { markup: "Markup", file: "Effect file" },
      attribute: {
        figure: "An image with the `ripple` effect.",
        alt: "The harbour at dusk",
        text: "The image becomes a WebGL plane. Rings spread from the pointer, and the picture keeps its place in the layout.",
      },
      custom: {
        figure: "A custom effect, `brighten`: the file and the markup.",
        text: [
          "Your own effect is a single file. Its name is the file name, and its params come from the defaults.",
          "The picture is shaped in TSL, the three.js shading language. The built-in effects are written the same way, with the same helpers.",
        ],
      },
      glsl: "A GLSL shader works too: `@dioramajs/glsl` converts a `.frag` file to TSL at build time, and its uniforms become params.",
    },
    site: {
      title: "On this site",
      text: [
        "This site is built with Diorama. The package diagram above is drawn by the `graph` effect, and the reel in the browser window by `device`.",
        "The `assembly` effect isn't part of the library. I wrote it for this site the same way as `brighten`: a file in `src/effects`.",
        "In the stack section on the home page it shows the four layers as one isometric block in the middle of the screen. As you scroll, the layers move out to their places in the list. It takes the layers with `layers()` and moves them with `pose()`.",
      ],
      links: {
        caption: "Links",
        docs: "Docs",
        repo: "Source code",
        npm: "npm",
        source: "This site's code",
        author: "Author",
      },
      back: "Back to projects on the home page",
    },
  },
};

export function getCases(locale: Locale | string): Cases {
  return locale === "en" ? casesEn : casesRu;
}
