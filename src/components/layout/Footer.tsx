import { SITE } from "@/content/site";
import type { Content } from "@/content";
import { DesignationsToggle } from "@/components/diorama/DesignationsToggle";

export function Footer({ content: c }: { content: Content }) {
  const year = 2026;
  return (
    <footer className="mx-auto max-w-[1424px] px-4 pb-28 pt-10 text-[0.9375rem] text-ink-soft md:px-8 md:pb-12">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <span>
          © {year} {c.hero.name}
        </span>
        <a className="link" href={SITE.diorama.docs} target="_blank" rel="noopener">
          {c.footer.made}
        </a>
        <a className="link" href={SITE.source} target="_blank" rel="noopener">
          {c.footer.source}
        </a>
        <span className="md:ml-auto">
          <DesignationsToggle show={c.ui.designations.show} hide={c.ui.designations.hide} hint={c.ui.designations.hint} />
        </span>
      </div>
    </footer>
  );
}
