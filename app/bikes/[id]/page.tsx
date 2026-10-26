import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { io } from "next/cache";
import type { Metadata } from "next";
import { getBikeById, getRelatedBikes } from "@/lib/bikes";
import {
  bikeName,
  formatCc,
  formatHorsepower,
  formatPrice,
  isValidBikeId,
  type Bike,
  type BikeSpecs,
} from "@/lib/types";
import { ArrowLeftIcon, CogIcon, GaugeIcon } from "@/components/icons";
import { BikeCard } from "@/components/BikeCard";
import { Button } from "@/components/ui/Button";

const SHOWROOM_PHONE_HREF = "tel:+15550147800";

// The specification rows, in the order they are shown on the page.
const SPEC_LABELS: { key: keyof BikeSpecs; label: string }[] = [
  { key: "engine", label: "Engine" },
  { key: "power", label: "Power" },
  { key: "torque", label: "Torque" },
  { key: "transmission", label: "Transmission" },
  { key: "topSpeed", label: "Top speed" },
  { key: "weight", label: "Weight" },
  { key: "seatHeight", label: "Seat height" },
  { key: "fuelCapacity", label: "Fuel capacity" },
];

// The page title in the browser tab.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  if (!isValidBikeId(id)) return { title: "Bike not found" };

  try {
    // Keep the database query out of the prerender step.
    await io();
    const bike = await getBikeById(id);

    if (!bike) return { title: "Bike not found" };

    return {
      title: bikeName(bike),
      description: bike.description.slice(0, 155),
    };
  } catch {
    // The database is unreachable — show a simple title instead of failing.
    return { title: "Bike Details" };
  }
}

// Navigations to this page may wait for the streamed content.
export const instant = false;

/**
 * /bikes/[id] — the page of one bike.
 *
 * The empty shell (back link + skeleton) is sent first, then the bike
 * itself is loaded from MongoDB and streamed in.
 */
export default async function BikeDetailsPage({
  params,
}: PageProps<"/bikes/[id]">) {
  const { id } = await params;

  // A wrong id (bad slug, wrong length, path junk) never reaches the database.
  if (!isValidBikeId(id)) notFound();

  return (
    <section className="bg-ink pb-24 pt-32 sm:pt-36 lg:pt-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Suspense fallback={<BikeDetailsSkeleton />}>
          <BikeDetails id={id} />
        </Suspense>
      </div>
    </section>
  );
}

/**
 * Loads the bike and the related bikes from MongoDB, then shows the content.
 */
async function BikeDetails({ id }: { id: string }) {
  // The MongoDB driver reads the current time internally, which is not
  // allowed while the page is being prepared ahead of time. io() stops the
  // prerender here and continues at request time.
  await io();

  const bike = await getBikeById(id);
  if (!bike) notFound();

  const related = await getRelatedBikes(bike, 3);

  return <BikeDetailsContent bike={bike} related={related} />;
}

// The grey placeholder shown while the bike is loading.
function BikeDetailsSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse">
      <div className="h-10 w-44 rounded-full border border-white/15 bg-surface" />

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="aspect-[4/3] w-full rounded-3xl border border-line bg-surface" />

        <div className="space-y-6">
          <div className="flex gap-3">
            <div className="h-5 w-24 rounded bg-surface" />
            <div className="h-5 w-20 rounded bg-surface" />
          </div>
          <div className="h-10 w-3/4 rounded-lg bg-surface" />
          <div className="h-9 w-40 rounded bg-surface" />
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-surface" />
            <div className="h-4 w-5/6 rounded bg-surface" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-2xl border border-line bg-surface"
              />
            ))}
          </div>
          <div className="flex gap-4">
            <div className="h-12 w-48 rounded-full bg-surface" />
            <div className="h-12 w-44 rounded-full bg-surface" />
          </div>
        </div>
      </div>

      <div className="mt-14 h-64 rounded-3xl border border-line bg-charcoal" />
      <div className="mt-16 h-8 w-64 rounded bg-surface" />
      <div className="mt-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-80 rounded-3xl border border-line bg-surface" />
        ))}
      </div>
    </div>
  );
}

