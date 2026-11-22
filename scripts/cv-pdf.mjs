#!/usr/bin/env node
/**
 * Prints the CV pages (/cv and /en/cv) to A4 PDFs for the "Скачать PDF" / "Download PDF" links.
 *
 *   node scripts/cv-pdf.mjs [baseUrl] [outDir]
 *
 * baseUrl  where the site runs, default http://localhost:3000 (start `next start` or `next dev` first)
 * outDir   where the PDFs go, default public/cv (relative to the project root)
 *
 * Playwright is taken from PLAYWRIGHT_PATH, else from the diorama demo checkout, else from
 * node_modules. Its Chromium must be installed (`npx playwright install chromium`).
 */
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEMO_PLAYWRIGHT = "C:/myshit/diorama/diorama-demo-dev/node_modules/.pnpm/playwright@1.64.1/node_modules/playwright";

const PAGES = [
  { path: "/cv", file: "kalachev-cv-ru.pdf", locale: "ru-RU" },
  { path: "/en/cv", file: "kalachev-cv-en.pdf", locale: "en-US" },
];

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/+$/, "");
const outDir = resolve(ROOT, process.argv[3] ?? "public/cv");

function loadPlaywright() {
  const require = createRequire(import.meta.url);
  const candidates = [process.env.PLAYWRIGHT_PATH, DEMO_PLAYWRIGHT, "playwright"].filter(Boolean);
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {
      /* try the next one */
    }
  }
  throw new Error(`Playwright not found. Set PLAYWRIGHT_PATH to a playwright package folder. Tried: ${candidates.join(", ")}`);
}

/** Page count from the PDF's page tree; Chromium writes it uncompressed. */
function countPages(pdf) {
  const match = pdf.toString("latin1").match(/\/Type\s*\/Pages\b[^>]*?\/Count\s+(\d+)/);
  return match ? Number(match[1]) : NaN;
}

const { chromium } = loadPlaywright();
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
try {
  for (const { path, file, locale } of PAGES) {
    // Paper print, not blueprint: the theme script reads localStorage "print" before first paint.
    const context = await browser.newContext({ colorScheme: "light", locale });
    await context.addInitScript(() => {
      try {
        localStorage.setItem("print", "light");
      } catch {
        /* storage unavailable */
      }
    });
    const page = await context.newPage();
    const url = `${base}${path}`;
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
    if (!response?.ok()) throw new Error(`${url} answered ${response?.status() ?? "nothing"}`);
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: "print", colorScheme: "light" });

    const pdf = await page.pdf({
      format: "A4",
      preferCSSPageSize: true,
      margin: { top: "14mm", right: "14mm", bottom: "14mm", left: "14mm" },
      printBackground: false,
      displayHeaderFooter: false,
      tagged: true,
    });
    const target = join(outDir, file);
    await writeFile(target, pdf);
    const pages = countPages(pdf);
    console.log(`${url} -> ${target} (${pages} page${pages === 1 ? "" : "s"}, ${Math.round(pdf.length / 1024)} KB)`);
    if (pages > 2) console.warn(`  warning: ${file} runs to ${pages} pages; the CV should fit on 2.`);
    await context.close();
  }
} finally {
  await browser.close();
}
