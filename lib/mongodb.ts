// The MongoDB connection used by BikeZone.
//
// ⚠️ SERVER ONLY — never import this file from a client component.
// The connection string comes from process.env.MONGODB_URI. Next.js only
// exposes environment variables to the server, and there is no
// NEXT_PUBLIC_ prefix here on purpose.

import { MongoClient, type Db } from "mongodb";

// The database name we use, unless MONGODB_DB says something else.
const DEFAULT_DB_NAME = "bikezone";

/**
 * Thrown when MONGODB_URI is missing. The API routes turn this into a 503
 * with a helpful message, so it is easy to see what is wrong.
 */
export class MongoNotConfiguredError extends Error {
  constructor() {
    super(
      "MONGODB_URI is not set. Add it to .env.local in the project root (copy .env.example) and restart the dev server.",
    );
    this.name = "MongoNotConfiguredError";
  }
}

// We keep the connection on globalThis (instead of a normal variable)
// because Next.js reloads the server code while developing. Storing it
// here means we reuse the same connection instead of opening a new one
// on every code change.
const globalStore = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

/**
 * Connect to MongoDB (only once) and return the BikeZone database.
 * Throws MongoNotConfiguredError when MONGODB_URI is missing, or the
 * MongoDB error when the cluster cannot be reached.
 */
export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) throw new MongoNotConfiguredError();

  // First call creates the connection, later calls reuse it.
  if (!globalStore.mongoClientPromise) {
    const client = new MongoClient(uri, {
      // Give up after 8 seconds when the cluster cannot be reached, so the
      // page can show an error instead of waiting for a long time.
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    });

    globalStore.mongoClientPromise = client.connect().catch((error) => {
      // Connecting failed — forget the promise so the next request can
      // try again instead of always failing.
      globalStore.mongoClientPromise = undefined;
      throw error;
    });
  }

  const client = await globalStore.mongoClientPromise;
  const dbName = process.env.MONGODB_DB?.trim() || DEFAULT_DB_NAME;

  return client.db(dbName);
}
