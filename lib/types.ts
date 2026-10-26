// Shared types and small helper functions for BikeZone.
//
// This file is used by server code (API routes, server components) *and*
// client code, so it must not contain anything Node-only
// (no mongodb import, no process.env, no fs).

// The four categories a bike can belong to.
//
// "as const" freezes the array so TypeScript knows its exact contents.
// BikeCategory is then read out of the array:
// typeof CATEGORIES  ->  readonly ["Sport", "Cruiser", "Adventure", "Street"]
// ...[number]        ->  "Sport" | "Cruiser" | "Adventure" | "Street"
// This way the list of categories and the TypeScript type can never drift apart.
export const CATEGORIES = ["Sport", "Cruiser", "Adventure", "Street"] as const;
export type BikeCategory = (typeof CATEGORIES)[number];

// Same trick for the ways the bikes can be sorted.
export const SORT_OPTIONS = ["default", "price-asc", "price-desc"] as const;
export type BikeSort = (typeof SORT_OPTIONS)[number];

// The text shown in the sort dropdown.
export const SORT_LABELS: Record<BikeSort, string> = {
  default: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
};

// The longest search text we accept (the UI and the API use the same limit).
export const MAX_SEARCH_LENGTH = 80;

// The specification table shown on the bike details page.
export type BikeSpecs = {
  engine: string;
  power: string;
  torque: string;
  transmission: string;
  topSpeed: string;
  weight: string;
  seatHeight: string;
  fuelCapacity: string;
};

// A motorcycle in the BikeZone catalogue.
//
// `id` is a short slug like "panigale-v4r". It is also the MongoDB `_id`,
// so it never changes and links to a bike always keep working.
export type Bike = {
  id: string;
  brand: string;
  model: string;
  category: BikeCategory;
  /** Price in USD (a number, so the API can sort by it). */
  price: number;
  previousPrice?: number;
  engineCc: number;
  horsepower: number;
  topSpeedMph: number;
  description: string;
  image: string;
  alt: string;
  badge?: string;
  specs: BikeSpecs;
};

// Full name of a bike, for example "Ducati Panigale V4".
export function bikeName(bike: Pick<Bike, "brand" | "model">): string {
  return `${bike.brand} ${bike.model}`;
}

// We always format numbers in English, so the server and the browser
// always show the exact same text.
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const integerFormatter = new Intl.NumberFormat("en-US");

export function formatPrice(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCc(value: number): string {
  return `${integerFormatter.format(value)}cc`;
}

export function formatHorsepower(value: number): string {
  return `${integerFormatter.format(value)} HP`;
}

/**
 * A valid bike id is a short slug: 3–64 characters, made of lowercase
 * letters, digits and single hyphens (for example "panigale-v4r").
 * Anything else is rejected before it reaches the database.
 */
export function isValidBikeId(id: string): boolean {
  if (id.length < 3 || id.length > 64) return false;
  // The regular expression reads as:
  //   [a-z0-9]+          one or more lowercase letters or digits
  //   (?:-[a-z0-9]+)*    optionally, more of those after a single hyphen
  // Testing it here keeps badly formed ids away from the database.
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
}

/**
 * A URL parameter can arrive as one string or as a list of strings
 * (for example ?tag=a&tag=b). We only ever use the first value.
 */
function firstValue(value: string | string[] | null | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/**
 * Read the "category" URL parameter and return the matching category,
 * or undefined when the value is not one of our categories.
 */
export function parseCategoryParam(
  value: string | string[] | null | undefined,
): BikeCategory | undefined {
  const raw = firstValue(value).trim().toLowerCase();
  return CATEGORIES.find((category) => category.toLowerCase() === raw);
}

/**
 * Read the "sort" URL parameter and return the matching sort option,
 * or undefined when the value is not one of our options.
 */
export function parseSortParam(
  value: string | string[] | null | undefined,
): BikeSort | undefined {
  const raw = firstValue(value).trim();
  return SORT_OPTIONS.find((option) => option === raw);
}

/**
 * Read the "search" URL parameter, trim it and cut it to the maximum
 * allowed length.
 */
export function parseSearchParam(
  value: string | string[] | null | undefined,
): string {
  return firstValue(value).trim().slice(0, MAX_SEARCH_LENGTH);
}
