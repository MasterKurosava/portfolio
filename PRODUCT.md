# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- HR and recruiters at companies in the CIS (Kazakhstan, Russia) hiring a fullstack developer. They arrive from hh.ru, Telegram or a CV link, often on a phone, and decide in seconds whether to write.
- Tech leads and CTOs who check how the candidate thinks before an interview: what he built, at what scale, with which stack.
- People who search for the name (Михаил Калачёв / Калачев / Mikhail Kalachev).

## Product Purpose

Personal portfolio of Mikhail Kalachev at kalachev.dev. Success is a message: a recruiter or lead writes in Telegram, by email or by phone, or downloads the CV.

## Positioning

A fullstack developer (Laravel, Vue 3, TypeScript) who is also the author of Diorama, an open-source three.js / WebGPU effects library. The site is built with that library, so every effect on it is evidence of his own engineering, not a template.

## Operating Context

- Target market: CIS. Default language Russian, English version for international companies.
- Work format: office, remote or hybrid. Lives in Almaty. Not ready to relocate or travel. Work permit: Kazakhstan, Russia. Full-time.
- Recruiters compare the site with the hh.ru resume; facts must match it.

## Capabilities and Constraints

- Next.js 15 App Router, next-intl (ru, en), Tailwind 4, deployed on Vercel at kalachev.dev.
- Visual effects come from Diorama (`@dioramajs/diorama`, three r187). Text stays in the DOM; effects load after first paint and are optional.
- Must be excellent on mobile; must be fully readable without WebGL, with reduced motion and on weak phones.
- All content server-rendered for SEO.

## Brand Commitments

- Name: Михаил Калачёв (ru), Mikhail Kalachev (en). Domain kalachev.dev.
- Voice (user, binding): plain human language, concrete facts, no AI-sounding phrasing.
- UChat Intelligence is never mentioned (user, binding).

## Evidence on Hand

Source of truth: hh.ru resume (updated 2026-08-05), provided by the user.

- Whitewill (May 2024 – Jun 2026, Moscow, real estate), Fullstack developer: migration of central catalogs from legacy Blade/jQuery to Laravel + Inertia.js + Vue 3, 7 regional catalogs consolidated into one architecture (TypeScript, DTO, Transformers, Factories, Service Layer), no business downtime, key pages 2x+ faster; Redis multi-level cache, MySQL query work, N+1 removed, page load from 10–15 s to 2–4 s; automatic sync from an external database, 100 000+ objects a day via REST API and Laravel Jobs, translation into 3 languages, derived data; amoCRM integration with bonus points accrual via Jobs; Docker, CI/CD, PHPUnit unit and feature tests, code review, GitLab. Markets: Moscow, Dubai, Abu Dhabi, Ras Al Khaimah, Oman, London, Miami (user confirmed). He also built a block constructor for object pages (new-build and apartment pages assembled from blocks; user confirmed 2026-11-22). The site gives it one line: the owner does not want the portfolio to read like a Whitewill brochure.
- VOTON (Jan 2023 – Mar 2024, Canada, Web3), Frontend developer: frontend architecture from scratch on React, Next.js, TypeScript (SSR/SSG), complex interfaces with GSAP and Three.js (his first Three.js work, user confirmed), REST and WebSockets real-time, daily English communication with an international team and clients. The product site no longer exists; no screenshots.
- Teknolab (May 2021 – Dec 2022, Almaty), Fullstack developer: service for Kaspi.kz sellers on PHP, Laravel, Vue.js, MySQL with competitor monitoring and dynamic repricing (the resume's word is «демпинг цен»: the seller's price kept just under the competitor's; the Russian site keeps that word, the English one says repricing); Kaspi.kz parser; admin panel for products and repricing settings; Docker, GitLab CI/CD. No product name or screenshots available.
- Education: International IT University (МУИТ), Almaty, 2023, computer technologies and cybersecurity.
- Recommendations (names and roles per resume): Konstantin, head of the development group, Whitewill; Nikita, CTO, VOTON; Nuraly, CEO, Teknolab. Existing quote texts and photos in `src/data/testimonials.ts`, `public/images/`.
- Pet projects: Diorama (github.com/MasterKurosava/diorama, dioramajs.dev, npm `@dioramajs/diorama`; per the library README: 100 effects, 19 packages, `start()` 47 KB gzip, three.js r187, WebGPU with a WebGL 2 fallback, MIT, version 0.1.1); InTouch Ping landing (https://intouchping.com/), built with Diorama.
- Laravel and Vue years: Teknolab 1 y 8 m + Whitewill 2 y 2 m, about 3 y 10 m; VOTON was React and Next.js. Whitewill's seven markets are five countries.
- Contacts: phone +7 777 307 84 05 (preferred), email mihailkalchiov@gmail.com, Telegram @MasterKurosava, WhatsApp, hh.ru (resume URL not yet provided).
- Absent, never fabricate: screenshots of VOTON, Teknolab, partners portal; client names beyond the above; salary.

## Product Principles

1. A recruiter understands role, level, stack, format and how to write within the first screen, on a phone.
2. Every effect carries content or proof; the page reads fully before and without any effect.
3. Each fact appears once, in its strongest place.
4. Facts match the hh.ru resume exactly.

## Accessibility & Inclusion

Inferred: WCAG AA contrast, keyboard access, `prefers-reduced-motion` honoured (Diorama does per effect), tap targets ≥ 44 px.
