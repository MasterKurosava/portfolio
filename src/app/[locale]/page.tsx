import { setRequestLocale } from "next-intl/server";
import { resolveSiteOrigin } from "@/lib/site";
import { ProfileJsonLd } from "@/components/seo/PersonJsonLd";
import { getContent } from "@/content";
import { Hero } from "@/components/home/Hero";
import { WorkSheet } from "@/components/home/WorkSheet";
import { StackSheet } from "@/components/home/StackSheet";
import { ProjectsSheet } from "@/components/home/ProjectsSheet";
import { ContactSheet } from "@/components/home/ContactSheet";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = getContent(locale);
  const origin = await resolveSiteOrigin();
  return (
    <>
      <ProfileJsonLd content={c} origin={origin} />
      <Hero content={c} />
      <WorkSheet content={c} />
      <StackSheet content={c} />
      <ProjectsSheet content={c} />
      <ContactSheet content={c} />
    </>
  );
}
