import { Hero } from "@/components/sections/Hero";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { LazyMount } from "@/components/ui/lazy-mount";
import dynamic from "next/dynamic";

const RoadmapJourney = dynamic(
  () => import("@/components/sections/roadmap/RoadmapJourney").then((m) => m.RoadmapJourney),
  { loading: () => null }
);

const ExpertiseSection = dynamic(
  () => import("@/components/sections/ExpertiseSection").then((m) => m.ExpertiseSection),
  { loading: () => null }
);

const ExpertiseMap = dynamic(
  () => import("@/components/sections/ExpertiseMap").then((m) => m.ExpertiseMap),
  { loading: () => null }
);

const Finale = dynamic(
  () => import("@/components/sections/Finale").then((m) => m.Finale),
  { loading: () => null }
);

export function HomePage() {
  return (
    <>
      <Hero />
      <ImpactSection />
      <LazyMount minHeight="40vh">
        <RoadmapJourney />
      </LazyMount>
      <LazyMount minHeight="32vh">
        <ExpertiseSection />
      </LazyMount>
      <LazyMount minHeight="48vh">
        <ExpertiseMap />
      </LazyMount>
      <LazyMount minHeight="50vh">
        <Finale />
      </LazyMount>
    </>
  );
}
