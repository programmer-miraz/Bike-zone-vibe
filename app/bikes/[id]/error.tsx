"use client";

import Link from "next/link";
import { AlertIcon, ArrowLeftIcon } from "@/components/icons";

/**
 * Error boundary for /bikes/[id] — shown when the database is unreachable or
 * the query fails. `reset()` re-renders the failed segment (retries the query).
 */
export default function BikeDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="bg-ink pb-24 pt-32 sm:pt-36 lg:pt-40">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div
          role="alert"
          className="mx-auto flex max-w-xl flex-col items-center gap-5 rounded-3xl border border-brand/40 bg-charcoal px-6 py-16 text-center"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-brand/15 text-brand-light">
            <AlertIcon className="h-7 w-7" />
          </span>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Something went wrong
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              We could not load this bike&rsquo;s details. The database may be
              unreachable — check <code className="text-zinc-300">MONGODB_URI</code>{" "}
              in <code className="text-zinc-300">.env.local</code> and try again.
            </p>
            {error.digest ? (
              <p className="mt-2 text-xs text-zinc-500">
                Reference: {error.digest}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="h-11 rounded-full bg-brand px-7 text-sm font-semibold text-white transition-all hover:bg-brand-light hover:shadow-lg hover:shadow-brand/30 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            >
              Try again
            </button>
            <Link
              href="/bikes"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-7 text-sm font-semibold text-white transition-all hover:border-brand hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to all bikes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
