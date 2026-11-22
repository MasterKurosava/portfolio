import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { routing } from "@/lib/i18n/routing";

const size = { width: 1200, height: 630 };

export const dynamic = "force-static";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Dark stage in fixed values: satori cannot read the site's CSS variables. */
const GROUND = "#121110";
const INK = "#f0ede6";
const SOFT = "#bdb8ae";
const SPOT = "#f2b45a";

const COPY = {
  ru: {
    name: ["Михаил", "Калачёв"],
    role: "Fullstack-разработчик · Laravel, Vue 3, TypeScript",
    facts: "5 лет · Алматы · офис, гибрид или удалённо",
  },
  en: {
    name: ["Mikhail", "Kalachev"],
    role: "Fullstack developer · Laravel, Vue 3, TypeScript",
    facts: "5 years · Almaty · office, hybrid or remote",
  },
} as const;

/** Static instances of Geologica (satori does not read variable fonts), Latin and Cyrillic only. */
function font(weight: 500 | 800) {
  return readFile(join(process.cwd(), `src/assets/fonts/Geologica-${weight}.ttf`));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = COPY[locale === "en" ? "en" : "ru"];
  const [medium, extraBold] = await Promise.all([font(500), font(800)]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: GROUND,
          backgroundImage: "radial-gradient(circle at 85% 0%, rgba(242, 180, 90, 0.24), rgba(18, 17, 16, 0) 55%)",
          color: INK,
          fontFamily: "Geologica",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          {t.name.map((line) => (
            <div key={line} style={{ fontSize: 156, fontWeight: 800, lineHeight: 0.92, letterSpacing: -6, display: "flex" }}>
              {line}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 500, color: SPOT }}>{t.role}</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 500, color: SOFT }}>
            <span>{t.facts}</span>
            <span style={{ color: INK, fontWeight: 800 }}>kalachev.dev</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geologica", data: medium, weight: 500, style: "normal" },
        { name: "Geologica", data: extraBold, weight: 800, style: "normal" },
      ],
    },
  );
}
