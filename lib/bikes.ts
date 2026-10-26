// All MongoDB access for the "bikes" collection.
//
// ⚠️ SERVER ONLY — only import this from API routes and server components.
// User input is cleaned and checked here (and in lib/types.ts) before it
// reaches the database.

import type { Collection, Filter, Sort } from "mongodb";
import { getDb, MongoNotConfiguredError } from "@/lib/mongodb";
import {
  MAX_SEARCH_LENGTH,
  isValidBikeId,
  type Bike,
  type BikeCategory,
  type BikeSort,
} from "@/lib/types";

// The name of the collection inside the database.
export const BIKES_COLLECTION = "bikes";

// A document as it is stored in MongoDB. The `_id` is the bike's slug
// (for example "panigale-v4r"), so links always keep working.
export type BikeDocument = Omit<Bike, "id"> & { _id: string };

// The most bikes we return in one request.
const MAX_RESULTS = 100;

async function bikesCollection(): Promise<Collection<BikeDocument>> {
  const db = await getDb();
  return db.collection<BikeDocument>(BIKES_COLLECTION);
}

// Escape special characters so the user's text is used as plain text
// inside the search regular expression.
function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Turn a MongoDB document into a plain Bike object (rename _id to id).
function toBike(doc: BikeDocument): Bike {
  const { _id, ...bike } = doc;
  return { ...bike, id: _id };
}

// The filters the /api/bikes route can ask for.
export type ListBikesQuery = {
  search?: string;
  category?: BikeCategory;
  sort?: BikeSort;
};

/**
 * List bikes with an optional search (brand or model), an optional
 * category filter and an optional price sort. All three work together.
 */
export async function listBikes(query: ListBikesQuery = {}): Promise<Bike[]> {
  const search = query.search?.trim().slice(0, MAX_SEARCH_LENGTH);
  const category = query.category;
  const sort = query.sort ?? "default";

  // Step 1: build the MongoDB filter.
  const filter: Filter<BikeDocument> = {};

  if (category) {
    filter.category = category;
  }

  if (search) {
    // "i" means the search ignores upper/lower case.
    const searchPattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ brand: searchPattern }, { model: searchPattern }];
  }

  // Step 2: build the sort order. "_id" is added so the order is stable
  // when two bikes have the same price.
  let sortBy: Sort = { brand: 1, model: 1, _id: 1 };
  if (sort === "price-asc") {
    sortBy = { price: 1, _id: 1 };
  } else if (sort === "price-desc") {
    sortBy = { price: -1, _id: 1 };
  }

  // Step 3: run the query.
  const collection = await bikesCollection();
  const documents = await collection
    .find(filter)
    .sort(sortBy)
    .limit(MAX_RESULTS)
    .toArray();

  return documents.map(toBike);
}

/**
 * Find one bike by its id. Returns null when the id is unknown.
 */
export async function getBikeById(id: string): Promise<Bike | null> {
  if (!isValidBikeId(id)) return null;

  const collection = await bikesCollection();
  const document = await collection.findOne({ _id: id });

  return document ? toBike(document) : null;
}

/**
 * Check if a bike exists. Used by proxy.ts to send a real 404 before the
 * page starts streaming. Only the _id is read, so it stays fast.
 */
export async function bikeExists(id: string): Promise<boolean> {
  if (!isValidBikeId(id)) return false;

  const collection = await bikesCollection();
  const document = await collection.findOne(
    { _id: id },
    { projection: { _id: 1 } },
  );

  return document !== null;
}

/**
 * Other bikes from the same category, without the bike we are looking at.
 */
export async function getRelatedBikes(
  bike: Bike,
  limit = 4,
): Promise<Bike[]> {
  const collection = await bikesCollection();
  const documents = await collection
    .find({ category: bike.category, _id: { $ne: bike.id } })
    .sort({ price: 1, _id: 1 })
    .limit(limit)
    .toArray();

  return documents.map(toBike);
}

/**
 * Turn a database error into a JSON error response.
 * A missing connection string gives 503 (with setup help),
 * every other failure gives 500.
 */
export function databaseErrorResponse(error: unknown): Response {
  if (error instanceof MongoNotConfiguredError) {
    return Response.json({ error: error.message }, { status: 503 });
  }

  console.error("[api/bikes] database error:", error);

  return Response.json(
    {
      error:
        "Could not reach the bikes database. Check MONGODB_URI in .env.local and that your cluster is reachable.",
    },
    { status: 500 },
  );
}
