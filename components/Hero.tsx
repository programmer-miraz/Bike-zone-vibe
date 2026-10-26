
import { heroStats } from "@/lib/data";
import { ArrowRightIcon, GaugeIcon, CogIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

const HERO_IMAGE = "/bikes/Ninja Ride.png";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-ink pt-32 pb-20 sm:pt-36 lg:pt-44 lg:pb-28"
    >
      {/* Ambient red glow + grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 -top-56 h-[38rem] w-[38rem] rounded-full bg-brand/25 blur-[140px]" />
        <div className="absolute -right-32 top-40 h-[30rem] w-[30rem] rounded-full bg-brand/10 blur-[130px]" />
        <div className="absolute inset-0 grid-lines opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="mx-auto grid max-w-7xl rounded-2xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16"
        style={{
          backgroundImage: `linear-gradient(to bottom,
              rgba(8, 9, 13, 0.92) 0%,
               rgba(8, 9, 13, 0.65) 30%,
              rgba(8, 9, 13, 0.90) 100%),url('/bikes/Ninja Ride.png')`,
          backgroundSize: "cover",
          // height:200,
          backgroundPosition: "center",
        }}

      >
        {/* Copy */}
        <div className="animate-fade-up pt-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-zinc-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-brand" />
            2026 Collection Available
          </span>

          <h1 className="mt-6 text-5xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl xl:text-7xl">
            Ride
            <span className="text-gradient-brand"> Beyond</span>
            <br />
            Limits
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-mist">
            Discover the perfect machine for your next adventure — hand-picked
            performance bikes, transparent pricing and riders who live it too.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button href="/bikes" size="lg">
              Explore Collection
              <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Button>
            <Button href="/#about" variant="outline" size="lg">
              Learn More
            </Button>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-8">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-black text-red-500 ">{stat.value}</dd>
                <dd className="mt-1 text-xs font-medium uppercase pb-3 tracking-wider text-mist">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Imagery */}
        <div
          className="relative animate-fade-up"
          style={{ animationDelay: "150ms" }}
        >
          <div className="absolute inset-6 -z-10 rounded-full bg-brand/30 blur-[110px]" />

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl shadow-black/60">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={HERO_IMAGE}
                alt="Ducati Panigale V4 sport motorcycle on display"


                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
          </div>

          {/* Floating spec chips */}
          <div
            className="absolute -bottom-6 -left-4 hidden animate-float items-center gap-3 rounded-2xl border border-white/10 bg-charcoal/95 px-4 py-3 shadow-xl shadow-black/50 backdrop-blur sm:flex"
            style={{ animationDelay: "400ms" }}
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/15 text-brand-light">
              <GaugeIcon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-white hover:text-brand-light">2.9s</span>
              <span className="block text-[11px] uppercase tracking-wider text-mist">
                0–60 mph
              </span>
            </span>
          </div>

          <div
            className="absolute -right-3 top-4 hidden animate-float items-center gap-3 rounded-2xl border border-white/10 bg-charcoal/95 px-4 py-3 shadow-xl shadow-black/50 backdrop-blur sm:flex"
            style={{ animationDelay: "900ms" }}
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand/15 text-brand-light">
              <CogIcon className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-sm font-bold text-white hover:text-brand-light">1,103cc</span>
              <span className="block text-[11px] uppercase tracking-wider text-mist">
                V4 Engine
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