// Everything we show for one bike.
function BikeDetailsContent({
  bike,
  related,
}: {
  bike: Bike;
  related: Bike[];
}) {
  // The four small boxes under the description.
  const quickStats = [
    { label: "Engine capacity", value: formatCc(bike.engineCc), icon: CogIcon },
    {
      label: "Horsepower",
      value: formatHorsepower(bike.horsepower),
      icon: GaugeIcon,
    },
    { label: "Top speed", value: `${bike.topSpeedMph} mph`, icon: GaugeIcon },
    { label: "Category", value: bike.category, icon: CogIcon },
  ];

  return (
    <>
      <Link
        href="/bikes"
        className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-300 transition-all hover:border-brand hover:text-white focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
      >
        <ArrowLeftIcon className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        Back to all bikes
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:items-start">
        {/* Image */}
        <div className="relative animate-fade-up overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="relative aspect-[4/3] w-full">
            <Image
              src={bike.image}
              alt={bike.alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          {bike.badge ? (
            <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-black/40">
              {bike.badge}
            </span>
          ) : null}
        </div>

        {/* Info */}
        <div className="animate-fade-up">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-light">
              {bike.brand}
            </span>
            <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-300">
              {bike.category}
            </span>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
              In stock
            </span>
          </div>

          <h1 className="mt-3 text-4xl font-black uppercase leading-[1.05] tracking-tight text-white sm:text-5xl">
            {bike.model}
          </h1>

          <div className="mt-6 flex flex-wrap items-end gap-4">
            <span className="text-4xl font-black text-white">
              {formatPrice(bike.price)}
            </span>
            {bike.previousPrice ? (
              <span className="pb-1 text-base text-zinc-400 line-through">
                {formatPrice(bike.previousPrice)}
              </span>
            ) : null}
          </div>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-mist">
            {bike.description}
          </p>

          {/* Quick stats */}
          <dl className="mt-8 grid grid-cols-2 gap-4">
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-brand/40"
              >
                <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <stat.icon className="h-4 w-4 text-brand-light/80" />
                  {stat.label}
                </dt>
                <dd className="mt-2 text-xl font-black text-white">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              href={`mailto:hello@bikezone.example?subject=${encodeURIComponent(`Test ride: ${bikeName(bike)}`)}`}
              size="lg"
            >
              Book a test ride
            </Button>
            <Button href={SHOWROOM_PHONE_HREF} variant="outline" size="lg">
              Call the showroom
            </Button>
          </div>
        </div>
      </div>

      {/* Full specifications */}
      <div className="mt-14 rounded-3xl border border-line bg-charcoal p-7 sm:p-9">
        <h2 className="text-2xl font-black uppercase tracking-tight text-white">
          Specifications
        </h2>
        <dl className="mt-6 grid gap-x-10 gap-y-0 sm:grid-cols-2">
          {SPEC_LABELS.map(({ key, label }) => (
            <div
              key={key}
              className="flex items-baseline justify-between gap-4 border-b border-white/10 py-4"
            >
              <dt className="text-sm text-mist">{label}</dt>
              <dd className="text-right text-sm font-bold text-white">
                {bike.specs[key]}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Related bikes */}
      {related.length > 0 ? (
        <section className="mt-16" aria-labelledby="related-heading">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-light">
                Keep exploring
              </span>
              <h2
                id="related-heading"
                className="mt-2 text-3xl font-black uppercase tracking-tight text-white"
              >
                Related {bike.category} bikes
              </h2>
            </div>
            <Link
              href={`/bikes?category=${bike.category.toLowerCase()}`}
              className="text-sm font-bold text-white underline decoration-brand/60 underline-offset-4 transition-colors hover:text-brand-light focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 focus-visible:rounded-sm"
            >
              View all {bike.category.toLowerCase()} bikes
            </Link>
          </div>

          <div className="mt-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedBike, index) => (
              <BikeCard
                key={relatedBike.id}
                bike={relatedBike}
                index={index}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
