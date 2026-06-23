"use client";

import { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Database, Layers, Network, Check } from "lucide-react";
import { expertiseCards } from "@/data/expertise-cards";
import { t } from "@/data/career";
import { cn } from "@/lib/utils";
import { TechText } from "@/components/ui/tech-text";
import { useIsMobile } from "@/hooks/useDeviceTier";

const TILT = 8;
const PARALLAX = 12;

const CARD_ICONS = {
  backend: Database,
  frontend: Layers,
  platform: Network,
} as const;

function CardPattern({ cardId, accent }: { cardId: string; accent: string }) {
  if (cardId === "backend") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]" aria-hidden>
        <defs>
          <pattern id="grid-backend" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke={accent} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-backend)" />
      </svg>
    );
  }
  if (cardId === "frontend") {
    return (
      <svg className="absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden>
        <defs>
          <pattern id="layers-frontend" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect x="4" y="8" width="32" height="6" rx="1" fill={accent} opacity="0.3" />
            <rect x="8" y="18" width="24" height="6" rx="1" fill={accent} opacity="0.2" />
            <rect x="12" y="28" width="16" height="6" rx="1" fill={accent} opacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#layers-frontend)" />
      </svg>
    );
  }
  return (
    <svg className="absolute inset-0 h-full w-full opacity-[0.05]" aria-hidden>
      <defs>
        <pattern id="nodes-platform" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="24" cy="24" r="2" fill={accent} />
          <line x1="24" y1="24" x2="48" y2="12" stroke={accent} strokeWidth="0.5" opacity="0.5" />
          <line x1="24" y1="24" x2="8" y2="40" stroke={accent} strokeWidth="0.5" opacity="0.5" />
          <line x1="24" y1="24" x2="40" y2="40" stroke={accent} strokeWidth="0.5" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#nodes-platform)" />
    </svg>
  );
}

