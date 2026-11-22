import { Link } from "@/lib/i18n/navigation";
import type { Content } from "@/content";
import { LocaleLink } from "./LocaleLink";

export function Header({ content: c }: { content: Content }) {
  const other = c.locale === "ru" ? "en" : "ru";
  const nav = [
    ["spec", c.ui.nav.spec],
    ["work", c.ui.nav.work],
    ["stack", c.ui.nav.stack],
    ["projects", c.ui.nav.projects],
    ["contact", c.ui.nav.contact],
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--hair)] bg-paper">
      <div className="mx-auto flex h-14 max-w-[1424px] items-center gap-4 px-4 md:px-8">
        <Link href="/" className="flex items-baseline gap-2 font-bold tracking-[-0.01em] no-underline">
          <span className="text-[0.9375rem]">{c.hero.name}</span>
        </Link>
        <nav aria-label={c.ui.menu} className="ml-6 hidden lg:block">
          <ul className="flex gap-6 text-[0.9375rem] text-ink-soft">
            {nav.map(([id, label]) => (
              <li key={id}>
                <Link href={`/#${id}`} className="no-underline transition-colors hover:text-ink">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LocaleLink locale={other} label={c.ui.lang.other} title={c.ui.lang.otherName} />
        </div>
      </div>
    </header>
  );
}
