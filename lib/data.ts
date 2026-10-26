// Homepage content for BikeZone.
//
// `lib/sample-bikes.json` is the single source of truth for the sample
// inventory: it seeds MongoDB (scripts/seed.mjs) and feeds the featured
// showcase below, so card links always match real database IDs. The images
// are vendored locally in /public/bikes (downloaded from Wikimedia Commons,
// which is freely licensed) — serving them from the app avoids the upstream
// rate-limiting (HTTP 429) that broke remote next/image optimization.
// Source files: https://commons.wikimedia.org — see `imageCredits` below.

import sampleBikesJson from "./sample-bikes.json";
import { CATEGORIES, type Bike, type BikeCategory } from "@/lib/types";

// The JSON is hand-maintained to match the Bike shape exactly; the seed
// script validates every entry before it touches the database.
export const sampleBikes: Bike[] = sampleBikesJson as Bike[];

export type Category = {
  id: string;
  name: BikeCategory;
  image: string;
  alt: string;
  count: number;
  blurb: string;
};

export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: "quality" | "service" | "support" | "secure";
};

// Real routes so every nav item works from any page. Hash-only links break
// once you navigate away from the homepage, so on-page anchors carry "/#".
export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Bikes", href: "/bikes" },
  { label: "Categories", href: "/#categories" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
] as const;

const FEATURED_BIKE_IDS = [
  "panigale-v4r",
  "harley-vrod",
  "r1300gs",
  "cb1000r",
] as const;

/**
 * The four showcase machines on the home page.
 * We look up every id in the sample data and skip the ones that are
 * missing (every id exists in the sample database).
 */
export const featuredBikes: Bike[] = FEATURED_BIKE_IDS.map((id) =>
  sampleBikes.find((bike) => bike.id === id),
).filter((bike): bike is Bike => bike !== undefined);

const categoryContent: Record<
  BikeCategory,
  { image: string; alt: string; blurb: string }
> = {
  Sport: {
    image: "/bikes/category-sport.jpg",
    alt: "Blue and white Suzuki GSX-R750 sport motorcycle",
    blurb: "Track-bred performance",
  },
  Cruiser: {
    image: "/bikes/category-cruiser.jpg",
    alt: "Harley-Davidson VRSC Anniversary Edition cruiser motorcycle",
    blurb: "Relaxed V-Twin power",
  },
  Adventure: {
    image: "/bikes/category-adventure.jpg",
    alt: "BMW R 1300 GS Adventure in Triple Black",
    blurb: "Built to go anywhere",
  },
  Street: {
    image: "/bikes/category-street.jpg",
    alt: "Honda CB1000R naked street motorcycle",
    blurb: "Everyday agility",
  },
};

/** Category cards with counts computed from the actual sample inventory. */
export const categories: Category[] = CATEGORIES.map((name) => {
  const content = categoryContent[name];
  return {
    id: name.toLowerCase(),
    name,
    image: content.image,
    alt: content.alt,
    blurb: content.blurb,
    count: sampleBikes.filter((bike) => bike.category === name).length,
  };
});

export const features: Feature[] = [
  {
    id: "quality",
    title: "Quality Bikes",
    description:
      "Every machine is inspected across a 40-point checklist before it reaches the showroom floor.",
    icon: "quality",
  },
  {
    id: "service",
    title: "Trusted Service",
    description:
      "Factory-trained technicians and genuine parts keep your ride performing season after season.",
    icon: "service",
  },
  {
    id: "support",
    title: "Expert Support",
    description:
      "Talk to riders who know the specs — before, during and long after you take delivery.",
    icon: "support",
  },
  {
    id: "secure",
    title: "Secure Shopping",
    description:
      "Encrypted checkout, flexible financing and insured delivery on every purchase.",
    icon: "secure",
  },
];

export const contact = {
  address: "1200 Chrome Avenue, Rider City, CA 90210",
  phone: "+1 (555) 014-7800",
  email: "hello@bikezone.example",
  hours: "Mon–Sat: 9:00 AM – 7:00 PM",
};

export const footerLinks = {
  company: [
    { label: "About Us", href: "/#about" },
    { label: "Our Team", href: "/#about" },
    { label: "Careers", href: "/#contact" },
    { label: "Testimonials", href: "/#about" },
  ],
  support: [
    { label: "Financing", href: "/#contact" },
    { label: "Service & Parts", href: "/#contact" },
    { label: "Warranty", href: "/#contact" },
    { label: "FAQs", href: "/#contact" },
  ],
};

export const heroStats = [
  { value: "200+", label: "Bikes in stock" },
  { value: "15 yrs", label: "On the road" },
  { value: "4.9/5", label: "Rider rating" },
];

// Sample content: build-time constant (avoid `new Date()` at render time, which
// is an unstable value under Cache Components prerendering).
export const copyrightYear = "2026";

// Attribution for locally vendored photography (freely licensed on Wikimedia
// Commons). The Commons file pages carry the exact author and license.
export const imageCredits = {
  label: "Photography via Wikimedia Commons",
  href: "https://commons.wikimedia.org/wiki/Category:Motorcycles",
};
