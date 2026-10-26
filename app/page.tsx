import { Hero } from "@/components/Hero";
import { FeaturedBikes } from "@/components/FeaturedBikes";
import { Categories } from "@/components/Categories";
import { PromoBanner } from "@/components/PromoBanner";
import { WhyChooseUs } from "@/components/WhyChooseUs";

// Navbar and Footer live in app/layout.tsx so every route shares them.
export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedBikes />
      <Categories />
      <PromoBanner />
      <WhyChooseUs />
    </>
  );
}
