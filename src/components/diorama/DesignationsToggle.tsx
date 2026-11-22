"use client";

import { useEffect, useState } from "react";

const ATTR = "data-designations";

export function DesignationsToggle({ show, hide, hint }: { show: string; hide: string; hint: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setOn(root.hasAttribute(ATTR));
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: [ATTR] });
    return () => observer.disconnect();
  }, []);

  return (
    <button
      type="button"
      aria-pressed={on}
      title={hint}
      onClick={() => document.documentElement.toggleAttribute(ATTR, !on)}
      className={`btn min-h-10 px-4 py-1.5 text-[0.875rem] ${on ? "border-spot text-spot" : ""}`}
    >
      <span aria-hidden className="font-mono text-[0.8125rem]">
        {"</>"}
      </span>
      {on ? hide : show}
    </button>
  );
}
