import { Hero } from "@/components/sections/Hero";
import { RoadmapJourney } from "@/components/sections/roadmap/RoadmapJourney";
import { ExpertiseSection } from "@/components/sections/ExpertiseSection";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { ExpertiseMap } from "@/components/sections/ExpertiseMap";
import { Finale } from "@/components/sections/Finale";

export function HomePage() {
  return (
    <>
      <Hero />
      <ImpactSection />
      <RoadmapJourney />
      <ExpertiseSection />
      <ExpertiseMap />
      <Finale />
    </>
  );
}
