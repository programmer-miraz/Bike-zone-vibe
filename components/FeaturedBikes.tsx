import { featuredBikes } from "@/lib/data";
import { ArrowRightIcon } from "@/components/icons";
import { BikeCard } from "@/components/BikeCard";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const CARD_SIZES = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw";

export function FeaturedBikes() {
  return (
    <section id="bikes" className="scroll-mt-24 bg-ink py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Hand-picked"
          title="Featured Motorcycles"
          description="A rotating showcase of the most sought-after machines on our floor — each one inspected, serviced and ready to ride home."
        />

        <div className="mt-12 grid gap-7  sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {featuredBikes.map((bike, i) => (
            <BikeCard key={bike.id} bike={bike} index={i} sizes={CARD_SIZES} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="/bikes" variant="outline" size="lg">
            Browse all bikes
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
