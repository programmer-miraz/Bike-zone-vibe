#!/usr/bin/env node
// Safe sample-data seeder for the BikeZone `bikes` collection.
//
// Usage:  npm run seed
//
// Safety guarantees:
//  - INSERT ONLY. Uses `updateOne` with `$setOnInsert` + upsert, so an
//    existing document with the same _id is NEVER modified, overwritten or
//    deleted — re-running is always a no-op for data already in the database.
//  - Reads MONGODB_URI from the environment, or falls back to .env.local.
//    No credentials are hard-coded here (or anywhere in the repo).
//  - Validates every sample record before writing anything.
//  - Creates two read indexes (additive, safe on an existing collection).

import { readFileSync } from "node:fs";
import { MongoClient } from "mongodb";

const DB_NAME = process.env.MONGODB_DB?.trim() || "bikezone";
const COLLECTION = "bikes";
const VALID_CATEGORIES = new Set(["Sport", "Cruiser", "Adventure", "Street"]);

// --- load MONGODB_URI (process env first, then .env.local) -----------------
function loadEnvLocal() {
  if (process.env.MONGODB_URI?.trim()) return;
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!match) continue;
      const [, key, value] = match;
      if (!value || key in process.env) continue;
      process.env[key] = value.replace(/^["']|["']$/g, "");
    }
  } catch {
    // .env.local missing — we fall through to the clear error below.
  }
}

loadEnvLocal();

const uri = process.env.MONGODB_URI?.trim();
if (!uri) {
  console.error("✗ MONGODB_URI is not set.");
  console.error(
    "  Create .env.local in the project root (same folder as package.json) and add:\n" +
      "  MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/bikezone\n" +
      "  (see .env.example), then run: npm run seed",
  );
  process.exit(1);
}

// --- load + validate sample data ------------------------------------------
const samplePath = new URL("../lib/sample-bikes.json", import.meta.url);
const bikes = JSON.parse(readFileSync(samplePath, "utf8"));

function validate(bike, index) {
  const problems = [];
  if (typeof bike.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(bike.id)) {
    problems.push("id must be a lowercase slug");
  }
  if (typeof bike.brand !== "string" || !bike.brand) problems.push("brand");
  if (typeof bike.model !== "string" || !bike.model) problems.push("model");
  if (!VALID_CATEGORIES.has(bike.category)) problems.push("category");
  for (const field of ["price", "engineCc", "horsepower", "topSpeedMph"]) {
    if (typeof bike[field] !== "number" || bike[field] <= 0) problems.push(field);
  }
  if (typeof bike.description !== "string" || !bike.description) {
    problems.push("description");
  }
  if (typeof bike.image !== "string" || !bike.image.startsWith("/")) {
    problems.push("image");
  }
  if (!bike.specs || typeof bike.specs !== "object") problems.push("specs");
  if (problems.length > 0) {
    console.error(
      `✗ Invalid sample entry #${index + 1} (${bike?.id ?? "no id"}): ${problems.join(", ")}`,
    );
    process.exit(1);
  }
}

if (!Array.isArray(bikes) || bikes.length === 0) {
  console.error("✗ lib/sample-bikes.json contains no bikes — nothing to do.");
  process.exit(1);
}
bikes.forEach(validate);

const duplicateIds = bikes.map((b) => b.id).filter((id, i, all) => all.indexOf(id) !== i);
if (duplicateIds.length > 0) {
  console.error(`✗ Duplicate ids in sample data: ${duplicateIds.join(", ")}`);
  process.exit(1);
}

// --- connect and insert (insert-only) -------------------------------------
const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

try {
  await client.connect();
} catch (error) {
  console.error("✗ Could not connect to MongoDB.");
  console.error(`  ${error?.message ?? error}`);
  console.error("  Check MONGODB_URI in .env.local and network access to your cluster.");
  process.exit(1);
}

try {
  const collection = client.db(DB_NAME).collection(COLLECTION);

  const operations = bikes.map((bike) => ({
    updateOne: {
      filter: { _id: bike.id },
      // $setOnInsert only — an existing document is left completely untouched.
      update: { $setOnInsert: { ...bike, _id: bike.id } },
      upsert: true,
    },
  }));

  const result = await collection.bulkWrite(operations, { ordered: false });

  // Additive indexes to keep list/search/sort queries fast.
  await collection.createIndex({ category: 1, price: 1 });
  await collection.createIndex({ brand: 1, model: 1 });

  const total = await collection.countDocuments();
  console.log(`✓ Connected to MongoDB (db: "${DB_NAME}", collection: "${COLLECTION}")`);
  console.log(
    `✓ ${result.upsertedCount} bike(s) inserted, ${bikes.length - result.upsertedCount} already present (left untouched).`,
  );
  console.log(`✓ Collection now holds ${total} document(s).`);
  console.log("✓ Seeding complete. Try: GET /api/bikes and GET /api/bikes/panigale-v4r");
} catch (error) {
  console.error("✗ Seeding failed.");
  console.error(`  ${error?.message ?? error}`);
  process.exit(1);
} finally {
  await client.close().catch(() => {});
}
