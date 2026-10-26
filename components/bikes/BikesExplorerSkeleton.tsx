/**
 * Loading skeleton for the bikes browser — used as the Suspense fallback on
 * /bikes and while the initial list request is in flight. Pure markup, safe to
 * import from both server and client components.
 */
export function BikesExplorerSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div aria-hidden="true">
      {/* Toolbar skeleton */}
      <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="h-12 w-full animate-pulse rounded-full border border-line bg-surface lg:max-w-sm" />
        <div className="flex flex-wrap gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 animate-pulse rounded-full border border-line bg-surface"
            />
          ))}
        </div>
      </div>

      {/* Results meta skeleton */}
      <div className="mt-8 h-5 w-40 animate-pulse rounded-md border-b border-white/10 bg-surface/60" />

      {/* Card grid skeleton */}
      <div className="mt-6 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(cards)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse overflow-hidden rounded-3xl border border-line bg-charcoal"
          >
            <div className="aspect-[4/3] w-full bg-surface" />
            <div className="space-y-4 p-6">
              <div className="h-3 w-20 rounded bg-surface" />
              <div className="h-6 w-3/4 rounded bg-surface" />
              <div className="h-4 w-1/2 rounded bg-surface" />
              <div className="h-8 w-1/3 rounded bg-surface" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
