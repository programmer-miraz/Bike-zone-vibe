import type { Metadata } from "next";
import { ArrowRightIcon, SearchIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
};

/** Global 404 — also used for invalid or unknown bike ids on /bikes/[id]. */
export default function NotFound() {
  return (
    <section className="flex flex-1 items-center bg-ink pb-24 pt-36 sm:pt-44">
      <div className="mx-auto w-full max-w-xl px-5 text-center sm:px-8">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand/15 text-brand-light">
          <SearchIcon className="h-8 w-8" />
        </span>

        <p className="mt-7 text-7xl font-black leading-none text-gradient-brand sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-mist">
          The page you are looking for does not exist or has moved. If you
          followed a bike link, that bike may not be in the database yet —
          running <code className="text-zinc-300">npm run seed</code> loads the
          sample catalog.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button href="/" size="lg">
            Back to home
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
          <Button href="/bikes" variant="outline" size="lg">
            Browse all bikes
          </Button>
        </div>
      </div>
    </section>
  );
}
