import { features } from "@/lib/data";
import {
  HeadsetIcon,
  LockIcon,
  ShieldCheckIcon,
  GaugeIcon,
} from "@/components/icons";
import { SectionHeading } from "@/components/ui/SectionHeading";

const iconMap = {
  quality: GaugeIcon,
  service: ShieldCheckIcon,
  support: HeadsetIcon,
  secure: LockIcon,
} as const;

export function WhyChooseUs() {
  return (
    <section id="about" className="scroll-mt-24 bg-charcoal py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="The BikeZone difference"
          title="Why Choose Us"
          description="A dealership built by riders, for riders — where the experience matters as much as the machine."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            return (
              <article
                key={feature.id}
                className="group animate-fade-up rounded-3xl border border-white/10 bg-ink p-7 transition-all duration-500 hover:-translate-y-2 hover:border-brand/40 hover:bg-surface hover:shadow-2xl hover:shadow-black/50"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand/12 text-brand-light transition-all duration-500 group-hover:rotate-6 group-hover:bg-brand group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand/40">
                  <Icon className="h-7 w-7" />
                </span>

                <span className="mt-6 block text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-colors group-hover:text-brand-light">
                  0{i + 1}
                </span>

                <h3 className="mt-2 text-xl font-bold text-white">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-mist">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
