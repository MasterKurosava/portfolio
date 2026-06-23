import { Fragment, type ReactNode } from "react";

/** Stack and technology names — longest first for correct matching */
const TECH_TERMS = [
  "blocks_constructor",
  "Excel Export",
  "Framer Motion",
  "Service Layer",
  "Multi-region",
  "Inertia.js",
  "TypeScript",
  "JavaScript",
  "WebSockets",
  "Playwright",
  "REST API",
  "FlutterFlow",
  "Next.js",
  "Node.js",
  "Three.js",
  "Vue 3",
  "amoCRM",
  "Whitelist",
  "Laravel",
  "Django",
  "Postgres",
  "React",
  "Redis",
  "MySQL",
  "CI/CD",
  "GSAP",
  "PHP",
  "SSR",
  "SSG",
  "DTO",
  "Vue",
  "SQL",
  "Jobs",
  "multilang",
  "Docker",
  "Vite",
  "Web3",
  "AI",
  "API",
].sort((a, b) => b.length - a.length);

const TECH_SET = new Set(TECH_TERMS.map((t) => t.toLowerCase()));

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const TECH_REGEX = new RegExp(`(${TECH_TERMS.map(escapeRegExp).join("|")})`, "gi");

function isTechTerm(part: string) {
  return TECH_SET.has(part.toLowerCase());
}

export function parseTechText(text: string): ReactNode[] {
  const parts = text.split(TECH_REGEX);

  return parts.map((part, i) => {
    if (!part) return null;
    if (isTechTerm(part)) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part}
        </strong>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function parseFocusLine(line: string): ReactNode[] {
  return line.split(" · ").flatMap((segment, i, arr) => {
    const nodes: ReactNode[] = [
      <strong key={`${i}-tech`} className="font-semibold text-foreground">
        {segment.trim()}
      </strong>,
    ];
    if (i < arr.length - 1) {
      nodes.push(<span key={`${i}-sep`}> · </span>);
    }
    return nodes;
  });
}
