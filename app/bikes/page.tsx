import { Suspense } from "react";
import type { Metadata } from "next";
import { BikesExplorer } from "@/components/bikes/BikesExplorer";
import { BikesExplorerSkeleton } from "@/components/bikes/BikesExplorerSkeleton";
import {
  parseCategoryParam,
  parseSearchParam,
  parseSortParam,
} from "@/lib/types";

export const metadata: Metadata = {
  title: "All Bikes",
  description:
    "Browse every motorcycle in the BikeZone lineup — search by brand or model, filter by Sport, Cruiser, Adventure or Street, and sort by price.",
};

// The page gets its search parameters like this:
// /bikes?search=harley&category=Cruiser&sort=price-asc
type SearchParams = PageProps<"/bikes">["searchParams"];

export default function BikesPage({ searchParams }: PageProps<"/bikes">) {
  return (
    <section className="bg-ink pb-24 pt-32 sm:pt-36 lg:pt-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <header className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-brand-light">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            The full lineup
          </span>
          <h1 className="text-4xl font-black uppercase tracking-tight text-white sm:text-5xl">
            All Motorcycles
          </h1>
          <p className="text-base leading-relaxed text-mist sm:text-lg">
            Search the showroom by brand or model, filter by riding style and
            sort prices in either direction — everything updates in place.
          </p>
        </header>

        {/* The browser needs the URL parameters, so it is loaded inside a
            Suspense boundary and streamed in after the page shell. */}
        <Suspense fallback={<BikesExplorerSkeleton />}>
          <BikesBrowser searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}

/**
 * Reads the URL parameters and gives them to the BikesExplorer as the
 * starting values of the search box, the filter and the sort.
 */
async function BikesBrowser({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;

  const category = parseCategoryParam(params.category) ?? "all";
  const sort = parseSortParam(params.sort) ?? "default";
  const query = parseSearchParam(params.q ?? params.search);

  // The key changes when the URL changes, so the explorer starts over with
  // the new values instead of keeping the old ones.
  const key = `${category}|${sort}|${query}`;

  return (
    <BikesExplorer
      key={key}
      initialQuery={query}
      initialCategory={category}
      initialSort={sort}
    />
  );
}
