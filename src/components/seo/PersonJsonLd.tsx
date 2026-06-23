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

export function PersonJsonLd({ locale }: { locale: string }) {
  const isRu = locale === "ru";

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${absoluteUrl()}/#person`,
        name: isRu ? "Михаил Калачёв" : "Mikhail Kalachev",
        alternateName: isRu ? "Mikhail Kalachev" : "Михаил Калачёв",
        jobTitle: "Fullstack Developer",
        url: localeUrl(locale),
        image: absoluteUrl("/images/profile.png"),
        sameAs: ["https://t.me/MasterKurosava"],
        knowsAbout: KNOWS_ABOUT,
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl()}/#website`,
        name: isRu ? "Михаил Калачёв — Fullstack Developer" : "Mikhail Kalachev — Fullstack Developer",
        url: absoluteUrl(),
        inLanguage: ["ru", "en"],
        publisher: { "@id": `${absoluteUrl()}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${localeUrl(locale)}#profile`,
        url: localeUrl(locale),
        name: isRu ? "Портфолио Михаила Калачёва" : "Mikhail Kalachev Portfolio",
        inLanguage: locale,
        isPartOf: { "@id": `${absoluteUrl()}/#website` },
        about: { "@id": `${absoluteUrl()}/#person` },
        mainEntity: { "@id": `${absoluteUrl()}/#person` },
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
