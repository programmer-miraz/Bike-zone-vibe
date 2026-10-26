import Link from "next/link";
import {
  contact,
  categories,
  footerLinks,
  copyrightYear,
  imageCredits,
} from "@/lib/data";
import {
  ClockIcon,
  FacebookIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  XIcon,
  YoutubeIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { Logo } from "@/components/ui/Logo";

const socials = [
  { label: "Facebook", href: "https://www.facebook.com/", Icon: FacebookIcon },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    Icon: InstagramIcon,
  },
  { label: "X", href: "https://x.com/", Icon: XIcon },
  { label: "YouTube", href: "https://www.youtube.com/", Icon: YoutubeIcon },
];

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1.5 text-sm text-mist transition-colors hover:text-brand-light focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 focus-visible:rounded-sm"
            >
              <span className="h-1 w-1 rounded-full bg-brand/60 transition-all group-hover:w-3" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-24 border-t border-white/10 bg-ink">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mist">
            Premium motorcycles, honest guidance and a community of riders.
            Ride beyond limits with BikeZone.
          </p>

          <div className="mt-6 flex items-center gap-3">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-zinc-300 transition-all duration-300 hover:border-brand hover:bg-brand hover:text-white hover:shadow-lg hover:shadow-brand/30 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <LinkColumn title="Company" links={[...footerLinks.company]} />
        <LinkColumn title="Support" links={[...footerLinks.support]} />

        {/* Contact */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white">
            Get in touch
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-mist">
            <li className="flex gap-3">
              <MapPinIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-light" />
              <span>{contact.address}</span>
            </li>
            <li className="flex gap-3">
              <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-light" />
              <a
                href="tel:+15550147800"
                className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 focus-visible:rounded-sm"
              >
                {contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-light" />
              <a
                href={`mailto:${contact.email}`}
                className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 focus-visible:rounded-sm"
              >
                {contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-light" />
              <span>{contact.hours}</span>
            </li>
          </ul>

          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent("Book a test ride")}`}
            className="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-brand-light focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 focus-visible:rounded-sm"
          >
            Book a test ride
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* Categories strip */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-6 sm:px-8">
          <ul className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/bikes?category=${category.id}`}
                  className="inline-block rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-mist transition-all hover:border-brand hover:text-white focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col items-start gap-1 sm:items-end">
            <p className="text-xs text-zinc-400">
              © {copyrightYear} BikeZone. All rights reserved.
            </p>
            <p className="text-xs text-zinc-500">
              {imageCredits.label}{" "}
              <a
                href={imageCredits.href}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-dotted underline-offset-2 transition-colors hover:text-zinc-300 focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 focus-visible:rounded-sm"
              >
                commons.wikimedia.org
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