function ExpertiseCard({
  card,
  locale,
  resultsLabel,
  index,
}: {
  card: (typeof expertiseCards)[number];
  locale: string;
  resultsLabel: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const rotateX = useSpring(0, { stiffness: 260, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 260, damping: 22 });
  const parallaxX = useMotionValue(0);
  const parallaxY = useMotionValue(0);

  const active = hovered || tapped;
  const enableTilt = !reducedMotion && !isMobile;
  const Icon = CARD_ICONS[card.id as keyof typeof CARD_ICONS] ?? Database;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateX.set(-y * TILT);
    rotateY.set(x * TILT);
    parallaxX.set(x * PARALLAX);
    parallaxY.set(y * PARALLAX);
  };

  const handleLeave = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    parallaxX.set(0);
    parallaxY.set(0);
  };

  return (
    <motion.article
      ref={ref}
      className="relative h-full"
      initial={reducedMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      onClick={() => setTapped((v) => !v)}
      style={
        enableTilt
          ? {
              rotateX,
              rotateY,
              transformPerspective: 1000,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
    >
      <div
        className={cn(
          "group expertise-card relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border backdrop-blur-xl transition-all duration-500 md:min-h-[420px]",
          active && "is-active border-foreground/20"
        )}
        style={
          active
            ? { boxShadow: `0 0 80px ${card.glow}` }
            : undefined
        }
      >
        <CardPattern cardId={card.id} accent={card.accent} />

        <span
          className="pointer-events-none absolute -right-2 -top-6 select-none font-mono text-[7rem] font-bold leading-none opacity-[0.04] md:text-[8rem]"
          style={{ color: card.accent }}
          aria-hidden
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl transition-opacity duration-500"
          style={{ background: card.accent, opacity: active ? 0.18 : 0.06 }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500"
          style={{ background: card.accent, opacity: active ? 0.1 : 0.03 }}
        />

        <div
          className="pointer-events-none absolute left-0 top-0 h-16 w-16 border-l border-t border-border transition-colors duration-500"
          style={{ borderColor: active ? `${card.accent}66` : undefined }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-16 w-16 border-b border-r border-border transition-colors duration-500"
          style={{ borderColor: active ? `${card.accent}66` : undefined }}
        />

        <motion.div
          style={enableTilt ? { x: parallaxX, y: parallaxY } : undefined}
          className="relative z-10 flex flex-1 flex-col p-4 sm:p-6 md:p-8"
        >
          <div className="flex items-start gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-elevated transition-all duration-500"
              style={{
                borderColor: active ? `${card.accent}55` : undefined,
                background: active
                  ? `linear-gradient(135deg, ${card.accent}22 0%, transparent 100%)`
                  : undefined,
                boxShadow: active ? `0 0 24px ${card.glow}` : "none",
              }}
            >
              <Icon className="h-5 w-5" style={{ color: card.accent }} strokeWidth={1.5} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold tracking-tight md:text-xl" style={{ color: card.accent }}>
                  {t(card.title, locale)}
                </h3>
                <span
                  className={cn(
                    "ml-auto shrink-0 font-mono text-[10px] tracking-widest",
                    !active && "text-muted"
                  )}
                  style={{ color: active ? card.accent : undefined }}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div
                className="mt-2 h-px w-full max-w-[120px] bg-gradient-to-r from-border to-transparent transition-all duration-500"
                style={
                  active
                    ? { background: `linear-gradient(90deg, ${card.accent}, transparent)` }
                    : undefined
                }
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {card.technologies.map((tech, i) => (
              <span
                key={tech}
                className="rounded-md border border-border bg-elevated px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wide transition-colors duration-300 md:text-[11px]"
                style={{
                  borderColor: active ? `${card.accent}33` : undefined,
                  background: active ? `${card.accent}0d` : undefined,
                  color: i === 0 ? card.accent : undefined,
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <div
            className="relative mt-5 flex-1 rounded-xl border-l-2 py-1 pl-4 pr-2 transition-colors duration-500"
            style={{
              borderLeftColor: active ? card.accent : `${card.accent}55`,
              background: active
                ? `linear-gradient(90deg, ${card.accent}08 0%, transparent 70%)`
                : "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, transparent 70%)",
            }}
          >
            <p className="text-sm leading-relaxed text-foreground/80 md:text-[15px] md:leading-[1.7]">
              <TechText>{t(card.description, locale)}</TechText>
            </p>
          </div>

          {!active && card.results[0] && (
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted md:text-sm">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: card.accent }} strokeWidth={2.5} />
              <span className="line-clamp-2">
                <TechText>{t(card.results[0], locale)}</TechText>
              </span>
            </p>
          )}

          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-500 ease-out",
              active ? "mt-5 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]"
            )}
          >
            <div className="overflow-hidden">
              <div
                className="rounded-xl border p-4 md:p-5"
                style={{
                  borderColor: `${card.accent}30`,
                  background: `linear-gradient(160deg, ${card.accent}0c 0%, var(--theme-card-inner) 100%)`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, transparent, ${card.accent}44)` }} />
                  <p className="shrink-0 font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: card.accent }}>
                    {resultsLabel}
                  </p>
                  <div className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${card.accent}44, transparent)` }} />
                </div>
                <ul className="mt-4 space-y-3">
                  {card.results.map((result, ri) => (
                    <li key={result.ru} className="flex gap-3 text-sm leading-relaxed text-foreground/88">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold"
                        style={{
                          background: `${card.accent}18`,
                          color: card.accent,
                          border: `1px solid ${card.accent}33`,
                        }}
                      >
                        {ri + 1}
                      </span>
                      <TechText>{t(result, locale)}</TechText>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center font-mono text-[9px] tracking-widest text-muted/50 md:hidden">
            {locale === "ru" ? "Нажмите для результатов" : "Tap for results"}
          </p>
          <p className="mt-4 hidden text-center font-mono text-[9px] tracking-widest text-muted/40 md:block">
            {locale === "ru" ? "Наведите для результатов" : "Hover for results"}
          </p>
        </motion.div>
      </div>
    </motion.article>
  );
}

export function ExpertiseMap() {
  const tr = useTranslations("tech");
  const locale = useLocale();

  return (
    <section id="tech" className="relative overflow-hidden section-padding py-14 md:py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-accent-secondary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">{tr("label")}</p>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl md:mt-4 md:text-5xl">{tr("title")}</h2>
          <p className="mt-3 text-sm text-muted md:mt-4 md:text-lg">{tr("subtitle")}</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-14 md:gap-6 lg:grid-cols-3 lg:gap-5">
          {expertiseCards.map((card, index) => (
            <ExpertiseCard
              key={card.id}
              card={card}
              locale={locale}
              resultsLabel={tr("resultsLabel")}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
