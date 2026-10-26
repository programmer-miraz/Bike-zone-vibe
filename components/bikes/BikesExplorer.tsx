"use client";

import { useEffect, useRef, useState } from "react";
import {
  CATEGORIES,
  SORT_LABELS,
  SORT_OPTIONS,
  type Bike,
  type BikeCategory,
  type BikeSort,
} from "@/lib/types";
import { AlertIcon, ChevronDownIcon, SearchIcon } from "@/components/icons";
import { BikeCard } from "@/components/BikeCard";
import { BikesExplorerSkeleton } from "@/components/bikes/BikesExplorerSkeleton";

type CategoryFilter = BikeCategory | "all";

type Props = {
  initialQuery?: string;
  initialCategory?: CategoryFilter;
  initialSort?: BikeSort;
};

// Which screen we show: the skeleton, the bike list, or the error message.
type Status = "loading" | "success" | "error";

// The "All" chip plus one chip for every category.
const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  ...CATEGORIES.map((category) => ({ value: category, label: category })),
];

// How long we wait after the last key stroke before searching (milliseconds).
const DEBOUNCE_MS = 300;

/**
 * Turn the current search / filter / sort state into a query string,
 * for example: "search=harley&category=Cruiser&sort=price-asc".
 */
function buildSearchParams(
  query: string,
  category: CategoryFilter,
  sort: BikeSort,
): string {
  const params = new URLSearchParams();

  const searchText = query.trim();
  if (searchText) params.set("search", searchText);
  if (category !== "all") params.set("category", category);
  if (sort !== "default") params.set("sort", sort);

  return params.toString();
}

/**
 * The interactive catalogue on /bikes.
 *
 * The user can search by brand/model, filter by category and sort by price.
 * All three are sent to GET /api/bikes together in one request.
 */
export function BikesExplorer({
  initialQuery = "",
  initialCategory = "all",
  initialSort = "default",
}: Props) {
  // The three controls the user can change.
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [sort, setSort] = useState<BikeSort>(initialSort);

  // The data we get back from the API, plus the state of the request.
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clicking "Try again" increases this number, which makes the effect
  // below run one more time and reload the bikes.
  const [retryCount, setRetryCount] = useState(0);

  // Used only to know if this is the very first load.
  const isFirstLoad = useRef(true);

  // Load the bikes whenever the search, filter or sort changes.
  useEffect(() => {
    // Lets us cancel the request if the user changes something again
    // before this request has finished.
    const controller = new AbortController();

    // The first load happens right away. Later changes wait a moment, so
    // typing in the search box does not send a request on every key stroke.
    const delay = isFirstLoad.current ? 0 : DEBOUNCE_MS;
    isFirstLoad.current = false;

    const timer = window.setTimeout(async () => {
      setStatus("loading");

      try {
        const searchParams = buildSearchParams(query, category, sort);
        const response = await fetch(
          `/api/bikes${searchParams ? `?${searchParams}` : ""}`,
          {
            signal: controller.signal,
            headers: { Accept: "application/json" },
          },
        );

        // The API always sends JSON, but a network error could still give us
        // something else — in that case we treat it as "no data".
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error ?? `The bikes could not be loaded (HTTP ${response.status}).`,
          );
        }

        setBikes(Array.isArray(data?.bikes) ? data.bikes : []);
        setErrorMessage(null);
        setStatus("success");
      } catch (error) {
        // The request was cancelled on purpose (the user typed again),
        // so there is nothing to show.
        if (controller.signal.aborted) return;

        setBikes([]);
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading bikes.",
        );
        setStatus("error");
      }
    }, delay);

    // Clean up: clear the timer and cancel the request when the effect
    // runs again or when the page is left.
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, category, sort, retryCount]);

  // True when the user has changed anything (search, filter or sort).
  const hasActiveFilters =
    query.trim().length > 0 || category !== "all" || sort !== "default";

  // Put every control back to its default value.
  function clearFilters() {
    setQuery("");
    setCategory("all");
    setSort("default");
  }

  // The text shown above the bike list ("12 bikes found" and friends).
  let resultLabel = `${bikes.length} bikes found`;
  if (status === "loading") {
    resultLabel = "Loading bikes…";
  } else if (status === "error") {
    resultLabel = "Bikes could not be loaded";
  } else if (bikes.length === 1) {
    resultLabel = "1 bike found";
  }

  return (
    <div>
      {/* Toolbar: search + category filters + sort */}
      <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <label htmlFor="bike-search" className="sr-only">
            Search bikes by brand or model
          </label>
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mist" />
          <input
            id="bike-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search brand or model…"
            autoComplete="off"
            enterKeyHint="search"
            className="h-12 w-full rounded-full border border-line bg-surface pl-12 pr-4 text-sm text-white transition-colors placeholder:text-zinc-500 hover:border-zinc-600 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <div
            role="group"
            aria-label="Filter bikes by category"
            className="flex flex-wrap gap-2"
          >
            {CATEGORY_OPTIONS.map((option) => {
              const active = category === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(option.value)}
                  className={`h-10 rounded-full border px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 ${
                    active
                      ? "border-brand bg-brand text-white shadow-lg shadow-brand/25"
                      : "border-line bg-surface text-zinc-300 hover:border-brand/50 hover:text-white"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="bike-sort" className="text-sm text-mist">
              Sort by
            </label>
            <div className="relative">
              <select
                id="bike-sort"
                value={sort}
                onChange={(event) => setSort(event.target.value as BikeSort)}
                className="h-10 cursor-pointer appearance-none rounded-full border border-line bg-surface pl-4 pr-10 text-sm font-semibold text-white transition-colors hover:border-brand/50 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/40"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {SORT_LABELS[option]}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
            </div>
          </div>
        </div>
      </div>

      {/* Result count / status — polite live region for screen readers */}
      <div
        aria-live="polite"
        className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5"
      >
        <p
          className={`text-sm font-medium ${status === "error" ? "text-brand-light" : "text-mist"}`}
        >
          {resultLabel}
        </p>

        {hasActiveFilters && status !== "loading" ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-semibold text-white underline decoration-brand/60 underline-offset-4 transition-colors hover:text-brand-light focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 focus-visible:rounded-sm"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      {status === "loading" ? (
        <div className="mt-6">
          <span className="sr-only">Loading bikes, please wait…</span>
          <BikesExplorerSkeleton cards={6} />
        </div>
      ) : null}

      {status === "error" ? (
        <div
          role="alert"
          className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-brand/40 bg-charcoal px-6 py-14 text-center"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand/15 text-brand-light">
            <AlertIcon className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-white">
              We could not load the bikes
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-mist">
              {errorMessage}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRetryCount((value) => value + 1)}
            className="mt-1 h-11 rounded-full bg-brand px-7 text-sm font-semibold text-white transition-all hover:bg-brand-light hover:shadow-lg hover:shadow-brand/30 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          >
            Try again
          </button>
        </div>
      ) : null}

      {status === "success" && bikes.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-line bg-charcoal px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-surface text-zinc-400">
            <SearchIcon className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-white">No bikes match</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-mist">
              {query.trim()
                ? `Nothing found for “${query.trim()}”. Try another brand or model, or clear your filters.`
                : "Try a different category or sort order."}
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-1 h-11 rounded-full border border-white/20 px-7 text-sm font-semibold text-white transition-all hover:border-brand hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          >
            Clear filters
          </button>
        </div>
      ) : null}

      {status === "success" && bikes.length > 0 ? (
        <div className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {bikes.map((bike, index) => (
            <BikeCard key={bike.id} bike={bike} index={index} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
