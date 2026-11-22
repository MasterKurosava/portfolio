import { SITE } from "@/content/site";
import type { Content } from "@/content";
import { absoluteUrl, localeUrl } from "@/lib/site";

const KNOWS = ["PHP", "Laravel", "Vue.js", "TypeScript", "MySQL", "Redis", "Inertia.js", "React", "Next.js", "Docker", "PHPUnit", "Three.js", "WebGPU"];

export function PersonJsonLd({ content: c, origin }: { content: Content; origin: string }) {
  const root = absoluteUrl("", origin);
  const person = `${root}/#person`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": person,
        name: c.hero.name,
        alternateName: ["Михаил Калачёв", "Михаил Калачев", "Калачев Михаил", "Mikhail Kalachev"].filter((n) => n !== c.hero.name),
        jobTitle: c.locale === "en" ? "Fullstack developer" : "Fullstack-разработчик",
        url: localeUrl(c.locale, "/", origin),
        image: absoluteUrl(SITE.photo, origin),
        email: `mailto:${SITE.email}`,
        telephone: "+77773078405",
        address: { "@type": "PostalAddress", addressLocality: c.locale === "en" ? "Almaty" : "Алматы", addressCountry: "KZ" },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: c.locale === "en" ? "International Information Technology University" : "Международный университет информационных технологий",
        },
        sameAs: [SITE.telegramHref, SITE.github, SITE.diorama.repo, SITE.diorama.npm, ...(SITE.hh ? [SITE.hh] : [])],
        knowsAbout: KNOWS,
        knowsLanguage: ["ru", "en"],
      },
      {
        "@type": "WebSite",
        "@id": `${root}/#website`,
        name: c.hero.name,
        url: root,
        inLanguage: ["ru", "en"],
        publisher: { "@id": person },
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": `${root}/#diorama`,
        name: "Diorama",
        description:
          c.locale === "en" ? "three.js effects for plain HTML: one attribute on any element." : "Эффекты three.js для обычного HTML: один атрибут на любом элементе.",
        codeRepository: SITE.diorama.repo,
        url: SITE.diorama.docs,
        programmingLanguage: "TypeScript",
        license: "https://opensource.org/licenses/MIT",
        author: { "@id": person },
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

/** The home page is the profile: a ProfilePage node pointing at the Person of the layout. */
export function ProfileJsonLd({ content: c, origin }: { content: Content; origin: string }) {
  const root = absoluteUrl("", origin);
  const data = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${localeUrl(c.locale, "/", origin)}#profile`,
    url: localeUrl(c.locale, "/", origin),
    name: c.meta.title,
    inLanguage: c.locale,
    isPartOf: { "@id": `${root}/#website` },
    mainEntity: { "@id": `${root}/#person` },
    dateModified: "2026-11-22",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
