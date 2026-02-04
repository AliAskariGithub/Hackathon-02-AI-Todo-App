import { FeaturesSection } from "@/components/FeaturesSection";
import HeroSection from "@/components/HeroSection";
import TestimonialGrid from "@/components/Testimonials/TestimonialGrid";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <HeroSection />
      <FeaturesSection />
      <TestimonialGrid />
    </div>
  );
}
