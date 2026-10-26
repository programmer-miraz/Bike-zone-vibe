import Image from "next/image";
import { ArrowRightIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

 const BANNER_IMAGE = "/bikes/hero.jpg";

export function PromoBanner() {
  return (
    <section className="bg-ink py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative animate-fade-up overflow-hidden rounded-[2rem] border border-white/10">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <Image
              src={BANNER_IMAGE}
              alt=""
              fill
              aria-hidden
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-brand-dark/70" />
            <div className="absolute inset-0 bg-ink/40" />
          </div>

          <div className="flex flex-col gap-8 px-7 py-16 sm:px-12 lg:flex-row lg:items-center lg:justify-between lg:py-20">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-brand-light">
                Ready when you are
              </span>
              <h2 className="mt-4 text-4xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
                Find Your Perfect Ride
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
                Two hundred machines on the floor, one that belongs to you.
                Filter by category, budget or power — then book a test ride in
                under a minute.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-4">
              <Button href="/bikes" size="lg" variant="light">
                Browse All Bikes
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
              <span className="text-center text-sm text-zinc-300">
                No dealership fees · Free test rides
              </span>
            </div>
          </div>

          {/* Decorative corner */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
        </div>
      </div>
    </section>
  );
}
