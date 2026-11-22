"use client";

import { useEffect, useState } from "react";
import { Phone, Send } from "lucide-react";
import { SITE } from "@/content/site";
import { usePathname } from "@/lib/i18n/navigation";
import type { Content } from "@/content";

/** Phone-only bar with the two ways to reach Mikhail, shown once the first screen is passed. */
export function ActionBar({ content: c }: { content: Content }) {
  const [shown, setShown] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShown(false);
    const target = document.getElementById("hero-actions");
    const contact = document.getElementById("contact");
    if (!target) return;
    let pastHero = false;
    let atContact = false;
    const update = () => setShown(pastHero && !atContact);
    const heroObserver = new IntersectionObserver(([entry]) => {
      pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    });
    const contactObserver = new IntersectionObserver(([entry]) => {
      atContact = entry.isIntersecting;
      update();
    });
    heroObserver.observe(target);
    if (contact) contactObserver.observe(contact);
    return () => {
      heroObserver.disconnect();
      contactObserver.disconnect();
    };
  }, [pathname]);

  return (
    <div className="action-bar" data-shown={shown} aria-hidden={!shown}>
      <a className="btn btn-primary" href={SITE.phoneHref} tabIndex={shown ? 0 : -1}>
        <Phone aria-hidden />
        {c.ui.actions.call}
      </a>
      <a className="btn" href={SITE.telegramHref} target="_blank" rel="noopener" tabIndex={shown ? 0 : -1}>
        <Send aria-hidden />
        Telegram
      </a>
    </div>
  );
}
