import Image from "next/image";
import Link from "next/link";
import {
  bikeName,
  formatCc,
  formatHorsepower,
  formatPrice,
  type Bike,
} from "@/lib/types";
import { ArrowUpRightIcon, CogIcon, GaugeIcon } from "@/components/icons";

type Props = {
  bike: Bike;
  /** Stagger index for the entrance animation (0-based). */
  index?: number;
  /** Responsive `sizes` hint for next/image (varies by grid). */
  sizes?: string;
  priority?: boolean;
};

const DEFAULT_SIZES =
  "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

/**
 * Catalog card — image, brand, model, category, engine capacity and price.
 * Shared by the homepage showcase, the /bikes listing and related-bike grids.
 * Server- and client-safe (no hooks, no data access).
 *
 * The whole card is clickable: the model title carries a stretched link
 * (::after covers the card) so there is exactly one link for assistive
 * technology, with a focus ring drawn around the entire card.
 */
export function BikeCard({
  bike,
  index = 0,
  sizes = DEFAULT_SIZES,
  priority = false,
}: Props) {
  return (
    <article
      className="group relative flex h-full animate-fade-up flex-col overflow-hidden rounded-3xl border border-line bg-charcoal transition-all duration-500 hover:-translate-y-2 hover:border-brand/40 hover:shadow-2xl hover:shadow-black/60 has-[:focus-visible]:border-brand has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand has-[:focus-visible]:outline-offset-2"
      style={{ animationDelay: `${Math.min(index, 8) * 90}ms` }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface">
        <Image
          src={bike.image}
          alt={bike.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {bike.badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg shadow-black/40">
            {bike.badge}
          </span>
        ) : null}

        <span className="absolute right-4 top-4 rounded-full border border-white/20 bg-ink/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zinc-200 backdrop-blur">
          {bike.category}
        </span>

        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-light">
            {bike.brand}
          </p>
          <h3 className="mt-1 text-xl font-bold text-white transition-colors group-hover:text-brand-light">
            <Link
              href={`/bikes/${bike.id}`}
              aria-label={`View details for ${bikeName(bike)}`}
              className="rounded-sm outline-none after:absolute after:inset-0 after:content-[''] focus-visible:outline-2 focus-visible:outline-brand"
            >
              {bike.model}
            </Link>
          </h3>
        </div>

        <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-mist">
          <li className="flex items-center gap-2">
            <CogIcon className="h-4 w-4 text-brand-light/80" />
            {formatCc(bike.engineCc)}
          </li>
          <li className="flex items-center gap-2">
            <GaugeIcon className="h-4 w-4 text-brand-light/80" />
            {formatHorsepower(bike.horsepower)}
          </li>
        </ul>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-5">
          <div>
            <span className="block text-2xl font-black text-white">
              {formatPrice(bike.price)}
            </span>
            {bike.previousPrice ? (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(bike.previousPrice)}
              </span>
            ) : null}
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:shadow-lg group-hover:shadow-brand/30">
            View Details
            <ArrowUpRightIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
