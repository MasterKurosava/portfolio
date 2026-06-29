import { absoluteUrl, localeUrl } from "@/lib/site";

const KNOWS_ABOUT = [
  "React",
  "Next.js",
  "Vue",
  "TypeScript",
  "Laravel",
  "PHP",
  "Fullstack Development",
  "Web Architecture",
  "SSR",
  "CI/CD",
];

export function PersonJsonLd({
  locale,
  siteOrigin,
}: {
  locale: string;
  siteOrigin: string;
}) {
  const isRu = locale === "ru";

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${absoluteUrl("", siteOrigin)}/#person`,
        name: isRu ? "Михаил Калачёв" : "Mikhail Kalachev",
        alternateName: isRu ? "Mikhail Kalachev" : "Михаил Калачёв",
        jobTitle: "Fullstack Developer",
        url: localeUrl(locale, "/", siteOrigin),
        image: absoluteUrl("/images/profile.png", siteOrigin),
        sameAs: ["https://t.me/MasterKurosava"],
        knowsAbout: KNOWS_ABOUT,
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("", siteOrigin)}/#website`,
        name: isRu ? "Михаил Калачёв — Fullstack Developer" : "Mikhail Kalachev — Fullstack Developer",
        url: absoluteUrl("", siteOrigin),
        inLanguage: ["ru", "en"],
        publisher: { "@id": `${absoluteUrl("", siteOrigin)}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${localeUrl(locale, "/", siteOrigin)}#profile`,
        url: localeUrl(locale, "/", siteOrigin),
        name: isRu ? "Портфолио Михаила Калачёва" : "Mikhail Kalachev Portfolio",
        inLanguage: locale,
        isPartOf: { "@id": `${absoluteUrl("", siteOrigin)}/#website` },
        about: { "@id": `${absoluteUrl("", siteOrigin)}/#person` },
        mainEntity: { "@id": `${absoluteUrl("", siteOrigin)}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
