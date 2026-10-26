import Image from "next/image";
import Link from "next/link";
import { categories } from "@/lib/data";
import { ArrowUpRightIcon } from "@/components/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Categories() {
  return (
    <section id="categories" className="scroll-mt-24 bg-charcoal py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Browse by style"
          title="Explore by Category"
          description="Four distinct ways to ride. Find the silhouette that fits your style and we will match it to the right machine."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {categories.map((category, i) => (
            <Link
              key={category.id}
              href={`/bikes?category=${category.id}`}
              className="group relative block animate-fade-up overflow-hidden rounded-3xl border border-white/10 bg-ink transition-all duration-500 hover:-translate-y-2 hover:border-brand/50 hover:shadow-2xl hover:shadow-black/60 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover grayscale-[35%] transition-all duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10 transition-opacity duration-500 group-hover:from-brand-dark/70 group-hover:via-ink/40" />
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-light">
                    {category.count} models
                  </span>
                  <h3 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-300">{category.blurb}</p>
                </div>

                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:shadow-lg group-hover:shadow-brand/40">
                  <ArrowUpRightIcon className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
